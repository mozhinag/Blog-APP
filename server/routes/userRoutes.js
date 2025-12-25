import express from "express";
import { registerUser, loginUser, getMe } from '../controller/userController.js'
import {protect} from '../middlewares/authMiddleware.js';

const router = express.Router();


router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
