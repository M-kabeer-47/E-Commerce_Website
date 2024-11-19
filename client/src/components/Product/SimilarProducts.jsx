import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './SimilarProducts.css'



export default function SimilarProducts({ category, currentProductId, backendUrl }) {
  const [products, setProducts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/products/${category.replace(" ", "-").toLowerCase()}?page=1`)
        setProducts(response.data.filter((product) => product._id !== currentProductId))
      } catch (error) {
        console.error('Error fetching similar products:', error)
      }
    }

    fetchSimilarProducts()
  }, [category, currentProductId, backendUrl])

  const getProductsPerView = () => {
    const width = window.innerWidth
    if (width >= 1200) return 5
    if (width >= 992) return 4
    if (width >= 768) return 3
    if (width >= 576) return 2
    return 1
  }

  const handlePrev = () => {
    const productsPerView = getProductsPerView()
    setCurrentIndex((prevIndex) => Math.max(prevIndex - productsPerView, 0))
  }

  const handleNext = () => {
    const productsPerView = getProductsPerView()
    setCurrentIndex((prevIndex) => Math.min(prevIndex + productsPerView, products.length - productsPerView))
  }

  useEffect(() => {
    const handleResize = () => {
      const productsPerView = getProductsPerView()
      setCurrentIndex((prevIndex) => Math.min(prevIndex, products.length - productsPerView))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [products])

  return (
    <div className="similar-products">
      <h2 className="similarTitle" style={{color:"white", marginBottom:"60px", maxWidth:"100vw", fontSize:"45px"}}>Similar Products</h2>
      <div className="slider-container">
        <button 
          className="nav-button prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          &#8249;
        </button>
        <div className="slider-wrapper" ref={sliderRef}>
          <div 
            className="slider"
            style={{ transform: `translateX(-${currentIndex * (100 / getProductsPerView())}%)` }}
          >
            {products.map((product) => (
              <div key={product._id} className="product-card" onClick={() => {
                window.scrollTo(0, 0)
                navigate(`/product/${product._id}`)
              }}>
                <img src={product.imageUrl} alt={product.name} />
                <div className="product-Info">
                  <h3 title={product.name} style={{color:"white"}}>{product.name}</h3>
                  <p className="category">{product.category}</p>
                  <p className="price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button 
          className="nav-button next"
          onClick={handleNext}
          disabled={currentIndex >= products.length - getProductsPerView()}
        >
          &#8250;
        </button>
      </div>
    </div>
  )
}