function Dashboard({ userId, onLogout }) {
  // This component is shown when user is logged in
  // userId comes from App.js
  // onLogout is a function from App.js that handles logout

  return (
    <div className="dashboard-container">
      <div className="dashboard-box">
        <h1>Welcome to Penumbra!</h1>

        {/* Display user info */}
        <p>You are logged in as user ID: <strong>{userId}</strong></p>

        {/* Logout button */}
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
