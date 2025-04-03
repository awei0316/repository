// Slider.js
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
};

const SliderComponent = () => {
    return (
        <Slider {...settings}>
            {/* 确保这些链接有效 */}
            <div>
                <img src="https://picsum.photos/1920/600" alt="Slide 1" />
            </div>
            <div>
                <img src="https://picsum.photos/1920/700" alt="Slide 2" />
            </div>
            <div>
                <img src="https://picsum.photos/1920/800" alt="Slide 3" />
            </div>
        </Slider>
    );
};

export default SliderComponent;