import { useSelector } from "react-redux";
import './products.css';
import Product from "./Product";
import InfiniteScroll from "react-infinite-scroll-component";

import { useDispatch } from "react-redux";
import {useEffect, useState } from "react";





export default function SearchResultsDisplay({title,loading,renderPagination}) {

  const isFiltered = useSelector((state) => state.search.isFiltered);
  let searchResults;
  if (isFiltered) {
    searchResults = useSelector((state) => state.search.filteredSearch);
  } else {
    searchResults = useSelector((state) => state.search.searchResult);
  }
  
  useEffect(()=>{
    console.log("Inside SearchResultsDisplay"+searchResults);
    
  },[])
  
  
  
  return (
    <div className="productsDiv" style={{maxWidth:"100%",minHeight:"1000px"}}>
      {loading ? (
        <div className="skeleton skeleton-title"></div>
      ) : (
        <h2 className="category" style={{maxWidth:"100vw"}}>{title}</h2>
      )}
      {!loading && <hr className="line" /> }
      
        
        


      
      
      
      
      

      <div className="products" >
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
        ) : (
          
          searchResults.map((product, index) => (
            <Product
              key={index}
              product={product}
              index={index}
              
            />
          ))
        )}
      </div>
      {!loading && searchResults.length > 0 && (renderPagination())}
      
    </div>
  );
}
