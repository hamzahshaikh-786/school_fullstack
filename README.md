# School Payments & Dashboard

A complete full-stack microservice for school payment processing with React dashboard.

## Quick Start

### Backend (Node.js + Express + MongoDB)
```bash
cd backend
npm install
npm run dev
```
- **Port**: 4005
- **Health**: http://localhost:4005/health
- **API Docs**: See `postman_collection.json`

### Frontend (React + Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
- **Port**: 5177
- **URL**: http://localhost:5177

## Features

### Completed
- **Backend API**: Complete REST API with auth, payments, webhooks, transactions
- **Frontend Dashboard**: React dashboard with filters, pagination, search
- **Authentication**: JWT-based auth with auto-register/login
- **Payment Flow**: Create payment → webhook processing → status tracking
- **Data Models**: User, Order, OrderStatus, WebhookLog with proper indexes
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Testing**: Jest + Supertest unit tests
- **Validation**: DTOs with class-validator
- **Navigation**: React Router with multiple pages
- **Postman Collection**: Complete API testing collection

### In Progress
- **Deployment**: Backend to Render, Frontend to Vercel

## Architecture

```
/school_fullstack
├── /backend          # Node.js + Express API
│   ├── /src/modules  # Auth, Orders, Transactions, Webhooks
│   ├── /src/common   # DTOs, Utils, Middleware
│   ├── /scripts      # Seed data
│   └── /tests        # Unit tests
└── /frontend         # React + Vite + Tailwind
    ├── /src/pages    # Dashboard, TransactionDetail, etc.
    └── /src/lib      # API client
```

## 🔗 API Endpoints

### Auth
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### Payments
- `POST /create-payment` - Create payment order

### Webhooks
- `POST /webhook` - Process payment webhooks

### Transactions
- `GET /transactions` - Get all transactions (paginated)
- `GET /transactions/school/:schoolId` - Get school transactions
- `GET /transaction-status/:custom_order_id` - Get transaction status

## Demo Credentials

- **Email**: demo@example.com
- **Password**: Password123!
- **Role**: school

## Deployment

### Backend (Render)
1. Push to GitHub
2. Connect Render to repo
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Frontend (Vercel)
1. Push to GitHub
2. Connect Vercel to repo
3. Set `VITE_API_URL` to deployed backend URL

## Database Schema

### User
- email (unique), passwordHash, role, createdAt

### Order
- school_id, trustee_id, student_info, gateway_name, custom_order_id (unique), metadata, createdAt

### OrderStatus
- collect_id (ref Order), order_amount, transaction_amount, payment_mode, status, payment_time, updatedAt

### WebhookLog
- raw_payload, receivedAt, processed, error

## Testing

```bash
# Backend tests
cd backend
npm test

# Seed data
npm run seed
```

## Frontend Pages

- `/` - Main dashboard with all transactions
- `/transaction/:custom_order_id` - Transaction details
- `/school/:schoolId` - School-specific transactions
- `/create-payment` - Create new payment form

## Environment Variables

### Backend
- `PORT=4005`
- `NODE_ENV=development`
- `JWT_SECRET=your-secret-key`
- `MONGODB_URI=mongodb://localhost:27017/school_payments`

### Frontend
- `VITE_API_URL=http://localhost:4005`

## 📈 Performance

- **Backend**: Express with MongoDB indexes on frequently queried fields
- **Frontend**: React with Vite for fast builds, Tailwind for optimized CSS
- **Security**: Rate limiting, input sanitization, JWT authentication
- **Scalability**: Microservice architecture, stateless design

## UI/UX

- **Design**: Modern, responsive Tailwind CSS
- **Components**: Reusable React components
- **Navigation**: React Router with clean URLs
- **Interactions**: Hover effects, loading states, error handling
- **Accessibility**: Proper ARIA labels, keyboard navigation

---

**Status**: Nicely designed Production Ready Application!!
**Last Updated**: September 17, 2025
