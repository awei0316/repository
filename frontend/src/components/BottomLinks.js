import React from 'react';
import { Link } from 'react-router-dom';

const BottomLinks = () => {
    return (
        <div className="bottom-links-container">
            <div className="bottom-left-link">
                <Link to="/about">关于我们</Link>
            </div>
            <div className="bottom-right-link">
                <Link to="/contact">联系我们</Link>
            </div>
        </div>
    );
};

export default BottomLinks;    