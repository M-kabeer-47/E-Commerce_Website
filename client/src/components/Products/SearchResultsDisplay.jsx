import { useSelector } from "react-redux";
import './products.css';
import Product from "./Product";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate,useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";





export default function SearchResultsDisplay({title,requestBackend,hasMore,query,loading}) {
  
  
  
  
  
  
  
  
  
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
    <div className="productsDiv">
      {loading ? (
        <div className="skeleton skeleton-title"></div>
      ) : (
        <h2 className={"category"}>{title}</h2>
      )}
      {!loading && <hr className="line" /> }
      <InfiniteScroll dataLength={searchResults.length} next={()=>{

      
        
          requestBackend(query)
      }
        
        


      } 
      
      
      
      hasMore={hasMore}
      
       > 

      <div className="products">
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
      </InfiniteScroll>
    </div>
  );
}
