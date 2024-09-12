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
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const searchResults = useSelector((state) => state.search.searchResult);
const navigate =useNavigate()
const queryParams = new URLSearchParams(useLocation().search);
const query = queryParams.get('text');
  const requestBackend = async (query) => {
    try {
      
      let results = await axios.get(`https://e-commerce-website-hzldz0138.vercel.app/search/${query}?page=${page}`);
      if(results.data === false ){
        
        navigate("/notfound");
      }
      else if(results.data.length === 0){
        setHasMore(false);
      }
      else{
        results = results.data;
        
        updateTitle(query);
        dispatch(updateSearch([...searchResults,...results]));
        setPage(prev => prev + 1);
        
        
        
        
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
      let results = await axios.get(`https://e-commerce-website-hzldz0138.vercel.app/search/${query}?page=${1}`);
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Enables smooth scrolling
    });
    
  window.addEventListener("resize", handleResize);
  let timeout = setTimeout(()=>{
  const query = queryParams.get('text');
  
    initialFetch();
    setHasMore(true);
    
  },1000)
  return () => {
    window.removeEventListener("resize", handleResize);
    clearTimeout(timeout)
  };

  }, [location.search,query]);

  

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
              

              
            
            

          />
          </>
        
        </div>
        <Footer />
      </div>
      
    </>
  );
}
