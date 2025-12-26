import posts from '../models/postModel.js';
import expressAsyncHandler from 'express-async-handler';

/* =======================
   GET POSTS
======================= */

// Get logged-in user's posts
export const getAllPost = expressAsyncHandler(async (req, res) => {
  const userPosts = await posts.find({ user: req.user.id });
  res.status(200).json(userPosts);
});

// Get public posts (no auth)
export const getPublicPosts = expressAsyncHandler(async (req, res) => {
  const publicPosts = await posts.find().populate('user', 'name');
  res.status(200).json(publicPosts);
});

// Get single post by post ID (public)
export const getPostByPostId = expressAsyncHandler(async (req, res) => {
  const post = await posts
    .findById(req.params.id)
    .populate('user', 'name')
    .populate('comments.user', 'name email');

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  res.status(200).json(post);
});

// Get posts by user ID (public profile)
// export const getPostByUserId = expressAsyncHandler(async (req, res) => {
//   const userPosts = await posts.find({ user: req.params.id });
//   res.status(200).json(userPosts);
// });

export const getPostByUserId = expressAsyncHandler(async (req, res) =>
{
  const post = await posts.findById(req.params.id)

  if (!post)
    return res.status(404).json({ message: 'Post not found' });
  if (!req.user)
    return res.status(401).json({ message: 'User not found' }); // Only owner can access
  if (post.user._id.toString() !== req.user.id)
  {
    return res.status(401).json({ message: 'User not authorized' });
  }
  res.status(200).json(post);
});

/* =======================
   CREATE POST
======================= */

export const addPost = expressAsyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const post = await posts.create({
    title,
    content,
    category: category || 'Other',
    image: req.file ? req.file.path : null, // Cloudinary URL
    user: req.user.id,
    likes: [],
  });

  res.status(201).json(post);
});

/* =======================
   UPDATE POST
======================= */

export const updatedPost = expressAsyncHandler(async (req, res) => {
  const post = await posts.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;
  post.category = req.body.category || post.category;

  if (req.file) {
    post.image = req.file.path; // Cloudinary URL
  }

  const updated = await post.save();
  res.status(200).json(updated);
});

/* =======================
   DELETE POST
======================= */

export const deletePost = expressAsyncHandler(async (req, res) => {
  const post = await posts.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Data not found');
  }

  if (post.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await post.deleteOne();

  res.status(200).json({ id: req.params.id });
});

/* =======================
   LIKES
======================= */

export const toggleLike = expressAsyncHandler(async (req, res) => {
  const post = await posts.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const userId = req.user.id;

  // 🚫 BLOCK SELF-LIKE
  if (post.user.toString() === userId) {
    return res.status(403).json({
      message: 'You cannot like your own post',
    });
  }

  if (!Array.isArray(post.likes)) {
    post.likes = [];
  }

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  res.status(200).json(post);
});

// export const toggleLike = expressAsyncHandler(async (req, res) => {
//   const post = await posts.findById(req.params.id);
//   if (!post)
//     return res.status(404).json({ message: 'Post not found' });

//   const userId = req.user.id; // Fix corrupted data

//   if (!Array.isArray(post.likes))
//   {
//     post.likes = [];
//   }
//   if (post.likes.includes(userId))
//   {
//     post.likes = post.likes.filter((id) => id.toString() !== userId);
//   }
//   else {
//     post.likes.push(userId);
//   }
//   await post.save();
//   res.status(200).json(post);
// });

/* =======================
   COMMENTS
======================= */

export const addComment = expressAsyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Comment cannot be empty');
  }

  const post = await posts.findById(req.params.postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  post.comments.push({
    user: req.user.id,
    text,
  });

  await post.save();
  res.status(201).json(post.comments);
});
