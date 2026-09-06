import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { AppLayout } from './components/common/AppLayout.jsx';
import { LoadingSpinner } from './components/common/LoadingSpinner.jsx';

// Code-splitting / Lazy loading page bundles
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage.jsx').then((m) => ({ default: m.DashboardPage }))
);
const DoctorsPage = lazy(() =>
  import('./pages/DoctorsPage.jsx').then((m) => ({ default: m.DoctorsPage }))
);
const AppointmentsPage = lazy(() =>
  import('./pages/AppointmentsPage.jsx').then((m) => ({ default: m.AppointmentsPage }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage.jsx').then((m) => ({ default: m.NotFoundPage }))
);

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner fullPage text="Loading portal..." />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<Navigate to="/" replace />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
