import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Header } from './Header.jsx';

export const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    return localStorage.getItem('dentpulse_sidebar_collapsed') === 'true';
  });

  const handleToggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('dentpulse_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div className={`app-container ${isDesktopCollapsed ? 'desktop-collapsed' : ''}`}>
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleDesktopCollapse={handleToggleDesktopCollapse}
      />
      <div className="main-content">
        <Header
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopCollapse={handleToggleDesktopCollapse}
        />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
