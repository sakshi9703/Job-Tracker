import { FiX, FiCode, FiUsers, FiFolder } from "react-icons/fi";
import "./InterviewQuestionsModal.css";

export default function InterviewQuestionsModal({
  open,
  onClose,
  questions,
}) {
  if (!open || !questions) return null;

  return (
    <div className="iq-backdrop">
      <div className="iq-modal">

        <div className="iq-header">
          <h2>Interview Questions</h2>

          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="iq-section">
          <h3>
            <FiCode />
            Technical Questions
          </h3>

          <ol>
            {questions.technicalQuestions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ol>
        </div>

        <div className="iq-section">
          <h3>
            <FiUsers />
            Behavioral Questions
          </h3>

          <ol>
            {questions.behavioralQuestions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ol>
        </div>

        <div className="iq-section">
          <h3>
            <FiFolder />
            Project Questions
          </h3>

          <ol>
            {questions.projectQuestions.map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}