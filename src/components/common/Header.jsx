import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Clock, Calendar, PlusCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from './Button.jsx';

export const Header = ({
  onToggleMobile,
  isDesktopCollapsed,
  onToggleDesktopCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return {
          title: 'Clinic Dashboard',
          subtitle: 'Overview of today’s schedules, staff on duty, and clinical statistics.',
        };
      case '/doctors':
        return {
          title: 'Doctors Directory',
          subtitle: 'Manage specialized dentists, working hours, and active practice statuses.',
        };
      case '/appointments':
        return {
          title: 'Appointments Schedule',
          subtitle: 'Track, schedule, update, and manage all patient treatments.',
        };
      default:
        return {
          title: 'DentPulse Portal',
          subtitle: 'Dental Clinic Management System',
        };
    }
  };

  const pageInfo = getPageInfo();

  return (
    <header className="header">
      <div className="header-left">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobile}
          className="btn-icon mobile-menu-btn"
          style={{ display: 'none' }}
          aria-label="Toggle mobile menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Sidebar Toggle Button */}
        <button
          onClick={onToggleDesktopCollapse}
          className="btn-icon desktop-toggle-btn"
          title={isDesktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isDesktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isDesktopCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div>
          <h1 className="header-title">{pageInfo.title}</h1>
          <p className="header-subtitle">{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Live Date & Clock */}
        <div className="live-clock">
          <Calendar size={14} style={{ color: '#0ea5e9' }} />
          <span>
            {time.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <Clock size={14} style={{ color: '#0ea5e9' }} />
          <span>
            {time.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </span>
        </div>

        {/* Global Quick Action */}
        <Button
          onClick={() => navigate('/appointments?action=new')}
          icon={PlusCircle}
          size="sm"
        >
          Book Appointment
        </Button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .desktop-toggle-btn {
            display: none !important;
          }
          .live-clock {
            display: none !important;
          }
          .header-subtitle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
