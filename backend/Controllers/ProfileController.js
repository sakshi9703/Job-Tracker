import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import Job from "../models/Job.js";
import { parseResume } from "../Services/resumeParser.js";
import cloudinary from "../Services/cloudinary.js";
import uploadToCloudinary from "../util/uploadToCloudinary.js";
import { Readable } from "node:stream";

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
      { new: true },
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

    const isMatch = await bcrypt.compare(currentPassword, user.password);

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

    const resumeText = await parseResume(req.file);

    const user = await User.findById(req.userId);

    // Delete previous resume if it exists
    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, {
        resource_type: "raw",
      });
    }

    // Upload new resume
    const cloudinaryResult = await uploadToCloudinary(
      req.file.buffer,
      `users/${req.userId}`,
      "resume",
    );

    // Update database
    await User.findByIdAndUpdate(req.userId, {
      resumeText,
      resumeFileName: req.file.originalname,
      resumeUrl: cloudinaryResult.secure_url,
      resumePublicId: cloudinaryResult.public_id,
      resumeUpdatedAt: new Date(),
    });

    res.json({
      message: "Resume uploaded successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.resumeUrl) {
      return res.json({ hasResume: false });
    }

    res.json({
      hasResume: true,
      resumeFileName: user.resumeFileName,
      resumeUpdatedAt: user.resumeUpdatedAt,
      resumeUrl: user.resumeUrl,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "resumeUrl resumeFileName",
    );

    if (!user?.resumeUrl) {
      return res.status(404).json({ message: "No resume uploaded" });
    }

    const response = await fetch(user.resumeUrl);
    if (!response.ok || !response.body) {
      throw new Error("Unable to retrieve resume from storage");
    }

    const fileName = (user.resumeFileName || "resume").replace(/[\\\r\n\"]/g, "_");
    const contentType = response.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`);
    res.setHeader("X-Content-Type-Options", "nosniff");

    Readable.fromWeb(response.body).pipe(res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to download resume" });
    }
  }
};

export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, {
        resource_type: "raw",
      });
    }

    await User.findByIdAndUpdate(req.userId, {
      $unset: {
        resumeUrl: 1,
        resumePublicId: 1,
        resumeFileName: 1,
        resumeText: 1,
        resumeUpdatedAt: 1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};
