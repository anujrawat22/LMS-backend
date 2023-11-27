import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageCarousel = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <div style={{
            width: '100%',
            overflow: 'hidden',
            height: 'auto',
            border: '1px solid red'
        }}>
            <h2>Images</h2>
            <Slider {...settings} style={{
                width: '100%',
                maxHeight: '400px',
                boxSizing: 'border-box',
                margin: "2% 0% 2% 0%",
                overflow: 'hidden',
                padding: '2%'
            }}>
                {
                    images.length > 0 && images.map((image) => {
                        return (
                            <img src={image} alt="CourseImg" style={{ border: '1px solid red' }} />
                        )
                    })
                }
            </Slider>
        </div>
    )
}

export default ImageCarousel