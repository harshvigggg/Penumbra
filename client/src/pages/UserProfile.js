import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import timeAgo from '../utils/timeAgo';

function UserProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('posts'); // 'posts' or 'comments'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/users/${username}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user:', err);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (!data || data.error) return <p>User not found.</p>;

  const { user, posts, comments } = data;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>u/{user.username}</h1>
        <p className="profile-meta">
          {user.karma} karma · joined {timeAgo(user.created_at)}
        </p>
      </div>

      <div className="profile-tabs">
        <button
          className={tab === 'posts' ? 'active' : ''}
          onClick={() => setTab('posts')}
        >
          Posts ({posts.length})
        </button>
        <button
          className={tab === 'comments' ? 'active' : ''}
          onClick={() => setTab('comments')}
        >
          Comments ({comments.length})
        </button>
      </div>

      {tab === 'posts' && (
        <div className="profile-list">
          {posts.length === 0 && <p>No posts yet.</p>}
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-votes">
                <span>▲</span>
                <span>{post.upvotes - post.downvotes}</span>
              </div>
              <div className="post-body">
                <div className="post-meta">
                  <Link to={`/c/${post.community_slug}`}>c/{post.community_name}</Link>
                  <span> · {timeAgo(post.created_at)}</span>
                </div>
                <Link to={`/post/${post.id}`} className="post-title">
                  <h3>{post.title}</h3>
                </Link>
                {post.content && (
                  <p className="post-content">
                    {post.content.slice(0, 200)}{post.content.length > 200 ? '...' : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'comments' && (
        <div className="profile-list">
          {comments.length === 0 && <p>No comments yet.</p>}
          {comments.map((comment) => (
            <div key={comment.id} className="profile-comment">
              <div className="profile-comment-meta">
                on <Link to={`/post/${comment.post_id}`}>{comment.post_title}</Link>
                <span> · {timeAgo(comment.created_at)}</span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
