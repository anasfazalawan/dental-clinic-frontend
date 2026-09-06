import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  HeartPulse,
  X,
} from 'lucide-react';

export const Sidebar = ({
  isMobileOpen,
  onCloseMobile,
  isDesktopCollapsed,
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
        {/* Brand Header */}
        <div
          className="sidebar-brand"
          style={{
            justifyContent: isDesktopCollapsed ? 'center' : 'space-between',
            padding: isDesktopCollapsed ? '1rem 0.5rem' : '1.25rem 1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              justifyContent: isDesktopCollapsed ? 'center' : 'flex-start',
              width: isDesktopCollapsed ? '100%' : 'auto',
            }}
          >
            <div
              className="brand-icon-wrapper"
              title="DentPulse Clinic Management"
              style={{ margin: isDesktopCollapsed ? '0 auto' : undefined }}
            >
              <HeartPulse size={22} />
            </div>
            {!isDesktopCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div className="brand-name">
                  Dent<span>Pulse</span>
                </div>
                <span className="brand-tag">Clinic Management</span>
              </div>
            )}
          </div>

          {/* Mobile Close Button only on Mobile Drawer */}
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

        {/* Professional Clinical System Status Footer */}
        <div className="sidebar-footer">
          <div
            className="system-status"
            style={{
              justifyContent: isDesktopCollapsed ? 'center' : 'flex-start',
            }}
          >
            <div
              className="status-dot"
              title="Clinic System Operational"
            />
            {!isDesktopCollapsed && (
              <div className="system-status-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.8rem' }}>
                  System Operational
                </span>
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  All Services Online
                </span>
              </div>
            )}
          </div>
        </div>

        <style>{`
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
