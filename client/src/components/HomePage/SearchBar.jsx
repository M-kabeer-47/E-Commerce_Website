import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";




export default function SearchBar(props) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [search, updateSearch] = useState("");
  const searchRef = useRef(null);
  const navigate= useNavigate()
  
    function handleKeyPress(event){
        if(event.key === "Enter"){
                
            window.location.href
            navigate(`/searchResult?text=${search}`)
        }

    }
  const handleChange = (event) => {
    let text = event.target.value;
    updateSearch(text);
    console.log(text);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`search ${isExpanded ? "expanded" : ""}`}
      onClick={() => setIsExpanded(props.expanded)}
      ref={searchRef}
    >
      {!isExpanded && (
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="icons searchIcon"
          style={{ color: "#00a7ff" }}
        />
      )}
      <input
        type="text"
        placeholder="Search for products"
        className="inputSearch"
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />

    </div>
  );
}
