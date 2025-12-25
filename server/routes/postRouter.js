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
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
// PUBLIC POSTS - NO TOKEN NEEDED
router.get('/public', getPublicPosts);
router.get('/public/:id', getPostByPostId);


// PRIVATE POSTS - LOGIN REQUIRED
router.get('/', protect, getAllPost);        // all posts (for admin maybe)
router.get('/my', protect, getMyPosts);      // only logged-in user's posts
router.post('/', protect, upload.single('image'), addPost);
router.put('/:id/like', protect, toggleLike);
router.post('/:postId/comments', protect, addComment);

// SINGLE POST
router.get('/:id', protect, getPostByUserId);
router.put('/:id', protect, upload.single('image'), updatedPost);
router.delete('/:id', protect, deletePost);


export default router;
