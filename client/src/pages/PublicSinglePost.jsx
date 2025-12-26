import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  getPostByPostId,
  likePost,
  addComment,
} from '../features/posts/postSlice';
import Spinner from '../components/Spinner';
import { FaHeart } from 'react-icons/fa';
import { IoCaretBackOutline } from 'react-icons/io5';

function PublicSinglePost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const passedUserId = location.state?.userId;

  const { post, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  // Determine current user ID (logged-in or passed from Read More)
  const currentUserId = user?._id || passedUserId;

  // Fetch post by ID
  useEffect(() => {
    if (id) dispatch(getPostByPostId(id));
  }, [dispatch, id]);

  // Load comments when post updates
  useEffect(() => {
    if (post?.comments) setComments(post.comments);
  }, [post]);

  // Determine like status
  const alreadyLiked = Array.isArray(post?.likes)
    ? currentUserId && post.likes.includes(currentUserId)
    : false;

  const likeCount = Array.isArray(post?.likes)
    ? post.likes.length
    : post?.likes || 0;

  // LIKE
  const handleLike = () => {
    if (!currentUserId) return alert('Login required to like this post');
    dispatch(likePost(post._id));
  };

  // COMMENT
 const handleCommentSubmit = () => {
   if (!currentUserId) return alert('Login required to comment');
   if (!commentText.trim()) return alert('Comment cannot be empty');

   dispatch(addComment({ postId: post._id, text: commentText })).then(() => {
     dispatch(getPostByPostId(id)); // 🔥 Refresh post with new comments
   });

   setCommentText('');
 };


  if (isLoading) return <Spinner />;
  if (!post) return <h2 className="text-center mt-5">Post not found</h2>;

  return (
    <div className="container mt-4">
      <h1 className="text-center">{post.title}</h1>

      {/* Action buttons */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button
          className="btn btn-light"
          onClick={handleLike}
          disabled={!currentUserId || post.isPublic}
        >
          <FaHeart color={alreadyLiked ? 'red' : 'grey'} /> {likeCount}
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          <IoCaretBackOutline />
        </button>
      </div>

      {/* Post image */}
      {post.image && (
        <div className="text-center mt-4">
          <img
            src={post.image}
            alt={post.title}
            style={{
              maxWidth: '80%',
              borderRadius: '10px',
              border: '2px solid #ccc',
              padding: '4px',
            }}
          />
        </div>
      )}

      {/* Category */}
      <p className="mt-3 text-center">
        <strong>Category:</strong> {post.category}
      </p>

      {/* Content */}
      <p className="mt-4">{post.content}</p>

      {/* Date */}
      <p className="text-muted mt-4 text-center">
        Posted On:{' '}
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown'}
      </p>

      {/* ---------------- COMMENTS ---------------- */}
      <div className="mt-5">
        <h5>Comments</h5>

        {/* Comment input for logged-in / unknown users */}
        {!post.isPublic && currentUserId && (
          <div className="d-flex gap-2 mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ height: '45px', fontSize: '16px', padding: '10px' }}
            />
            <button
              className="btn btn-primary"
              onClick={handleCommentSubmit}
            >
              Add
            </button>
          </div>
        )}

        {/* Comment list */}
        <div className="mt-4">
          {comments && comments.length > 0 ? (
            comments.map((c) => (
              <div
                key={c._id}
                className="border p-2 mb-2 rounded"
              >
                <strong>{c.user?.name || 'Unknown'}:</strong>
                <p className="mb-1">{c.text}</p>
                <small className="text-muted">
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p className="text-muted">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicSinglePost;
