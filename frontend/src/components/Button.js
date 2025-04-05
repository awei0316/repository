// src/components/Button.js
import React from 'react';

const Button = ({ children, onClick, className, loading = false, isCodeButton = false }) => {
    const baseClass = isCodeButton ? 'btn-code' : 'btn';
    return (
        <button onClick={onClick} className={`${baseClass} ${className}`} disabled={loading}>
            {loading ? '加载中...' : children}
        </button>
    );
};

export default Button;