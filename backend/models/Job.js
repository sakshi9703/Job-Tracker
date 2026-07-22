import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  descriptionUpdatedAt: {
  type: Date,
  default: Date.now,
},
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resumeAnalysis: {
    score: Number,
    matchingSkills: [String],
    missingSkills: [String],
    strengths: [String],
    suggestions: [String],
    analyzedAt: Date,
  },
interviewQuestions: {
  technicalQuestions: [String],
  behavioralQuestions: [String],
  projectQuestions: [String],
  generatedAt: Date,
}},
{
    timestamps: true,
  });

jobSchema.index({ userId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ company: "text" });
jobSchema.index({ role: "text" });

const Job = mongoose.model("Job", jobSchema);
export default Job;
