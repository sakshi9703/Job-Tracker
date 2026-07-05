import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiBriefcase,
  FiEdit3,
  FiLock,
  FiArrowLeft,
  FiUpload
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ChangePassword from "../ChangePassword";
import UploadResume from "../UploadResume";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");

  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showResumeForm, setShowResumeForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/profile",
          { withCredentials: true }
        );

        setProfile(data);
        setUsername(data.user.username);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const updateUsername = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        "http://localhost:3000/profile/username",
        { username },
        { withCredentials: true }
      );

      setProfile((prev) => ({
        ...prev,
        user: data.user,
      }));

      toast.success(data.message);

      setShowUsernameForm(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update username"
      );
    }
  };

  if (!profile) {
    return (
      <div className="profile-loading">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container py-4">
        <div className="profile-header-wrapper">
  <button
    className="back-btn"
    onClick={() => navigate("/")}
  >
    <FiArrowLeft />
    Back to Dashboard
  </button>

  <div className="profile-header">
    <div className="profile-avatar">
      {profile.user.username.charAt(0).toUpperCase()}
    </div>

    <div>
      <h1>Hi, {profile.user.username}!</h1>
      <p>Manage your account settings</p>
    </div>
  </div>
</div>

        <div className="profile-grid">
          {/* Account Information */}

          <div className="profile-card">
            <h3 className="section-title">
              Account Information
            </h3>

            <div className="info-list">
              <div className="info-item">
                <FiUser className="info-icon" />

                <div>
                  <span>Username</span>
                  <strong>{profile.user.username}</strong>
                </div>
              </div>

              <div className="info-item">
                <FiMail className="info-icon" />

                <div>
                  <span>Email</span>
                  <strong>{profile.user.email}</strong>
                </div>
              </div>

              <div className="info-item">
                <FiCalendar className="info-icon" />

                <div>
                  <span>Joined</span>
                  <strong>
                    {new Date(
                      profile.user.createdAt
                    ).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              <div className="info-item">
                <FiBriefcase className="info-icon" />

                <div>
                  <span>Total Applications</span>
                  <strong>
                    {profile.totalApplications}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}

          <div className="profile-card">
            <h3 className="section-title">
              Account Settings
            </h3>

            <div className="settings-actions">
              <button
                className="settings-toggle-btn"
                onClick={() => {
                  setShowUsernameForm((prev) => !prev);
                  setShowPasswordForm(false);
                }}
              >
                <FiEdit3 />

                {showUsernameForm
                  ? "Cancel"
                  : "Change Username"}
              </button>

              {showUsernameForm && (
                <form
                  className="settings-form"
                  onSubmit={updateUsername}
                >
                  <label className="profile-label">
                    New Username
                  </label>

                  <div className="input-group-custom">
                    <FiUser className="input-icon" />

                    <input
                      type="text"
                      className="profile-input"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      placeholder="Enter new username"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="profile-btn"
                  >
                    Save Username
                  </button>
                </form>
              )}

              <button
                className="settings-toggle-btn"
                onClick={() => {
                  setShowPasswordForm((prev) => !prev);
                  setShowUsernameForm(false);
                }}
              >
                <FiLock />

                {showPasswordForm
                  ? "Cancel"
                  : "Change Password"}
              </button>

              {showPasswordForm && (
                <div className="password-section">
                  <ChangePassword
                    onSuccess={() =>
                      setShowPasswordForm(false)
                    }
                  />
                </div>
              )}
              <button
  className="settings-toggle-btn"
  onClick={() => {
    setShowResumeForm((prev) => !prev);
    setShowUsernameForm(false);
    setShowPasswordForm(false);
  }}
>
  <FiUpload />

  {showResumeForm ? "Cancel" : "Upload Resume"}
</button>

{showResumeForm && (
  <div className="resume-section">
    <UploadResume
      onSuccess={() => setShowResumeForm(false)}
    />
  </div>
)}
            </div>
          </div>
        </div>

        <ToastContainer
          theme="dark"
          position="top-right"
        />
      </div>
    </div>
  );
}