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
import { set } from 'mongoose';
export default function SearchResult() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [title, updateTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const searchResults = useSelector((state) => state.search.searchResult);
const navigate =useNavigate()
const queryParams = new URLSearchParams(useLocation().search);
const query = queryParams.get('text');
const renderPagination = () => {  
  const showNextButton = !loading && (searchResults.length >= 9 || hasMore);

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
  const initialFetch = async () => {
    try {
      setLoading(true);
      let results = await axios.get(`${backendUrl}/search/${query}?page=${1}`);
      if(results.data === false ){
        
        navigate("/notfound");
      }
      else if(results.data.length === 0){
        setHasMore(false);
      }
      else{
        results = results.data;
        
        updateTitle(query);
        dispatch(updateSearch([...results]));
        setPage(2);
        setTimeout(()=>{
          setLoading(false);
        },1000)
        
        
      }     
      }
    catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const location = useLocation();
useEffect(()=>{
  setLoading(true);
},[location.pathname])
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 1050);
  
  
  const handleResize = () => {
    setIsWideScreen(window.innerWidth >= 1050);
  };

  useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
    
  window.addEventListener("resize", handleResize);
  
    
    const query = queryParams.get('text');
    requestBackend(query)
    
    
  
  return () => {
    window.removeEventListener("resize", handleResize);
    
  };

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
            requestBackend={requestBackend}
            page={page}
            hasMore={hasMore}
            query={queryParams.get('text')}
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
