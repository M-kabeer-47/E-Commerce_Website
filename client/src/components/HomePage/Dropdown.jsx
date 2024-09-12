import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = forwardRef(({ isVisible }, ref) => {
  const hardware = ["Processors", "Power supply", "Cases", "Graphic Cards", "Motherboards", "RAMS", "HDDs", "SSDs", "Monitors"];
  const accessories = ["Keyboards", "Mouse", "Headphones", "Cables", "Microphones", "Webcams", "Speakers"];
  const console = ["Playstation", "Xbox", "Nintendo", "PS Games", "X-Box Games", "Gift cards"];

  return (
    <div
      className={`dropdown ${isVisible ? 'show' : ''}`}
      
      ref={ref}
    >
      <div className="pcHardware">
        {hardware.map((item, index) => (
          <Link key={index}  className = "link"  to={`/products/${item.replace(/\s+/g, '-').toLowerCase()}`}>
            <li>{item}</li>
          </Link>
        ))}
      </div>
      <div className="accessories">
        {accessories.map((item, index) => (
          <Link key={index}  className = "link"  to={`/products/${item.replace(/\s+/g, '-').toLowerCase()}`}>
            <li>{item}</li>
          </Link>
        ))}
      </div>
      <div className="console">
        {console.map((item, index) => (
          <Link key={index} className = "link" to={`/products/${item.replace(/\s+/g, '-').toLowerCase()}` }>
            <li>{item}</li>
          </Link>
        ))}
      </div>
    </div>
  );
});

export default Dropdown;
