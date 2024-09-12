import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons'; 

const Button = ({ className, text,onClick,cart,wishlist}) => {
  const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 770);

  useEffect(() => {
    const handleResize = () => {
      setIsNarrowScreen(window.innerWidth <770);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  const icon = className === 'redButton'
    ? faHeart
    : faCartShopping;

  return (
    <button className={`hover-button ${className}`} style={isNarrowScreen?{width:"100px",display:"flex",justifyContent:"center",backgroundColor:"background-color: rgb(40, 40, 40)"}:{}} onClick={onClick}>
      {isNarrowScreen ? (
        <FontAwesomeIcon icon={icon} style={{color:"white"}} />
      ) : (
        <>
          
          <p className='button-text'>{text}</p>
        </>
      )}
    </button>
  );
};

export default Button;
