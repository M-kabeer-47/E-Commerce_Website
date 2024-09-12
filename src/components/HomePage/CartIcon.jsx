import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './styles.css'; // Make sure to import your CSS file

const IconWithBadge = ({ count }) => {
    const [hoveredIcon, setHoveredIcon] = useState(null);
    const handleMouseEnter = (iconName) => {
        setHoveredIcon(iconName);
      };
    
      const handleMouseLeave = () => {
        setHoveredIcon(null);
      };
    
      const iconStyle = (iconName) => ({
        color: hoveredIcon === iconName ? "#FF6347" : "#A0ACBD",
        transition: "color 0.3s ease",
        cursor: "pointer",
      });
  

 
  return (
    <div className="icon-container">
      <FontAwesomeIcon
        icon={faHeart}
        className="icons lastIcons"
        style={iconStyle("heart")}
        onMouseEnter={() => handleMouseEnter("heart")}
        onMouseLeave={handleMouseLeave}
      />
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
};

export default IconWithBadge;
