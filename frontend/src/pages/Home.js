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

            {/* 新的新闻模块 */}
            <Card>
                <h3>国际贸易新闻</h3>
                <ul>
                    <li>
                        <Link to="#">新闻标题 1：全球贸易趋势分析</Link>
                        <p>近期全球贸易呈现出一些新的趋势，各国政策调整对贸易格局产生了影响...</p>
                    </li>
                    <li>
                        <Link to="#">新闻标题 2：新兴市场贸易增长潜力</Link>
                        <p>新兴市场国家在国际贸易中的地位逐渐提升，其贸易增长潜力备受关注...</p>
                    </li>
                    <li>
                        <Link to="#">新闻标题 3：贸易协定对企业的影响</Link>
                        <p>新的贸易协定签署后，企业在进出口业务中面临着新的机遇和挑战...</p>
                    </li>
                </ul>
            </Card>
        </div>
    );
};

export default Home;