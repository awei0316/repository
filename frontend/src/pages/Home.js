// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { FaGlobe, FaChartPie } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import SliderComponent from '../components/Slider';
import axios from 'axios';

const Home = () => {
    const [sliderNews, setSliderNews] = useState([]);
    const [guardianNews, setGuardianNews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // 定义与国际贸易相关的关键词
    const tradeKeywords = ['国际贸易', '外贸', '进出口', '跨境贸易', '关税', '贸易协定'];

    useEffect(() => {
        const fetchSliderNews = async () => {
            try {
                const apiKey = process.env.REACT_APP_NEWS_API_KEY; 
                if (!apiKey) {
                    setErrorMessage('未找到 API 密钥，请检查环境变量配置。');
                    return;
                }
                const response = await axios.get(
                    `https://newsapi.org/v2/everything?q=中国 外贸&apiKey=${apiKey}`
                );
                console.log('轮播图新闻返回的数据:', response.data); 
                const data = response.data;

                if (data && Array.isArray(data.articles)) {
                    // 筛选包含关键词的新闻
                    const filteredNews = data.articles.filter(article => {
                        const title = article.title || '';
                        const description = article.description || '';
                        return tradeKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));
                    });

                    const formattedNews = filteredNews.map(result => ({
                        title: result.title,
                        description: result.description,
                        url: result.url,
                        image: result.urlToImage
                    }));
                    setSliderNews(formattedNews);
                    setErrorMessage('');
                } else {
                    setSliderNews([]);
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

        const fetchGuardianNews = async () => {
            try {
                const apiKey = process.env.REACT_APP_GUARDIAN_API_KEY; 
                if (!apiKey) {
                    setErrorMessage('未找到卫报 API 密钥，请检查环境变量配置。');
                    return;
                }
                // 修改查询条件以获取国贸相关信息
                const response = await axios.get(
                    `https://content.guardianapis.com/search?api-key=${apiKey}&q=china+international+trade&show-fields=headline,trailText,thumbnail`
                );
                console.log('卫报新闻返回的数据:', response.data); 
                const data = response.data.response;

                if (data && Array.isArray(data.results)) {
                    const formattedNews = data.results.map(result => ({
                        title: result.fields.headline,
                        description: result.fields.trailText,
                        url: result.webUrl,
                        image: result.fields.thumbnail
                    }));
                    setGuardianNews(formattedNews);
                    setErrorMessage('');
                } else {
                    setGuardianNews([]);
                    setErrorMessage('返回的数据格式不符合预期');
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        setErrorMessage('请求失败，状态码 401：卫报 API 密钥无效，请检查你的 API 密钥。');
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

        fetchSliderNews();
        fetchGuardianNews();
    }, []);

    return (
        <div className="container">
            <h1>欢迎来到 UniTrade 国际贸易平台</h1>
            <p>利用大数据和人工智能技术，提供全面的国际贸易解决方案</p>

            {/* 将获取到的轮播图新闻数据传递给 SliderComponent */}
            <SliderComponent news={sliderNews} />

            <Card className="news-container">
                <h3 className="news-title">国际贸易新闻</h3>
                <div className="news-divider"></div>
                <div className="news-grid">
                    {guardianNews.slice(0, 4).map((article, index) => (
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