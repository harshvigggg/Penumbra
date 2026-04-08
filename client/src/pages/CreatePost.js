import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CreatePost() {
  const { slug } = useParams();
  const [community, setCommunity] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch community info so we know its id
    fetch(`http://localhost:3000/communities/${slug}`)
      .then((res) => res.json())
      .then((data) => setCommunity(data))
      .catch((err) => console.error('Failed to fetch community:', err));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          type: 'text',
          communityId: community.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create post');
      }

      navigate(`/post/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!community) return <p>Loading...</p>;

  return (
    <div className="create-page">
      <h2>Post to c/{community.name}</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          placeholder="What do you want to talk about?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Content (optional)</label>
        <textarea
          placeholder="Share your thoughts, lyrics, interpretation..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
