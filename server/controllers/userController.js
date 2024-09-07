import { CAE } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import bcrypt from "bcrypt";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";

export const register = CAE(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password)
    return next(new ErrorHandler("Please enter all fields", 400));

  // Check if the user already exists
  const isUser = await User.findOne({ email });
  if (isUser) return next(new ErrorHandler("User is Already Exist.", 401));

  // Hash the password
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  // Create a new user instance
  const newUser = new User({
    name,
    email,
    password: hashPassword,
    avatar: {
      public_id: "temp",
      url: "temp",
    },
  });

  // Save the user
  const user = await newUser.save();

  // Convert user to a plain object and delete the password field
  const userObj = user.toObject();
  delete userObj.password;

  // Send the token with the response
  sendToken(res, userObj, "Registered successfully", 201);
});

export const login = CAE(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if all required fields are provided
  if (!email || !password)
    return next(new ErrorHandler("Please enter all fields", 400));

  // Find the user by email
  const user = await User.findOne({ email });

  // Check if the user exists
  if (!user) return next(new ErrorHandler("Email or Password is Wrong.", 401));

  // Compare the entered password with the hashed password in the database
  const isMatched = await bcrypt.compare(password, user.password);

  // If the password doesn't match, return an error
  if (!isMatched)
    return next(new ErrorHandler("Email or Password is Wrong.", 401));

  // Convert user to a plain object and delete the password field
  const userObj = user.toObject();
  delete userObj.password;

  // Send the token with the response
  sendToken(res, userObj, `Welcome ${user.name}`, 201);
});

export const logout = CAE(async (req, res) => {
  res
    .status(200)
    .cookie("ED_TOKEN", null, { expires: new Date(Date.now()) })
    .json({
      success: true,
      message: "loged out successfully",
    });
});

export const getMyProfile = CAE(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Convert user to a plain object and delete the password field
  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({ success: true, user });
});

//To change the password

export const changePassword = CAE(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("please enter all fields", 400));

  const user = await User.findById(req.user._id);

  const isMatched = await bcrypt.compare(oldPassword, user.password);

  if (!isMatched)
    return next(new ErrorHandler("old password is incorrexct", 401));

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashPassword;

  await user.save();

  res.status(200).json({ success: true, message: "password is updated" });
});

export const updateProfile = CAE(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;

  if (email) user.email = email;

  await user.save();

  res.status(200).json({ success: true, message: "profile is updated" });
});

//todo
export const updateProfilePicture = CAE(async (req, res, next) => {
  try {
    // Ensure file is provided
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const file = req.file;
    const fileUri = getDataUri(file);

    // Upload to Cloudinary
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "EdMachine",
    });

    // Remove old avatar from Cloudinary if not temporary
    if (user?.avatar?.public_id !== "temp") {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    }

    // Update user profile with new avatar
    user.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture is updated",
    });
  } catch (error) {
    next(error);
  }
});

export const forgetPassword = CAE(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!email) return next(new ErrorHandler("no user with this email", 404));

  const resetToken = user.getResetToken();

  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  const text = `click on the link to reset your password.\n ${url} \n if not requested dont open`;

  sendEmail(user.email, "reset password", text);

  res
    .status(200)
    .json({ success: true, message: "reset token is send to email" });
});

export const resetPassword = CAE(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("token is invalid or expired"));

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  user.save();

  res
    .status(200)
    .json({ success: true, message: "password change success fully" });
});

export const addToPlaylist = CAE(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandler("course id not found", 404));

  const itemExists = await user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) return true;
  });

  if (itemExists) return next(new ErrorHandler("course already exists", 409));

  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });

  await user.save();

  res.status(200).json({ success: true, message: "added to playlist" });
});

export const removeFromPlaylist = CAE(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.body.id);

  if (!course) return next(new ErrorHandler("course id not found", 404));

  const itemExists = await user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) return true;
  });

  if (!itemExists) return next(new ErrorHandler("course does not exists", 409));

  const newPlaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) return item;
  });

  user.playlist = newPlaylist;

  await user.save();

  res
    .status(200)
    .json({ success: true, message: "course deleted from playlist" });
});

// admin controller
export const getAllUser = CAE(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ success: true, message: "all users data", users });
});

export const updateUserRole = CAE(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  if (user.role === "user") {
    user.role = "admin";
  } else {
    user.role = "user";
  }

  user.save();

  res.status(200).json({ success: true, message: "role is updated" });
});

export const deleteUser = CAE(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  //cancle subscription;

  await user.remove;

  res
    .status(200)
    .json({ success: true, message: "user is deleted successfully" });
});
