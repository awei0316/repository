// src/components/PasswordVisibilityToggle.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordVisibilityToggle = ({ inputRef, onToggleVisibility }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(!isVisible);
        if (onToggleVisibility) {
            onToggleVisibility(!isVisible);
        }
    };

    return (
        <span className="password-toggle" onClick={toggleVisibility}>
            {isVisible ? <FaEyeSlash /> : <FaEye />}
        </span>
    );
};

export default PasswordVisibilityToggle;