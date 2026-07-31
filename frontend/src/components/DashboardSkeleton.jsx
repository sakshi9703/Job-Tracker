import "../App.css";

function SkeletonBlock({ className = "" }) {
  return <div className={`dashboard-skeleton-block ${className}`} />;
}

export default function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton" aria-busy="true" aria-label="Loading dashboard">
      <nav className="skeleton-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <SkeletonBlock className="skeleton-brand" />
          <div className="d-flex gap-3">
            <SkeletonBlock className="skeleton-nav-link" />
            <SkeletonBlock className="skeleton-nav-link" />
          </div>
        </div>
      </nav>

      <main className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <SkeletonBlock className="skeleton-title" />
            <SkeletonBlock className="skeleton-subtitle" />
          </div>

          <div className="summary-grid">
            {["applications", "interviews"].map((item) => (
              <div className="summary-card" key={item}>
                <SkeletonBlock className="skeleton-icon" />
                <div className="flex-grow-1">
                  <SkeletonBlock className="skeleton-line short" />
                  <SkeletonBlock className="skeleton-number" />
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <section className="dashboard-card">
              <SkeletonBlock className="skeleton-section-title" />
              <SkeletonBlock className="skeleton-line medium" />
              <SkeletonBlock className="skeleton-chart" />
            </section>
            <section className="dashboard-card">
              <SkeletonBlock className="skeleton-section-title" />
              <SkeletonBlock className="skeleton-line medium" />
              <div className="stats-list">
                {Array.from({ length: 5 }, (_, index) => (
                  <div className="stat-row" key={index}>
                    <div className="stat-info flex-grow-1">
                      <SkeletonBlock className="skeleton-stat-icon" />
                      <SkeletonBlock className="skeleton-line short" />
                    </div>
                    <SkeletonBlock className="skeleton-badge" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="dashboard-actions">
            <SkeletonBlock className="skeleton-action" />
            <SkeletonBlock className="skeleton-action" />
          </div>
        </div>
      </main>
    </div>
  );
}
