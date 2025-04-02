import React from 'react';

const InputField = ({ type, placeholder, value, onChange, required, error }) => {
    return (
        <div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`input-field ${error ? 'input-error' : ''}`}
                required={required}
            />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default InputField;    