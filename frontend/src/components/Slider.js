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

    // 截取前 8 条新闻
    const slicedNews = news.slice(0, 8);

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {slicedNews.map((article, index) => (
                    <div key={index}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            {article.image && <img src={article.image} alt={article.title} />}
                            <h4>{article.title}</h4>
                            <p>{article.description}</p>
                        </a>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SliderComponent;