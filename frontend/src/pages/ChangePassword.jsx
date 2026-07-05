import { useState } from "react";
import axios from "axios";
import { FiLock } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ChangePassword({ onSuccess }) {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await axios.put(
        "http://localhost:3000/profile/password",
        passwords,
        { withCredentials: true }
      );

      toast.success(data.message);

      setPasswords({
        currentPassword: "",
        newPassword: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <label className="profile-label">
        Current Password
      </label>

      <div className="input-group-custom">
        <FiLock className="input-icon" />

        <input
          type="password"
          name="currentPassword"
          className="profile-input"
          value={passwords.currentPassword}
          onChange={handleChange}
          placeholder="Enter current password"
          required
        />
      </div>

      <label className="profile-label">
        New Password
      </label>

      <div className="input-group-custom">
        <FiLock className="input-icon" />

        <input
          type="password"
          name="newPassword"
          className="profile-input"
          value={passwords.newPassword}
          onChange={handleChange}
          placeholder="Enter new password"
          required
        />
      </div>

      <button
        type="submit"
        className="profile-btn"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}