import React from 'react';
import { FaGlobe, FaChartPie } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
            <h1>欢迎来到 UniTrade 国际贸易平台</h1>
            <p>利用大数据和人工智能技术，提供全面的国际贸易解决方案</p>
            
            <div className="banner">
                <div className="flexslider">
                    <ul className="slides">
                        <li style={{ backgroundImage: 'url(https://dummyimage.com/800x300/00aaff/ffffff&text=Anime+Image+1)' }}></li>
                        <li style={{ backgroundImage: 'url(https://dummyimage.com/800x300/ff00aa/ffffff&text=Anime+Image+2)' }}></li>
                        <li style={{ backgroundImage: 'url(https://dummyimage.com/800x300/00ffaa/ffffff&text=Anime+Image+3)' }}></li>
                    </ul>
                </div>
            </div>

            <div className="dashboard">
                <div className="dashboard-item">
                    <h3><FaChartPie /> 贸易统计</h3>
                    <p>查看最新的贸易统计数据和趋势</p>
                    <Link to="/trade-statistics" className="btn">探索</Link>
                </div>
                <div className="dashboard-item">
                    <h3><FaChartPie /> 市场分析</h3>
                    <p>获取深入的市场分析和见解</p>
                    <Link to="/market-analysis" className="btn">探索</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;    