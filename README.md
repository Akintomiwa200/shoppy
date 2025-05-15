
# Shoppy - E-Commerce Backend API

A real-time e-commerce platform built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- User Authentication (JWT)
- Real-time Product Updates
- Payment Integration (Paystack)
- Admin Dashboard
- API Documentation (Swagger)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create .env file:
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PAYSTACK_SECRET=your_paystack_secret_key
```

3. Start the server:
```bash
npm run dev
```

## API Documentation

Access Swagger documentation at: `http://localhost:5000/api-docs`

### Main Endpoints

#### Authentication
- POST `/api/auth/signup` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile
- POST `/api/auth/request-reset` - Request password reset
- POST `/api/auth/reset-password` - Reset password

#### Products
- GET `/api/products` - List all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

#### Payments
- POST `/api/payments/pay` - Initiate payment
- GET `/api/payments/verify/:reference` - Verify payment
- GET `/api/payments/transactions` - List transactions
- POST `/api/payments/webhook` - Payment webhook

## Real-time Features

The application uses Socket.IO for real-time updates:
- Product inventory updates
- Payment status notifications
- Admin dashboard updates

## Error Handling

The API uses standardized error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error info"
}
```
