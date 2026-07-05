import { useState } from "react";
import axios from "axios";
import { FiUpload, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";


export default function UploadResume({ onSuccess }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please select a PDF resume.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const { data } = await axios.post(
        "http://localhost:3000/profile/upload-resume",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);

      setResume(null);

      // Clear the file input
      e.target.reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
  console.log(err.response?.data);

  toast.error(
    err.response?.data?.message ||
    "Failed to upload resume."
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <label className="profile-label">
        Upload Resume (PDF)
      </label>

      <div className="input-group-custom">
        <FiFileText className="input-icon" />

        <input
          type="file"
          accept=".pdf"
          className="profile-input"
          onChange={handleFileChange}
          required
        />
      </div>

      <button
        type="submit"
        className="profile-btn"
        disabled={loading}
      >
        <FiUpload />

        {loading ? "Uploading..." : "Upload Resume"}
      </button>
    </form>
  );
}