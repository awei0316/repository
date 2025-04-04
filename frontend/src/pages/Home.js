// src/pages/Home.js
import React from 'react';
import { FaGlobe, FaChartPie, FaDatabase, FaChartBar, FaChartLine, FaUsers, FaRobot } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SliderComponent from '../components/Slider';
import Clock from '../components/Clock';

const Home = () => {
    return (
        <div className="container">
            <Clock />
            <h1>欢迎来到 UniTrade 国际贸易平台</h1>
            <p>利用大数据和人工智能技术，提供全面的国际贸易解决方案</p>

            {/* 使用 SliderComponent 替换原来的 flexslider */}
            <SliderComponent />

            <div className="dashboard">
                <Card>
                    <h3><FaDatabase /> 数据收集模块</h3>
                    <p>构建高效数据采集系统，从多渠道获取多维度数据，保障数据质量。</p>
                    <Link to="/data-collection" className="btn">了解更多</Link>
                </Card>
                <Card>
                    <h3><FaChartBar /> 数据可视化模块</h3>
                    <p>通过多种可视化形式展示核心数据，支持实时更新和交互式查询。</p>
                    <Link to="/data-visualization" className="btn">了解更多</Link>
                </Card>
                <Card>
                    <h3><FaChartLine /> 销售趋势预测模块</h3>
                    <p>利用机器学习算法分析历史数据，预测未来销售走势，提供决策支持。</p>
                    <Link to="/sales-prediction" className="btn">了解更多</Link>
                </Card>
                <Card>
                    <h3><FaUsers /> 用户社区模块</h3>
                    <p>创建开放社区，促进从业者交流合作，保障社区安全并推送相关内容。</p>
                    <Link to="/user-community" className="btn">了解更多</Link>
                </Card>
                <Card>
                    <h3><FaRobot /> AI 模块</h3>
                    <p>集成智能翻译和合同审查功能，提升平台智能化水平和用户体验。</p>
                    <Link to="/ai-services" className="btn">了解更多</Link>
                </Card>
            </div>
        </div>
    );
};

export default Home;