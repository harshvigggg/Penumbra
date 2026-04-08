import { useState } from 'react';

function Dashboard({ userId, onLogout, onNavigateToSong, onCreateSong }) {
  // This component is shown when user is logged in
  // userId comes from App.js
  // onLogout is a function from App.js that handles logout
  // onNavigateToSong is a function to navigate to a specific song
  // onCreateSong is a function to navigate to create song page

  // State for the song ID input
  const [songId, setSongId] = useState("");

  // Handle when user submits song ID
  const handleViewSong = (e) => {
    e.preventDefault();
    if (songId.trim()) {
      onNavigateToSong(songId);
      setSongId("");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>Welcome to Penumbra!</h1>

        {/* Display user info */}
        <p>You are logged in as user ID: <strong>{userId}</strong></p>

        {/* Form to navigate to a song */}
        <form onSubmit={handleViewSong} className="song-search-form">
          <input
            type="number"
            placeholder="Enter song ID to view..."
            value={songId}
            onChange={(e) => setSongId(e.target.value)}
          />
          <button type="submit">View Song</button>
        </form>

        {/* Create Song button */}
        <button onClick={onCreateSong} className="create-song-btn">
          + Create Song
        </button>

        {/* Logout button */}
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
