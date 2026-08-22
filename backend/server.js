import express from "express";
import mongoose from "mongoose";
import Job from "./models/Job.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./Routes/AuthRoute.js";
import { userVerification } from "./Middlewares/AuthMiddleware.js";
import User from "./models/UserModel.js";
import { jobSchema } from "./Validations/jobValidation.js";
import { validate } from "./Middlewares/Validate.js";
import aiRoutes from "./Routes/ai.js";
import profileRoutes from "./Routes/ProfileRoute.js";
import path from "path";
import cloudinary from "./Services/cloudinary.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        origin === "http://localhost:5173" ||
        origin === "http://localhost:4173" ||
        origin.endsWith(".netlify.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/jobs", userVerification);
app.use("/uploads", express.static("uploads"));
app.use("/ai", aiRoutes);
app.use("/profile", profileRoutes);

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

main()
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("server running");
});

app.get("/verify", userVerification, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: user.username,
    });
  } catch (err) {
    console.error("Verify Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
app.post("/jobs", validate(jobSchema), async (req, res, next) => {
  try {
    const { status, date } = req.body;

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // Interested jobs must have a future date
    if (status === "Interested") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({
          success: false,
          message: "The apply-by date cannot be in the past.",
        });
      }
    }

    const newJob = new Job({
      ...req.body,
      userId: req.userId,
    });

    await newJob.save();

    res.status(201).json(newJob);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.delete("/jobs/:id", async (req, res) => {
  let id = req.params.id;
  try {
    await Job.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Job Deleted successfully" });
  } catch (err) {
    next(err);
  }
});

app.put("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const status = req.body.status ?? job.status;
    const date = req.body.date ?? job.date;

    const selectedDate = new Date(date);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    if (status === "Interested") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({
          success: false,
          message: "The apply-by date cannot be in the past.",
        });
      }
    }

    // Update description timestamp only if description changed
    if (
      req.body.description !== undefined &&
      job.description !== req.body.description
    ) {
      job.descriptionUpdatedAt = new Date();
    }

    Object.assign(job, req.body);

    await job.save();

    res.status(200).json(job);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to update job",
    });
  }
});

app.get("/jobs/stats", async (req, res) => {
  try {
    const jobs = await Job.find({
      userId: req.userId,
    });

    const interested = jobs.filter((job) => job.status === "Interested").length;

    const applied = jobs.filter((job) => job.status === "Applied").length;

    const interview = jobs.filter((job) => job.status === "Interview").length;

    const accepted = jobs.filter((job) => job.status === "Accepted").length;

    const rejected = jobs.filter((job) => job.status === "Rejected").length;

    res.json({
      all: jobs.length,
      applied,
      interview,
      accepted,
      rejected,
      interested,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/jobs", async (req, res) => {
  const search = req.query.search || "";
  const status = req.query.status;
  const sort = req.query.sort;

  try {
    let query = {
      userId: req.userId,
    };

    // Search
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status && status !== "All") {
      query.status = status;
    }

    // Sorting
    let sortOption = {};

    switch (sort) {
      case "recent":
        // Recently added to the tracker
        sortOption = { createdAt: -1 };
        break;

      case "oldest":
        // Oldest application date
        sortOption = { date: 1 };
        break;

      case "newest":
      default:
        // Newest application date
        sortOption = { date: -1 };
        break;
    }

    // Fetch user
    const user = await User.findById(req.userId);

    // Fetch jobs
    const jobs = await Job.find(query).sort(sortOption);

    const jobsWithStatus = jobs.map((job) => {
      const hasAnalysis =
        typeof job.resumeAnalysis?.score === "number" &&
        !!job.resumeAnalysis?.analyzedAt;

      let needsReanalysis = true;

      if (hasAnalysis) {
        needsReanalysis = false;

        if (
          user.resumeUpdatedAt &&
          job.resumeAnalysis.analyzedAt < user.resumeUpdatedAt
        ) {
          needsReanalysis = true;
        }

        if (
          job.descriptionUpdatedAt &&
          job.resumeAnalysis.analyzedAt < job.descriptionUpdatedAt
        ) {
          needsReanalysis = true;
        }
      }

      const hasQuestions = !!job.interviewQuestions?.generatedAt;

      const needsQuestionRegeneration =
        !hasQuestions ||
        (user.resumeUpdatedAt &&
          job.interviewQuestions?.generatedAt < user.resumeUpdatedAt) ||
        (job.descriptionUpdatedAt &&
          job.interviewQuestions?.generatedAt < job.descriptionUpdatedAt);

      return {
        ...job.toObject(),
        hasAnalysis,
        needsReanalysis,
        hasQuestions,
        needsQuestionRegeneration,
      };
    });

    return res.status(200).json(jobsWithStatus);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch jobs",
    });
  }
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
