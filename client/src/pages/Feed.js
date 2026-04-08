import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import timeAgo from '../utils/timeAgo';

function Feed({ userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId, value) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetId: postId, targetType: 'post', value }),
      });
      fetchPosts();
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="feed">
      <h2>Home Feed</h2>

      {posts.length === 0 && (
        <p>No posts yet. <Link to="/communities">Join some communities</Link> to see posts here.</p>
      )}

      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-votes">
            <button onClick={() => handleVote(post.id, 1)}>▲</button>
            <span>{post.upvotes - post.downvotes}</span>
            <button onClick={() => handleVote(post.id, -1)}>▼</button>
          </div>

          <div className="post-body">
            <div className="post-meta">
              <Link to={`/c/${post.community_slug}`}>c/{post.community_name}</Link>
              <span> · posted by <Link to={`/u/${post.username}`}>u/{post.username}</Link> · {timeAgo(post.created_at)}</span>
            </div>

            <Link to={`/post/${post.id}`} className="post-title">
              <h3>{post.title}</h3>
            </Link>

            {post.content && (
              <p className="post-content">{post.content.slice(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
            )}

            <div className="post-footer">
              <Link to={`/post/${post.id}`}>{post.comment_count} comments</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;
