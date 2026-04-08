import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import timeAgo from '../utils/timeAgo';

function CommunityPage({ userId }) {
  const { slug } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunity();
    fetchPosts();
  }, [slug]);

  const fetchCommunity = async () => {
    try {
      const res = await fetch(`http://localhost:3000/communities/${slug}`);
      const data = await res.json();
      setCommunity(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch community:', err);
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/communities/${slug}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/communities/${slug}/follow`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFollowing(data.following);
      fetchCommunity();
    } catch (err) {
      console.error('Follow failed:', err);
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
  if (!community) return <p>Community not found.</p>;

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>c/{community.name}</h1>
        <p>{community.description}</p>
        <span>{community.member_count} members</span>
        <button onClick={handleFollow}>
          {following ? 'Unfollow' : 'Follow'}
        </button>
        <Link to={`/c/${slug}/submit`}>+ New Post</Link>
      </div>

      <div className="posts-list">
        {posts.length === 0 && <p>No posts yet. Be the first!</p>}

        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-votes">
              <button onClick={() => handleVote(post.id, 1)}>▲</button>
              <span>{post.upvotes - post.downvotes}</span>
              <button onClick={() => handleVote(post.id, -1)}>▼</button>
            </div>

            <div className="post-body">
              <div className="post-meta">
                <span><Link to={`/u/${post.username}`}>u/{post.username}</Link> · {timeAgo(post.created_at)}</span>
              </div>
              <Link to={`/post/${post.id}`}>
                <h3>{post.title}</h3>
              </Link>
              {post.content && (
                <p>{post.content.slice(0, 200)}{post.content.length > 200 ? '...' : ''}</p>
              )}
              <Link to={`/post/${post.id}`}>{post.comment_count} comments</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommunityPage;
