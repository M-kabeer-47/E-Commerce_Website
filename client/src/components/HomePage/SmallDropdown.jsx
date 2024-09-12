import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const SmallDropdown = forwardRef(({ isVisible }, ref) => {
  return (
    <div ref={ref} className={`smallDropdown ${isVisible ? 'showDropdown' : ''}`}>
      <Link  className='link'  to={"/products/value-deals"}>Value Deals</Link>
      <Link className='link' to={"/products/smash-deals"}>Smash Deals</Link>
      <Link className='link' to={"/products/rapid-deals"}>Rapid Deals</Link>
      <Link className='link' to={"/products/xtreme-deals"}>Xtreme Deals</Link>
    </div>
  );
});

export default SmallDropdown;
