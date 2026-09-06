import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />,
          title: 'Success',
          bgCircle: '#d1fae5',
        };
      case 'error':
        return {
          icon: <AlertCircle size={20} style={{ color: '#ef4444', flexShrink: 0 }} />,
          title: 'Validation / System Notice',
          bgCircle: '#fee2e2',
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />,
          title: 'Attention',
          bgCircle: '#fef3c7',
        };
      default:
        return {
          icon: <Info size={20} style={{ color: '#0ea5e9', flexShrink: 0 }} />,
          title: 'Information',
          bgCircle: '#e0f2fe',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          return (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              role="alert"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
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
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: toast.type === 'error' ? '#b91c1c' : toast.type === 'success' ? '#047857' : '#0369a1',
                    marginBottom: '2px',
                  }}
                >
                  {config.title}
                </div>
                <div
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#334155',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                  }}
                >
                  {toast.message}
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="toast-close-btn"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
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

