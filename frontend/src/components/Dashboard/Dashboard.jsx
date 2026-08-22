import Analytics from "../Analytics/Analytics";
import "./Dashboard.css";

export default function Dashboard({
  jobList,
  stats,
  username,
  onStatusSelect,
  setEditingIndex,
  setFormData,
  setShowJobModal,
}) {
  const statusItems = [
    {
      label: "Interested",
      value: stats?.interested || 0,
      className: "interested",
    },
    {
      label: "Applied",
      value: stats?.applied || 0,
      className: "applied",
    },
    {
      label: "Interview",
      value: stats?.interview || 0,
      className: "interview",
    },
    {
      label: "Accepted",
      value: stats?.accepted || 0,
      className: "accepted",
    },
    {
      label: "Rejected",
      value: stats?.rejected || 0,
      className: "rejected",
    },
  ];

  const metrics = [
    {
      label: "Total applications",
      value: jobList?.length || 0,
    },
    {
      label: "Interviews",
      value: stats?.interview || 0,
    },
    {
      label: "Accepted",
      value: stats?.accepted || 0,
    },
  ];

  const getDateLabel = (status) => {
  switch (status) {
    case "Interested":
      return "Apply by";

    case "Applied":
      return "Applied";

    case "Interview":
      return "Interview";

    case "Accepted":
      return "Accepted";

    case "Rejected":
      return "Rejected";

    default:
      return "Date";
  }
};

  const recentJobs = jobList?.slice(0, 5) || [];
  const showViewAll = jobList?.length > 5;

const formatRelativeDate = (dateString) => {
  if (!dateString) return "No date";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "No date";
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const target = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.round(
    (target - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Tomorrow";
  }

  if (diffDays === -1) {
    return "Yesterday";
  }

  if (diffDays > 1 && diffDays < 7) {
    return `In ${diffDays} days`;
  }

  if (diffDays < -1 && diffDays > -7) {
    return `${Math.abs(diffDays)} days ago`;
  }

  if (diffDays >= 7 && diffDays < 30) {
    return `In ${Math.floor(diffDays / 7)}w`;
  }

  if (diffDays <= -7 && diffDays > -30) {
    return `${Math.floor(Math.abs(diffDays) / 7)}w ago`;
  }

  return date.toLocaleDateString("en-CA");
};

  const openJobModal = () => {
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
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">
  <div className="dashboard-header-content">
    <p className="dashboard-greeting">
      Good morning, {username || "there"}
    </p>

    <h1>Here's a snapshot of your job search.</h1>

    <p>Keep track of your applications and stay on top of your search.</p>
  </div>

  <button
    type="button"
    className="dashboard-action-button"
    onClick={openJobModal}
  >
    + Add Job
  </button>
</header>


        {/* ================= METRICS ================= */}

        <section className="dashboard-metrics">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="metric-card"
            >
              <span className="metric-value">
                {metric.value}
              </span>

              <span className="metric-label">
                {metric.label}
              </span>
            </div>
          ))}
        </section>


        {/* ================= PIPELINE ================= */}

        <section className="dashboard-main-grid">

          {/* Analytics */}

          <section className="analytics-panel">

            <div className="panel-header">
              <div>
                <p className="panel-overline">
                  Application pipeline
                </p>

                <h2 className="panel-title">
                  Progress across your active roles
                </h2>
              </div>
            </div>

            <div className="chart-box">

              <Analytics
                stats={stats}
                onStatusSelect={onStatusSelect}
              />

            </div>

          </section>

          {/* Status */}

          <section className="status-panel">

            <div className="panel-header">
              <div>
                <p className="panel-overline">
                  Application status
                </p>

                <h2 className="panel-title">
                  Filter by stage
                </h2>
              </div>
            </div>

            <div className="status-list">

              {statusItems.map((item) => (

                <button
                  key={item.label}
                  type="button"
                  className="status-row"
                  onClick={() =>
                    onStatusSelect(item.label)
                  }
                >

                  <div className="status-row-label">

                    <span
                      className={`status-indicator status-${item.className}`}
                    />

                    <span>
                      {item.label}
                    </span>

                  </div>

                  <span className="status-row-count">
                    {item.value}
                  </span>

                </button>

              ))}

            </div>

          </section>

        </section>


        {/* ================= RECENT APPLICATIONS ================= */}

        <section className="recent-applications">

          <div className="panel-header panel-header-space-between">

            <div>
              <p className="panel-overline">
                Recent applications
              </p>

              <h2 className="panel-title">
                Most recent activity
              </h2>
            </div>

            {showViewAll && <span type="button"
                className="view-all-text"
                onClick={() => onStatusSelect("All")}>View all</span>}

          </div>


          <div className="recent-table">

            {recentJobs.length > 0 ? (

              recentJobs.map((job) => (

                <div
                  key={job._id}
                  className="recent-row"
                >

                  <div className="recent-job-info">

                    <p className="recent-role">
                      {job.role}
                    </p>

                    <p className="recent-company">
                      {job.company}
                    </p>

                  </div>


                  <div className="recent-meta">

                    <span
                      className={`recent-status status-${job.status?.toLowerCase()}`}
                    >
                      {job.status}
                    </span>

                    <span className="recent-date">
  {getDateLabel(job.status)} · {formatRelativeDate(job.date)}
</span>

                  </div>

                </div>

              ))

            ) : (

              <div className="recent-empty">

                <p>
                  No recent applications yet.
                </p>

                <span>
                  Add your first application to start
                  tracking your job search.
                </span>
                <div>
                <button
                  type="button"
                  onClick={openJobModal}
                  className="dashboard-action-button mt-3"
                >
                  + Add your first job
                </button>
                </div>

              </div>

            )}

          </div>

        </section>

      </div>
    </main>
  );
}