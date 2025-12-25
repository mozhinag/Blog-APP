import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please add a name'],
    },
    email: {
      type: String,
      required: [true, 'please add a email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'please add a password'],
    },
  },
  {
    timestamps: true,
  }
);

export default  mongoose.model('User',userSchema)
