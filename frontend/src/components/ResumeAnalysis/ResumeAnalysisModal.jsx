import "./ResumeAnalysisModal.css";

export default function ResumeAnalysisModal({
  open,
  onClose,
  analysis,
}) {
  if (!open || !analysis) return null;

  // Special case: no job description
  if (analysis.analysisAvailable === false) {
    return (
      <div className="analysis-overlay">
        <div className="analysis-modal">
          <div className="analysis-header">
            <h2>Unable to Analyze Resume</h2>

            <button
              className="close-btn"
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          <p>{analysis.message}</p>

          <p>{analysis.note}</p>

          <div className="analysis-block">
            <h3>Skills Found in Your Resume</h3>

            <ul>
              {(analysis.resumeSkills || []).map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
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

  const scoreColor =
    analysis.score >= 80
      ? "#22c55e"
      : analysis.score >= 60
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="analysis-overlay">
      <div className="analysis-modal">
        <div className="analysis-header">
          <h2>Resume Match Analysis</h2>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="score-section">
          <div
            className="score-circle"
            style={{ borderColor: scoreColor }}
          >
            <span>{analysis.score}%</span>
          </div>

          <p
            style={{
              color: scoreColor,
              fontWeight: "bold",
            }}
          >
            {analysis.score >= 80
              ? "Excellent Match"
              : analysis.score >= 60
              ? "Good Match"
              : "Needs Improvement"}
          </p>
        </div>

        <div className="analysis-block">
          <h3>✓ Matching Skills</h3>

          <ul>
            {(analysis.matchingSkills || []).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-block">
          <h3>⚠ Missing Skills</h3>

          <ul>
            {(analysis.missingSkills || []).map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-block">
          <h3>⭐ Strengths</h3>

          <ul>
            {(analysis.strengths || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-block">
          <h3>💡 Suggestions</h3>

          <ul>
            {(analysis.suggestions || []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
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