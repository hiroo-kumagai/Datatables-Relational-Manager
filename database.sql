-- Database setup for Company Data Management System
-- Create database
CREATE DATABASE IF NOT EXISTS company_data_management;
USE company_data_management;

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create security_cards table
CREATE TABLE IF NOT EXISTS security_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_number VARCHAR(20) NOT NULL UNIQUE,
    card_type VARCHAR(50) NOT NULL,
    access_level VARCHAR(50) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    position VARCHAR(100),
    department_id INT,
    security_card_id INT,
    hire_date DATE,
    salary DECIMAL(10, 2),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (security_card_id) REFERENCES security_cards(id)
);

-- Insert sample data
INSERT INTO departments (name, description) VALUES
('IT Department', 'Information Technology and Systems'),
('Human Resources', 'Personnel Management and Development'),
('Finance', 'Financial Management and Accounting'),
('Marketing', 'Marketing and Customer Relations'),
('Operations', 'Daily Operations and Management');

INSERT INTO security_cards (card_number, card_type, access_level, issue_date, expiry_date, status) VALUES
('SC001', 'Standard', 'Level 1', '2024-01-15', '2025-01-15', 'active'),
('SC002', 'Premium', 'Level 2', '2024-02-20', '2025-02-20', 'active'),
('SC003', 'Executive', 'Level 3', '2024-03-10', '2025-03-10', 'active'),
('SC004', 'Standard', 'Level 1', '2024-04-05', '2025-04-05', 'active'),
('SC005', 'Premium', 'Level 2', '2024-05-12', '2025-05-12', 'active');

INSERT INTO employees (first_name, last_name, email, phone, position, department_id, security_card_id, hire_date, salary, status) VALUES
('John', 'Smith', 'john.smith@company.com', '555-0101', 'Software Developer', 1, 1, '2023-01-15', 75000.00, 'active'),
('Jane', 'Johnson', 'jane.johnson@company.com', '555-0102', 'HR Manager', 2, 2, '2022-03-20', 80000.00, 'active'),
('Michael', 'Brown', 'michael.brown@company.com', '555-0103', 'Finance Analyst', 3, 3, '2023-06-10', 70000.00, 'active'),
('Sarah', 'Davis', 'sarah.davis@company.com', '555-0104', 'Marketing Specialist', 4, 4, '2023-09-05', 65000.00, 'active'),
('David', 'Wilson', 'david.wilson@company.com', '555-0105', 'Operations Manager', 5, 5, '2022-11-12', 85000.00, 'active');
