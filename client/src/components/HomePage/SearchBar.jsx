import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios"; // Import axios for API calls

export default function SearchBar(props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, updateSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]); // State for storing suggestions
  const searchRef = useRef(null);
  const navigate = useNavigate();
const backendUrl = useSelector((state) => state.user.backendUrl); 
  // Fetch suggestions based on user input
  useEffect(() => {
    const fetchSuggestions = async () => {
      
      if (search.length > 1) {
        
        try {
          const response = await axios.get(`${backendUrl}/api/products/search?query=${search}`);
          if (Array.isArray(response.data)) {
            setSuggestions(response.data); // Set fetched suggestions
            
          } else {
            setSuggestions([]); // Ensure it's an array
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]); // Handle error by clearing suggestions
        }
      } else {
        setSuggestions([]); // Clear suggestions if input is too short
      }
    };
    fetchSuggestions();
  }, [search]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate(`/searchResult?text=${search}`);
    }
  };

  const handleChange = (event) => {
    let text = event.target.value;
    updateSearch(text);
  };

  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  // Close the suggestions when clicking outside the search bar
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (suggestion) => {
    updateSearch(suggestion.name); // Fill input with selected suggestion
    navigate(`/searchResult?text=${suggestion.name}`); // Navigate to search result page
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div
      className={`search ${isExpanded && props.expanded ?  "expanded" : ""}`}
      onClick={() => setIsExpanded(true)} // Always expand when clicked
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
        value={search}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />

      {/* Render suggestions if available */}
      {suggestions.length > 0 && isExpanded && (
        <div className="suggestions-list" style={{color:"black"}}>
          {suggestions.map((product) => (
            <div
              key={product.id}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(product)}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
