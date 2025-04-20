// src/components/CustomAlert.js
import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ message, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="custom-alert">
            <div className="custom-alert-content">
                <p>{message}</p>
                <button onClick={onClose}>确定</button>
            </div>
        </div>
    );
};

export default CustomAlert;