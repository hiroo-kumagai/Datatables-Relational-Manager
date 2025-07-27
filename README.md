# DataTables Relational Manager

A PHP-based web application that provides an intuitive interface for managing relational database records using DataTables. This project enables users to perform CRUD (Create, Read, Update, Delete) operations across multiple database tables while respecting foreign key constraints.

## 🚀 Features

- **Multi-table Management**: Support for multiple database tables with a unified interface
- **Foreign Key Constraint Handling**: Automatic validation and user-friendly alerts when foreign key constraints would be violated
- **DataTables Integration**: Rich, interactive tables with sorting, searching, and pagination
- **Real-time CRUD Operations**: Add, edit, and delete records with immediate feedback
- **Responsive Design**: Bootstrap-based UI that works across different screen sizes
- **RESTful API**: Clean API architecture using PHP and PDO
- **Modal-based Forms**: User-friendly modal dialogs for data entry and editing

## 📋 Requirements

- **Web Server**: Apache (XAMPP recommended)
- **PHP**: 7.4 or higher
- **Database**: MySQL/MariaDB
- **Browser**: Modern web browser with JavaScript enabled

## 🛠 Installation

### Using XAMPP (Recommended)

1. **Download and Install XAMPP**
   - Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
   - Install and start Apache and MySQL services

2. **Clone or Download the Project**
   ```bash
   cd C:\xampp\htdocs
   git clone https://github.com/yourusername/Datatables-Relational-Manager.git
   ```

3. **Database Setup**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `company_data_management`
   - Import the provided `database.sql` file

4. **Configuration**
   - Open `config/database.php`
   - Update database credentials if needed (default works with XAMPP)

5. **Access the Application**
   - Navigate to `http://localhost/Datatables-Relational-Manager/`

## 📊 Database Structure

The application comes with a sample database structure including:

- **Departments**: Company departments
- **Employees**: Employee records with department relationships
- **Security Cards**: Security card assignments linked to employees

## 🎯 Usage

### Navigation
- **Home Page**: Overview and navigation to different table managers
- **Departments**: Manage company departments
- **Employees**: Manage employee records
- **Security Cards**: Manage security card assignments

### Operations
1. **View Records**: All records are displayed in interactive DataTables
2. **Add Records**: Click the "Add" button to open the creation modal
3. **Edit Records**: Click the "Edit" button on any row to modify data
4. **Delete Records**: Click the "Delete" button to remove records
5. **Toggle Editing**: Use the editing toggle to enable/disable modification features

### Foreign Key Handling
- The system automatically validates foreign key relationships
- If a constraint violation is detected, an alert will be displayed
- Tables will not be updated if it would violate referential integrity

## 🔧 API Endpoints

Each table has its own API endpoint supporting standard HTTP methods:

- `GET /api/[table].php` - List all records
- `GET /api/[table].php?action=get&id=[id]` - Get specific record
- `POST /api/[table].php` - Create new record
- `PUT /api/[table].php` - Update existing record
- `DELETE /api/[table].php` - Delete record

## 🔒 Security Considerations

### ✅ Implemented Security Measures
- **SQL Injection Protection**: Uses PDO prepared statements throughout
- **CORS Configuration**: Proper headers for API access
- **Error Handling**: Structured error responses

### ⚠️ Security Limitations
This project includes basic security measures but **additional security implementations may be necessary** depending on your intended use:

- **No Authentication System**: APIs are open access
- **No Authorization Controls**: No user roles or permissions
- **Limited Input Validation**: Basic validation only
- **No CSRF Protection**: No cross-site request forgery protection
- **No Rate Limiting**: APIs can be called without restrictions

**⚠️ Important**: This project is suitable for development, learning, or internal use but requires additional security hardening for production environments.

## 🏗 Project Structure

```
Datatables-Relational-Manager/
├── api/                     # API endpoints
│   ├── base_api.php        # Base API class
│   ├── departments.php     # Departments API
│   ├── employees.php       # Employees API
│   └── security_cards.php  # Security Cards API
├── assets/                 # Static assets
│   ├── css/               # Stylesheets
│   └── js/                # JavaScript files
├── config/                # Configuration files
│   └── database.php       # Database configuration
├── *.html                 # HTML pages
├── database.sql           # Database schema
└── README.md             # This file
```

## 🧪 Testing Environment

This project has been tested and confirmed to work in:
- **XAMPP 8.2.x** with PHP 8.2 and MySQL 8.0
- **Windows 10/11** environment
- **Modern browsers**: Chrome, Firefox, Edge, Safari

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Foreign key field validation relies on client-side JavaScript
- No built-in backup/restore functionality
- Manual database setup required

## 🔮 Future Enhancements

- User authentication and authorization system
- Advanced input validation and sanitization
- Role-based access control
- Audit logging for all operations
- Export/import functionality
- Multi-language support

## ❓ FAQ

**Q: Can I use this in production?**
A: Additional security measures are recommended for production use. See the Security Considerations section.

**Q: How do I add a new table?**
A: Create a new API file extending BaseAPI and add the corresponding HTML page following the existing patterns.

**Q: Does it work with other web servers?**
A: While tested with XAMPP/Apache, it should work with other PHP-capable web servers with minor configuration adjustments.

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information about your problem
3. Include your environment details (PHP version, web server, etc.)

---

**Note**: This project is designed for educational and development purposes. Always implement proper security measures before deploying to production environments.
