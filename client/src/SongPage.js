import { useState, useEffect } from 'react';
import InterpretationModal from './InterpretationModal';

function SongPage({ songId, userId, onBack }) {
  // State to store the song data
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for modal
  const [selectedLine, setSelectedLine] = useState(null);

  // When component loads, fetch the song
  useEffect(() => {
    fetchSong();
  }, [songId]);

  // Function to fetch song from backend
  const fetchSong = async () => {
    try {
      const response = await fetch(`http://localhost:3000/songs/${songId}`);

      if (!response.ok) {
        throw new Error("Song not found");
      }

      const data = await response.json();
      setSong(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return <div className="song-page"><p>Loading song...</p></div>;
  }

  // Show error state
  if (error) {
    return (
      <div className="song-page">
        <p className="error">Error: {error}</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  // If no song, return early
  if (!song) {
    return (
      <div className="song-page">
        <p>Song not found</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  // Split lyrics into individual lines
  const lyricLines = song.lyrics.split('\n').filter(line => line.trim() !== "");

  return (
    <div className="song-page">
      {/* Song header */}
      <div className="song-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h1>{song.title}</h1>
        <p className="artist">by {song.artist}</p>
        <div className="song-meta">
          <span className="language">Language: {song.language}</span>
          {song.genre && <span className="genre">Genre: {song.genre}</span>}
        </div>
      </div>

      {/* Clickable lyrics - no interpretations shown here, only when clicked */}
      <div className="lyrics-container">
        {lyricLines.map((lyricLine, index) => (
          <div
            key={index}
            className="lyric-line-clickable"
            onClick={() => setSelectedLine({ lineNumber: index + 1, text: lyricLine })}
          >
            {lyricLine}
          </div>
        ))}
      </div>

      {/* Modal opens when a line is clicked */}
      {selectedLine && (
        <InterpretationModal
          songId={songId}
          lineNumber={selectedLine.lineNumber}
          lyricLine={selectedLine.text}
          userId={userId}
          onClose={() => setSelectedLine(null)}
        />
      )}
    </div>
  );
}

export default SongPage;
