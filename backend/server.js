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
import aiRoutes from "./routes/ai.js";
import profileRoutes from "./Routes/ProfileRoute.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/jobs", userVerification);
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
  const user = await User.findById(req.userId);

  res.json({
    success: true,
  message: "Login successful",
  user: user.username,
  });
  
});

app.post("/jobs", validate(jobSchema), async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, userId: req.userId });

    await newJob.save();

    res.status(201).json(newJob);
  } catch (err) {
    console.log(err);
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

    // Update description timestamp only if description changed
    if (
      req.body.description &&
      job.description !== req.body.description
    ) {
      job.descriptionUpdatedAt = new Date();
    }

    // Update other fields
    Object.assign(job, req.body);

    await job.save();

    res.status(200).json(job);
  } catch (err) {
    console.log(err);

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
      interested
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
    const sortOption = {
      date: sort === "oldest" ? 1 : -1,
    };

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

  const hasQuestions =
    !!job.interviewQuestions?.generatedAt;

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

    const jobsWithGenratedQuestions = jobs.map((job) =>{
      const hasQuestions =
  !!job.interviewQuestions?.generatedAt;

const needsQuestionRegeneration =
  !hasQuestions ||
  (user.resumeUpdatedAt &&
    job.interviewQuestions.generatedAt < user.resumeUpdatedAt) ||
  (job.descriptionUpdatedAt &&
    job.interviewQuestions.generatedAt < job.descriptionUpdatedAt);

return {
  ...job.toObject(),
  hasQuestions,
  needsQuestionRegeneration,
};
    })
    res.status(200).json(jobsWithAnalysisStatus, jobsWithGenratedQuestions);
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

const PORT = 3000;

app.listen(PORT, () => {
  console.log("listening to port", PORT);
});
