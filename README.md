# 🦷 DentPulse — Frontend Single-Page Application

[![React Version](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.4.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-6.28.0-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Lucide Icons](https://img.shields.io/badge/Lucide%20Icons-0.468.0-F56565?logo=lucide&logoColor=white)](https://lucide.dev/)
[![Deployment](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive, component-based single-page application (SPA) for the **DentPulse Dental Clinic Management System**. Built with React 18, Vite, React Router, custom React hooks, and a medical design system.

---

## 🌟 Key Features & UI Highlights

- **📊 Clinic Dashboard (`/` or `/dashboard`)**:
  - 4 Key metric cards (Total Doctors, Today's Appointments, Upcoming Visits, Pending Review).
  - Quick action toolbar (Book Appointment, Add Doctor, Refresh Data).
  - Interactive "Today's Schedule" timeline with one-click status transitions.
  - "Doctors on Duty" workload widget with specialization tags.
  - "Recent Appointments" overview table with quick actions.
- **👨‍⚕️ Doctors Directory (`/doctors`)**:
  - Grid and Table view toggles.
  - Real-time search by doctor name, email, and phone number.
  - Specialization and active practice status filters.
  - Doctor cards displaying avatar, specialization badge, working days tags, daily shift hours, and rating.
  - Add / Edit Doctor modal with interactive weekday selector and field validations.
  - Doctor Profile & Schedule modal displaying full biography and booked patient visits.
  - Safe delete confirmation dialog with active booking conflict warnings.
- **📅 Appointments Schedule (`/appointments`)**:
  - Filterable by patient search, attending doctor, status, and date filters (Today, Tomorrow, Upcoming, Custom date).
  - Patient contact details, doctor badges, appointment date/time chips, duration, and treatment reason.
  - Inline Quick Status Changer dropdown (`QuickStatusSelect`).
  - Book / Edit Appointment modal with real-time doctor schedule checks and conflict prevention alerts.
  - Delete / Cancel Appointment confirmation modal.
- **⚡ Custom Hooks Architecture**:
  - `useDoctors`: Manages doctor listings, filtering, search, and CRUD mutations.
  - `useAppointments`: Manages appointment schedules, status transitions, doctor lookups, and conflict error handling.
  - `useDashboard`: Coordinates overview statistics, today's queue timeline, and live data refreshes.
- **📱 Responsive Collapsible Mini-Dock**:
  - Desktop sidebar collapses into a sleek 76px icon dock with centered logo and single header toggle.
  - Full slide-out drawer navigation with backdrop blur on mobile and tablet screens.
- **🔔 Glassmorphic Toast Notification System**:
  - High z-index (99999), top-right feedback notifications for all CRUD operations, errors, and validation warnings.

---

## 📁 Component Hierarchy & Structure

```
src/
├── components/
│   ├── common/
│   │   ├── AppLayout.jsx          # Shell layout (Sidebar + Header + Outlet)
│   │   ├── Sidebar.jsx            # Collapsible mini-dock navigation & status
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
├── hooks/
│   ├── useDoctors.js              # Encapsulated Doctor state & CRUD hooks
│   ├── useAppointments.js         # Encapsulated Appointment state & scheduling hooks
│   └── useDashboard.js            # Encapsulated Dashboard stats & schedule hooks
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

Configure your `.env` variables:

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

## 🌐 Live Production Deployment

- **Live Frontend (Vercel)**: [https://dental-clinic-frontend-nine.vercel.app](https://dental-clinic-frontend-nine.vercel.app/)
- **Live Backend API (Render)**: [https://dental-clinic-backend-ilhq.onrender.com](https://dental-clinic-backend-ilhq.onrender.com/)

---

## 🌐 Deploying to Vercel or Render

### Option A: Deploying on Vercel (Recommended)
1. Import your `dental-clinic-frontend` GitHub repository on [Vercel](https://vercel.com/).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable:
   - `VITE_API_URL`: `https://dental-clinic-backend-ilhq.onrender.com/api`
6. Click **Deploy**.

### Option B: Deploying on Render (Static Site)
1. In the [Render Dashboard](https://dashboard.render.com/), click **New +** -> **Static Site**.
2. Connect your `dental-clinic-frontend` GitHub repository.
3. Configure settings:
   - **Name**: `dental-clinic-frontend`
   - **Branch**: `develop`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://dental-clinic-backend-ilhq.onrender.com/api`
5. Under **Redirects / Rewrites**, add the SPA client-side routing rewrite rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
6. Click **Create Static Site**.

---

## 📄 License

This project is licensed under the MIT License.