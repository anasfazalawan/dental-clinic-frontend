import React from 'react';
import clsx from 'clsx';

export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={clsx('form-group', className)}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: '#94a3b8',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Icon size={16} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={clsx('form-input', error && 'border-rose-500')}
          style={{
            paddingLeft: Icon ? '38px' : '14px',
            borderColor: error ? '#ef4444' : undefined,
          }}
          {...props}
        />
      </div>
      {error && <div className="form-error">{error}</div>}
      {!error && helperText && (
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = 3,
  disabled = false,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className={clsx('form-group', className)}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="form-textarea"
        style={{
          borderColor: error ? '#ef4444' : undefined,
          resize: 'vertical',
        }}
        {...props}
      />
      {error && <div className="form-error">{error}</div>}
      {!error && helperText && (
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
          {helperText}
        </div>
      )}
    </div>
  );
};
