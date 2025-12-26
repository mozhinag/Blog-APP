import express from 'express';
import {
  getAllPost,
  getMyPosts,
  addPost,
  getPostByUserId,
  updatedPost,
  deletePost,
  getPublicPosts,
  toggleLike,
  addComment,
  getPostByPostId,
} from '../controller/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// PUBLIC POSTS
router.get('/public', getPublicPosts);
router.get('/public/:id', getPostByPostId);

// PRIVATE POSTS
router.get('/', protect, getAllPost);
router.get('/my', protect, getMyPosts);

// CREATE & UPDATE WITH CLOUDINARY
router.post('/', protect, upload.single('image'), addPost);
router.put('/:id', protect, upload.single('image'), updatedPost);

// LIKE & COMMENT
router.put('/:id/like', protect, toggleLike);
router.post('/:postId/comments', protect, addComment);

// SINGLE POST
router.get('/:id', protect, getPostByUserId);
router.delete('/:id', protect, deletePost);

export default router;
