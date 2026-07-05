import "./AILoadingModal.css";

export default function AILoadingModal({
  open,
  title = "AI is working...",
}) {
  if (!open) return null;

  return (
    <div className="ai-loading-overlay">
      <div className="ai-loading-modal">

        <h2>{title}</h2>

        <p>Analyzing your resume...</p>

        <div className="progress-row">
            <span>Comparing Skills</span>
            <div className="loading-bar">
                <div className="loading-fill fill1"></div>
            </div>
        </div>

        <div className="progress-row">
            <span>Matching Experience</span>
            <div className="loading-bar">
                <div className="loading-fill fill2"></div>
            </div>
        </div>

        <div className="progress-row">
            <span>Evaluating Education</span>
            <div className="loading-bar">
                <div className="loading-fill fill3"></div>
            </div>
        </div>

        <div className="progress-row">
            <span>Generating Suggestions</span>
            <div className="loading-bar">
                <div className="loading-fill fill4"></div>
            </div>
        </div>

        <p className="loading-note">
            This usually takes 5–15 seconds.
        </p>

    </div>
</div>
  );
}