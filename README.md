# Coffee Shop - Web Application Development Project

## Contributors

* phuchng - Nguyễn Hoàng Phúc
* ThaiCoder2003 - Đặng Quốc Thái
* thannhandz - Lê Phan Thanh Nhân

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

## Getting Started

Try the demo at https://coffeeshop-demo.onrender.com/, or alternatively, host it locally by following the instructions below.

1. **Clone the repository:**

    ```bash
    git clone https://github.com/phuchng/CoffeeShop.git
    cd CoffeeShop
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
    -   Create a `.env` file in the `CoffeeShop` directory.
    -   Add your MongoDB connection string:

        ```
        MONGODB_URI=your_mongodb_connection_string
        ```

4. **Populate the database (optional):**
    -   Run `npm run seed` to add initial data to the database.

5. **Test the application (optional:)**
    - Run `npm test` to run the automated test suites
    
6. **Start the application:**

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
-   [x] SSR search, filtering, and paging
-   [x] View product details
    -   [x] Show related products
    -   [ ] View list of product reviews
    -   [ ] AJAX paging product reviews
-   [x] Shopping cart
    -   [x] Add product to cart
    -   [x] View products in the cart
    -   [x] AJAX update the product count in the cart
    
### 3. Authentication and Authorization

-   [x] Use a popular authentication library (Passport.js)
-   [x] Registration
    -   [x] Verify user input: password complexity, full name, ...
    -   [x] AJAX checking username/email availability
    -   [ ] Account activation by email
-   [ ] Social Sign-up/Sign-In (Google or Facebook)
-   [x] Login to the website
-   [x] Authorize website features
-   [ ] Forgot password by email

### 4. Features for Logged-in Users

-   [x] Update user profile
    -   [x] Verify user input
    -   [ ] Update the user's avatar
    -   [x] Update password (The user must input old password to update new password)
-   [ ] Checkout and payment
    -   [x] Bind the shopping cart to the user when login
    -   [ ] Input shipping details
    -   [ ] Process payment
    -   [ ] View order list and status
    -   [ ] View order details

### 5. Administration Features

-   [x] Update your admin profile
-   [x] View account list
    -   [ ] Filter account by name, email
    -   [ ] Sort account by name, email, registration time, ...
    -   [x] AJAX paging account list
-   [x] View account details
-   [ ] Ban/unban an account
-   [ ] Manage product categories, manufacturer
-   [x] View product list
    -   [ ] Filter product by name, category, manufacturer
    -   [ ] Sort product by creation time, price, total purchase
    -   [x] AJAX paging product list
-   [x] Create a new product
    -   [ ] Upload multiple product photos
    -   [x] Add product to a specific category, manufacturer, ...
    -   [ ] Specify product status
    -   [x] Verify user input
-   [x] Update a product
    -   [ ] Add, and remove product photos
    -   [x] Change product category, manufacturer, ...
    -   [ ] Update product status
    -   [x] Verify user input
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
-   [x] CI/CD
-   [x] Automated testing