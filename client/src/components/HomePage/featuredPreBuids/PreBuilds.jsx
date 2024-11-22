import React, { useState, useEffect } from 'react'
import './index.css'; // Ensure this imports the CSS file with the above styles
import HomeProducts from '../HomeProducts';

import axios from 'axios';
import { useSelector } from 'react-redux';
const Slider = () => {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3); // Default to 3 items per page
  const [featuredProducts,setFeaturedProducts] = useState([{},{}])
  useEffect(()=>{
    let timeout;
    try{
      timeout = setTimeout(async()=>{
        let response = (await axios.get(`${backendUrl}/products/value-deals?page=1`))
        console.log(response.data);
        const sortedPreBuilds = response.data.sort((a, b) => {
          const numA = parseInt(a.name.split(" ")[1]); // Extract the number from 'Value X'
          const numB = parseInt(b.name.split(" ")[1]); // Extract the number from 'Value X'
          return numA - numB; // Compare the numbers
        });
        setFeaturedProducts(sortedPreBuilds)

      },100)

    }
    catch(err){
      console.log(err);
      
    }
    return ()=>clearTimeout(timeout)
    
  },[])
  const totalItems = featuredProducts.length;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 950) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideLeft = () => {
    if (currentIndex !== 0) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerPage, 0));
    }
  };

  const slideRight = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + itemsPerPage, totalItems - itemsPerPage));
  };

  // Calculate the transform value for smooth sliding
  const translateX = -(currentIndex * 100 / itemsPerPage);

  return (
    <div className="sliderBigContainer">
      <div className="prebuildDiv">
        <p className='prebuildTitle'>FEATURED PRE BUILDS</p>
      </div>
      <div className="sliderContainer">
        <button className="arrowButton left" onClick={slideLeft} disabled={currentIndex === 0}>←</button>
        <div className="sliderWrapper">
          <div className="slider" style={{ transform: `translateX(${translateX}%)` }}>
            {featuredProducts && featuredProducts.map((product, index) => (
              <div key={index} className="sliderItem">
                <HomeProducts
                  product={product}
                  index={index}
                  type={"prebuild"}
                />
              </div>
            ))}
          </div>
        </div>
        <button className="arrowButton right" onClick={slideRight} disabled={currentIndex + itemsPerPage >= totalItems}>→</button>
      </div>
    </div>
  );
};

export default Slider;
