import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';

export const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //Get token from the token
      token = req.headers.authorization.split(' ')[1];

      //Verify token
      const decode = jwt.verify(token, process.env.JWT_SECRET);

      //Get the user from the token
      req.user = await User.findById(decode.id).select('-password');

      next();
    } catch (error) {
      console.log(error);
      req.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized,no token');
  }
});

