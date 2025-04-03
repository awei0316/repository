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
            <div>
                <img src="D:\develop\UniTrade\frontend\imag\banner1.png" alt="Slide 1" />
            </div>
            <div>
                <img src="D:\develop\UniTrade\frontend\imag\banner2.png" alt="Slide 2" />
            </div>
            <div>
                <img src="D:\develop\UniTrade\frontend\imag\banner3.png" alt="Slide 3" />
            </div>
        </Slider>
    );
};

export default SliderComponent;