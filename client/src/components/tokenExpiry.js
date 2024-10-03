export default function isTokenExpired() {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return true; 
    return Date.now() > parseInt(tokenExpiry); 
  };

  