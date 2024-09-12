import React, { useEffect, useRef, useState } from "react";
import './products.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { sortLowToHigh, sortHighToLow, sortHighlyRated } from "../../store/category.js";
import { sortSearchHighlyRated, sortSearchHighToLow, sortSearchLowToHigh } from "../../store/search.js";

const Dropdown = ({type}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sort, updateSort] = useState("");
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [screenWidth,updateScreenWidth] = useState(window.innerWidth)
  const handleDropdownClicked = (event) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("resize",updateScreenWidth(window.innerWidth))
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("resize",updateScreenWidth(Window.innerWidth))
    };
  }, []);

  useEffect(() => {
    if (dropdownRef.current) {
      if (isOpen) {
        dropdownRef.current.classList.add("open");
      } else {
        dropdownRef.current.classList.remove("open");
      }
    }
  }, [isOpen]);

  return (
    <div className="Dropdown" ref={dropdownRef}>
      <button onClick={handleDropdownClicked} className="dropdown-button">
        {screenWidth > 500 ?  <p>{"Sort by: " + sort}</p> : <p>Sort by</p> }
       
        <FontAwesomeIcon
          icon={faCaretDown}
          style={{ color: "#ffffff", fontSize: "16px" }}
        />
      </button>
      <div className="Menu">
        <button className="firstButton" onClick={() => {
          if(type === "search"){
            dispatch(sortSearchLowToHigh())
          }
          else{
            updateSort("price low to high");
          dispatch(sortLowToHigh());
          
          }
          setIsOpen(false);
            
          
          
        }}>
          <p>price low to high</p>
        </button>
        <button onClick={() => {
          if(type === "search"){
            dispatch(sortSearchHighToLow())
          }
          else{
          updateSort("price high to low");
          dispatch(sortHighToLow());
          }
          setIsOpen(false);
        }}>
          <p>price high to low</p>
        </button>
        <button onClick={() => {
          if(type === "search"){
            dispatch(sortSearchHighlyRated())
          }
          else{
            updateSort("highly rated");
          dispatch(sortHighlyRated());
          
          }
          setIsOpen(false);
          
        }}>
          <p>highly rated</p>
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
