# FULafia Online Clearance Management System (OCMS)

A full-stack web application that digitises the final-year student clearance workflow at the **Federal University of Lafia**. It replaces the manual, paper-based process with a centralised web portal where students pay fees, staff review and approve clearance requests, and administrators manage the entire ecosystem.

---

## Features

### Student Module

- Dashboard with real-time clearance progress and payment summary
- Remita-styled payment gateway simulation with card entry and digital receipt
- 7-department clearance status timeline with live updates
- Self-service clearance application initiation
- Bio-data verification gate before certificate access
- Downloadable PDF clearance certificate (landscape A4) with QR code verification
- Support ticket system — raise and track tickets with staff replies
- Self-service password change

### Staff Module (7 Departments)

- Bursary, Library, Department, Faculty, Clinic, Hostel, Student Affairs
- Department-specific dashboard with status distribution chart (Recharts)
- Pending request list with inline approve/reject and bulk approve actions
- Rejection requires mandatory comment
- Clearance history log with search
- Support ticket inbox with reply functionality

### Admin Module

- University-wide analytics with bar and pie charts
- Clearance rate tracking and department performance comparison
- Full user management (Create, Edit, Reset Password)
- Comprehensive audit trail of all system activities

### System-Wide

- JWT-based authentication with role-based access control
- Toast notification system
- Skeleton loaders for all data-fetching states
- Collapsible icon-only sidebar
- Responsive design — works on desktop and mobile
- Audit logging for every significant action

---

## Tech Stack

| Layer              | Technology                                |
| ------------------ | ----------------------------------------- |
| **Frontend**       | React 19, Vite 8, React Router 7          |
| **Charts**         | Recharts                                  |
| **Icons**          | Lucide React                              |
| **QR Codes**       | qrcode.react                              |
| **PDF Generation** | html2canvas + jsPDF                       |
| **Backend**        | Express 5 (Node.js)                       |
| **Database**       | SQLite via Node.js built-in `node:sqlite` |
| **Authentication** | bcryptjs + jsonwebtoken                   |
| **Dev Tooling**    | concurrently (unified dev server)         |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **v22 or later** (required for built-in `node:sqlite`)
- npm (comes with Node.js)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/MeetEnRich/Fulafia-OCMS.git
cd fulafia-ocms
```

### Step 2 — Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 3 — Configure Environment Variables

The backend requires a `.env` file inside the `server/` directory. A default one is included, but you can customize it:

```bash
# server/.env
JWT_SECRET=your-secret-key-here
DB_PATH=./database.sqlite
PORT=5000
```

### Step 4 — Seed the Database

This creates all tables and populates the database with demo data (6 students, 7 staff, 1 admin):

```bash
node server/seeds/seed.js
```

You should see output confirming all tables and demo accounts were created.

### Step 5 — Start the Application

A single command starts **both** the backend API and the frontend dev server:

```bash
npm start
```

This runs:

- **Backend API** → `http://localhost:5000`
- **Frontend** → `http://localhost:5173`

Open **http://localhost:5173** in your browser.

> **Note:** If you prefer to run them separately, use `npm run server` and `npm run dev` in two terminals.

---

## Demo Credentials

| Role                    | User ID             | Password     |
| ----------------------- | ------------------- | ------------ |
| Student                 | `2021/CP/CSC/0076`  | `student123` |
| Student (Fully Cleared) | `2021/ENG/EEE/0043` | `student123` |
| Bursary Officer         | `BURS001`           | `staff123`   |
| Library Officer         | `LIB001`            | `staff123`   |
| Department Officer      | `DEPT001`           | `staff123`   |
| Faculty Officer         | `FAC001`            | `staff123`   |
| Clinic Officer          | `CLN001`            | `staff123`   |
| Hostel Officer          | `HST001`            | `staff123`   |
| Student Affairs         | `SA001`             | `staff123`   |
| Admin                   | `ADMIN001`          | `admin123`   |

---

## Project Structure

```
fulafia-ocms/
├── public/                     # Static assets (logo)
├── src/                        # Frontend (React + Vite)
│   ├── components/
│   │   ├── Layout.jsx          # App shell (sidebar + header + outlet)
│   │   ├── Sidebar.jsx         # Collapsible, role-aware navigation
│   │   └── UI.jsx              # Card, Btn, Toast, Skeleton, etc.
│   ├── context/
│   │   └── AppContext.jsx      # Auth state, toast system, notifications
│   ├── pages/
│   │   ├── LoginPage.jsx       # Login with demo account buttons
│   │   ├── ChangePassword.jsx  # Self-service password change
│   │   ├── student/
│   │   │   ├── Overview.jsx    # Student dashboard
│   │   │   ├── Payment.jsx     # Remita payment gateway
│   │   │   ├── Clearance.jsx   # 7-dept clearance tracker
│   │   │   ├── MyTickets.jsx   # Support ticket viewer
│   │   │   ├── BioVerification.jsx
│   │   │   └── Certificate.jsx # PDF certificate generation
│   │   ├── staff/
│   │   │   ├── Overview.jsx    # Staff dashboard with charts
│   │   │   ├── PendingRequests.jsx
│   │   │   └── History.jsx
│   │   └── admin/
│   │       ├── Overview.jsx    # Admin analytics dashboard
│   │       ├── AuditLog.jsx
│   │       └── UserManagement.jsx
│   ├── services/
│   │   └── api.js              # Axios instance + all API methods
│   ├── App.jsx                 # Router with protected routes
│   ├── main.jsx
│   └── index.css               # Global design system (CSS variables)
├── server/                     # Backend (Express.js)
│   ├── config/db.js            # SQLite connection (node:sqlite)
│   ├── controllers/
│   │   ├── authController.js   # Login, profile, change password
│   │   ├── adminController.js  # Stats, users, certificate, bio-data
│   │   ├── clearanceController.js
│   │   ├── paymentController.js
│   │   ├── studentController.js
│   │   └── ticketController.js
│   ├── middleware/auth.js      # JWT verification + RBAC
│   ├── routes/                 # Express route definitions
│   ├── seeds/seed.js           # Demo data seeder
│   ├── utils/helpers.js        # Constants & utility functions
│   └── index.js                # Express app entry point
├── package.json
└── README.md
```

---

## API Endpoints

### Authentication

| Method | Route                       | Access        |
| ------ | --------------------------- | ------------- |
| `POST` | `/api/auth/login`           | Public        |
| `GET`  | `/api/auth/me`              | Authenticated |
| `PUT`  | `/api/auth/change-password` | Authenticated |

### Students

| Method | Route                              | Access         |
| ------ | ---------------------------------- | -------------- |
| `GET`  | `/api/students`                    | Staff/Admin    |
| `GET`  | `/api/students/:userId`            | Authenticated  |
| `PUT`  | `/api/students/:userId/verify-bio` | Student (self) |

### Clearance

| Method | Route                         | Access  |
| ------ | ----------------------------- | ------- |
| `GET`  | `/api/clearance`              | Student |
| `POST` | `/api/clearance/apply`        | Student |
| `GET`  | `/api/clearance/pending`      | Staff   |
| `PUT`  | `/api/clearance/:dept`        | Staff   |
| `POST` | `/api/clearance/bulk-approve` | Staff   |

### Payments

| Method | Route                       | Access        |
| ------ | --------------------------- | ------------- |
| `POST` | `/api/payments`             | Student       |
| `GET`  | `/api/payments`             | Authenticated |
| `GET`  | `/api/payments/student/:id` | Staff/Admin   |

### Support Tickets

| Method | Route                    | Access        |
| ------ | ------------------------ | ------------- |
| `POST` | `/api/tickets`           | Student       |
| `GET`  | `/api/tickets`           | Authenticated |
| `PUT`  | `/api/tickets/:id/reply` | Staff         |

### Admin

| Method     | Route                           | Access        |
| ---------- | ------------------------------- | ------------- |
| `GET`      | `/api/stats`                    | Admin         |
| `GET`      | `/api/audit`                    | Admin         |
| `GET/POST` | `/api/users`                    | Admin         |
| `PUT`      | `/api/users/:id`                | Admin         |
| `POST`     | `/api/users/:id/reset-password` | Admin         |
| `GET`      | `/api/graduation-list`          | Admin         |
| `GET`      | `/api/certificate/:studentId`   | Authenticated |

---

## Clearance Workflow

```
Student Applies → 7 Pending Clearance Rows Created
                        ↓
    Each Department Staff Reviews Independently
         ↓                              ↓
     Approve ✅                    Reject ❌ (with comment)
         ↓                              ↓
   Clearance Granted          Student Raises Support Ticket
                                        ↓
                              Staff Replies & Reconsiders

All 7 Cleared + All 4 Fees Paid + Bio-Data Verified → Certificate Generated
```

---

## Architecture

The system follows a **Three-Tier Architecture**:

1. **Presentation Layer** — React SPA with role-based dashboards
2. **Application Layer** — Express.js REST API with JWT authentication
3. **Data Layer** — SQLite database with 7 relational tables (users, students, clearance_requests, payments, notifications, audit_log, tickets)

---

## License

This project was built as an academic project for the Federal University of Lafia, Department of Computer Science.
