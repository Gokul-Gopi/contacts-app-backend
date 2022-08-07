const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

//database schemas
const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, "User firstname required"],
  },
  lastname: {
    type: String,
    required: [true, "User lastname  required"],
  },
  mobile: {
    type: Number,
    required: [true, "User phone number required"],
  },
});

const messageSchema = new Schema({
  message: {
    type: String,
    trim: true,
    required: [true, "Message required"],
    minLength: [6, "Message needs to be atleast 6 characters long"],
    maxLength: [100, "Message cannot exceed 100 characters"],
  },
  otp: {
    type: String,
    required: [true, "Message required"],
    minLength: [6, "OTP needs to be atleast 6 digits long"],
    maxLength: [6, "OTP cannot exceed 6 digits"],
  },

  user: userSchema,
  date: { type: Date, default: Date.now },
});

//validation schemas for request body
const sendMesageBodySchema = Joi.object({
  message: Joi.string().min(6).max(100).required(),
  otp: Joi.string().min(6).max(6).required(),
  mobile: Joi.number().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
});

const Message = mongoose.model("Message", messageSchema);
module.exports = { Message, sendMesageBodySchema };
