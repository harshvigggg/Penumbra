import { useState, useEffect } from 'react';
import './App.css';
import Auth from './Auth';
import Dashboard from './Dashboard';

function App() {
  // State to track if user is logged in
  // isLoggedIn = true if token exists in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  // Run this when component loads (only once, because of [])
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Token exists, user is logged in
      setIsLoggedIn(true);
      // Also get userId from localStorage
      const id = localStorage.getItem('userId');
      setUserId(id);
    }
  }, []); // Empty dependency array = run only on mount

  // Handle logout: delete token and go back to login
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
  };

  // If logged in, show Dashboard. Otherwise show Auth (login/signup)
  return (
    <div className="App">
      {isLoggedIn ? (
        <Dashboard userId={userId} onLogout={handleLogout} />
      ) : (
        <Auth onLoginSuccess={(id) => {
          setUserId(id);
          setIsLoggedIn(true);
        }} />
      )}
    </div>
  );
}

export default App;
