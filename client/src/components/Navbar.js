import { Link } from 'react-router-dom';

function Navbar({ username, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Penumbra</Link>

      <div className="navbar-links">
        <Link to="/">Feed</Link>
        <Link to="/communities">Communities</Link>
        <Link to="/create-community">+ Community</Link>
      </div>

      <div className="navbar-user">
        <span>{username}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
