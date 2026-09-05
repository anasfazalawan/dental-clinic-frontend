import React from 'react';
import clsx from 'clsx';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
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
      <select
        id={name}
        name={name}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="form-select"
        style={{
          borderColor: error ? '#ef4444' : undefined,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <div className="form-error">{error}</div>}
      {!error && helperText && (
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>
          {helperText}
        </div>
      )}
    </div>
  );
};
