import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  Sparkles,
  RefreshCw,
  Trash2,
  AlertTriangle,
  AlertOctagon,
  Info,
  X,
} from 'lucide-react';

const ToastContext = createContext(null);

const ToastItem = ({ toast, onRemove }) => {
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef(toast.duration || 5000);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (toast.duration <= 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, remainingTimeRef.current);
  }, [toast.duration, toast.id, onRemove]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, [startTimer, clearTimer]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    clearTimer();
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    startTimer();
  };

  const getToastConfig = (type = 'success') => {
    switch (type.toLowerCase()) {
      case 'create':
      case 'created':
      case 'success':
        return {
          icon: <Sparkles size={18} style={{ color: '#059669' }} />,
          title: 'Successfully Created',
          className: 'toast-create',
          progressColor: '#10b981',
          bgCircle: '#d1fae5',
          titleColor: '#047857',
        };
      case 'update':
      case 'updated':
        return {
          icon: <RefreshCw size={17} style={{ color: '#0284c7' }} />,
          title: 'Record Updated',
          className: 'toast-update',
          progressColor: '#0284c7',
          bgCircle: '#e0f2fe',
          titleColor: '#0369a1',
        };
      case 'delete':
      case 'deleted':
      case 'remove':
      case 'removed':
        return {
          icon: <Trash2 size={17} style={{ color: '#e11d48' }} />,
          title: 'Record Removed',
          className: 'toast-delete',
          progressColor: '#f43f5e',
          bgCircle: '#ffe4e6',
          titleColor: '#be123c',
        };
      case 'warning':
      case 'warn':
        return {
          icon: <AlertTriangle size={18} style={{ color: '#d97706' }} />,
          title: 'Validation Notice',
          className: 'toast-warning',
          progressColor: '#f59e0b',
          bgCircle: '#fef3c7',
          titleColor: '#b45309',
        };
      case 'error':
      case 'conflict':
        return {
          icon: <AlertOctagon size={18} style={{ color: '#dc2626' }} />,
          title: 'Action Error',
          className: 'toast-error',
          progressColor: '#ef4444',
          bgCircle: '#fee2e2',
          titleColor: '#b91c1c',
        };
      default:
        return {
          icon: <Info size={18} style={{ color: '#4f46e5' }} />,
          title: 'System Information',
          className: 'toast-info',
          progressColor: '#6366f1',
          bgCircle: '#e0e7ff',
          titleColor: '#4338ca',
        };
    }
  };

  const config = getToastConfig(toast.type);

  return (
    <div
      className={`toast ${config.className}`}
      role="alert"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '10px',
          background: config.bgCircle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '1px',
        }}
      >
        {config.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.775rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: config.titleColor,
            marginBottom: '3px',
          }}
        >
          {config.title}
        </div>
        <div
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#1e293b',
            lineHeight: 1.45,
            wordBreak: 'break-word',
          }}
        >
          {toast.message}
        </div>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="toast-close-btn"
        aria-label="Close notification"
      >
        <X size={15} />
      </button>

      {toast.duration > 0 && (
        <div
          className="toast-progress-bar"
          style={{
            backgroundColor: config.progressColor,
            animationDuration: `${toast.duration}ms`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      )}
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

