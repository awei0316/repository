// src/components/Slider.js
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderComponent = ({ news }) => {
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const [loadedImagesCount, setLoadedImagesCount] = useState(0);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500, // 切换速度，保持一致
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, // 自动播放间隔时间，保持一致
        pauseOnHover: false, // 鼠标悬停时是否暂停播放
    };

    // 过滤掉来自 https://post.smzdm.com/ 和 https://www.huxiu.com/ 的新闻
    const filteredNews = news.filter(article => {
        return !article.url.startsWith('https://post.smzdm.com/') && !article.url.startsWith('https://www.huxiu.com/');
    });

    // 截取前 8 条新闻
    const slicedNews = filteredNews.slice(0, 8);

    // 预加载图片
    useEffect(() => {
        const loadImages = async () => {
            let count = 0;
            for (const article of slicedNews) {
                if (article.image) {
                    try {
                        await new Promise((resolve, reject) => {
                            const img = new Image();
                            img.src = article.image;
                            img.onload = resolve;
                            img.onerror = reject;
                        });
                        count++;
                        setLoadedImagesCount(count);
                    } catch (error) {
                        console.error('图片加载失败:', error);
                    }
                }
            }
            if (count === slicedNews.filter(article => article.image).length) {
                setIsImagesLoaded(true);
            }
        };

        loadImages();
    }, [slicedNews]);

    return (
        <div className="slider-container">
            {isImagesLoaded && (
                <Slider {...settings}>
                    {slicedNews.map((article, index) => (
                        <div key={index}>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                {article.image && <img src={article.image} alt={article.title} />}
                                <h4>{article.title}</h4>
                            </a>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};

export default SliderComponent;