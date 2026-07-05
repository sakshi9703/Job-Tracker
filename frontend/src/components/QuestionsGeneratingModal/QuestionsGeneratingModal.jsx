import "./QuestionsGeneratingModal.css";

export default function QuestionsGeneratingModal({
  open,
  title = "AI is working...",
}) {
  if (!open) return null;

  return (
    <div className="ai-loading-overlay">
      <div className="ai-loading-modal">

        <h2>{title}</h2>

        <p>Generating Questions...</p>

        <div className="progress-row">
            <span>Technical Questions</span>
            <div className="loading-bar">
                <div className="loading-fill fill1"></div>
            </div>
        </div>

        <div className="progress-row">
            <span>Behavioural Questions</span>
            <div className="loading-bar">
                <div className="loading-fill fill2"></div>
            </div>
        </div>

        <div className="progress-row">
            <span>Project Questions</span>
            <div className="loading-bar">
                <div className="loading-fill fill3"></div>
            </div>
        </div>

        <p className="loading-note">
            This usually takes 5–15 seconds.
        </p>

    </div>
</div>
  );
}