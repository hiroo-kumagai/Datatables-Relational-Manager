// Base Table Management System
class BaseTable {
  constructor(config) {
    this.config = {
      tableName: config.tableName,
      apiEndpoint: config.apiEndpoint,
      columns: config.columns,
      hiddenColumns: config.hiddenColumns || [],
      foreignKeys: config.foreignKeys || {},
      modalFields: config.modalFields || [],
      editingEnabled: false,
      ...config,
    };

    this.table = null;
    this.currentRecord = null;
    this.isEditing = false;

    this.init();
  }

  init() {
    this.setupToggleSwitch();
    this.setupDataTable();
    this.setupModals();
    this.setupEventListeners();
  }

  setupToggleSwitch() {
    const toggleSwitch = document.getElementById("editing-toggle");
    const toggleLabel = document.getElementById("toggle-label");

    if (!toggleSwitch) {
      console.error("Toggle switch element not found!");
      return;
    }

    if (!toggleLabel) {
      console.error("Toggle label element not found!");
      return;
    }

    console.log("Setting up toggle switch for table:", this.config.tableName);

    toggleSwitch.addEventListener("change", () => {
      this.config.editingEnabled = toggleSwitch.checked;
      toggleLabel.textContent = this.config.editingEnabled
        ? "Enabled"
        : "Disabled";
      this.toggleEditingMode();
    });
  }

  setupDataTable() {
    const columns = this.config.columns.map((col) => {
      const newCol = { ...col };
      if (this.config.hiddenColumns.includes(col.data)) {
        newCol.visible = false;
      }
      return newCol;
    });

    // Check if we already have an Actions column defined in the HTML
    const hasActionsColumn =
      document.querySelector("#data-table thead th.actions-column") !== null;

    // Add action column if editing is enabled and we don't already have one
    if (this.config.editingEnabled && !hasActionsColumn) {
      columns.push({
        data: null,
        title: "Actions",
        orderable: false,
        className: "actions-column",
        render: function (data, type, row) {
          if (type === "display") {
            const rowId = row.id || row[Object.keys(row)[0]];
            if (rowId) {
              return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${rowId}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${rowId}">Delete</button>
                            `;
            } else {
              return '<span class="text-muted">No ID</span>';
            }
          }
          return "";
        },
      });
    }

    this.table = $("#data-table").DataTable({
      ajax: {
        url: this.config.apiEndpoint,
        type: "GET",
        dataSrc: function (json) {
          console.log("API Response:", json);
          if (json && json.success && Array.isArray(json.data)) {
            console.log(
              "Data loaded successfully:",
              json.data.length,
              "records"
            );
            return json.data;
          } else {
            console.error("API Error:", json);
            alert("Error loading data: " + (json.error || "Unknown error"));
            return [];
          }
        },
        error: function (xhr, error, thrown) {
          console.error("AJAX Error:", { xhr, error, thrown });
          alert("Failed to load data. Please check the console for details.");
        },
      },
      columns: columns,
      pageLength: 25,
      lengthMenu: [10, 25, 50, 100],
      language: {
        search: "Search:",
        lengthMenu: "Show _MENU_ entries",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        paginate: {
          first: "First",
          last: "Last",
          next: "Next",
          previous: "Previous",
        },
      },
    });
  }

  setupModals() {
    // Unified Form Modal
    const formModal = document.getElementById("form-modal");
    const deleteModal = document.getElementById("delete-modal");

    // Close modal events - only allow closing via close button or Cancel button
    document.querySelectorAll(".close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", (e) => {
        e.target.closest(".modal").style.display = "none";
      });
    });

    // Removed click-outside-to-close behavior for better usability
    // Users must explicitly click Cancel or the X button to close modals
  }

  setupEventListeners() {
    // Add button
    document.getElementById("add-btn").addEventListener("click", () => {
      this.showAddModal();
    });

    // Edit and Delete buttons (delegated)
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("edit-btn")) {
        const id = e.target.getAttribute("data-id");
        this.showEditModal(id);
      } else if (e.target.classList.contains("delete-btn")) {
        const id = e.target.getAttribute("data-id");
        this.showDeleteModal(id);
      }
    });

    // Unified form submission
    document.getElementById("entity-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.isEditing) {
        this.handleEdit();
      } else {
        this.handleAdd();
      }
    });

    document.getElementById("confirm-delete").addEventListener("click", () => {
      this.handleDelete();
    });
  }

  toggleEditingMode() {
    const isEnabled = this.config.editingEnabled;

    // Toggle main add button
    const addBtn = document.getElementById("add-btn");
    if (addBtn) {
      addBtn.style.display = isEnabled ? "inline-block" : "none";
    }

    // Check if Actions column already exists
    const hasActionsColumn =
      document.querySelector("#data-table thead th.actions-column") !== null;

    // Only recreate table if we need to add/remove the Actions column
    if ((isEnabled && !hasActionsColumn) || (!isEnabled && hasActionsColumn)) {
      // Store current page info and page length before recreating
      const currentPage = this.table ? this.table.page.info().page : 0;
      const currentPageLength = this.table ? this.table.page.len() : 25;
      this.recreateTable();

      // Restore page length and page after recreation
      if (this.table) {
        // First set the page length
        this.table.page.len(currentPageLength);

        // Then restore the page - use setTimeout to ensure table is fully initialized
        setTimeout(() => {
          if (this.table && currentPage >= 0) {
            this.table.page(currentPage).draw(false); // false = don't reset paging
          }
        }, 10);
      }
    } else {
      // Just toggle visibility of existing Actions column
      const actionsColumn = this.table.column(".actions-column");
      if (actionsColumn.length > 0) {
        actionsColumn.visible(isEnabled);
      }
    }
  }

  recreateTable() {
    // Destroy existing table
    if (this.table) {
      this.table.destroy();
    }

    // Clear the table element
    $("#data-table").empty();

    // Recreate the table with updated configuration
    // Make a deep copy of the original columns to preserve all properties
    const columns = this.config.columns.map((col) => {
      const newCol = { ...col };
      if (this.config.hiddenColumns.includes(col.data)) {
        newCol.visible = false;
      }
      return newCol;
    });

    // Check if we already have an Actions column defined in the HTML
    const hasActionsColumn =
      document.querySelector("#data-table thead th.actions-column") !== null;

    // Add action column if editing is enabled and we don't already have one
    if (this.config.editingEnabled && !hasActionsColumn) {
      columns.push({
        data: null,
        title: "Actions",
        orderable: false,
        className: "actions-column",
        render: function (data, type, row) {
          if (type === "display") {
            const rowId = row.id || row[Object.keys(row)[0]];
            if (rowId) {
              return `
                                <button class="btn btn-sm btn-warning edit-btn" data-id="${rowId}">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${rowId}">Delete</button>
                            `;
            } else {
              return '<span class="text-muted">No ID</span>';
            }
          }
          return "";
        },
      });
    }

    this.table = $("#data-table").DataTable({
      ajax: {
        url: this.config.apiEndpoint,
        type: "GET",
        dataSrc: function (json) {
          console.log("API Response:", json);
          if (json && json.success && Array.isArray(json.data)) {
            console.log(
              "Data loaded successfully:",
              json.data.length,
              "records"
            );
            return json.data;
          } else {
            console.error("API Error:", json);
            alert("Error loading data: " + (json.error || "Unknown error"));
            return [];
          }
        },
        error: function (xhr, error, thrown) {
          console.error("AJAX Error:", { xhr, error, thrown });
          alert("Failed to load data. Please check the console for details.");
        },
      },
      columns: columns,

      pageLength: 25,
      lengthMenu: [10, 25, 50, 100],
      language: {
        search: "Search:",
        lengthMenu: "Show _MENU_ entries",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        paginate: {
          first: "First",
          last: "Last",
          next: "Next",
          previous: "Previous",
        },
      },
    });
  }

  async showAddModal() {
    // Update modal title and button for Add mode
    document.getElementById("modal-title").textContent = `Add ${
      this.config.tableName.slice(0, -1).charAt(0).toUpperCase() +
      this.config.tableName.slice(1, -1)
    }`;
    const submitBtn = document.getElementById("submit-btn");
    submitBtn.textContent = `Add ${
      this.config.tableName.slice(0, -1).charAt(0).toUpperCase() +
      this.config.tableName.slice(1, -1)
    }`;
    submitBtn.className = "btn btn-success";

    // Set form mode
    this.isEditing = false;

    // Show modal and populate
    document.getElementById("form-modal").style.display = "block";
    await this.populateForeignKeyFields("entity-form");
    this.resetForm("entity-form");
  }

  async showEditModal(id) {
    try {
      const response = await fetch(
        `${this.config.apiEndpoint}?action=get&id=${id}`
      );
      const result = await response.json();

      if (result.success) {
        this.currentRecord = result.data;

        // Update modal title and button for Edit mode
        document.getElementById("modal-title").textContent = `Edit ${
          this.config.tableName.slice(0, -1).charAt(0).toUpperCase() +
          this.config.tableName.slice(1, -1)
        }`;
        const submitBtn = document.getElementById("submit-btn");
        submitBtn.textContent = `Update ${
          this.config.tableName.slice(0, -1).charAt(0).toUpperCase() +
          this.config.tableName.slice(1, -1)
        }`;
        submitBtn.className = "btn btn-warning";

        // Set form mode
        this.isEditing = true;

        // Show modal and populate with data
        document.getElementById("form-modal").style.display = "block";
        await this.populateForeignKeyFields("entity-form");
        this.populateForm("entity-form", result.data);
      } else {
        this.showAlert("Error loading record: " + result.error, "danger");
      }
    } catch (error) {
      this.showAlert("Error loading record: " + error.message, "danger");
    }
  }

  showDeleteModal(id) {
    this.currentRecord = { id: id };
    document.getElementById("delete-modal").style.display = "block";
  }

  async populateForeignKeyFields(formId) {
    const form = document.getElementById(formId);

    for (const [fieldName, config] of Object.entries(this.config.foreignKeys)) {
      const select = form.querySelector(`[name="${fieldName}"]`);
      if (select) {
        try {
          const response = await fetch(
            `${this.config.apiEndpoint}?action=foreign_key_options&table=${config.table}&value_field=${config.valueField}&text_field=${config.textField}`
          );
          const result = await response.json();

          if (result.success) {
            select.innerHTML = '<option value="">Select...</option>';
            result.data.forEach((option) => {
              select.innerHTML += `<option value="${option.value}">${option.text}</option>`;
            });
          }
        } catch (error) {
          console.error("Error loading foreign key options:", error);
        }
      }
    }
  }

  populateForm(formId, data) {
    const form = document.getElementById(formId);
    Object.keys(data).forEach((key) => {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) {
        field.value = data[key] || "";
      }
    });
  }

  resetForm(formId) {
    document.getElementById(formId).reset();
  }

  async handleAdd() {
    const formData = new FormData(document.getElementById("entity-form"));
    const data = Object.fromEntries(formData.entries());

    // Remove empty values
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        delete data[key];
      }
    });

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        this.showAlert("Record added successfully!", "success");
        document.getElementById("form-modal").style.display = "none";
        this.table.ajax.reload(null, false); // Preserve pagination
      } else {
        this.showAlert("Error adding record: " + result.error, "danger");
      }
    } catch (error) {
      this.showAlert("Error adding record: " + error.message, "danger");
    }
  }

  async handleEdit() {
    const formData = new FormData(document.getElementById("entity-form"));
    const data = Object.fromEntries(formData.entries());
    data.id = this.currentRecord.id;

    // Remove empty values
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        delete data[key];
      }
    });

    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        this.showAlert("Record updated successfully!", "success");
        document.getElementById("form-modal").style.display = "none";
        this.table.ajax.reload(null, false); // Preserve pagination
      } else {
        this.showAlert("Error updating record: " + result.error, "danger");
      }
    } catch (error) {
      this.showAlert("Error updating record: " + error.message, "danger");
    }
  }

  async handleDelete() {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: this.currentRecord.id }),
      });

      const result = await response.json();

      if (result.success) {
        this.showAlert("Record deleted successfully!", "success");
        document.getElementById("delete-modal").style.display = "none";
        this.table.ajax.reload(null, false); // Preserve pagination
      } else {
        this.showAlert("Error deleting record: " + result.error, "danger");
      }
    } catch (error) {
      this.showAlert("Error deleting record: " + error.message, "danger");
    }
  }

  showAlert(message, type) {
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector(".container");
    container.insertBefore(alertDiv, container.firstChild);

    // If it's an error alert, scroll to top to make it visible
    if (type === "danger") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Remove alert after 5 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}
