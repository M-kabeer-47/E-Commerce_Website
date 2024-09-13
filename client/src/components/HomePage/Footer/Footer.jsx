import { Link } from 'react-router-dom';
import './styles.css';
import { FaFacebookSquare, FaInstagramSquare, FaTwitterSquare, FaLinkedin } from "react-icons/fa";


export default function Footer() {
  return (
    <footer>
      <section className="top">
        <h2>GLITCHWARE</h2>
        <ul>
          <li>
            <h3>Products</h3>
            <Link to="/products/playstation" className="footerItems">Playstation</Link>
            <Link to="/products/mouse" className="footerItems">Mouse</Link>
            <Link to="/products/keyboards" className="footerItems">Keyboards</Link>
            <Link to="/products/headphones" className="footerItems">Headphones</Link>
            <Link to="/products/monitors" className="footerItems">Monitors</Link>
          </li>
          <li>
            <h3>Pre-PC Builds</h3>
            <Link to="/products/value-deals" className="footerItems">Value Deals</Link>
            <Link to="/products/smash-deals" className="footerItems">Smash Deals</Link>
            <Link to="/products/rapid-deals" className="footerItems">Rapid Deals</Link>
            <Link to="/products/xtreme-deals" className="footerItems">Xtreme Deals</Link>
          </li>
          <li>
            <h3>Information</h3>
            <Link to="/about-us" className="footerItems">About Us</Link>
            <Link to="/faqs" className="footerItems">FAQs</Link>
            <Link to="/contact-us" className="footerItems">Contact Us</Link>
            <Link to="/policies" className="footerItems">Policies</Link>
          </li>
          <li>
            <h3>Socials</h3>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"  className="footerItems notfooter">
              <FaFacebookSquare className='social' />
            </a>
            <a href="https://www.instagram.com/"  target="_blank" rel="noopener noreferrer"className="footerItems notfooter">
              <FaInstagramSquare className='social' />
            </a>
            <a href="https://www.x.com/" target="_blank" rel="noopener noreferrer" className="footerItems notfooter">
              <FaTwitterSquare className='social'/>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="footerItems notfooter">
              <FaLinkedin className='social'/>
            </a> 
          </li>
        </ul>
      </section>

      <section className="bottom">© 2024 GLITCHWARE</section>
    </footer>
  );
}
