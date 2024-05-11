import mongoose, { Schema, model } from "mongoose";
import Joi from "joi";
mongoose.Schema.Types.String.cast(false);

const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: true,
    },
    token: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verifyCode: String,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const registerJoiSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
});

export const verifyEmailRepeatSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const User = model("user", userSchema);

export default User;
