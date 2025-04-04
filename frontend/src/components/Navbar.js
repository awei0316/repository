// repository/frontend/src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import DebounceClick from './DebounceClick';
import navbarMenuItems from '../constants/navbarMenuItems';
import Clock from './Clock';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <DebounceClick onClick={toggleMenu}>
                <div className="menu-toggle">
                    <FaBars style={{ fontSize: '24px' }} />
                </div>
            </DebounceClick>
            <ul className={`main-nav ${isMenuOpen ? 'show' : ''}`} onMouseLeave={handleMouseLeave}>
                {navbarMenuItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            to={item.path}
                            className={location.pathname === item.path ? 'active' : ''}
                        >
                            {item.icon} {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <ul className="right-nav">
                <Clock /> {/* 将时钟组件放在右侧导航栏 */}
                <li><Link to="/login">登录</Link></li>
                <li><Link to="/register">注册</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;