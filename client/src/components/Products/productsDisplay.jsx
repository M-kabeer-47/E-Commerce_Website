import { useSelector } from "react-redux";
import './products.css';
import Product from "./Product";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate,useLocation } from "react-router-dom";
import { useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { updateCategory } from "../../store/category.js";


export default function ProductDisplay() {
  const backendUrl = useSelector((state) => state.user.backendUrl);
  const [loading, setLoading] = useState(true);
  const [title, updateTitle] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  
  
  const categories = [
    "processors", "x-box-games", "hdds", "ssds", "monitors", "power-supply",
    "cases", "graphic-cards", "motherboards", "rams", "keyboards", "mouse",
    "cables", "microphones", "webcams", "speakers", "playstation", "xbox",
    "ps-games", "gift-cards", "nintendo", "headphones","value-deals","smash-deals",
    "rapid-deals",
    "xtreme-deals"
  ];
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isFiltered = useSelector((state) => state.category.isFiltered);
  let CATEGORY;
  if (isFiltered) {
    CATEGORY = useSelector((state) => state.category.filteredCategory);
  } else {
    CATEGORY = useSelector((state) => state.category.category);
  }
  
  const requestBackend = async () => {
    
    let pathname= location.pathname;
      let category = pathname.substring(10)
    if (!category) {
      console.error("Category is undefined");
      navigate("/notfound");
      return;
    }

    try {
      
      console.log(`Fetching category: ${category}`);
      const response = await axios.get(`${backendUrl}/products/${category}?page=${page}`);
      let categoryObject = response.data;
      if (categoryObject === false || categoryObject.length === 0) {
        setHasMore(false);
      } else {
        
        
        let stored_category = [...CATEGORY, ...categoryObject];
        console.log(stored_category);
        
        dispatch(updateCategory(stored_category));
        
        setPage(prev => prev + 1);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category:", error);
      
    }
  };
  async function initialFetch(Category){
    if (!Category) {
      console.error("Category is undefined");
      navigate("/notfound");
      return;
    }
    try{
      setLoading(true);
      console.log("Initial fetch");
      
      let response = await axios.get(`${backendUrl}/products/${Category}?page=${1}`)
      if(response.data.error){
        navigate("/notfound");
        
      }
      else{

      
      updateTitle(response.data[0].category);
      dispatch(updateCategory(response.data))
      setLoading(false)
      setPage(2); 
      setHasMore(true)
      }
    }
    catch(er){
      console.log(er);
      
    }
  }
  useEffect(() => {
    
    let pathname = location.pathname;
    let category = pathname.substring(10);
    
      
      
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      
    
    let timeout = setTimeout(()=>{
      if (categories.includes(category)) {
        
        initialFetch(category);
      } else {
        console.log("Category not found");
        navigate("/notfound");
      }
    },500)
    return () => {
      clearTimeout(timeout);
    }
    

    
    
  }, [location.pathname]); 
  
  
  

  return (
    <div className="productsDiv">
      {loading ? (
        <div className="skeleton skeleton-title"></div>
      ) : (
        <h2 className={"category"}>{title}</h2>
      )}
      {!loading && <hr className="line" /> }
      <InfiniteScroll dataLength={CATEGORY.length} next={
        
          requestBackend
        
        
        

      } 
      
      
      
      hasMore={hasMore}
      
       > 

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
        ) : (
          
          CATEGORY.map((product, index) => (
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
