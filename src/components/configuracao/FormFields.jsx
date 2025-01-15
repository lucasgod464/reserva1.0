{`import React from 'react';

export const InputField = ({ label, type, value, onChange, placeholder, step, min, max, withPercentSymbol, textarea, disabled }) => {
  const styles = {
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      marginBottom: '15px'
    },
    inputContainer: {
      position: 'relative',
      width: '100%'
    },
    label: {
      fontSize: '14px',
      color: '#8B4513'
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #8B4513',
      borderRadius: '5px',
      backgroundColor: '#FFF8DC',
      width: '100%',
      boxSizing: 'border-box'
    },
    percentSymbol: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#8B4513',
      pointerEvents: 'none'
    }
  };

  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputContainer}>
        {textarea ? (
          <textarea
            style={{ ...styles.input, height: '100px' }}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <input
            style={styles.input}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            step={step}
            min={min}
            max={max}
            disabled={disabled}
          />
        )}
        {withPercentSymbol && <span style={styles.percentSymbol}>%</span>}
      </div>
    </div>
  );
};

export const SelectField = ({ label, value, onChange, options }) => {
  const styles = {
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      marginBottom: '15px'
    },
    label: {
      fontSize: '14px',
      color: '#8B4513'
    },
    input: {
      padding: '10px',
      fontSize: '16px',
      border: '1px solid #8B4513',
      borderRadius: '5px',
      backgroundColor: '#FFF8DC',
      width: '100%',
      boxSizing: 'border-box'
    }
  };

  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <select style={styles.input} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
`}
