import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rating } from '@mui/material';
import { toast,Bounce, ToastContainer} from 'react-toastify';
import "./product.css"
import { useSelector } from 'react-redux';

const ProductReviews = ({ productId, backendUrl, reviews,fetchReviews }) => {
  const [newReview, setNewReview] = useState({ rating: 0, text: '', images: [] });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const user = useSelector((state) => state.user.user);  

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const review = {
        rating: newReview.rating,
        review: newReview.text,
        images: newReview.images,
        user: user.firstName + ' ' + user.lastName,
        productId: productId
      };
    
      const formData = new FormData();
      review.images.forEach((image, index) => {
        formData.append('images', image);
      });

      let urls = await axios.post(`${backendUrl}/uploadImages`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem("uid")}`
        }
      });
      urls = urls.data.urls;
      review.images = urls;

      await axios.post(`${backendUrl}/reviews`, { review }, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("uid")}`
        }
      });

      fetchReviews();
      toast.success('Review submitted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setNewReview({ rating: 0, text: '', images: [] });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response.data)
    }
  };

  const handleImageUpload = (e) => {
    setNewReview({ ...newReview, images: [...newReview.images, ...e.target.files] });
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return `${names[0][0]}${names[0][1] || ''}`.toUpperCase();
  };

  return (
    <>
    
    
    <div className="reviews-section">
      {reviews.length === 0 ? <p className="reviews-title" style={{position:"relative",left:"-60px"}}>No reviews yet.</p> :<h3 className="reviews-title">Customer Reviews</h3>}
      {user && (
        <>
      <button 
        className="leave-review-btn"
        onClick={() => setShowReviewForm(!showReviewForm)}
      >
        {showReviewForm ? 'Cancel' : 'Leave a Review'}
      </button>

      {showReviewForm && (
        <form onSubmit={handleReviewSubmit} className="review-form">
          <div style={{display:"flex",width:"100%",gap:"20px"}}>
            <h4>Rating:</h4>
            <Rating 
            style={{color:"orange"}}
              name="size-large" 
              defaultValue={1}  
              size="medium"
              value={newReview.rating}
              onChange={(event, newValue) => {
                setNewReview({ ...newReview, rating: newValue });
              }}
            /> 
          </div>
          
          <textarea
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            placeholder="Write your review here..."
            required
          />
          <input
            type="file"
            onChange={handleImageUpload}
            multiple
            accept="image/*"
          />
          <button type="submit" className="submit-review-btn">Submit Review</button>
        </form>
      )}
      
    

      <div className="reviews-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <div className="review-header">
              <div className="user-avatar">{getInitials(review.user)}</div>
              <div className="user-name">{review.user}</div>
              <Rating value={review.rating} readOnly />
            </div>
            <p className="review-text">{review.review}</p>
            <div className="review-images">
              {review.images.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image}
                  alt={`Review ${index + 1} image ${imgIndex + 1}`}
                  className="review-image-thumbnail"
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>
        ))}
      
      </div>


      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full size review" className="full-size-image" />
            <button className="close-modal" onClick={() => setSelectedImage(null)}>×</button>
          </div>
        </div>
      )}
      </>
      )}
    
    </div>

    </>
  );

};

export default ProductReviews;