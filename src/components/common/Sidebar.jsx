import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CalendarDays,
  Sparkles,
  Activity,
  HeartPulse,
  Database,
  X,
} from 'lucide-react';
import { dashboardService } from '../../services/dashboardService.js';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const [dbStatus, setDbStatus] = useState({ online: true, text: 'Connected' });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await dashboardService.checkHealth();
        if (res.status === 'healthy' || res.status === 'online') {
          setDbStatus({ online: true, text: 'API & DB Online' });
        } else {
          setDbStatus({ online: false, text: 'DB Connecting...' });
        }
      } catch (err) {
        setDbStatus({ online: false, text: 'Offline Mode' });
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

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
            zIndex: 35,
          }}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand header */}
        <div className="sidebar-brand">
          <div className="brand-icon-wrapper">
            <HeartPulse size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="brand-name">
              Dent<span>Pulse</span>
            </div>
            <span className="brand-tag">Clinic Management</span>
          </div>
          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="btn-icon"
              style={{ border: 'none' }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#94a3b8',
              letterSpacing: '0.06em',
              padding: '0.5rem 0.75rem 0.25rem',
            }}
          >
            Management
          </div>

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
              >
                <Icon size={18} className="nav-icon" />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
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
              </NavLink>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="sidebar-footer">
          <div className="system-status">
            <div
              className="status-dot"
              style={{
                backgroundColor: dbStatus.online ? '#10b981' : '#f59e0b',
                boxShadow: dbStatus.online
                  ? '0 0 0 3px rgba(16, 185, 129, 0.2)'
                  : '0 0 0 3px rgba(245, 158, 11, 0.2)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>
                System Live
              </span>
              <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
                {dbStatus.text}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
