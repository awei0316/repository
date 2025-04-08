// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { FaGlobe, FaChartPie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SliderComponent from '../components/Slider';
import axios from 'axios';

const Home = () => {
    const [news, setNews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const apiKey = process.env.REACT_APP_GUARDIAN_API_KEY; 
                if (!apiKey) {
                    setErrorMessage('未找到 API 密钥，请检查环境变量配置。');
                    return;
                }
                const response = await axios.get(
                    `https://content.guardianapis.com/search?api-key=${apiKey}&section=business&show-fields=headline,trailText,thumbnail`
                );
                console.log('返回的数据:', response.data); 
                const data = response.data.response;

                if (data && Array.isArray(data.results)) {
                    const formattedNews = data.results.map(result => ({
                        title: result.fields.headline,
                        description: result.fields.trailText,
                        url: result.webUrl,
                        image: result.fields.thumbnail
                    }));
                    setNews(formattedNews);
                    setErrorMessage('');
                } else {
                    setNews([]);
                    setErrorMessage('返回的数据格式不符合预期');
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMessage('请求失败，状态码 401：API 密钥无效，请检查你的 API 密钥。');
                    } else {
                        setErrorMessage(`请求失败，状态码: ${error.response.status}`);
                    }
                    console.error('响应状态码:', error.response.status);
                    console.error('响应数据:', error.response.data);
                } else if (error.request) {
                    console.error('没有收到响应:', error.request);
                    setErrorMessage('没有收到服务器响应');
                } else {
                    console.error('设置请求时出错:', error.message);
                    setErrorMessage(`设置请求时出错: ${error.message}`);
                }
            }
        };

        fetchNews();
    }, []);

    return (
        <div className="container">
            <h1>欢迎来到 UniTrade 国际贸易平台</h1>
            <p>利用大数据和人工智能技术，提供全面的国际贸易解决方案</p>

            <SliderComponent />

            <Card className="news-container">
                <h3 className="news-title">国际贸易新闻</h3>
                <div className="news-divider"></div>
                <div className="news-grid">
                    {news.slice(0, 4).map((article, index) => (
                        <div className="news-item" key={index}>
                            <Link to={article.url} target="_blank" rel="noopener noreferrer">
                                {article.image && <img src={article.image} alt={article.title} />}
                                <h4>{article.title}</h4>
                            </Link>
                            <p>{article.description}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Home;