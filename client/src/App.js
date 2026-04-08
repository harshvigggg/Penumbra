import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Auth from './Auth';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Communities from './pages/Communities';
import CommunityPage from './pages/CommunityPage';
import PostPage from './pages/PostPage';
import CreateCommunity from './pages/CreateCommunity';
import CreatePost from './pages/CreatePost';
import UserProfile from './pages/UserProfile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('username');

    if (token && id) {
      setIsLoggedIn(true);
      setUserId(id);
      setUsername(name);
    }
  }, []);

  const handleLoginSuccess = (id, name) => {
    setUserId(id);
    setUsername(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUserId(null);
    setUsername(null);
  };

  if (!isLoggedIn) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <Navbar username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Feed userId={userId} />} />
        <Route path="/communities" element={<Communities userId={userId} />} />
        <Route path="/c/:slug" element={<CommunityPage userId={userId} username={username} />} />
        <Route path="/c/:slug/submit" element={<CreatePost userId={userId} />} />
        <Route path="/post/:id" element={<PostPage userId={userId} username={username} />} />
        <Route path="/create-community" element={<CreateCommunity userId={userId} />} />
        <Route path="/u/:username" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
