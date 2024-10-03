import React, { useEffect } from 'react';
// test
import './OrderDetails.css';

export default function OrderDetails({ cart, total }) {
  function convertPrice(price, quantity) {
    let Price = parseFloat(price.replace("PKR", "").replace(",", "")) * quantity;
    const formattedTotal = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Price);
    return formattedTotal;
  }

  

  return (
    
    <aside className="order-details">
      <div className="order-details-header">
        <h3>Order Details</h3>
      </div>
      
      <div className="order-details-products">
        {cart.map((product, index) => (
          <div key={index} className="order-details-product">
            <div className="product-info">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <div className="product-details">
                <p className="product-name">{product.name}</p>
                <p className="product-price">{"PKR " + (convertPrice(product.price, product.quantityInCart))}</p>
              </div>
            </div>
            <p className="product-quantity">x {product.quantityInCart}</p>
          </div>
        ))}
      </div>

      <div className="order-details-summary">
        <div className="summary-row">
          <h4>Total</h4>
          <h4 className="price">{"PKR " + total(0)}</h4>
        </div>
        <div className="summary-row">
          <h4>Shipping charges</h4>
          <h4 className="price">{"PKR 300"}</h4>
        </div>
        <div className="summary-row">
          <h4>Subtotal</h4>
          <h4 className="price">{"PKR " + (total(300))}</h4>
        </div>
      </div>
    </aside>
  );
}