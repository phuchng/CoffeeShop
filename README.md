# Coffee Shop - Web Application Development Project

## Contributors

-   phuchng - Nguyễn Hoàng Phúc
-   ThaiCoder2003 - Đặng Quốc Thái
-   thannhandz - Lê Phan Thanh Nhân

## Technology Stack

-   **Frontend:**
    -   HTML
    -   CSS (with custom styles and Bootstrap 5.3.3)
    -   JavaScript (with jQuery 3.6.0)
    -   EJS for templating
-   **Backend:**
    -   Node.js
    -   Express.js
    -   MongoDB

## Getting Started

Try the demo at https://coffeeshop-demo.onrender.com/ (The demo is using a free instance that is slow to initialize).

Alternatively, host it locally by following the instructions below.

### Running with Docker

1. **Install Docker and Docker Compose:**

2. **Clone the repository:**

    ```bash
    git clone https://github.com/phuchng/CoffeeShop.git
    cd CoffeeShop
    ```

3. **Build and run with Docker Compose:**

    ```bash
    docker-compose build
    docker-compose up -d
    ```

4. **Access the application:**
    -   Open your web browser and go to `http://localhost:2000`.
    -   You can access admin dashboard by using account `admin@example.com:password1`

### Running without Docker

1. **Clone the repository:**

    ```bash
    git clone https://github.com/phuchng/CoffeeShop.git
    cd CoffeeShop
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```
    - If there are compability issues, run
    ```bash
    npm ci --unsafe-perm
    ```

3. **Populate the database (optional):**
    -   Run this to add initial data to the database.
    ```bash
    npm run seed
    ```
4. **Start the application:**

    ```bash
    npm start
    ```

    Or, for development with automatic restarts:

    ```bash
    npm run dev
    ```

6. **Access the application:**
    -   Open your web browser and go to `http://localhost:2000` (or the port specified in your configuration).
    -   You can access admin dashboard by using account `admin@example.com:password1`


## Usage

-   **Guest Users:**
    -   Browse products on the home page and product listing page.
    -   Filter and sort products based on various criteria.
    -   View product details and related products.
    -   Register for an account or log in if you already have one.
-   **Registered Users:**
    -   Log in to the application.
    -   Manage your profile information.
    -   Add products to your cart and proceed to checkout.
    -   View your order history.
-   **Admin Users:**
    -   Access the admin panel to manage products, users, and orders.

## Features Checklist

### 1. Basic Features

-   [x] Database design
-   [x] Database mock data
-   [x] Website layout (at least two layouts for customer and admin websites)
-   [x] Website architect (Based on MVC. With a clear separation of concerns)
-   [x] Document
-   [x] Demo video
-   [x] Publish to public hosts
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
-   [x] SSR search, filtering, and paging
-   [x] View product details
    -   [x] Show related products
    -   [x] View list of product reviews
    -   [x] AJAX paging product reviews
-   [x] Shopping cart
    -   [x] Add product to cart
    -   [x] View products in the cart
    -   [x] AJAX update the product count in the cart
    
### 3. Authentication and Authorization

-   [x] Use a popular authentication library (Passport.js)
-   [x] Registration
    -   [x] Verify user input: password complexity, full name, ...
    -   [x] AJAX checking username/email availability
    -   [x] Account activation by email
-   [x] Social Sign-up/Sign-In (Google or Facebook)
-   [x] Login to the website
-   [x] Authorize website features
-   [x] Forgot password by email

### 4. Features for Logged-in Users

-   [x] Update user profile
    -   [x] Verify user input
    -   [x] Update the user's avatar
    -   [x] Update password (The user must input old password to update new password)
-   [x] Checkout and payment
    -   [x] Bind the shopping cart to the user when login
    -   [x] Input shipping details
    -   [x] Process payment
    -   [x] View order list and status
    -   [x] View order details

### 5. Administration Features

-   [x] Update your admin profile
-   [x] View account list
    -   [x] Filter account by name, email
    -   [x] Sort account by name, email, registration time, ...
    -   [x] AJAX paging account list
-   [x] View account details
-   [x] Ban/unban an account
-   [x] Manage product categories, manufacturer
-   [x] View product list
    -   [x] Filter product by name, category, manufacturer
    -   [x] Sort product by creation time, price, total purchase
    -   [x] AJAX paging product list
-   [x] Create a new product
    -   [x] Upload multiple product photos
    -   [x] Add product to a specific category, manufacturer, ...
    -   [x] Specify product status
    -   [x] Verify user input
-   [x] Update a product
    -   [x] Add, and remove product photos
    -   [x] Change product category, manufacturer, ...
    -   [x] Update product status
    -   [x] Verify user input
-   [x] Customer's orders
    -   [x] View list of orders sorted by order creation time
    -   [x] Filter order by status
    -   [x] View order details
    -   [x] Update order status
-   [x] Reports
    -   [x] View revenue report in time range: day, week, month, ...
    -   [x] View top revenue by product in time range: day, week, month

### 6. Advanced Features

-   [ ] Payment system integration
-   [ ] Use a search engine library
-   [ ] Use memory cache to boost website performance
-   [ ] Analyze and track user actions
-   [x] Show interactive chart in reports
-   [x] Dockerize your project
-   [x] CI/CD