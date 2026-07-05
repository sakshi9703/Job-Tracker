import { useState } from "react";
import axios from "axios";
import { notifySuccess } from "../../utils/toast";
import "./Form.css";

export default function Form({
  editingIndex,
  setEditingIndex,
  formData,
  setFormData,
  formRef,
  refreshData,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingIndex) {
        await axios.put(
          `http://localhost:3000/jobs/${editingIndex}`,
          formData,
          { withCredentials: true }
        );

        notifySuccess("Job updated successfully");
        setEditingIndex(null);
      } else {
        await axios.post(
          "http://localhost:3000/jobs",
          formData,
          { withCredentials: true }
        );

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
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="form-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div ref={formRef} className="job-form-card">
              <div className="text-center mb-4">
                <h3 className="form-title">
                  {editingIndex !== null
                    ? "Update Application"
                    : "Add New Application"}
                </h3>

                <p className="form-subtitle">
                  Track and manage your job applications
                </p>
              </div>

              <form className="row g-4" onSubmit={handleSubmit}>
                <div className="col-12 col-md-6">
                  <label className="form-label job-label">
                    Company Name
                  </label>

                  <input
                    type="text"
                    className="form-control job-input"
                    name="company"
                    placeholder="Google"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label job-label">
                    Job Role
                  </label>

                  <input
                    type="text"
                    className="form-control job-input"
                    name="role"
                    placeholder="Frontend Developer"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label job-label">
                    Status
                  </label>

                  <select
                    className="form-select job-input"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select status</option>
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label job-label">
                    Job Description
                  </label>

                  <textarea
                    className="form-control job-input"
                    name="description"
                    rows="4"
                    placeholder="Enter your Job Decription"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label job-label">
                   {formData.status === "Interested" ? "Date to Apply By" : "Date Applied"}
                  </label>
                  <input
                    type="date"
                    className="form-control job-input"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <label className="form-label job-label">
                    Location
                  </label>

                  <input
                    type="text"
                    className="form-control job-input"
                    name="location"
                    placeholder="Bengaluru"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label job-label">
                    Notes
                  </label>

                  <textarea
                    className="form-control job-input"
                    name="notes"
                    rows="4"
                    placeholder="Referral from LinkedIn, interview details, follow-up reminders..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <button
                    type="submit"
                    className="btn submit-btn w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />

                        {editingIndex !== null
                          ? "Updating..."
                          : "Adding..."}
                      </>
                    ) : editingIndex !== null ? (
                      "Update Job"
                    ) : (
                      "Add Job"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}