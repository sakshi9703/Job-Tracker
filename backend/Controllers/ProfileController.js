import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Job from "../models/Job.js";
import { parseResume } from "../services/resumeParser.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    const totalApplications = await Job.countDocuments({
      userId: req.userId,
    });

    res.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      totalApplications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { username: username.trim() },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

   user.password = newPassword;
await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const resumeText = await parseResume(req.file.path);

    await User.findByIdAndUpdate(req.userId, {
  resumeText,
  resumeFileName: req.file.originalname,
  resumeUpdatedAt: new Date(),
});

    res.json({
      message: "Resume uploaded successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      resumeFileName: user.resumeFileName,
      hasResume: !!user.resumeText,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      resumeText: "",
      resumeFileName: "",
    });

    res.json({
      message: "Resume deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};