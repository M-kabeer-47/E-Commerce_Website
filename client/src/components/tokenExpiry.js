export default function isTokenExpired() {
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    if (!tokenExpiry) return true; // If there's no expiry time, treat the token as expired
    return Date.now() > parseInt(tokenExpiry); // Check if the current time is past the expiry time
  };

  