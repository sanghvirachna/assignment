# 🧾 Invoice Management

This application is a simple invoice management system built with Node.js and PostgreSQL. It provides features to create a new invoice, retrieve an invoice including customer and items, update invoice status from pending to paid and vice versa, list invoices for a customer including total amount and status for each invoice, and calculate total sales for a customer.

## 📋 Prerequisites

- Node.js
- PostgreSQL

## 🚀 Setup

1. **Create PostgreSQL Database** 🗄️

    First, you need to create a PostgreSQL database. You can do this through the PostgreSQL command line or a GUI like pgAdmin.

2. **Create Tables** 📚

    You will need to create three tables: `customers`, `invoices`, and `invoice_items`. Here are some basic commands to create these tables:

    ```sql
    CREATE TABLE customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    );

    CREATE TABLE invoices (
      id SERIAL PRIMARY KEY,
      customer_id INTEGER REFERENCES customers(id),
      status VARCHAR(50),
      total DECIMAL(10, 2)
    );

    CREATE TABLE invoice_items (
      id SERIAL PRIMARY KEY,
      invoice_id INTEGER REFERENCES invoices(id),
      item_name VARCHAR(100),
      quantity INTEGER,
      price DECIMAL(10, 2)
    );
    ```

    These commands create the tables with the necessary columns. Adjust the data types and constraints according to your requirements.

3. **Install Dependencies** 📥

    Navigate to the project directory and run the following command to install the necessary dependencies:

    ```bash
    npm install
    ```

4. **Run the Application** 🖥️

    You can start the application with the following command:

    ```bash
    node app.js
    ```

    The application will start and listen on port 3000.

## 🛠️ Usage

You can use a tool like curl, Postman, or Thunder Client to send HTTP requests to the application. Here are the available endpoints:

- `POST /invoices`: Create a new invoice.
- `GET /invoices/:id`: Retrieve an invoice including customer and items.
- `PUT /invoices/:id/status`: Update invoice status from pending to paid and vice versa.
- `GET /customers/:id/invoices`: List invoices for a customer including total amount and status for each invoice.
- `GET /customers/:id/total_sales`: Calculate total sales for a customer.

Please replace `:id` with the actual ID of the invoice or customer.
