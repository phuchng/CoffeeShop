# Coffeeno - Your Online Coffee Shop

## Project Overview

Coffeeno is a web application developed as the final project for the Web Application Development course at VNUHCM - University of Science. This project is a collaborative effort by a team of three students. Coffeeno aims to provide a user-friendly platform for customers to browse, purchase, and learn about a variety of coffee, tea, food, and juice products.

## Team Information

| Student ID   | Full Name           | 
| :----------- | :------------------ |
| `21127655` | `Lê Phan Thanh Nhân` |
| `21127671` | `Nguyễn Hoàng Phúc` |
| `21127545` | `Đặng Quốc Thái` |

## Technology Stack

-   **Frontend:**
    -   HTML
    -   CSS (with custom styles and Bootstrap 5.3.3)
    -   JavaScript (with jQuery 3.6.0)
    -   EJS for templating
-   **Backend:**
    -   Node.js
    -   Express.js
    -   MongoDB (with Mongoose for database interactions)
    -   Passport.js (for authentication)
    -   Bcrypt (for password hashing)
-   **Other:**
    -   Connect-flash (for flash messages)
    -   Express-session (for session management)
    -   Express-ejs-layouts (for layout management)

## Features Checklist

### 1. Overall Requirements

-   [ ] Database design
-   [ ] Database mock data
-   [x] Website layout (at least two layouts for customer and admin websites)
-   [x] Website architect (Based on MVC. With a clear separation of concerns)
-   [ ] Document
-   [ ] Demo video
-   [ ] Publish to public hosts
-   [x] Development progress is recorded in Github

### 2. Guest Features

-   [x] Home page (Layout and content of the home page)
-   [x] View list of products
-   [x] Filter products by
    -   [x] Product name
    -   [x] Category, manufacturer
    -   [x] Price range
    -   [x] Sort product by price, creation time, ...
-   [x] Product paging
-   [x] AJAX product paging
-   [x] View product details
-   [x] Show related products
-   [ ] View list of product reviews

### 3. Authentication and Authorization

-   [x] Use a popular authentication library (Passport.js)
-   [x] Registration
-   [x] Verify user input: password complexity, full name, ...
-   [x] AJAX checking username/email availability
-   [ ] Account activation by email
-   [ ] Social Sign-up/Sign-In (Google or Facebook)
-   [x] Login to the website
-   [ ] Authorize website features
-   [ ] Forgot password by email

### 4. Features for Logged-in Users

-   [x] Update user profile
-   [x] Verify user input
-   [ ] Update the user's avatar
-   [ ] Update password (The user must input old password to update new password)
-   [ ] Checkout and payment
    -   [ ] Bind the shopping cart to the user when login
    -   [ ] Input shipping details
    -   [ ] Process payment
    -   [ ] View order list and status
    -   [ ] View order details

### 5. Administration Features

-   [ ] Update your admin profile
-   [ ] View account list
    -   [ ] Filter account by name, email
    -   [ ] Sort account by name, email, registration time, ...
    -   [ ] AJAX paging account list
-   [ ] View account details
-   [ ] Ban/unban an account
-   [ ] Manage product categories, manufacturer
-   [ ] View product list
    -   [ ] Filter product by name, category, manufacturer
    -   [ ] Sort product by creation time, price, total purchase
    -   [ ] AJAX paging product list
-   [ ] Create a new product
-   [ ] Upload multiple product photos
-   [ ] Add product to a specific category, manufacturer, ...
-   [ ] Specify product status
-   [ ] Verify user input
-   [ ] Update a product
    -   [ ] Add, and remove product photos
    -   [ ] Change product category, manufacturer, ...
    -   [ ] Update product status
    -   [ ] Verify user input
-   [ ] Customer's orders
    -   [ ] View list of orders sorted by order creation time
    -   [ ] Filter order by status
    -   [ ] View order details
    -   [ ] Update order status
-   [ ] Reports
    -   [ ] View revenue report in time range: day, week, month, ...
    -   [ ] View top revenue by product in time range: day, week, month

### 6. Advanced Features

-   [ ] Payment system integration
-   [ ] Use a search engine library
-   [ ] Use memory cache to boost website performance
-   [ ] Analyze and track user actions
-   [ ] Show interactive chart in reports
-   [ ] Dockerize your project
-   [ ] CI/CD

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
    -   Create a `.env` file in the `MVC` directory.
    -   Add your MongoDB connection string:

        ```
        MONGODB_URI=your_mongodb_connection_string
        ```

4. **Populate the database (optional):**
    -   Run `node addProduct.js` to add initial product data to the database.

5. **Start the application:**

    ```bash
    npm start
    ```

    Or, for development with automatic restarts:

    ```bash
    npm run dev
    ```

6. **Access the application:**
    -   Open your web browser and go to `http://localhost:2000` (or the port specified in your configuration).

## Usage

-   **Guest Users:**
    -   Browse products on the home page and product listing page.
    -   Filter and sort products based on various criteria.
    -   View product details and related products.
    -   Register for an account or log in if you already have one.
-   **Registered Users:**
    -   Log in to the application.
    -   Manage your profile information.
    -   (TODO) Add products to your cart and proceed to checkout.
    -   (TODO) View your order history.
-   **Admin Users:**
    -   (TODO) Access the admin panel to manage products, users, and orders.