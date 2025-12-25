import posts from '../models/postModel.js';
import expressAsyncHandler from 'express-async-handler';


// Get all posts (private)
export const getAllPost = expressAsyncHandler(async (req, res) => {
  console.log('Logged in user:', req.user.id);
  const allPosts = await posts.find({ user: req.user.id });
  res.status(200).json(allPosts);
  console.log('Posts found:', allPosts.length);
});

//get my posts
export const getMyPosts = async (req, res) => {
  const myPosts = await posts.find({ user: req.user.id });
  res.status(200).json(myPosts);
};

// Get public posts (no auth)
export const getPublicPosts = expressAsyncHandler(async (req, res) => {
  const publicPosts = await posts.find();
  res.status(200).json(publicPosts);
});

// ADD POST
export const addPost = expressAsyncHandler(async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(404).json({
        success: false,
        message: 'Request Body is missing',
      });
    }

   const post = await posts.create({
  ...req.body,
  user: req.user.id,
  image: req.file ? req.file.filename : null,
  category: req.body.category || 'Other',
 likes: [],


});


    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});
//GET POST BY POST ID (no auth )
export const getPostByPostId = async (req, res) => {
  const post = await posts
    .findById(req.params.id)
    .populate('user', 'name')
    .populate('comments.user', 'name email');

  if (!post) return res.status(404).json({ message: 'Post not found' });

   res.status(200).json(post);
};

export const getPostByUserId = expressAsyncHandler(async (req, res) => {
  const post = await posts
    .findById(req.params.id)
    

  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (!req.user) return res.status(401).json({ message: 'User not found' });

  // Only owner can access
  if (post.user._id.toString() !== req.user.id) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  res.status(200).json(post);
});

// UPDATE POST
export const updatedPost = expressAsyncHandler(async (req, res, next) => {
  try {
    if (!req.body && !req.file) {
      return res
        .status(400)
        .json({ success: false, error: 'No fields provided for update' });
    }

    const post = await posts.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: 'Data not found' });

    if (!req.user) return res.status(401).json({ message: 'User not found' });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'User not authorized' });

    const updateData = {
      title: req.body.title || post.title,
      image: req.file ? req.file.filename : post.image,
      content: req.body.content || post.content,
      category: req.body.category || post.category, // <-- NEW
      likes: req.body.likes !== undefined ? req.body.likes : post.likes, // <-- NEW
    };

    const updatedPost = await posts.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE POST
export const deletePost = expressAsyncHandler(async (req, res, next) => {
  try {
    const post = await posts.findById(req.params.id);

    if (!post) throw new Error('Data not found');

    if (!req.user) throw new Error('User not found');

    if (post.user.toString() !== req.user.id)
      throw new Error('User not authorized');

    await posts.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    next(error);
  }
});
export const toggleLike = expressAsyncHandler(async (req, res) => {
  const post = await posts.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const userId = req.user.id;

  // Fix corrupted data
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


// Add a comment to a post
export const addComment = expressAsyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text)
    return res.status(400).json({ message: 'Comment cannot be empty' });

  const post = await posts.findById(postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = {
    user: req.user.id,
    text,
  };

  post.comments.push(comment);
  await post.save();

  res.status(201).json(post.comments);
});
