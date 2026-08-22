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
  FiUpload,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import ChangePassword from "../ChangePassword";
import UploadResume from "../UploadResume";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");

  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [resume, setResume] = useState(null);

  // ================================
  // FETCH PROFILE
  // ================================

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile`,
        {
          withCredentials: true,
        }
      );

      setProfile(data);
      setUsername(data.user.username);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  // ================================
  // FETCH RESUME
  // ================================

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile/upload-resume`,
        {
          withCredentials: true,
        }
      );

      setResume(data);
    } catch (err) {
      console.error("Failed to fetch resume:", err);
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================

  useEffect(() => {
    const loadProfile = async () => {
      await Promise.all([fetchProfile(), fetchResume()]);
    };

    loadProfile();
  }, []);

  // ================================
  // DELETE RESUME
  // ================================

  const deleteResume = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/profile/delete-resume`,
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);

      setResume({
        hasResume: false,
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete resume."
      );
    }
  };

  // ================================
  // CONFIRM DELETE
  // ================================

  const confirmDeleteResume = async () => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete resume?",
      text: "This will remove your saved resume and cannot be undone.",
      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#dc2626",

      background: "#ffffff",
      color: "#0f172a",

      customClass: {
        popup: "profile-swal-popup",
        confirmButton: "profile-swal-confirm",
        cancelButton: "profile-swal-cancel",
      },
    });

    if (isConfirmed) {
      await deleteResume();
    }
  };

  // ================================
  // DOWNLOAD RESUME
  // ================================

  const downloadResume = () => {
    window.open(
      `${import.meta.env.VITE_API_URL}/profile/download-resume`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ================================
  // UPDATE USERNAME
  // ================================

  const updateUsername = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/username`,
        {
          username: username.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setProfile((prev) => ({
        ...prev,
        user: data.user,
      }));

      setUsername(data.user.username);

      toast.success(data.message);

      setShowUsernameForm(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update username"
      );
    }
  };

  // ================================
  // LOADING
  // ================================

  if (!profile) {
    return (
      <div className="profile-loading">
        <div className="profile-loading-content">
          <div className="profile-loader" />
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container profile-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="profile-header-wrapper">

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/")}
          >
            <FiArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          <div className="profile-header">

            <div className="profile-avatar">
              {profile.user.username
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-heading-content">
              <p className="profile-overline">
                Account
              </p>

              <h1>
                Hi, {profile.user.username}!
              </h1>

              <p>
                Manage your account, resume and security
                settings.
              </p>
            </div>

          </div>
        </div>

        {/* =================================
            PROFILE GRID
        ================================= */}

        <div className="profile-grid">

          {/* =================================
              ACCOUNT INFORMATION
          ================================= */}

          <section className="profile-card account-card">

            <div className="card-heading">
              <div className="card-heading-icon">
                <FiUser />
              </div>

              <div>
                <h2>Account Information</h2>
                <p>Your account details</p>
              </div>
            </div>

            <div className="info-list">

              <div className="info-item">
                <div className="info-icon">
                  <FiUser />
                </div>

                <div className="info-content">
                  <span>Username</span>
                  <strong>
                    {profile.user.username}
                  </strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiMail />
                </div>

                <div className="info-content">
                  <span>Email</span>
                  <strong>
                    {profile.user.email}
                  </strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiCalendar />
                </div>

                <div className="info-content">
                  <span>Joined</span>
                  <strong>
                    {new Date(
                      profile.user.createdAt
                    ).toLocaleDateString()}
                  </strong>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <FiBriefcase />
                </div>

                <div className="info-content">
                  <span>Total Applications</span>
                  <strong>
                    {profile.totalApplications}
                  </strong>
                </div>
              </div>

            </div>
          </section>

          {/* =================================
              RESUME
          ================================= */}

          <section className="profile-card resume-card">

            <div className="card-heading">
              <div className="card-heading-icon resume-heading-icon">
                <FiUpload />
              </div>

              <div>
                <h2>Resume</h2>
                <p>
                  Keep your resume ready for analysis
                </p>
              </div>
            </div>

            {resume?.hasResume ? (
              <div className="uploaded-resume-card">

                <div className="resume-file-top">

                  <div className="resume-file-icon">
                    <FiUpload />
                  </div>

                  <div className="resume-info">
                    <h3 title={resume.resumeFileName}>
                      {resume.resumeFileName}
                    </h3>

                    <p>
                      Uploaded{" "}
                      {new Date(
                        resume.resumeUpdatedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                </div>

                <div className="resume-actions">

                  <button
                    type="button"
                    className="resume-action-btn download"
                    onClick={downloadResume}
                  >
                    Download
                  </button>

                  <button
                    type="button"
                    className="resume-action-btn delete"
                    onClick={confirmDeleteResume}
                  >
                    Delete
                  </button>

                </div>

                <div className="resume-divider" />

                <div className="replace-resume">

                  <p className="replace-title">
                    Replace resume
                  </p>

                  <UploadResume
                    hasResume={resume.hasResume}
                    onSuccess={fetchResume}
                  />

                </div>

              </div>
            ) : (
              <div className="empty-resume">

                <div className="empty-resume-icon">
                  <FiUpload />
                </div>

                <h3>No resume uploaded</h3>

                <p>
                  Upload your resume to use AI-powered
                  resume analysis.
                </p>

                <UploadResume
                  hasResume={false}
                  onSuccess={fetchResume}
                />

              </div>
            )}

          </section>

          {/* =================================
              ACCOUNT SETTINGS
          ================================= */}

          <section className="profile-card settings-card">

            <div className="card-heading">
              <div className="card-heading-icon settings-heading-icon">
                <FiLock />
              </div>

              <div>
                <h2>Account Settings</h2>
                <p>
                  Manage your account preferences
                </p>
              </div>
            </div>

            <div className="settings-actions">

              {/* Username */}

              <button
                type="button"
                className="settings-toggle-btn"
                onClick={() => {
                  setShowUsernameForm(
                    (prev) => !prev
                  );

                  setShowPasswordForm(false);
                }}
              >
                <span className="settings-button-left">
                  <FiEdit3 />

                  <span>
                    {showUsernameForm
                      ? "Cancel username change"
                      : "Change Username"}
                  </span>
                </span>

                <span className="settings-arrow">
                  {showUsernameForm ? "−" : "+"}
                </span>
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

              {/* Password */}

              <button
                type="button"
                className="settings-toggle-btn"
                onClick={() => {
                  setShowPasswordForm(
                    (prev) => !prev
                  );

                  setShowUsernameForm(false);
                }}
              >
                <span className="settings-button-left">
                  <FiLock />

                  <span>
                    {showPasswordForm
                      ? "Cancel password change"
                      : "Change Password"}
                  </span>
                </span>

                <span className="settings-arrow">
                  {showPasswordForm ? "−" : "+"}
                </span>
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

            </div>
          </section>

        </div>
      </div>

      <ToastContainer
        theme="light"
        position="top-right"
        autoClose={3000}
      />
    </div>
  );
}