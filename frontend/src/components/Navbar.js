import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import DebounceClick from './DebounceClick';
import navbarMenuItems from '../constants/navbarMenuItems';
import Clock from './Clock';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userAvatar, setUserAvatar] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        const storedUserAvatar = localStorage.getItem('userAvatar');
        if (storedIsLoggedIn === 'true') {
            setIsLoggedIn(true);
            setUserAvatar(storedUserAvatar);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 添加日志确认路由变化
    useEffect(() => {
        console.log('当前路由:', location.pathname);
    }, [location]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userAvatar');
        setIsLoggedIn(false);
        setUserAvatar('');
        setIsDropdownOpen(false);
    };

    const handleAvatarClick = () => {
        if (isLoggedIn) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            navigate('/login');
        }
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
                <Clock />
                <div
                    className="circle"
                    style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        backgroundColor: isLoggedIn ? 'transparent' : '#007BFF',
                        color: isLoggedIn ? 'inherit' : 'white'
                    }}
                    onClick={handleAvatarClick}
                >
                    {isLoggedIn ? (
                        <img
                            src={userAvatar}
                            alt="User Avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <span style={{ lineHeight: '30px', textAlign: 'center', display: 'block' }}>登录</span>
                    )}
                    {isLoggedIn && (
                        <div
                            className="dropdown"
                            style={{
                                display: isDropdownOpen ? 'block' : 'none',
                                position: 'absolute',
                                top: '35px',
                                right: '10px',
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                zIndex: 100
                            }}
                            ref={dropdownRef}
                        >
                            <Link to="/profile" style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#333' }}>个人信息</Link>
                            <a href="#" onClick={handleLogout} style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#333' }}>退出登录</a>
                        </div>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export default Navbar;