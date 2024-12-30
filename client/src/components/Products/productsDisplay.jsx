import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { updateCategory } from "../../store/category.js";
import Product from "./Product";
import './products.css';
import { set } from 'mongoose';

const ProductDisplay = () => {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [loading, setLoading] = useState(true);
  const [title, updateTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const categories = [
    "processors", "x-box-games", "hdds", "ssds", "monitors", "power-supply",
    "cases", "graphic-cards", "motherboards", "rams", "keyboards", "mouse",
    "cables", "microphones", "webcams", "speakers", "playstation", "xbox",
    "ps-games", "gift-cards", "nintendo", "headphones", "value-deals", "smash-deals",
    "rapid-deals", "xtreme-deals"
  ];

  const CATEGORY = useSelector((state) => 
    state.category.isFiltered 
      ? state.category.filteredCategory 
      : state.category.category
  );

  const fetchProducts = async (pageNumber) => {
    const pathname = location.pathname;
    const category = pathname.substring(10);

    if (!category) {
      setError("Category is undefined");
      navigate("/notfound");
      return;
    }

    try {
      setLoading(true);
      
      
      const response = await axios.get(`${backendUrl}/products/${category}`, {
        params: {
          page: pageNumber
        }
      });

      
      if (response.data.error) {
        if (response.data.error === "Category not found.") {
          navigate("/notfound");
        } else {
          setError(response.data.error);
        }
        setLoading(false);
        return;
      }

      const categoryObject = response.data;

      if (!categoryObject || categoryObject.length === 0) {
        if (pageNumber === 1) {
          navigate("/notfound");
        } else {
          setHasMore(false);
        }
        setLoading(false);
        return;
      }
      updateTitle(categoryObject[0].category);
      dispatch(updateCategory(categoryObject));
      
    
      setHasMore(categoryObject.length >= 9);
      
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.response?.data?.error || "Failed to fetch products");
      if (pageNumber === 1) {
        navigate("/notfound");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const pathname = location.pathname;
    const category = pathname.substring(10);
    
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    if (categories.includes(category)) {
      dispatch(updateCategory([]));
      fetchProducts(currentPage);
    } else {
      navigate("/notfound");
    }
  }, [location.pathname, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [location.pathname]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    const showNextButton = !loading && (hasMore);

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>

        {currentPage > 2 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="pagination-button"
            >
              1
            </button>
            {currentPage > 2 && <span className="pagination-dots">...</span>}
          </>
        )}

        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="pagination-button"
          >
            {currentPage - 1}
          </button>
        )}

        <button className="pagination-button active">
          {currentPage}
        </button>

        {showNextButton && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="pagination-button"
          >
            {currentPage + 1}
          </button>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!showNextButton}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="productsDiv">
      {loading ? (
        <div className="skeleton skeleton-title"></div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <h2 className="category" style={{maxWidth:"100vw"}}>{title}</h2>
          <hr className="line" />
        </>
      )}

      <div className="products category-products">
        {loading ? (
          <div className="skeleton-container">
            <div className="container">
              <div className="skeleton skeleton-1"></div>
              <div className="skeleton skeleton-2"></div>
              <div className="skeleton skeleton-3"></div>
              <div className="skeleton skeleton-4"></div>
            </div>
            <div className="container">
              <div className="skeleton skeleton-1"></div>
              <div className="skeleton skeleton-2"></div>
              <div className="skeleton skeleton-3"></div>
              <div className="skeleton skeleton-4"></div>
            </div>
            <div className="container">
              <div className="skeleton skeleton-1"></div>
              <div className="skeleton skeleton-2"></div>
              <div className="skeleton skeleton-3"></div>
              <div className="skeleton skeleton-4"></div>
            </div>
          </div>
        ) : error ? null : (
          CATEGORY.map((product, index) => (
            <Product
              key={index}
              product={product}
              index={index}
            />
          ))
        )}
      </div>

      {!loading && !error && CATEGORY.length > 0 && (
        <div className="pagination-container">
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;