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
        <div className="small-slider">
            <Slider {...settings}>
                {/* 使用相同尺寸的图片 */}
                <div>
                    <img src="https://picsum.photos/1200/600" alt="Slide 1" />
                </div>
                <div>
                    <img src="https://picsum.photos/1200/600" alt="Slide 2" />
                </div>
                <div>
                    <img src="https://picsum.photos/1200/600" alt="Slide 3" />
                </div>
            </Slider>
        </div>
    );
};

export default SliderComponent;