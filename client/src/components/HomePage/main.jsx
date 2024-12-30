import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Products from '../Products/Products.jsx';
import { store } from '../../store/store.js';
import { Provider } from 'react-redux';
import Product from '../Product/Product.jsx';
import ErrorPage from '../ErrorPage/ErrorPage.jsx';
import SearchResult from '../SearchResult/SearchResult.jsx';
import Login from '../Forms/Login.jsx';
import RegisterUser from '../Forms/RegisterUser.jsx';
import OrderHistory from '../OrderHistory/OrderHistory.jsx';
import CartPage from '../Cart&Wishlist/CartPage.jsx';
import Wishlist from '../Cart&Wishlist/Wishlist.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Shipping from '../Checkout/Shipping.jsx';
import StripeCard from '../Checkout/StripeCard.jsx';
import FAQ from '../FAQs/FAQ.jsx';
import AboutUs from '../AboutUs/AboutUs.jsx';
import ContactPage from '../ContactUs/ContactUs.jsx';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute.jsx';
import Profile from '../Profile/Profile.jsx';
import PoliciesPage from '../AboutUs/PoliciesPage.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  }, {
    path: "/products/:category",
    element: <Products />
  }, {
    path: "/product/:product",
    element: <Product />
  },
  {
    path: "/searchResult",
    element: <SearchResult />
  },
  {
    path: "*",
    element: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <RegisterUser />
  },
  // Protected Routes
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/wishlist",
    element: (
      <ProtectedRoute>
        <Wishlist />
      </ProtectedRoute>
    )
  },
  {
    path: "/shipping",
    element: (
      <ProtectedRoute>
        <Shipping />
      </ProtectedRoute>
    )
  },
  {
    path: "/stripe",
    element: (
      <ProtectedRoute>
        <StripeCard />
      </ProtectedRoute>
    )
  },
  {
    path: "/order-history",
    element: (
      <ProtectedRoute>
        <OrderHistory />
      </ProtectedRoute>
    )
  },
  {
    path:"/profile",
    element:(
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/faqs",
    element: <FAQ />
  },
  {
    path: "/about-us",
    element: <AboutUs />
  },
  {
    path: "/contact-us",
    element: <ContactPage />
  },
  {
    path:"/policies",
    element: <PoliciesPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <ToastContainer />
      </RouterProvider>
    </Provider>
  </React.StrictMode>,
);
