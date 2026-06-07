# TechnoAuth — Full Stack Auth + Protected Dashboard

TechnoAuth is a professional-grade user authentication and management system built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. It features a role-aware dashboard, real-time validations, and industry-standard security practices.

## 🚀 Features

- **Advanced Auth**: Secure Registration and Login with JWT and Bcrypt hashing.
- **Role-Based Access Control (RBAC)**: Distinct permissions and views for `Admin` and `User` roles.
- **Professional Dashboard**: Compact, high-performance UI with URL-persistent routing.
- **User Management (Admin)**: Real-time user directory with debounced search, status filtering, and pagination.
- **Security Enforcement**: Automatic session termination if an account is deactivated by an admin.
- **Real-time Validations**: Live password strength checking and email pattern validation.
- **Optimized Performance**: Zero redundant re-renders using React Memo, TanStack Query, and optimized context.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4, TanStack Query, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Bcrypt.

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

### 2. Clone and Install
```bash
# Backend setup
cd backend
npm install

# Frontend setup
cd ../frontend
npm install
```

### 3. Environment Configuration

#### Backend (`backend/.env`)
Create a `.env` file in the `backend` folder (use `.env.example` as a template):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

#### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Running the Application

#### Start Backend
```bash
cd backend
npm run dev
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── modules/auth/    # Auth controller, service, model, routes
│   │   ├── middleware/      # Auth & Error middlewares
│   │   ├── config/          # DB configuration
│   │   └── utils/           # Validation utilities
├── frontend/
│   ├── src/
│   │   ├── context/         # Auth state management
│   │   ├── hooks/           # TanStack Query & Debounce hooks
│   │   ├── components/      # Sidebar, Modals, ProtectedRoutes
│   │   └── pages/           # Login, Register, Dashboard
```

## 🔒 Security Notes
- Admin users cannot deactivate their own accounts.
- Inactive users are blocked at both the login and API middleware levels.
- All sensitive configurations are managed via environment variables and ignored by Git.
