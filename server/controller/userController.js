import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken'

//@DISC Register
//ROUTER post'/api/'
//ACCESS public

export const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;


  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  //   res.send('register-user');

  // check if email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user ID');
  }
});

//@DISC Login
//ROUTER post'/api/login'
//ACCESS public

export const loginUser = expressAsyncHandler(async (req, res) => {
  // res.send('register-user');

  const { email, password } = req.body;

  //Check for the user email

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user ID');
  }
});

//@DISC Register
//ROUTER post'/api/me'
//ACCESS private

export const getMe = expressAsyncHandler(async (req, res) => {


  res.status(200).json(
   req.user
  );
});

//Generet JWT token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}
