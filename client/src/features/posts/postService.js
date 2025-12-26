import axios from 'axios';

const API_URL = '/api/posts/';

// Create Post
const createPost = async (postData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // important for files
    },
  };

  const response = await axios.post(API_URL, postData, config);
  return response.data;
};


// Get all posts (private)
const getAllPosts = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};


// Get public posts (no token)
const getPublicPosts = async () => {
  const response = await axios.get(`${API_URL}public`);
  return response.data;
}

// Get single post ( private)
const getPostByUserId = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(`${API_URL}${id}`, config);
  return response.data; // this should be a single post object
};

// ✔ Public: Get post by post ID
const getPostByPostId = async (id) => {
  const response = await axios.get(`${API_URL}public/${id}`);
  return response.data;
};

// Delete post
const deletedPost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}${id}`, config);
  return response.data;
};

// Update post (with image support)
const updatedPost = async (id, formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // important for files
    },
  };

  const response = await axios.put(`${API_URL}${id}`, formData, config);
  return response.data; // return the updated post
};
const likePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}${id}/like`, {}, config);
  return response.data;
};
//-------------------
// ⭐ Add Comment
// -------------------
const addComment = async (postId, text, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API_URL}${postId}/comments`,
    { text },
    config
  );
  return response.data;
};

// -------------------
// ⭐ Add Reply to a Comment
// -------------------
const addReply = async (postId, commentId, text) => {
  const response = await axios.post(
    `${API_URL}${postId}/comments/${commentId}/reply`,
    { text }
  );
  return response.data;
};
const postService = {
  createPost,
  getAllPosts,
  getPostByUserId,
  deletedPost,
  updatedPost,
  getPublicPosts,
  likePost,
  getPostByPostId,
  addComment,
  addReply,
};
export default postService;
