import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import timeAgo from '../utils/timeAgo';

function CommentThread({ comment, allComments, onVote, onReply, replyTo, onSubmitReply, replyText, onReplyTextChange, submitting, depth = 0 }) {
  const children = allComments.filter((c) => c.parent_comment_id === comment.id);
  const indentStyle = { marginLeft: Math.min(depth, 5) * 20 + 'px' };

  return (
    <div style={indentStyle}>
      <div className="comment">
        <div className="comment-votes">
          <button onClick={() => onVote(comment.id, 1)}>▲</button>
          <span>{comment.upvotes - comment.downvotes}</span>
          <button onClick={() => onVote(comment.id, -1)}>▼</button>
        </div>

        <div className="comment-body">
          <Link to={`/u/${comment.username}`} className="comment-user">u/{comment.username}</Link>
          <p>{comment.content}</p>
          <button onClick={() => onReply(comment.id)}>Reply</button>

          {replyTo === comment.id && (
            <form onSubmit={onSubmitReply} className="inline-reply-form">
              <textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => onReplyTextChange(e.target.value)}
                required
                autoFocus
              />
              <div className="inline-reply-actions">
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Reply'}
                </button>
                <button type="button" onClick={() => onReply(null)}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {children.map((child) => (
        <CommentThread
          key={child.id}
          comment={child}
          allComments={allComments}
          onVote={onVote}
          onReply={onReply}
          replyTo={replyTo}
          onSubmitReply={onSubmitReply}
          replyText={replyText}
          onReplyTextChange={onReplyTextChange}
          submitting={submitting}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

function PostPage({ userId, username }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}`);
      const data = await res.json();
      setPost(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/posts/${id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleVotePost = async (value) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetId: parseInt(id), targetType: 'post', value }),
      });
      fetchPost();
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleVoteComment = async (commentId, value) => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ targetId: commentId, targetType: 'comment', value }),
      });
      fetchComments();
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ postId: parseInt(id), content: newComment, parentCommentId: null }),
      });
      setNewComment('');
      fetchComments();
      fetchPost();
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ postId: parseInt(id), content: replyText, parentCommentId: replyTo }),
      });
      setReplyText('');
      setReplyTo(null);
      fetchComments();
      fetchPost();
    } catch (err) {
      console.error('Reply failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetReply = (commentId) => {
    setReplyTo(commentId);
    setReplyText('');
  };

  const topLevelComments = comments.filter((c) => !c.parent_comment_id);

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="post-page">
      <div className="post-full">
        <div className="post-votes">
          <button onClick={() => handleVotePost(1)}>▲</button>
          <span>{post.upvotes - post.downvotes}</span>
          <button onClick={() => handleVotePost(-1)}>▼</button>
        </div>
        <div className="post-content-full">
          <div className="post-meta">
            <Link to={`/c/${post.community_slug}`}>c/{post.community_name}</Link>
            <span> · <Link to={`/u/${post.username}`}>u/{post.username}</Link> · {timeAgo(post.created_at)}</span>
          </div>
          <h1>{post.title}</h1>
          {post.content && <p>{post.content}</p>}
        </div>
      </div>

      <div className="comment-form-section">
        <form onSubmit={handleSubmitComment}>
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Comment'}
          </button>
        </form>
      </div>

      <div className="comments-section">
        <h3>{post.comment_count} Comments</h3>
        {topLevelComments.length === 0 && <p>No comments yet.</p>}
        {topLevelComments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            allComments={comments}
            onVote={handleVoteComment}
            onReply={handleSetReply}
            replyTo={replyTo}
            onSubmitReply={handleSubmitReply}
            replyText={replyText}
            onReplyTextChange={setReplyText}
            submitting={submitting}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

export default PostPage;
