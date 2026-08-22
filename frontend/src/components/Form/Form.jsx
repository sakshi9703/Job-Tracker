import { useState } from "react";
import axios from "axios";
import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiFileText,
  FiEdit3,
  FiX,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";

import { notifySuccess, notifyError } from "../../utils/toast";
import "./Form.css";

const EMPTY_FORM = {
  company: "",
  role: "",
  status: "",
  description: "",
  date: "",
  location: "",
  notes: "",
};

export default function Form({
  editingIndex,
  setEditingIndex,
  formData,
  setFormData,
  formRef,
  refreshData,
  onClose,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = editingIndex !== null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setEditingIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const today = getTodayString();

    // Interested = deadline must not be in the past
    if (formData.status === "Interested" && formData.date < today) {
      notifyError("The Date to Apply By cannot be in the past.");
      return;
    }

    // Other statuses = application date cannot be in the future
    if (formData.status !== "Interested" && formData.date > today) {
      notifyError("The Date Applied cannot be in the future.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/jobs/${editingIndex}`,
          formData,
          {
            withCredentials: true,
          },
        );

        notifySuccess("Job updated successfully");
        setEditingIndex(null);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, formData, {
          withCredentials: true,
        });

        notifySuccess("Job added successfully");
      }

      await refreshData();

      setFormData({
        company: "",
        role: "",
        status: "",
        description: "",
        date: "",
        location: "",
        notes: "",
      });

      onClose?.();
    } catch (error) {
      console.error("Failed to save job:", error);

      const message =
        error.response?.data?.message ||
        (isEditing
          ? "Failed to update application."
          : "Failed to add application.");

      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayString = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleCancel = () => {
    if (isSubmitting) return;

    resetForm();
    onClose?.();
  };

  return (
    <div ref={formRef} className="job-form-card">
      {/* HEADER */}
      <div className="form-header">
        <div className="form-heading">
          <div className="form-header-icon">
            {isEditing ? <FiEdit3 /> : <FiBriefcase />}
          </div>

          <div>
            <h2 className="form-title">
              {isEditing ? "Update Application" : "Add New Application"}
            </h2>

            <p className="form-subtitle">
              {isEditing
                ? "Update the details of your application."
                : "Add a job application to your tracker."}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            className="form-close-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
            aria-label="Close form"
          >
            <FiX />
          </button>
        )}
      </div>

      {/* FORM */}

      <form className="job-form" onSubmit={handleSubmit}>
        {/* COMPANY */}

        <div className="form-field">
          <label htmlFor="company" className="job-label">
            Company Name
            <span className="required">*</span>
          </label>

          <div className="form-input-wrapper">
            <FiBriefcase className="field-icon" />

            <input
              id="company"
              type="text"
              name="company"
              className="job-input"
              placeholder="e.g. Google"
              value={formData.company}
              onChange={handleChange}
              required
              autoComplete="organization"
            />
          </div>
        </div>

        {/* ROLE */}

        <div className="form-field">
          <label htmlFor="role" className="job-label">
            Job Role
            <span className="required">*</span>
          </label>

          <div className="form-input-wrapper">
            <FiEdit3 className="field-icon" />

            <input
              id="role"
              type="text"
              name="role"
              className="job-input"
              placeholder="e.g. Frontend Developer"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* STATUS */}

        <div className="form-field">
          <label htmlFor="status" className="job-label">
            Application Status
            <span className="required">*</span>
          </label>

          <div className="form-input-wrapper form-select-wrapper">
            <FiCheck className="field-icon" />

            <select
              id="status"
              className="job-input job-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Interested">Interested</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* DATE */}

        <div className="form-field">
          <label htmlFor="date" className="job-label">
            {formData.status === "Interested"
    ? "Apply by"
    : formData.status === "Applied"
    ? "Applied on"
    : formData.status === "Interview"
    ? "Interview date"
    : formData.status === "Accepted"
    ? "Decision date"
    : formData.status === "Rejected"
    ? "Decision date"
    : "Date"}

            <span className="required">*</span>
          </label>

          <div className="form-input-wrapper">
            <FiCalendar className="field-icon" />

            <input
              id="date"
              type="date"
              className="job-input"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={
                formData.status === "Interested" ? new Date().toISOString().split("T")[0] : undefined
              }
              max={
                formData.status !== "Interested" ? new Date().toISOString().split("T")[0] : undefined
              }
              required
            />
          </div>
        </div>

        {/* LOCATION */}

        <div className="form-field">
          <label htmlFor="location" className="job-label">
            Location
            <span className="required">*</span>
          </label>

          <div className="form-input-wrapper">
            <FiMapPin className="field-icon" />

            <input
              id="location"
              type="text"
              name="location"
              className="job-input"
              placeholder="e.g. Bengaluru / Remote"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* DESCRIPTION */}

        <div className="form-field form-field-wide">
          <div className="label-row">
            <label htmlFor="description" className="job-label">
              Job Description
            </label>

            <span className="optional">Optional</span>
          </div>

          <div className="textarea-wrapper">
            <FiFileText className="field-icon textarea-icon" />

            <textarea
              id="description"
              name="description"
              className="job-input job-textarea"
              rows="4"
              placeholder="Paste the job description here. This helps the AI features analyze the role."
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* NOTES */}

        <div className="form-field form-field-wide">
          <div className="label-row">
            <label htmlFor="notes" className="job-label">
              Notes
            </label>

            <span className="optional">Optional</span>
          </div>

          <div className="textarea-wrapper">
            <FiEdit3 className="field-icon textarea-icon" />

            <textarea
              id="notes"
              name="notes"
              className="job-input job-textarea"
              rows="4"
              placeholder="Referral details, interview notes, follow-up reminders..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <FiX />
            Cancel
          </button>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="form-spinner" />

                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <FiCheck />

                {isEditing ? "Update Application" : "Add Application"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
