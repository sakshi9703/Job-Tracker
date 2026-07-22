import axios from "axios";
import Swal from "sweetalert2";
import {
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiBriefcase,
} from "react-icons/fi";
import "./JobList.css";
import { useState } from "react";
import ResumeAnalysisModal from "../ResumeAnalysis/ResumeAnalysisModal";
import InterviewQuestionsModal from "../InterviewQuestionsModal/InterviewQuestionsModal";
import AILoadingModal from "../AILoadingModal/AILoadingModal";
import QuestionsGeneratingModal from "../QuestionsGeneratingModal/QuestionsGeneratingModal";

export default function JobList({
  currentJobs,
  jobList,
  setFormData,
  setEditingIndex,
  jobRef,
  error,
  loading,
  refreshData,
  setShowJobModal
}) {
  const [generatingQuestions, setGeneratingQuestions] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  const [openQuestions, setOpenQuestions] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showQuestionsGeneratingModal, setShowQuestionsGeneratingModal] =
    useState(false);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete job?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      background: "#334155",
      color: "#f8fafc",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:3000/jobs/${id}`, {
        withCredentials: true,
      });

      await refreshData();

      Swal.fire({
        title: "Deleted!",
        text: "The job has been removed.",
        icon: "success",
        background: "#334155",
        color: "#f8fafc",
        confirmButtonColor: "#3b82f6",
      });
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to delete the job.",
        icon: "error",
        background: "#334155",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleEdit = (job) => {
    setFormData({
      company: job.company,
      role: job.role,
      status: job.status,
      description: job.description,
      date: new Date(job.date).toISOString().split("T")[0],
      location: job.location,
      notes: job.notes,
    });

    setEditingIndex(job._id);
    setShowJobModal(true);
  };

  const getStatusClass = (status) => {
    return status.toLowerCase();
  };

  const handleAnalyzeResume = async (jobId) => {
    setLoadingAI(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/ai/match-resume/${jobId}`,
        {},
        {
          withCredentials: true,
        },
      );
      setAnalysis(res.data);

      setShowAnalysisModal(true);

      await refreshData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateInterviewQuestions = async (jobId) => {
    try {
      setGeneratingQuestions(jobId);
      setShowQuestionsGeneratingModal(true);

      const res = await axios.post(
        `http://localhost:3000/ai/interview-questions/${jobId}`,
        {},
        {
          withCredentials: true,
        },
      );
      setQuestions(res.data);
      setOpenQuestions(true);
      setGeneratingQuestions(null);
      setShowQuestionsGeneratingModal(false);
      await refreshData();
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container py-4" ref={jobRef}>
      {loading && (
        <div className="empty-state">
          <h4>Loading jobs...</h4>
        </div>
      )}

      {error && (
        <div className="empty-state">
          <p className="text-danger">{error}</p>
        </div>
      )}

      {!loading && jobList.length === 0 && (
        <div className="empty-card">
          <FiBriefcase className="empty-icon" />

          <h3>No jobs found</h3>

          <p>Start tracking your applications by adding your first job.</p>
        </div>
      )}

      <div className="job-grid">
        {currentJobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <div>
                <h4>{job.role}</h4>
                <p>{job.company}</p>
              </div>

              <span className={`status-badge ${getStatusClass(job.status)}`}>
                {job.status}
              </span>
            </div>

            {job.description && (
              <div className="job-notes">{job.description}</div>
            )}

            <div className="job-meta">
              <div>
                <FiCalendar />
                <span>{new Date(job.date).toLocaleDateString("en-CA")}</span>
              </div>

              <div>
                <FiMapPin />
                <span>{job.location}</span>
              </div>
            </div>

            {job.notes && <div className="job-notes">{job.notes}</div>}

            {job.resumeAnalysis?.score != null && (
              <div className="mt-4">
                <span
                  className={`analysis-complete ${
                    job.resumeAnalysis.score >= 70
                      ? "high-match"
                      : job.resumeAnalysis.score >= 50
                        ? "medium-match"
                        : "low-match"
                  }`}
                >
                  {job.resumeAnalysis.score}% Match
                </span>
              </div>
            )}

            <div
              className={`job-actions ${
                job.status === "Applied" ? "single-ai-action" : ""
              }`}
            >
              <button
                className="action-btn edit-btn"
                onClick={() => handleEdit(job)}
              >
                <FiEdit2 />
                Edit
              </button>

              <button
                className="action-btn delete-btn"
                onClick={() => handleDelete(job._id)}
              >
                <FiTrash2 />
                Delete
              </button>

              {["Interested", "Applied", "Interview"].includes(job.status) && (
                <>
                  {!job.hasQuestions ? (
                    <button
                      className="action-btn interview-btn"
                      onClick={() => handleGenerateInterviewQuestions(job._id)}
                      disabled={
                        generatingQuestions === job._id ||
                        showQuestionsGeneratingModal
                      }
                    >
                      Generate Interview Questions
                    </button>
                  ) : job.needsQuestionRegeneration ? (
                    <button
                      className="action-btn interview-btn"
                      onClick={() => handleGenerateInterviewQuestions(job._id)}
                      disabled={
                        generatingQuestions === job._id ||
                        showQuestionsGeneratingModal
                      }
                    >
                      Generate Questions Again
                    </button>
                  ) : (
                    <button
                      className="action-btn interview-btn"
                      onClick={() => {
                        setQuestions(job.interviewQuestions);
                        setOpenQuestions(true);
                      }}
                    >
                      View Generated Questions
                    </button>
                  )}
                </>
              )}

              {job.status === "Interested" && (
                <>
                  {!job.hasAnalysis ? (
                    <button
                      className="action-btn resume-btn"
                      onClick={() => handleAnalyzeResume(job._id)}
                      disabled={loadingAI}
                    >
                      Analyze Resume
                    </button>
                  ) : job.needsReanalysis ? (
                    <button
                      className="action-btn resume-btn"
                      onClick={() => handleAnalyzeResume(job._id)}
                      disabled={loadingAI}
                    >
                      Analyze Again
                    </button>
                  ) : (
                    <button
                      className="action-btn resume-btn"
                      onClick={() => {
                        setAnalysis(job.resumeAnalysis);
                        setShowAnalysisModal(true);
                      }}
                    >
                      View Analysis
                    </button>
                  )}
                </>
              )}
            </div>

            {job.status === "Interested" && (
              <div className="analysis-info">
                {job.resumeAnalysis?.analyzedAt && (
                  <p className="analysis-date">
                    Last analyzed{" "}
                    {new Date(
                      job.resumeAnalysis.analyzedAt,
                    ).toLocaleDateString()}
                  </p>
                )}

                {job.hasAnalysis && job.needsReanalysis && (
                  <p className="analysis-warning">
                    ⚠️ Resume or job description changed. Please analyze again.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <ResumeAnalysisModal
        open={showAnalysisModal}
        analysis={analysis}
        onClose={() => setShowAnalysisModal(false)}
      />
      <InterviewQuestionsModal
        open={openQuestions}
        onClose={() => setOpenQuestions(false)}
        questions={questions}
      />
      <QuestionsGeneratingModal open={showQuestionsGeneratingModal} />
      <AILoadingModal open={loadingAI} title="AI is analyzing your resume..." />
    </div>
  );
}
