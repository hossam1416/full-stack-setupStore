# SetupStore

A full-stack e-commerce platform for PC components, built with **Next.js, Node.js, Express, MongoDB, and MUI**.

SetupStore is a modern full-stack e-commerce application designed for selling PC components and helping users build compatible custom PCs. It provides a complete shopping experience including product browsing, search and filtering, authentication, cart management, orders, product comparison, and an interactive PC Builder with compatibility checking.

**Live Demo:** https://full-stack-setup-store.vercel.app/

## Screenshots

### Home Page
<img width="1920" height="1080" alt="Home Page" src="https://github.com/user-attachments/assets/036fae3b-de16-4249-93db-100031ee4bb2" />

### Products Page
<img width="1920" height="1080" alt="Products Page" src="https://github.com/user-attachments/assets/24f8468a-f20a-4b7a-8b81-1cd41788bb0a" />

### Product Details
<img width="1920" height="1080" alt="Product Details" src="https://github.com/user-attachments/assets/f49a1fcc-e8a2-45ab-8dcc-fb280231d95d" />

### Login
<img width="1920" height="1080" alt="Login Page" src="https://github.com/user-attachments/assets/cbe4f31f-d35c-4434-ac49-35e5fb7d50a0" />

### Shopping Cart
<img width="1920" height="1080" alt="Shopping Cart" src="https://github.com/user-attachments/assets/5aa7bcee-a49e-4c35-a222-e95a44fb458b" />

### Product Comparison
<img width="1920" height="1080" alt="Compare Page" src="https://github.com/user-attachments/assets/c5021bd9-410b-4237-a486-8eac927ceec3" />

### PC Builder
<img width="1920" height="1080" alt="PC Builder" src="https://github.com/user-attachments/assets/de6e18db-e5c5-4fcd-ad90-cb286159b9c3" />

### Admin Dashboard
<img width="1920" height="1080" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/a1b8fcb9-2fdf-4331-a9d9-a0ada9b357de" />

## Features

### Authentication
- User registration and login
- JWT authentication with protected routes
- Password reset / forgot password
- Role-based authorization (customer and admin)
- Persistent authentication using local storage

### Products
Users can browse, search, and filter products by category, minimum price, and maximum price; view product details, specifications, and stock availability; add products to the cart; and compare products. Product listing supports pagination for large catalogs.

### Product Import
Administrators can bulk-import products using a JSON file instead of creating them one by one. Example structure:

```json
[
  {
    "name": "Intel Core i9-14900K",
    "description": "High-performance Intel processor.",
    "price": 549.99,
    "category": "CPU",
    "brand": "Intel",
    "stock": 20,
    "images": [
      "https://placehold.co/600x400/2b2d42/ffffff?text=Intel+Core+i9-14900K"
    ],
    "specs": {
      "socket": "LGA1700",
      "cores": 24,
      "threads": 32
    }
  }
]
```

### Shopping Cart
Authenticated users each have their own cart and can add, update, or remove items, view the cart total, and proceed to checkout.

### Orders
Orders are created from the cart, and the price at time of purchase is stored via `priceAtPurchase` so historical orders aren't affected by later price changes. Users can view their own orders; admins can view and manage all orders.

### Product Comparison
Authenticated users can select multiple products and compare their specifications side by side.

### PC Builder
The interactive PC Builder lets users select a CPU, motherboard, RAM, GPU, storage, PSU, and case, and calculates the total price of the build. It also checks component compatibility:

- **CPU ↔ Motherboard** — verifies the CPU socket matches the motherboard socket (e.g. LGA1700 ↔ LGA1700)
- **RAM ↔ Motherboard** — verifies the RAM type is supported by the motherboard (e.g. DDR5 ↔ DDR5)
- **PSU ↔ System** — verifies the PSU wattage meets the build's requirements (e.g. 750W PSU for a 650W required load)

### Admin Features
Admins have access to a dashboard for managing products (create, edit, delete, bulk import), categories, and orders, all protected by role-based authorization.

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | *customer@setupstore.demo* | *Customer@Setup2026* |
| Admin | *admin@setupstore.demo* | *admin@setupstore.demo* |

These credentials are for demonstration/testing only — do not use real passwords or production credentials in this README.

## Tech Stack

**Frontend:** Next.js, React, JavaScript, Material UI (MUI), Next.js App Router, Context API, Fetch API, JWT authentication

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens (JWT), bcrypt

**Tools:** Git, GitHub, npm, VS Code

## Architecture

SetupStore follows a separated frontend/backend architecture: the Next.js frontend communicates with the Express backend over a REST API, and the backend communicates with MongoDB via Mongoose.

## Project Structure

```
SetupStore/
├── setupstore-frontend/
│   ├── app/
│   │   ├── admin/
│   │   ├── builder/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── compare/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── register/
│   │   ├── reset-password/
│   │   └── ...
│   ├── components/
│   ├── context/
│   │   └── AuthContext.js
│   ├── lib/
│   │   ├── api.js
│   │   └── useAddToCart.js
│   └── ...
├── setupstore-backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── ...
└── README.md
```

## Database Models

**User** — username, email, password, role (`customer` | `admin`), timestamps

**Product** — name, slug, description, price, category, brand, specs, images, stock, timestamps

**Category** — name, slug, description

**Cart** — user, items (product, quantity)

**Order** — user, items (product, quantity, priceAtPurchase), totalPrice, status, timestamps

**Build** — user, name, cpu, motherboard, ram, gpu, storage, psu, case, totalPrice

## API Overview

**Authentication**
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

**Products**
```
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```
Supports `search`, `category`, `minPrice`, `maxPrice`, `page`, and `limit` query params, e.g. `GET /api/products?search=intel&page=1&limit=12`.

**Categories**
```
GET  /api/categories
POST /api/categories
PUT  /api/categories/:id
```

**Cart**
```
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:id
DELETE /api/cart/:id
```

**Orders**
```
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
GET  /api/orders/admin/all
```

**Compare**
```
GET /api/compare
```

## Environment Variables

Create a `.env` file inside the backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

For the frontend, set the API URL in `lib/api.js`:

```javascript
const API_URL = "http://localhost:5000/api";
```

Never commit your `.env` file to GitHub. Add it to `.gitignore`:

```gitignore
.env
.env.local
node_modules/
.next/
```

## Installation

Clone the repository:

```bash
git clone [ADD YOUR GITHUB REPOSITORY URL]
cd SetupStore
```

### Backend Setup

```bash
cd setupstore-backend
npm install
```

Create your `.env` file as shown above, then start the server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### Frontend Setup

```bash
cd setupstore-frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000`.

## Testing

Use the test accounts above to try the app. A typical flow: register or log in, browse and filter products, open a product, add it to the cart, check out, and view your order.

To test the PC Builder: select a CPU, motherboard, RAM, GPU, storage, PSU, and case, then check the compatibility results and total price.

To test admin features: log in as admin, open the dashboard, manage products (including bulk import), categories, and orders.

## Product Import

To import products in bulk: log in as an admin, open the admin dashboard, go to product management, select the JSON import option, and upload a valid JSON file. The products are then processed and added to the catalog.

## Security

- Password hashing with bcrypt
- JWT-based authentication with protected API routes
- Admin-only middleware and role-based authorization
- Secrets kept in environment variables, `.env` excluded from Git

## Responsive Design

The frontend is built with Material UI and responsive layouts to work across desktop, laptop, tablet, and mobile.

## Main Pages

```
/
├── Home
├── Shop / Products
├── Product Details
├── Login
├── Register
├── Forgot Password
├── Reset Password
├── Cart
├── Checkout
├── Orders
├── Compare
├── PC Builder
└── Admin
    ├── Dashboard
    ├── Products
    ├── Categories
    └── Orders
```

## Development

This project was built to practice and demonstrate React and Next.js App Router development, a Node.js/Express REST API, MongoDB/Mongoose, JWT authentication and role-based authorization, CRUD operations, state management, responsive UI development, and PC component compatibility logic.

## Future Improvements

- Online payment integration
- Product reviews and ratings
- Wishlist
- Advanced product recommendations
- Better image hosting
- Cloud deployment
- Email service integration
- Advanced admin analytics and sales reports
- Inventory notifications
- More advanced PC compatibility rules
- Order tracking
- User profile management
- Discount and coupon system

## Important Notes

This project is intended as a full-stack software development project and demonstration. It uses test/demo data and should be configured with production-grade security and infrastructure before being used as a real commercial store. Do not expose `.env`, `JWT_SECRET`, MongoDB credentials, production passwords, or private API keys.

## Author

**Hossam Abuhmada**

GitHub: https://github.com/hossam1416 
LinkedIn: https://www.linkedin.com/in/hossam-abuhamda-45238a330/

## License

This project is for educational and portfolio purposes. Add your preferred license here (e.g. MIT License).
