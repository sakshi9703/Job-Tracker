import {
  FiX,
  FiCode,
  FiUsers,
  FiFolder,
  FiZap,
  FiChevronDown,
} from "react-icons/fi";

import "./InterviewQuestionsModal.css";

export default function InterviewQuestionsModal({
  open,
  onClose,
  questions,
}) {
  if (!open || !questions) return null;

  const sections = [
    {
      id: "technical",
      title: "Technical Questions",
      description: "Questions focused on technical skills and concepts",
      icon: FiCode,
      className: "technical",
      questions: questions.technicalQuestions || [],
    },
    {
      id: "behavioral",
      title: "Behavioral Questions",
      description: "Questions about communication, decisions and experience",
      icon: FiUsers,
      className: "behavioral",
      questions: questions.behavioralQuestions || [],
    },
    {
      id: "project",
      title: "Project Questions",
      description: "Questions about your projects and technical decisions",
      icon: FiFolder,
      className: "project",
      questions: questions.projectQuestions || [],
    },
  ];

  const totalQuestions = sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  return (
    <div className="iq-backdrop" onClick={onClose}>
      <div
        className="iq-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="iq-header">
          <div className="iq-title-wrapper">
            <div className="iq-title-icon">
              <FiZap />
            </div>

            <div>
              <p className="iq-overline">
                Interview Preparation
              </p>

              <h2>Interview Questions</h2>

              <p className="iq-subtitle">
                Questions generated from the job you're preparing for
              </p>
            </div>
          </div>

          <button
            className="iq-close-btn"
            onClick={onClose}
            aria-label="Close interview questions"
          >
            <FiX />
          </button>
        </header>

        {/* Summary */}
        <div className="iq-summary">
          <div>
            <span className="iq-summary-label">
              Questions to prepare
            </span>

            <strong>{totalQuestions}</strong>
          </div>

          <div className="iq-summary-hint">
            <FiZap />
            <span>
              Review these before your interview
            </span>
          </div>
        </div>

        {/* Sections */}
        <div className="iq-sections">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                className={`iq-section ${section.className}`}
                key={section.id}
              >
                <div className="iq-section-header">
                  <div className="iq-section-title">
                    <div className="iq-section-icon">
                      <Icon />
                    </div>

                    <div>
                      <h3>{section.title}</h3>

                      <p>{section.description}</p>
                    </div>
                  </div>

                  <span className="iq-count">
                    {section.questions.length}
                  </span>
                </div>

                {section.questions.length > 0 ? (
                  <ol className="iq-question-list">
                    {section.questions.map((question, index) => (
                      <li
                        className="iq-question"
                        key={`${section.id}-${index}`}
                      >
                        <div className="iq-question-number">
                          {index + 1}
                        </div>

                        <p>{question}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="iq-empty">
                    No questions available for this category.
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="iq-footer">
          <div className="iq-footer-tip">
            <FiZap />

            <span>
              Tip: Try answering each question aloud instead of
              reading your answers silently.
            </span>
          </div>

          <button
            className="iq-done-btn"
            onClick={onClose}
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
}