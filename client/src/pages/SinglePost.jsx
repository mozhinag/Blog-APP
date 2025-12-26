import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPostByUserId,
  likePost,
  deletedPost,
  addComment,
} from '../features/posts/postSlice';
import Spinner from '../components/Spinner';
import { FaHeart, FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoCaretBackOutline } from 'react-icons/io5';

function SinglePost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { post, isLoading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState('');

  const token = user?.token;

  // Fetch post
  useEffect(() => {
    if (id) dispatch(getPostByUserId(id));
  }, [dispatch, id]);

  if (isLoading) return <Spinner />;
  if (!post) return <h2 className="text-center mt-5">Post not found</h2>;

  const isOwner = user?._id === post?.user;
  const alreadyLiked = Array.isArray(post?.likes)
    ? user?._id && post.likes.includes(user._id)
    : false;

  const likeCount = Array.isArray(post?.likes)
    ? post.likes.length
    : post?.likes || 0;

  const handleLike = () => {
    if (!user) return alert('Login required');
    dispatch(likePost(post._id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(deletedPost(post._id));
      navigate('/dashboard');
    }
  };

  // Add comment
  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    dispatch(addComment({ postId: post._id, text: commentText, token })).then(
      () => dispatch(getPostByUserId(id))
    );

    setCommentText('');
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">{post.title}</h1>

      {/* Action buttons */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        {isOwner && (
          <>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              <MdDelete />
            </button>
            <button
              className="btn btn-warning"
              onClick={() => navigate(`/edit/${id}`)}
            >
              <FaEdit />
            </button>
          </>
        )}

        <button
          className="btn btn-light"
          onClick={handleLike}
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

      <p className="mt-3 text-center">
        <strong>Category:</strong> {post.category}
      </p>

      <p className="mt-4">{post.content}</p>

      <p className="text-muted mt-4 text-center">
        Posted On:{' '}
        {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown'}
      </p>

      {/* Comments Section */}
      <div className="mt-5">
        <h5>Comments</h5>

        {/* Comment input */}
        {user && (
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
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((c) => (
              <div
                key={c._id}
                className="border p-2 mb-2 rounded"
              >
                <strong>{c.user?.name || 'User'}:</strong>
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

export default SinglePost;
