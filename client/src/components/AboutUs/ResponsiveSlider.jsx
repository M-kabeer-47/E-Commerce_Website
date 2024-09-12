import React, { useState, useEffect } from "react";

const ResponsiveSlider = ({ logos }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      let itemsPerSlide;

      if (width >= 1200) {
        itemsPerSlide = 5;
      } else if (width >= 600) {
        itemsPerSlide = 3;
      } else  {
        itemsPerSlide = 1;
      }

      const newSlides = [];
      for (let i = 0; i < logos.length; i += itemsPerSlide) {
        newSlides.push(logos.slice(i, i + itemsPerSlide));
      }

      setSlides(newSlides);
      setCurrentSlide(0); // Reset to first slide on resize
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);

    return () => {
      window.removeEventListener("resize", updateSlides);
    };
  }, [logos]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="slider">
      <div
        className="slides-container"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            {slide.map((logo, i) => (
              logo
            ))}
          </div>
        ))}
      </div>
      <button onClick={prevSlide}>Prev</button>
      <button onClick={nextSlide}>Next</button>
    </div>
  );
};

export default ResponsiveSlider;
