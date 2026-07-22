import {
  FiSend,
  FiMessageSquare,
  FiCheckCircle,
  FiXCircle,
  FiBriefcase,
  FiUpload,
  FiBookmark
} from "react-icons/fi";
import Analytics from "./Analytics/Analytics";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Dashboard({ jobList, stats, setEditingIndex, setFormData, setShowJobModal }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const statItems = [
    {
      label: "Interested",
      value: stats?.interested || 0,
      icon: <FiBookmark />,
      className: "interested",
    },
    {
      label: "Applied",
      value: stats?.applied || 0,
      icon: <FiSend />,
      className: "applied",
    },
    {
      label: "Interview",
      value: stats?.interview || 0,
      icon: <FiMessageSquare />,
      className: "interview",
    },
    {
      label: "Accepted",
      value: stats?.accepted || 0,
      icon: <FiCheckCircle />,
      className: "accepted",
    },
    {
      label: "Rejected",
      value: stats?.rejected || 0,
      icon: <FiXCircle />,
      className: "rejected",
    },
  ];

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/verify",
          { withCredentials: true }
        );

        if (data.user) {
          setUsername(
            data.user.charAt(0).toUpperCase() +
              data.user.slice(1)
          );
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsername();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Hi, {username ? `${username}!` : "there!"}</h1>
          <p className="fs-5">Track your job applications with us.</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">
              <FiBriefcase />
            </div>

            <div>
              <span>Total Applications</span>
              <h2>{jobList?.length || 0}</h2>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon interview-bg">
              <FiMessageSquare />
            </div>

            <div>
              <span>Current Interviews</span>
              <h2>{stats?.interview || 0}</h2>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-grid">
          {/* Analytics */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Application Analytics</h3>
              <p>Distribution of your application statuses</p>
            </div>

            <Analytics stats={stats} />
          </div>

          {/* Statistics */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Statistics</h3>
              <p>Current application overview</p>
            </div>

            <div className="stats-list">
              {statItems.map((item) => (
                <div key={item.label} className="stat-row">
                  <div className="stat-info">
                    <div className={`stat-icon ${item.className}`}>
                      {item.icon}
                    </div>

                    <span>{item.label}</span>
                  </div>

                  <span className={`stat-badge ${item.className}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="upload-resume-btn"
            onClick={() => navigate("/profile")}
          >
            <FiUpload />
            Upload Your Resume
          </button>

          <button
            type="button"
            className="add-job-btn"
            onClick={() => {
              setEditingIndex(null);
              setFormData({
                company: "",
                role: "",
                status: "",
                date: "",
                location: "",
                notes: "",
                description: "",
              });
              setShowJobModal(true);
            }}
          >
            + Add New Job
          </button>
        </div>
      </div>
    </div>
  );
}
