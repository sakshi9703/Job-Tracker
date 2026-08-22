import "./DashboardSkeleton.css";

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`dashboard-skeleton-block ${className}`}
      aria-hidden="true"
    />
  );
}

export default function DashboardSkeleton() {
  return (
    <div
      className="dashboard-skeleton"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="skeleton-navbar">
        <div className="skeleton-navbar-inner">
          <SkeletonBlock className="skeleton-brand" />

          <div className="skeleton-nav-actions">
            <SkeletonBlock className="skeleton-nav-link" />
            <SkeletonBlock className="skeleton-nav-link skeleton-nav-profile" />
          </div>
        </div>
      </nav>

      {/* =========================
          DASHBOARD
      ========================= */}

      <main className="skeleton-dashboard">
        <div className="skeleton-dashboard-container">

          {/* =========================
              HEADER
          ========================= */}

          <header className="skeleton-dashboard-header">
            <div className="skeleton-header-content">
              <SkeletonBlock className="skeleton-greeting" />
              <SkeletonBlock className="skeleton-title" />
              <SkeletonBlock className="skeleton-subtitle" />
            </div>

            <SkeletonBlock className="skeleton-add-button" />
          </header>

          {/* =========================
              METRICS
          ========================= */}

          <section className="skeleton-metrics">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="skeleton-metric-card" key={index}>
                <SkeletonBlock className="skeleton-metric-number" />
                <SkeletonBlock className="skeleton-metric-label" />
              </div>
            ))}
          </section>

          {/* =========================
              ANALYTICS + STATUS
          ========================= */}

          <section className="skeleton-main-grid">

            {/* Analytics */}

            <div className="skeleton-panel skeleton-analytics-panel">
              <div className="skeleton-panel-header">
                <SkeletonBlock className="skeleton-overline" />
                <SkeletonBlock className="skeleton-panel-title" />
              </div>

              <div className="skeleton-chart-area">
                <SkeletonBlock className="skeleton-chart-line line-one" />
                <SkeletonBlock className="skeleton-chart-line line-two" />
                <SkeletonBlock className="skeleton-chart-line line-three" />

                <div className="skeleton-chart-bars">
                  {Array.from({ length: 7 }, (_, index) => (
                    <SkeletonBlock
                      key={index}
                      className={`skeleton-chart-bar bar-${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Application Status */}

            <div className="skeleton-panel skeleton-status-panel">
              <div className="skeleton-panel-header">
                <SkeletonBlock className="skeleton-overline" />
                <SkeletonBlock className="skeleton-panel-title short" />
              </div>

              <div className="skeleton-status-list">
                {Array.from({ length: 5 }, (_, index) => (
                  <div className="skeleton-status-row" key={index}>
                    <div className="skeleton-status-left">
                      <SkeletonBlock className="skeleton-status-indicator" />
                      <SkeletonBlock className="skeleton-status-label" />
                    </div>

                    <SkeletonBlock className="skeleton-status-count" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =========================
              RECENT APPLICATIONS
          ========================= */}

          <section className="skeleton-recent-panel">
            <div className="skeleton-recent-header">
              <div>
                <SkeletonBlock className="skeleton-overline" />
                <SkeletonBlock className="skeleton-panel-title medium" />
              </div>

              <SkeletonBlock className="skeleton-view-all" />
            </div>

            <div className="skeleton-recent-list">
              {Array.from({ length: 5 }, (_, index) => (
                <div className="skeleton-recent-row" key={index}>
                  <div className="skeleton-recent-info">
                    <SkeletonBlock className="skeleton-recent-role" />
                    <SkeletonBlock className="skeleton-recent-company" />
                  </div>

                  <div className="skeleton-recent-meta">
                    <SkeletonBlock className="skeleton-recent-status" />
                    <SkeletonBlock className="skeleton-recent-date" />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}