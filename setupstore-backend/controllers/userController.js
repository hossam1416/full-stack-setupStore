import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  const { username, email } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.username = username || user.username;
  user.email = email || user.email;

  await user.save();

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.json({
    message: "Password updated successfully",
  });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
