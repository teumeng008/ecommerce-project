# E-Commerce Web Application
A full-stack e-commerce web application built with React, Node.js, Express, Prisma, and MySQL. The project currently supports core customer shopping functions, authentication, order management, and an admin dashboard for managing products, users, and inventory.

## Live Demo
🌐 Frontend: [ShopSphere](https://ecommerce-project-neon-theta.vercel.app)

⚙️ Backend: [API](https://ecommerce-project-g5w2.onrender.com/)

---

## Free Admin Account
You can use the following account to test the admin dashboard without creating an account:

- Email: `Admin@gmail.com`
- Password: `Admin1234`

---

## Screenshots

### Home / Product Catalog
![Home](./Screenshots/Screenshot%202026-09-15%20155037.png)

### Product Details
![Product Details](./Screenshots/Screenshot%202026-09-15%20155138.png)

### Shopping Cart
![Shopping Cart](./Screenshots/Screenshot%202026-09-15%20155227.png)

### Checkout
![Checkout](./Screenshots/Screenshot%202026-09-15%20155300.png)

### User Profile
![Profile](./Screenshots/Screenshot%202026-09-15%20155323.png)

### Admin Dashboard
![Admin Dashboard](./Screenshots/Screenshot%202026-09-15%20155340.png)

### Admin Product Management
![Admin Product Management](./Screenshots/Screenshot%202026-09-15%20155353.png)

---

## Features

### Customer
- User registration and login
- JWT-based authentication
- Role-based access control
- Browse products
- Filter products by category
- View product details
- Add products to cart
- Update cart quantities
- Remove products from cart
- Checkout and place orders
- View order history
- View order details
- Manage user profile

### Admin
- Admin dashboard
- View registered users
- Update user roles
- Create products
- Edit products
- Delete products
- Activate/deactivate products
- Manage product stock
- Manage product visibility

---

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Framer Motion
- React Hook Form
- Zod

### Backend
- Node.js
- Express.js
- JWT
- bcrypt
- CORS
- Cookie Parser
- Zod

### Database
- MySQL
- Prisma ORM

### Deployment
- Vercel — Frontend
- Render — Backend
- Aiven / Managed MySQL — Database

---

## Architecture
The application follows a client-server architecture with a separate React frontend and Express backend.

```text
┌─────────────────────┐
│     React Client    │
│       Vercel        │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│    Express Server   │
│       Render        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Authentication &    │
│ Authorization        │
│ Validation           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Controllers /       │
│ Services            │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Prisma ORM       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     MySQL           │
│     Database        │
└─────────────────────┘
```

### Backend Request Flow

```text
Request
   ↓
Route
   ↓
Validation
   ↓
Authentication
   ↓
Authorization
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
MySQL
   ↓
Response
```

---

## Project Structure

```text
ecommerce-project/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── app.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── package.json
│   └── ...
│
├── Screenshots/
│   └── ...
│
└── README.md
```

---

## Authentication & Security
The application uses several layers of backend protection:

- JWT-based authentication
- HTTP-only cookies for authentication tokens
- bcrypt password hashing
- Role-based authorization
- Protected API routes
- Zod request validation
- Centralized error handling
- CORS configuration
- User input validation and sanitization

Admin-only operations are protected by backend authorization middleware rather than relying only on frontend route protection.

---

## Database
The application uses MySQL with Prisma ORM.

The database contains entities for core e-commerce functionality, including:

- Users
- Products
- Categories
- Cart
- Cart Items
- Orders
- Order Items

Prisma handles database access, schema management, relationships, and queries.

---

## Local Development

### Prerequisites
Make sure you have installed:

- Node.js
- npm
- MySQL
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL

cd ecommerce-project
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables
Create a `.env` file inside the `server` directory.

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="YOUR_SECRET"
CLIENT_URL="http://localhost:5173"
```

> Never commit your `.env` file or production credentials to GitHub.

### 5. Generate Prisma Client

```bash
cd server
npx prisma generate
```

### 6. Run database migrations

```bash
npx prisma migrate dev
```

### 7. Seed the database

```bash
npm run seed
```

### 8. Start the backend

```bash
npm run dev
```

### 9. Start the frontend
Open another terminal:

```bash
cd client
npm run dev
```

The application will normally be available at:

```text
Frontend: http://localhost:5173
Backend: http://localhost:3000
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=
```

### Frontend

```env
VITE_API_URL=
```

> Do not commit real credentials, API keys, JWT secrets, or database passwords to the repository.

---

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Server

```bash
npm run dev
npm run start
npm run seed
```

---

## Deployment
The application is deployed using a frontend hosting service and a backend hosting service.

### Production Architecture

```text
User
 │
 ▼
Vercel
React Frontend
 │
 │ HTTPS API Requests
 ▼
Render
Express Backend
 │
 ▼
Prisma
 │
 ▼
MySQL Database
```

---

## Future Improvements
Possible future improvements include:

- Payment gateway integration
- Product reviews and ratings
- Discount and promotion system
- Email notifications
- Advanced order tracking
- Product search improvements
- Sales analytics
- Wishlist functionality

---

## License
This project was developed as a personal and educational full-stack project.
