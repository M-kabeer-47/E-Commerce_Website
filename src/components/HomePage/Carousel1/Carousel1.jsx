import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "./styles.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import image1 from '/images/cases.jpg';
import image2 from '/images/keyboard.jpg';
import image3 from '/images/mouse.jpg';
import image4 from '/images/headphones2.jpg'; 
import image5 from '/images/ps52.jpg';
import image6 from '/images/gpus.jpg';
import image7 from '/images/giftcard.png';
import image8 from '/images/monitor.png';
import { Link } from "react-router-dom";

const slides = [
  { title: "Cases", image: image1 },
  { title: "Keyboards", image: image2 },
  { title: "Mouse", image: image3 },
  { title: "Headphones", image: image4 },
  { title: "Playstation", image: image5 },
  { title: "Monitors", image: image8 }, 
  { title: "Gift-Cards", image: image7 },
  { title: "Graphic-Cards", image: image6 },
];

export const Carousel1 = () => {
  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const rect = carouselRef.current.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        carouselRef.current.classList.add("animate");
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={carouselRef} className="page carousel-1-page">
      <Swiper
        grabCursor
        centeredSlides
        slidesPerView={2}
        spaceBetween={30}
        effect="coverflow"
        loop
        pagination={{ clickable: true }}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 3,
          slideShadows: true,
        }}
        modules={[Pagination, EffectCoverflow]}
        breakpoints={{
          300:{
            slidesPerView: 1
          },
          768: {
            slidesPerView: 1,
          },
          1050: {
            slidesPerView: 2,
          },
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.title}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "750px",
              backgroundRepeat: "no-repeat",
              
            }}
          >
            <div>
              <div>
                <h2>{slide.title}</h2>
                <Link className="explore" to={"./products/"+slide.title.toLowerCase()}>
                <p>explore</p>
                </Link>
                  
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
