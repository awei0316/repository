// src/components/Slider.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = ({ news }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    // 过滤掉来自 https://post.smzdm.com/ 和 https://www.huxiu.com/ 的新闻
    const filteredNews = news.filter(article => {
        return !article.url.startsWith('https://post.smzdm.com/') && !article.url.startsWith('https://www.huxiu.com/');
    });

    // 截取前 8 条新闻
    const slicedNews = filteredNews.slice(0, 8);

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {slicedNews.map((article, index) => (
                    <div key={index}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.image && <img src={article.image} alt={article.title} />}
                            <h4>{article.title}</h4>
                            {/* 移除简介部分的渲染 */}
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderComponent;