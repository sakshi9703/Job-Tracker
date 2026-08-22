import {
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
  FiZap,
  FiFileText,
} from "react-icons/fi";

import "./ResumeAnalysisModal.css";

export default function ResumeAnalysisModal({
  open,
  onClose,
  analysis,
}) {
  if (!open || !analysis) return null;

  const score = Number(analysis.score) || 0;

  const scoreColor =
    score >= 80
      ? "#16a34a"
      : score >= 60
      ? "#d97706"
      : "#dc2626";

  const scoreLabel =
    score >= 80
      ? "Excellent Match"
      : score >= 60
      ? "Good Match"
      : "Needs Improvement";

  // No job description case
  if (analysis.analysisAvailable === false) {
    return (
      <div className="analysis-overlay" onClick={onClose}>
        <div
          className="analysis-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="analysis-header">
            <div className="analysis-title-wrapper">
              <div className="analysis-title-icon warning-icon">
                <FiAlertCircle />
              </div>

              <div>
                <p className="analysis-overline">
                  Resume Analysis
                </p>

                <h2>Unable to Analyze Resume</h2>
              </div>
            </div>

            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX />
            </button>
          </div>

          <div className="analysis-message">
            <p>{analysis.message}</p>

            {analysis.note && <p>{analysis.note}</p>}
          </div>

          <div className="analysis-block">
            <div className="block-heading">
              <div className="block-icon blue-icon">
                <FiFileText />
              </div>

              <div>
                <h3>Skills Found in Your Resume</h3>
                <p>
                  Skills extracted from your uploaded resume
                </p>
              </div>
            </div>

            <div className="skill-list">
              {(analysis.resumeSkills || []).length > 0 ? (
                analysis.resumeSkills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))
              ) : (
                <span className="empty-analysis">
                  No skills found.
                </span>
              )}
            </div>
          </div>

          <button
            className="analysis-close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-overlay" onClick={onClose}>
      <div
        className="analysis-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="analysis-header">
          <div className="analysis-title-wrapper">
            <div className="analysis-title-icon ai-icon">
              <FiZap />
            </div>

            <div>
              <p className="analysis-overline">
                AI Resume Analysis
              </p>

              <h2>Resume Match Analysis</h2>

              <p className="analysis-subtitle">
                How well your resume matches this job description
              </p>
            </div>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {/* Score */}
        <div className="score-section">
          <div
            className="score-circle"
            style={{
              "--score": `${score * 3.6}deg`,
              "--score-color": scoreColor,
            }}
          >
            <div className="score-circle-inner">
              <span className="score-value">
                {score}%
              </span>

              <span className="score-label">
                Match
              </span>
            </div>
          </div>

          <div
            className="score-result"
            style={{ color: scoreColor }}
          >
            {score >= 80 ? (
              <FiCheckCircle />
            ) : score >= 60 ? (
              <FiZap />
            ) : (
              <FiAlertCircle />
            )}

            <span>{scoreLabel}</span>
          </div>

          <p className="score-description">
            Your resume matches approximately {score}% of
            the requirements identified in this job description.
          </p>
        </div>

        {/* Matching + Missing Skills */}
        <div className="analysis-grid">
          <div className="analysis-block matching-block">
            <div className="block-heading">
              <div className="block-icon success-icon">
                <FiCheckCircle />
              </div>

              <div>
                <h3>Matching Skills</h3>
                <p>Skills already present in your resume</p>
              </div>
            </div>

            <div className="skill-list">
              {(analysis.matchingSkills || []).length > 0 ? (
                analysis.matchingSkills.map((skill) => (
                  <span
                    className="skill-tag skill-success"
                    key={skill}
                  >
                    <FiCheckCircle />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="empty-analysis">
                  No matching skills found.
                </span>
              )}
            </div>
          </div>

          <div className="analysis-block missing-block">
            <div className="block-heading">
              <div className="block-icon danger-icon">
                <FiAlertCircle />
              </div>

              <div>
                <h3>Missing Skills</h3>
                <p>Skills you may need to improve or add</p>
              </div>
            </div>

            <div className="skill-list">
              {(analysis.missingSkills || []).length > 0 ? (
                analysis.missingSkills.map((skill) => (
                  <span
                    className="skill-tag skill-danger"
                    key={skill}
                  >
                    <FiAlertCircle />
                    {skill}
                  </span>
                ))
              ) : (
                <span className="empty-analysis">
                  No major missing skills identified.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Strengths */}
        <div className="analysis-block">
          <div className="block-heading">
            <div className="block-icon star-icon">
              <FiStar />
            </div>

            <div>
              <h3>Strengths</h3>
              <p>What makes your resume relevant to this role</p>
            </div>
          </div>

          <ul className="analysis-list">
            {(analysis.strengths || []).length > 0 ? (
              analysis.strengths.map((item) => (
                <li key={item}>
                  <span className="list-bullet success-bullet">
                    <FiCheckCircle />
                  </span>

                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="empty-analysis">
                No strengths identified.
              </li>
            )}
          </ul>
        </div>

        {/* Suggestions */}
        <div className="analysis-block suggestions-block">
          <div className="block-heading">
            <div className="block-icon suggestion-icon">
              <FiZap />
            </div>

            <div>
              <h3>Suggestions</h3>
              <p>Ways to improve your resume for this role</p>
            </div>
          </div>

          <ul className="analysis-list">
            {(analysis.suggestions || []).length > 0 ? (
              analysis.suggestions.map((item) => (
                <li key={item}>
                  <span className="list-bullet suggestion-bullet">
                    <FiZap />
                  </span>

                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="empty-analysis">
                No additional suggestions.
              </li>
            )}
          </ul>
        </div>

        <button
          className="analysis-close-btn"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}