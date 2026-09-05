# 🦷 DentPulse - Dental Clinic Management System (Frontend)

[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-6.4.3-646CFF.svg)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/react--router--dom-6.28.0-CA4245.svg)](https://reactrouter.com/)
[![Lucide Icons](https://img.shields.io/badge/lucide--react-0.468.0-F56565.svg)](https://lucide.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive, component-based single-page application (SPA) for the **DentPulse Dental Clinic Management System**. Built with React, Vite, React Router, and a custom medical design system.

---

## 🌟 Key Features & UI Highlights

- **Dashboard View (`/` or `/dashboard`)**:
  - 4 Key metric cards (Total Doctors, Today's Appointments, Upcoming Visits, Pending Review).
  - Quick action toolbar (Book Appointment, Add Doctor, Refresh, Seed Demo Data).
  - "Today's Schedule" interactive timeline with one-click status transitions.
  - "Doctors on Duty" workload widget.
  - "Recent Appointments" table with quick actions.
- **Doctors Directory (`/doctors`)**:
  - Grid and Table view toggling.
  - Real-time search by name, email, phone.
  - Specialization and active practice status filters.
  - Doctor cards with avatar, specialization badge, working days tags, daily shift hours, and rating.
  - Add / Edit Doctor modal with interactive weekday selector and field validations.
  - Comprehensive Doctor Profile & Schedule modal.
  - Delete Doctor confirmation dialog.
- **Appointments Schedule (`/appointments`)**:
  - Filterable by patient search, attending doctor, status, and dates (Today, Tomorrow, Upcoming, Custom date).
  - Patient details, doctor information, date/time chips, duration, treatment reason.
  - Inline Quick Status Changer dropdown.
  - Book / Edit Appointment modal with real-time doctor schedule checks and conflict prevention alerts.
  - Delete / Cancel Appointment confirmation dialog.
- **Global Toast Notification System**: Animated feedback for all CRUD actions and conflict errors.
- **State Management & UX**: Full loading spinners, skeleton loaders, empty states, and error handling.
- **Mobile Responsive Design**: Collapsible sidebar with backdrop overlay for mobile and tablet screens.

---

## 📁 Component Hierarchy & Structure

```
src/
├── components/
│   ├── common/
│   │   ├── AppLayout.jsx          # Shell wrapper (Sidebar + Header + Outlet)
│   │   ├── Sidebar.jsx            # Responsive navigation & API status indicator
│   │   ├── Header.jsx             # Live clock, page titles & quick book button
│   │   ├── Button.jsx             # Reusable button with variants & loading state
│   │   ├── Input.jsx              # Reusable text input and textarea
│   │   ├── Select.jsx             # Reusable select dropdown
│   │   ├── Badge.jsx              # Color-coded status & active badges
│   │   ├── Modal.jsx              # Accessible modal dialog with backdrop blur
│   │   ├── ConfirmDialog.jsx      # Confirmation modal for destructive actions
│   │   ├── EmptyState.jsx         # Custom illustrations & call-to-actions
│   │   ├── LoadingSpinner.jsx     # Loading spinners & skeleton cards
│   │   └── Skeleton.jsx           # Animated placeholder elements
│   ├── dashboard/
│   │   ├── StatCard.jsx           # Metric summary card
│   │   ├── QuickActions.jsx       # Action shortcuts toolbar
│   │   └── TodaySchedule.jsx      # Today's queue timeline widget
│   ├── doctors/
│   │   ├── DoctorCard.jsx         # Doctor profile card
│   │   ├── DoctorTable.jsx        # Doctor tabular view
│   │   ├── DoctorFormModal.jsx    # Add / Edit doctor modal
│   │   └── DoctorDetailModal.jsx  # Detailed biography & assigned visits
│   └── appointments/
│       ├── AppointmentTable.jsx   # Appointments table with row actions
│       ├── AppointmentFormModal.jsx # Book / Edit appointment modal
│       └── QuickStatusSelect.jsx  # Inline status switcher
├── context/
│   └── ToastContext.jsx           # Global toast notification context
├── pages/
│   ├── DashboardPage.jsx          # Clinic dashboard view
│   ├── DoctorsPage.jsx            # Doctors directory view
│   ├── AppointmentsPage.jsx       # Appointments scheduling view
│   └── NotFoundPage.jsx           # 404 error page
├── services/
│   ├── api.js                     # Centralized API fetch client
│   ├── doctorService.js           # Doctor API operations
│   ├── appointmentService.js      # Appointment API operations
│   └── dashboardService.js        # Analytics & seed endpoints
├── styles/
│   └── index.css                  # Custom medical design system & tokens
├── utils/
│   └── formatters.js              # Date, time, and status formatters
├── App.jsx                        # React Router configuration
└── main.jsx                       # Application entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- Running instance of the `dental-clinic-backend` API.

### 1. Installation

Clone the repository and checkout the `develop` branch:

```bash
git clone <YOUR_FRONTEND_REPO_URL> dental-clinic-frontend
cd dental-clinic-frontend
git checkout develop
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Set your backend API URL in `.env`:

```env
# For local development:
VITE_API_URL=http://localhost:5000/api

# For production deployment on Render:
# VITE_API_URL=https://dental-clinic-backend.onrender.com/api
```

### 3. Development Server

Start the local Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### 4. Production Build

To create an optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Deploying to Render (Static Site)

1. Push your frontend repository to GitHub on the `develop` (or `main`) branch.
2. In the [Render Dashboard](https://dashboard.render.com/), click **New +** -> **Static Site**.
3. Connect your `dental-clinic-frontend` GitHub repository.
4. Configure settings:
   - **Name**: `dental-clinic-frontend`
   - **Branch**: `develop`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-subdomain.onrender.com/api`
6. Under **Redirects / Rewrites**, add a rewrite rule for SPA client-side routing:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
7. Click **Create Static Site**.

---

## 📄 License

This project is licensed under the MIT License.
