import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BottomLinks = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setIsVisible(true);
                // 当滚动到底部时，给页脚添加 show 类
                document.querySelector('.footer').classList.add('show'); 
            } else {
                setIsVisible(false);
                // 当离开底部时，移除页脚的 show 类
                document.querySelector('.footer').classList.remove('show'); 
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`bottom-links-container ${isVisible ? 'show' : 'hide'}`}>
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