import { FiCpu } from "react-icons/fi";
import "./AILoadingModal.css";

export default function AILoadingModal({
  open,
  title = "AI is working...",
}) {
  if (!open) return null;

  return (
    <div
      className="ai-loading-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-loading-title"
    >
      <div className="ai-loading-modal">
        {/* Header */}
        <div className="ai-loading-header">
          <div className="ai-loading-icon">
            <FiCpu />
          </div>

          <div>
            <h2 id="ai-loading-title">{title}</h2>
            <p>Analyzing your resume and preparing insights.</p>
          </div>
        </div>

        {/* Progress */}
        <div className="ai-progress-list">

          <div className="ai-progress-row">
            <div className="ai-progress-label">
              <span>Comparing Skills</span>
              <span className="ai-progress-status">Processing</span>
            </div>

            <div className="ai-loading-bar">
              <div className="ai-loading-fill fill-1" />
            </div>
          </div>

          <div className="ai-progress-row">
            <div className="ai-progress-label">
              <span>Matching Experience</span>
              <span className="ai-progress-status">Processing</span>
            </div>

            <div className="ai-loading-bar">
              <div className="ai-loading-fill fill-2" />
            </div>
          </div>

          <div className="ai-progress-row">
            <div className="ai-progress-label">
              <span>Evaluating Education</span>
              <span className="ai-progress-status">Processing</span>
            </div>

            <div className="ai-loading-bar">
              <div className="ai-loading-fill fill-3" />
            </div>
          </div>

          <div className="ai-progress-row">
            <div className="ai-progress-label">
              <span>Generating Suggestions</span>
              <span className="ai-progress-status">Processing</span>
            </div>

            <div className="ai-loading-bar">
              <div className="ai-loading-fill fill-4" />
            </div>
          </div>

        </div>

        <div className="ai-loading-note">
          This usually takes 5–15 seconds.
        </div>
      </div>
    </div>
  );
}