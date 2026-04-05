import { useState } from 'react';

function Auth({ onLoginSuccess }) {
  // State to track which form to show: "login" or "signup"
  const [mode, setMode] = useState("login");

  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for error messages and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission (both login and signup)
  const handleSubmit = async (e) => {
    // e.preventDefault() stops the form from reloading the page
    e.preventDefault();

    // Clear previous errors
    setError("");
    setLoading(true);

    try {
      // Decide which endpoint to call based on mode
      const endpoint = mode === "login" ? "/login" : "/register";

      // Send email and password to backend
      // fetch() is built-in JavaScript to make HTTP requests
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST", // We're sending data
        headers: {
          "Content-Type": "application/json", // We're sending JSON
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // Parse the response as JSON
      const data = await response.json();

      // If response is not ok (e.g., 400, 500), throw an error
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Success! We got the token and userId
      // Save token and userId to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      // Tell App.js we're logged in (this will trigger rendering Dashboard)
      onLoginSuccess(data.userId);
    } catch (err) {
      // If something went wrong, show error message
      setError(err.message);
    } finally {
      // Always stop loading, whether success or error
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{mode === "login" ? "Login" : "Sign Up"}</h1>

        {/* Show error message if there is one */}
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            // onChange runs when user types
            // e.target.value is what they typed
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Submit button */}
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle between login and signup */}
        <p>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              // Switch modes and clear form
              setMode(mode === "login" ? "signup" : "login");
              setEmail("");
              setPassword("");
              setError("");
            }}
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
