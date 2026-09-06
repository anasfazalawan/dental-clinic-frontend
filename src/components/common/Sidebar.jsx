import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  HeartPulse,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export const Sidebar = ({
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
}) => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/doctors',
      label: 'Doctors',
      icon: UserCheck,
      badge: 'Staff',
    },
    {
      to: '/appointments',
      label: 'Appointments',
      icon: CalendarDays,
      badge: 'Schedule',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(3px)',
            zIndex: 35,
          }}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${isMobileOpen ? 'mobile-open' : ''} ${
          isDesktopCollapsed ? 'collapsed' : ''
        }`}
      >
        {/* Brand header */}
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="brand-icon-wrapper" title="DentPulse Clinic">
              <HeartPulse size={22} />
            </div>
            {!isDesktopCollapsed && (
              <div>
                <div className="brand-name">
                  Dent<span>Pulse</span>
                </div>
                <span className="brand-tag">Clinic Management</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={onToggleDesktopCollapse}
            className="btn-icon desktop-collapse-btn"
            title={isDesktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isDesktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            style={{
              padding: '5px',
              borderRadius: '6px',
              color: '#64748b',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDesktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile Close Button */}
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="btn-icon mobile-close-btn"
              style={{ border: 'none', background: 'transparent' }}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {!isDesktopCollapsed && (
            <div className="sidebar-nav-title">Management</div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                end={item.to === '/'}
                title={isDesktopCollapsed ? item.label : undefined}
              >
                <Icon size={18} className="nav-icon" style={{ flexShrink: 0 }} />
                {!isDesktopCollapsed && (
                  <>
                    <span className="nav-item-label" style={{ flex: 1 }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className="nav-item-badge"
                        style={{
                          fontSize: '0.675rem',
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#f1f5f9',
                          color: '#64748b',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="sidebar-footer">
          <div className="system-status">
            <div
              className="status-dot"
              title="PostgreSQL / Supabase Connected"
            />
            {!isDesktopCollapsed && (
              <div className="system-status-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.8rem' }}>
                  System Live
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Supabase Connected
                </span>
              </div>
            )}
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .desktop-collapse-btn {
              display: none !important;
            }
          }
          @media (min-width: 769px) {
            .mobile-close-btn {
              display: none !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
};
