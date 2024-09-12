
import './featuredProducts.css';
import { useState,useEffect  } from "react";



import HomeProducts from "../HomeProducts";


import axios from "axios";
export default function FeaturedProduct() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  useEffect(()=>{
    const fetchFeaturedProducts = async () => {
      const response = await axios.get("http://localhost:3000/featuredProducts");
      setFeaturedProducts(response.data);
    };
    fetchFeaturedProducts();
  },[])
  

  return (
    <div className="featuredProductsDiv">
      <h2>FEATURED PRODUCTS</h2>
      <div className="featuredProducts">
        {featuredProducts.map((product, index) => (
          <HomeProducts
          key={index}
          product={product}
          index={index}
           />
        ))}
      </div>
    </div>
  );
}
