import React from 'react';

const Button = ({ children, onClick, className, loading = false }) => {
    return (
        <button onClick={onClick} className={`btn ${className}`} disabled={loading}>
            {loading ? '加载中...' : children}
        </button>
    );
};

export default Button;   