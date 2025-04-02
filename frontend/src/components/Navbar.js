import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaDatabase, FaChartBar, FaChartLine, FaUsers, FaRobot, FaBars } from 'react-icons/fa';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMouseLeave = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="menu-toggle" onClick={toggleMenu}>
                <FaBars style={{ fontSize: '24px' }} />
            </div>
            <ul className={`main-nav ${isMenuOpen ? 'show' : ''}`} onMouseLeave={handleMouseLeave}>
                <li><Link to="/"><FaHome style={{ fontSize: '20px' }} /> 首页</Link></li>
                <li><Link to="/data-collection"><FaDatabase style={{ fontSize: '20px' }} /> 数据收集</Link></li>
                <li><Link to="/data-visualization"><FaChartBar style={{ fontSize: '20px' }} /> 数据可视化</Link></li>
                <li><Link to="/sales-prediction"><FaChartLine style={{ fontSize: '20px' }} /> 销售预测</Link></li>
                <li><Link to="/user-community"><FaUsers style={{ fontSize: '20px' }} /> 用户社区</Link></li>
                <li><Link to="/ai-services"><FaRobot style={{ fontSize: '20px' }} /> AI服务</Link></li>
            </ul>
            <ul className="right-nav">
                <li><Link to="/login">登录</Link></li>
                <li><Link to="/register">注册</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;    