import { useRef, useState } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

export default function UploadResume({
  hasResume,
  onSuccess,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const uploadResume = async (file) => {
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

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

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to upload resume."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      uploadResume(file);
    }
  };

  return (
    <div className={`resume-upload ${hasResume ? "replace-resume" : ""}`}>
      {hasResume && (
        <div className="replace-resume-heading">
          <h4>Replace your resume</h4>
          <p>Select a new file to update your saved resume.</p>
        </div>
      )}

      <div className="file-picker">
        <label htmlFor="resume-file" className="upload-label">
          <FiUpload />
          {loading
            ? "Uploading..."
            : hasResume
              ? "Choose a new resume"
              : "Upload Resume"}
        </label>

        <input
          id="resume-file"
          type="file"
          accept=".pdf,.doc,.docx"
          hidden
          disabled={loading}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <span className="selected-file">
          {selectedFile ? selectedFile.name : "PDF, DOC, or DOCX"}
        </span>
      </div>
    </div>
  );
}
