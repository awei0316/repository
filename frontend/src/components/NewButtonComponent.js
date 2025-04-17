// src/components/NewButtonComponent.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NewButtonComponent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 20) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`new-button-container ${isVisible ? 'show' : 'hide'}`}>
            <div className="bottom-left-link">
                <Link to="/about">关于我们</Link>
            </div>
            <div className="bottom-right-link">
                <Link to="/contact">联系我们</Link>
            </div>
        </div>
    );
};

export default NewButtonComponent;