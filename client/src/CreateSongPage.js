import { useState } from 'react';

function CreateSongPage({ userId, onBack }) {
  // Form state
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [language, setLanguage] = useState("hindi");
  const [genre, setGenre] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate inputs
      if (!title.trim() || !artist.trim() || !lyrics.trim() || !language) {
        throw new Error("Title, artist, lyrics, and language are required");
      }

      const token = localStorage.getItem("token");

      // Send to backend
      const response = await fetch("http://localhost:3000/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": userId,
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          artist: artist.trim(),
          lyrics: lyrics.trim(),
          language,
          genre: genre.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create song");
      }

      // Success!
      setSuccess(`Song created! ID: ${data.songId}`);

      // Clear form
      setTitle("");
      setArtist("");
      setLyrics("");
      setLanguage("hindi");
      setGenre("");

      // Navigate back after 2 seconds
      setTimeout(() => onBack(), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-song-page">
      <div className="create-song-container">
        <button onClick={onBack} className="back-btn">← Back</button>

        <h1>Add a New Song</h1>
        <p className="subtitle">Share a song and start building interpretations</p>

        <form onSubmit={handleSubmit} className="create-song-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Song Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Blinding Lights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Artist */}
          <div className="form-group">
            <label htmlFor="artist">Artist *</label>
            <input
              id="artist"
              type="text"
              placeholder="e.g., The Weeknd"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </div>

          {/* Language */}
          <div className="form-group">
            <label htmlFor="language">Language *</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="hindi">Hindi</option>
              <option value="urdu">Urdu</option>
              <option value="punjabi">Punjabi</option>
              <option value="english">English</option>
            </select>
          </div>

          {/* Genre */}
          <div className="form-group">
            <label htmlFor="genre">Genre (optional)</label>
            <input
              id="genre"
              type="text"
              placeholder="e.g., Pop, Hip-Hop, Classical"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
          </div>

          {/* Lyrics */}
          <div className="form-group">
            <label htmlFor="lyrics">Lyrics *</label>
            <p className="lyrics-hint">Separate each line with a new line (press Enter)</p>
            <textarea
              id="lyrics"
              placeholder="Line 1&#10;Line 2&#10;Line 3&#10;..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              required
              rows="12"
            />
          </div>

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          {/* Success message */}
          {success && <div className="success-message">{success}</div>}

          {/* Submit button */}
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Creating..." : "Create Song"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSongPage;
