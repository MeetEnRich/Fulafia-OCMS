# FULafia Online Clearance Management System (OCMS)

A full-stack web application that digitises the final-year student clearance workflow at the **Federal University of Lafia**. It replaces the manual, paper-based process with a centralised web portal where students pay fees, staff review and approve clearance requests, and administrators manage the entire ecosystem.

---

## Features

### Student Module
- Dashboard with real-time clearance progress ring and payment summary
- Simulated payment gateway with card entry, OTP verification, and digital receipt
- Visual clearance timeline showing department-by-department status
- Self-service clearance application initiation
- Downloadable PDF clearance certificate with QR code verification

### Staff Module (Bursary, Library, HOD, Student Affairs)
- Department-specific dashboard with status distribution chart
- Expandable pending request list with inline approve/reject actions
- Payment verification for bursary officers
- Clearance history log with search

### Admin Module
- University-wide analytics with bar and pie charts (Recharts)
- Clearance rate tracking and department performance comparison
- Full user management (Create, Edit, Reset Password)
- Comprehensive audit trail of all system activities

### System-Wide
- JWT-based authentication with role-based access control
- Toast notification system (replaces all browser alerts)
- Skeleton loaders for all data-fetching states
- Responsive design — works on desktop and mobile
- Audit logging for every significant action

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router 7 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **QR Codes** | qrcode.react |
| **PDF Generation** | html2canvas + jsPDF |
| **Backend** | Express 5 (Node.js) |
| **Database** | SQLite via better-sqlite3 |
| **Authentication** | bcryptjs + jsonwebtoken |

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/fulafia-ocms.git
cd fulafia-ocms

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Database Setup

```bash
# Seed the database with demo data (5 students, 5 staff, 1 admin)
cd server
node seeds/seed.js
cd ..
```

### Running the Application

You need **two terminals** — one for the backend and one for the frontend.

**Terminal 1 — Backend API (Port 5000):**
```bash
node server/index.js
```

**Terminal 2 — Frontend Dev Server (Port 5173):**
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Demo Credentials

| Role | User ID | Password |
|------|---------|----------|
| Student | `2021/CP/CSC/0076` | `student123` |
| Bursary Officer | `BURS001` | `staff123` |
| Library Officer | `LIB001` | `staff123` |
| HOD | `HOD001` | `staff123` |
| Student Affairs | `SA001` | `staff123` |
| Admin | `ADMIN001` | `admin123` |

---

## Project Structure

```
fulafia-ocms/
├── public/                     # Static assets (logo)
├── src/                        # Frontend (React + Vite)
│   ├── components/             # Reusable UI components
│   │   ├── Layout.jsx          # App shell (sidebar + header + outlet)
│   │   ├── Sidebar.jsx         # Role-aware navigation sidebar
│   │   └── UI.jsx              # Card, Btn, Toast, Skeleton, etc.
│   ├── context/
│   │   └── AppContext.jsx      # Auth state, toast system, notifications
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── student/            # Student dashboard, payment, clearance, certificate
│   │   ├── staff/              # Staff dashboard, pending requests, history
│   │   └── admin/              # Admin dashboard, user management, audit log
│   ├── services/
│   │   └── api.js              # Axios instance + all API methods
│   ├── App.jsx                 # Router with protected routes
│   ├── main.jsx
│   └── index.css               # Global design system
├── server/                     # Backend (Express.js)
│   ├── config/db.js            # SQLite connection
│   ├── controllers/            # Route handlers
│   ├── middleware/auth.js      # JWT + RBAC middleware
│   ├── routes/                 # Express route definitions
│   ├── seeds/seed.js           # Demo data seeder
│   ├── utils/helpers.js        # Utility functions
│   └── index.js                # Express app entry point
├── package.json
└── README.md
```

---

## API Endpoints

### Authentication
| Method | Route | Access |
|--------|-------|--------|
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/me` | Authenticated |

### Clearance
| Method | Route | Access |
|--------|-------|--------|
| `GET` | `/api/clearance` | Student |
| `POST` | `/api/clearance/apply` | Student |
| `GET` | `/api/clearance/pending` | Staff |
| `PUT` | `/api/clearance/:dept` | Staff |

### Payments
| Method | Route | Access |
|--------|-------|--------|
| `POST` | `/api/payments` | Student |
| `GET` | `/api/payments` | Student/Staff/Admin |

### Admin
| Method | Route | Access |
|--------|-------|--------|
| `GET` | `/api/stats` | Admin |
| `GET` | `/api/audit` | Admin |
| `GET/POST` | `/api/users` | Admin |
| `PUT` | `/api/users/:id` | Admin |
| `POST` | `/api/users/:id/reset-password` | Admin |

---

## Architecture

The system follows a **Three-Tier Architecture**:

1. **Presentation Layer** — React SPA with role-based dashboards
2. **Application Layer** — Express.js REST API with JWT authentication
3. **Data Layer** — SQLite database with 6 relational tables

---

## License

This project was built as an academic project for the Federal University of Lafia, Department of Computer Science.
