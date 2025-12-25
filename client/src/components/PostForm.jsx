import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createPost,
  updatedPost,
  getPostByUserId,
  deletedPost,
  reset,
} from '../features/posts/postSlice';
import { MdDelete } from 'react-icons/md';
import { IoCaretBackOutline } from 'react-icons/io5';

function PostForm({ onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // id exists → edit mode

  const { post } = useSelector((state) => state.posts);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    category: '', // added category
  });

  const [preview, setPreview] = useState(null); // preview of image

  const { title, content, category, image } = formData;

  // Load post data for editing
  useEffect(() => {
    if (id) {
      dispatch(getPostByUserId(id));
    }
  }, [id, dispatch]);

  // Fill form fields after post is loaded
  useEffect(() => {
    if (id && post) {
      setFormData({
        title: post.title,
        content: post.content,
        image: null,
        category: post.category || '', // set category
      });
      setPreview(post.image ? `/uploads/${post.image}` : null);
    }
  }, [post, id]);
  // useEffect(() => {
  //   return () => {
  //     dispatch(reset());
  //   };
  // }, [dispatch]);
  // Handle input change
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle image selection
  const onFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Submit form
  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', title);
    data.append('content', content);
    data.append('category', category);
    if (image) data.append('image', image);

    if (id) {
      dispatch(updatedPost({ id, formData: data })).then(() => {
        if (onClose) onClose(); // close the form
        navigate('/dashboard'); // go to dashboard
      });
    } else {
      dispatch(createPost(data)).then(() => {
        if (onClose) onClose();
        navigate('/dashboard');
      });
    }
  };


  // Delete post
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete?')) {
      dispatch(deletedPost(id));
      navigate('/dashboard');
    }
  };

  return (
    <section className="form">
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Left side: Back button */}
        {id && (
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate(-1)}
          >
            <IoCaretBackOutline />
          </button>
        )}

        {/* Center: Title */}
        <h2
          className="m-0 text-center flex-grow-1"
          style={{ color: '#25b6ac' }} // light green
        >
          {id ? 'Edit Post' : 'Create Post'}
        </h2>

        {/* Right side: Delete button */}
        {id && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            <MdDelete />
          </button>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        encType="multipart/form-data"
      >
        {/* Title */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={onChange}
            required
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={onFileChange}
          />
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="form-group">
            <img
              src={preview}
              alt="Preview"
              style={{ width: '200px', height: 'auto', marginTop: '10px' }}
            />
          </div>
        )}
        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={onChange}
            required
          >
            <option value="">-- Select Category --</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Tech">Tech</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Content */}
        <div className="form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={content}
            onChange={onChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button className="btn-custom btn-block">
            {id ? 'Update Post' : 'Submit'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PostForm;
