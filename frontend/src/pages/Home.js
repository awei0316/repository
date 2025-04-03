import React from 'react';
import { FaGlobe, FaChartPie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SliderComponent from '../components/Slider';

const Home = () => {
    return (
        <div className="container">
            <h1>欢迎来到 UniTrade 国际贸易平台</h1>
            <p>利用大数据和人工智能技术，提供全面的国际贸易解决方案</p>

            {/* 使用 SliderComponent 替换原来的 flexslider */}
            <SliderComponent />

            <div className="dashboard">
                <Card>
                    <h3><FaChartPie /> 贸易统计</h3>
                    <p>查看最新的贸易统计数据和趋势</p>
                    <Link to="/trade-statistics" className="btn">探索</Link>
                </Card>
                <Card>
                    <h3><FaChartPie /> 市场分析</h3>
                    <p>获取深入的市场分析和见解</p>
                    <Link to="/market-analysis" className="btn">探索</Link>
                </Card>
            </div>
        </div>
    );
};

export default Home;