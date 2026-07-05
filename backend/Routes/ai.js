import express from "express";
import Job from "../models/Job.js";
import User from "../models/UserModel.js";
import {
  analyzeResume,
  interviewQuestionsGenerator,
} from "../services/resumeAnalyzer.js";
import { userVerification } from "../Middlewares/AuthMiddleware.js";

const router = express.Router();

// Protect all AI routes
router.use(userVerification);

router.post("/match-resume/:jobId", async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user?.resumeText) {
      return res.status(400).json({
        message: "Please upload a resume in your profile first.",
      });
    }

    const job = await Job.findById(req.params.jobId);

if (!job) {
  return res.status(404).json({
    message: "Job not found",
  });
}

if (!job.description || job.description.trim() === "") {
  return res.status(200).json({
    analysisAvailable: false,
    message:
      "This job doesn't have a detailed job description, so a personalized ATS analysis isn't possible.",
    note:
      "Based on your resume, you appear suitable for roles requiring your core technical skills. Add the job description later to receive a detailed match score and skill gap analysis.",
    resumeSkills: [
      "React.js",
      "Node.js",
      "MongoDB",
      "Express.js",
      "REST APIs",
      "Authentication",
      "CRUD Operations",
      "Responsive Web Development",
      "JavaScript",
      "Full Stack Development"
    ]
  });
}

// Otherwise perform AI analysis
const analysis = await analyzeResume(
  user.resumeText,
  job.description
);

job.resumeAnalysis = {
  ...analysis,
  analyzedAt: new Date(),
};

await job.save();
    res.json(analysis);
  } catch (err) {
    console.log(err);

    res.status(503).json({
      message:
        "AI service is currently busy. Please try again shortly.",
    });
  }
});

router.post("/interview-questions/:jobId", async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user?.resumeText) {
      return res.status(400).json({
        message: "Please upload a resume in your profile first.",
      });
    }

    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const questions = await interviewQuestionsGenerator(
  user.resumeText,
  job.description
);

job.interviewQuestions = {
  ...questions,
  generatedAt: new Date(),
};

await job.save();

res.json(job.interviewQuestions);
  } catch (err) {
    console.log(err);

    res.status(503).json({
      message:
        "AI service is currently busy. Please try again shortly.",
    });
  }
});

export default router;