import { useState, useEffect } from 'react';

function LineInterpretation({ songId, lineNumber, lyricLine, userId }) {
  // State to store interpretations for this line
  const [interpretations, setInterpretations] = useState([]);

  // State for the form to submit a new interpretation
  const [newInterpretation, setNewInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // When component loads, fetch interpretations for this line
  useEffect(() => {
    fetchInterpretations();
  }, [songId, lineNumber]);

  // Function to fetch interpretations from backend
  const fetchInterpretations = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/songs/${songId}/line/${lineNumber}/interpretations`
      );
      const data = await response.json();
      // data is an array of interpretations, already sorted by votes
      setInterpretations(data);
    } catch (err) {
      console.error("Failed to fetch interpretations:", err);
    }
  };

  // Function to submit a new interpretation
  const handleSubmitInterpretation = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/interpretations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Send userId and token for authentication
          "user-id": userId,
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          songId,
          lineNumber,
          content: newInterpretation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add interpretation");
      }

      // Success! Clear the form and refresh interpretations
      setNewInterpretation("");
      await fetchInterpretations();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="line-interpretation">
      {/* The actual lyric line */}
      <div className="lyric-line">
        <strong>{lyricLine}</strong>
      </div>

      {/* Display existing interpretations */}
      <div className="interpretations-list">
        {interpretations.length === 0 ? (
          <p className="no-interpretations">No interpretations yet. Be the first!</p>
        ) : (
          interpretations.map((interp) => (
            <div key={interp.id} className="interpretation-item">
              <p className="interpretation-content">{interp.content}</p>
              <div className="interpretation-meta">
                <span className="votes">👍 {interp.votes} votes</span>
                <span className="user">by user {interp.user_id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form to add a new interpretation */}
      <form onSubmit={handleSubmitInterpretation} className="interpretation-form">
        <textarea
          placeholder="What does this line mean to you?"
          value={newInterpretation}
          onChange={(e) => setNewInterpretation(e.target.value)}
          required
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Interpretation"}
        </button>
      </form>
    </div>
  );
}

export default LineInterpretation;
