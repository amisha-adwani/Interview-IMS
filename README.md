# Inventory Management System (IMS)

Full-stack inventory management system built with React, Redux Toolkit, Node.js, Express, and MongoDB.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env - set MONGODB_URI and JWT_SECRET
npm run dev
```

Backend runs on http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173 with API proxy to backend.

### 3. First User

1. Open http://localhost:5173/register
2. Register with email, password, and role **Admin**
3. Sign in at /login

## Features

- **Auth**: JWT-based login, role-based access (Admin / Viewer)
- **Products**: CRUD, pagination, search, category filter, low-stock filter
- **Stock Movements**: Stock IN/OUT with atomic updates (no negative quantity)
- **Dashboard**: Total products, low-stock list, recent movements

## Live Demo

🚀 **Live Application**: https://interview-ims-1.onrender.com/

## Setup Steps

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd interview
```

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env - set MONGODB_URI and JWT_SECRET
npm run dev
```

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Create First User
1. Open http://localhost:5173/register
2. Register with email, password, and role **Admin**
3. Sign in at /login

## API Overview

The API follows RESTful conventions with JWT authentication:

### Authentication
- **POST /api/auth/login** - User login
- **POST /api/auth/register** - User registration

### Products Management
- **GET /api/products** - List products with pagination, search, and filters
- **POST /api/products** - Create new product (Admin only)
- **PATCH /api/products/:id** - Update product (Admin only)
- **DELETE /api/products/:id** - Delete product (Admin only)

### Stock Management
- **GET /api/movements** - List stock movements with pagination
- **POST /api/movements** - Create stock movement (Admin only)

### Dashboard
- **GET /api/dashboard** - Get dashboard statistics

### Health Check
- **GET /health** - API health status

## Assumptions

1. **Single-Tenant Architecture**: The system is designed for a single organization/tenant
2. **Role-Based Access**: Only two roles - Admin (full access) and Viewer (read-only)
3. **Atomic Stock Updates**: Stock movements are atomic to prevent negative inventory
4. **JWT Authentication**: Stateless authentication using JWT tokens
5. **MongoDB as Primary Database**: Document-based storage for flexibility
6. **Client-Side Pagination**: Frontend handles pagination for better performance
7. **Real-Time Updates Not Required**: No WebSocket implementation for real-time updates

## Trade-offs

1. **Simplicity vs. Features**: Prioritized core functionality over advanced features like reporting, analytics, or multi-warehouse support
2. **Performance vs. Development Speed**: Used MongoDB for rapid development over relational databases that might offer better data consistency
3. **Security vs. Convenience**: JWT tokens have 1-hour expiry for security, requiring more frequent logins
4. **Scalability vs. Complexity**: Stateless API design for scalability, but lacks advanced caching mechanisms
5. **UI Framework Choice**: Used React with Tailwind for rapid development over more comprehensive UI libraries
6. **Error Handling**: Basic error handling implemented without comprehensive logging or monitoring
7. **Testing**: Manual testing approach over automated testing for faster delivery

## API Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/auth/login | No | - |
| POST | /api/auth/register | No | - |
| GET | /api/products | Yes | Viewer+ |
| POST | /api/products | Yes | Admin |
| PATCH | /api/products/:id | Yes | Admin |
| DELETE | /api/products/:id | Yes | Admin |
| GET | /api/movements | Yes | Viewer+ |
| POST | /api/movements | Yes | Admin |
| GET | /api/dashboard | Yes | Viewer+ |
| GET | /health | No | - |

## Project Structure

```
backend/           # Node.js + Express API
frontend/          # React + Redux + Tailwind
Mini-IMS-Architecture-Design.md   # Architecture document
```

## Environment Variables

### Backend (.env)

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiry (default: 1h)
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - CORS origin (default: http://localhost:5173)
