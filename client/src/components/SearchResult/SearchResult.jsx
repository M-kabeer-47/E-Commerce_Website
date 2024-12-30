import Navbar from '../HomePage/Navbar';
import Navbar2 from '../HomePage/Navbar2';
import Footer from "../HomePage/Footer/Footer.jsx"
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useLocation } from 'react-router-dom';
import FilterDiv from '../Products/FilterDiv.jsx';

import {updateSearch} from '../../store/search.js';
import SearchResulsDisplay from '../Products/SearchResultsDisplay.jsx';

export default function SearchResult() {
  
  const [title, updateTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);


  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('text');


  
  const backendUrl = useSelector((state) => state.user.backendUrl);


  const navigate =useNavigate()
  const location = useLocation();
  const dispatch = useDispatch();

  
  const renderPagination = () => {  
  const showNextButton = !loading && (hasMore);
  return (
    <div className="pagination" style={{position: "relative",left:"30%",width:"70%",top:"50px"}}>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="pagination-button"
      >
        Previous
      </button>

      {page > 2 && (
        <>
          <button
            onClick={() => setPage(1)}
            className="pagination-button"
          >
            1
          </button>
          {page > 2 && <span className="pagination-dots">...</span>}
        </>
      )}

      {page > 1 && (
        <button
          onClick={() => setPage(page - 1)}
          className="pagination-button"
        >
          {page - 1}
        </button>
      )}

      <button className="pagination-button active">
        {page}
      </button>

      {showNextButton && (
        <button
          onClick={() => setPage(page + 1)}
          className="pagination-button"
        > 
          {page + 1}
        </button>
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={!showNextButton}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};


  const requestBackend = async (query) => {
    try {
      
      let results = await axios.get(`${backendUrl}/search/${query}?page=${page}`);
      if(results.data === false ){
        
        navigate("/notfound");
      }
      else if(results.data.length === 0){
        setHasMore(false);
        return;
      }
      else{
        
        if(results.data.total_pages <= page){
          setHasMore(false);
        }
        else{
          setHasMore(true);
        }
        results = results.data.searchResults;
        setLoading(false);
       
        updateTitle(query);
        dispatch(updateSearch([...results]));
              
      }     
      }
    catch (error) {
      console.error(error);
      setLoading(false);
    }
  }
  


useEffect(()=>{
  setLoading(true);
},[location.pathname])
  
  
  
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
  };

  useEffect(() => {
    setLoading(true);
     window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
    handleResize();
    // window.addEventListener("resize", handleResize);
    requestBackend(query)
    
  //   return () => {
  //   window.removeEventListener("resize", handleResize);
  // };
  }, [location.search,query,page]);

  

  return (
    <>
     <div className="homePage">
        {isWideScreen ? <Navbar /> : <Navbar2 />}
        <div className="main">
        
        <>
          <FilterDiv
          type={"search"}
          />
          <SearchResulsDisplay
            title={title}
            
            page={page}
            
            
            loading={loading}
            renderPagination={renderPagination}
          
          />
          </>
        
        </div>

        <Footer />
      </div>
      
    </>
  );
}
