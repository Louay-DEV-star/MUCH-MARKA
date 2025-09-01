import '../styles/components/Navbar.scss';
import logo from '../assets/logo.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { FiShoppingCart, FiX, FiMenu } from "react-icons/fi";
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { SERVER } from '../hooks/config';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { getCartItemCount } = useCart();

  // Search products by name
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const { data } = await axios.get(`${SERVER}/products/search?q=${encodeURIComponent(query)}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        searchProducts(searchTerm);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleProductClick = (product) => {
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    navigate(`/product/${product.name}`, { state: { productId: product.id } });
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <>
      <div className={`navbar ${isHomePage ? "" : "with-border"}`}>
        <div className='navbar-container'>
          <div className="navbar-logo">
            <img src={logo} alt="Logo" onClick={() => navigate('/')} /> 
          </div> 

          {/* Desktop Navigation */}
          <nav className="navbar-links">
            <Link to="/" className="navbar-link">Accueil</Link>
            <Link to="/AboutUs" className="navbar-link">À propos</Link>
            <Link to="/products" className="navbar-link">Nos produits</Link>
            <Link to="/contact" className="navbar-link">Contact</Link>
          </nav>

          {/* Utils (desktop only) */}
          <div className='utils'>
            <div className="search-icon" onClick={() => setIsSearchOpen(true)}>
              <GoSearch size={21} />
            </div>
            <div className="cart" onClick={() => setIsCartOpen(true)}>
              <FiShoppingCart size={21} />
              {getCartItemCount() > 0 && (
                <span className="cart-count">{getCartItemCount()}</span>
              )}
            </div>

            {/* Hamburger menu (mobile trigger) */}
            <div className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
              <FiMenu size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <nav className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <img src={logo} alt="Logo" className="mobile-logo" onClick={() => {navigate('/'); setIsMenuOpen(false);}} />
          <div className='mobile-utils'>
              <div className="mobile-search-icon" onClick={() => { setIsSearchOpen(true); setIsMenuOpen(false); }}>
                <GoSearch size={22} />
              </div>
              <div className="close-btn" onClick={() => setIsMenuOpen(false)}>
                <FiX size={24} />
              </div>
          </div>
        </div>

        <div className="mobile-links">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
          <Link to="/AboutUs" onClick={() => setIsMenuOpen(false)}>À propos</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)}>Nos produits</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          <div className="mobile-cart" onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}>
            <FiShoppingCart size={22} />
            {getCartItemCount() > 0 && (
              <span className="cart-count">{getCartItemCount()}</span>
            )}
            <span className="cart-label">Mon Panier</span>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="search-modal-overlay" onClick={closeSearch}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-header">
              <div className="search-input-container">
                <GoSearch size={20} className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="search-input"
                />
              </div>
              <button className="close-search" onClick={closeSearch}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="search-content">
              {isSearching ? (
                <div className="search-loading">
                  <div className="loading-spinner"></div>
                  <p>Recherche en cours...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <div 
                      key={product.id} 
                      className="search-result-item"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="product-image">
                        <img src={`${SERVER}${product.banner}`} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <h4 className="product-name">{product.name}</h4>
                        <p className="product-price">{product.price} DT</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="no-results">
                  <p>Aucun produit trouvé pour "{searchTerm}"</p>
                  <p className="suggestion">Essayez avec d'autres mots-clés</p>
                </div>
              ) : (
                <div className="search-placeholder">
                  <GoSearch size={48} className="placeholder-icon" />
                  <p>Commencez à taper pour rechercher des produits</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}      
    </>
  );
}

export default Navbar;
