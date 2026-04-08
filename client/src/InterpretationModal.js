import { useState, useEffect } from 'react';

function InterpretationModal({ songId, lineNumber, lyricLine, userId, onClose }) {
  // State to store interpretations for this line
  const [interpretations, setInterpretations] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the form to submit a new interpretation
  const [newInterpretation, setNewInterpretation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // When modal opens, fetch interpretations
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
      setInterpretations(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch interpretations:", err);
      setLoading(false);
    }
  };

  // Function to upvote an interpretation
  const handleUpvote = async (interpretationId, currentIndex) => {
    try {
      const response = await fetch(
        `http://localhost:3000/interpretations/${interpretationId}/upvote`,
        { method: "POST" }
      );

      if (!response.ok) {
        throw new Error("Failed to upvote");
      }

      const data = await response.json();

      // Update the local state with new vote count
      const updatedInterpretations = [...interpretations];
      updatedInterpretations[currentIndex].votes = data.votes;

      // Re-sort by votes (highest first)
      updatedInterpretations.sort((a, b) => b.votes - a.votes);
      setInterpretations(updatedInterpretations);
    } catch (err) {
      console.error("Upvote failed:", err);
    }
  };

  // Function to submit a new interpretation
  const handleSubmitInterpretation = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/interpretations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

      // Success! Clear form and refresh
      setNewInterpretation("");
      await fetchInterpretations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {/* Modal box - stop click propagation so clicking inside doesn't close it */}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose}>×</button>

        {/* Lyric line title */}
        <h2 className="modal-title">{lyricLine}</h2>
        <p className="modal-subtitle">What does this line mean?</p>

        {/* Loading state */}
        {loading ? (
          <p className="loading-text">Loading interpretations...</p>
        ) : (
          <>
            {/* Interpretations list */}
            <div className="modal-interpretations">
              {interpretations.length === 0 ? (
                <p className="no-interpretations">No interpretations yet. Be the first!</p>
              ) : (
                interpretations.map((interp, index) => (
                  <div key={interp.id} className="interpretation-item">
                    <p className="interpretation-content">{interp.content}</p>
                    <div className="interpretation-footer">
                      <button
                        className="upvote-btn"
                        onClick={() => handleUpvote(interp.id, index)}
                      >
                        👍 {interp.votes}
                      </button>
                      <span className="user-info">by user {interp.user_id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Form to submit new interpretation */}
            <form onSubmit={handleSubmitInterpretation} className="interpretation-form">
              <textarea
                placeholder="Share your interpretation..."
                value={newInterpretation}
                onChange={(e) => setNewInterpretation(e.target.value)}
                required
              />
              {error && <div className="error">{error}</div>}
              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Add Interpretation"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default InterpretationModal;
