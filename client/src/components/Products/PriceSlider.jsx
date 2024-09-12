import * as React from 'react';

import Slider from '@mui/material/Slider';
import {filterProductsByPrice} from "../../store/category.js"
import { useDispatch } from 'react-redux';
import { filterSearchByPrice } from '../../store/search.js';
function valuetext(value) {
  return `${value}Rs`;
}

export default function PriceSlider({type}) {
  const [value, setValue] = React.useState([0, 60000]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const dispatch = useDispatch();
  const handleFilterClick = () => {
    console.log("clicked");
    console.log(value);
    if(type === "search")
      dispatch(filterSearchByPrice(value));
    else{
    dispatch(filterProductsByPrice(value)); 
    }
  };

  return (
        <>
        <div className="priceSlider">

       
        <h3>Filter by price</h3>
        
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}    
        min={0}
        max={500000}
      />
      <button className='sliderButton' onClick={handleFilterClick}>Filter</button>
      </div>
    </>
  );
}
