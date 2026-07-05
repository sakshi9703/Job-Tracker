import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import "./Analytics.css";

function Analytics({ stats }) {
  const allData = [
    {
      name: "Applied",
      value: stats?.applied || 0,
      color: "#ffc107",
    },
    {
      name: "Interview",
      value: stats?.interview || 0,
      color: "#0d6efd",
    },
    {
      name: "Accepted",
      value: stats?.accepted || 0,
      color: "#198754",
    },
    {
      name: "Rejected",
      value: stats?.rejected || 0,
      color: "#dc3545",
    },
    {
      name: "Interested",
      value: stats?.interested || 0,
      color: "#e08646",
    },
  ];

  const total = allData.reduce((sum, item) => sum + item.value, 0);

  const chartData = allData.filter((item) => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const item = payload[0];

    return (
      <div
        style={{
          background: "#334155",
          color: "#fff",
          border: "1px solid #475569",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          {item.name}
        </div>

        <div>
          {item.value} application{item.value !== 1 ? "s" : ""}
        </div>

        <div
          style={{
            color: "#cbd5e1",
            marginTop: "4px",
          }}
        >
          {((item.value / total) * 100).toFixed(1)}%
        </div>
      </div>
    );
  };

  return (
    <div className="h-100">
      {total === 0 ? (
        <div className="d-flex flex-column justify-content-center align-items-center h-100 py-5">
          <h5 className="text-muted">
            No application data available yet
          </h5>

          <p className="text-secondary mb-0">
            Add your first application to see analytics.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={4}
              // stroke="#1e293b"
              strokeWidth={3}
              rootTabIndex={-1}
              isAnimationActive
            >
              {chartData.map((item) => (
                <Cell
                  key={item.name}
                  fill={item.color}
                />
              ))}
            </Pie>

            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              isAnimationActive={false}
              cursor={false}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              formatter={(value) => {
                const item = allData.find(
                  (entry) => entry.name === value
                );

                const percentage = total
                  ? ((item.value / total) * 100).toFixed(0)
                  : 0;

                return `${value} (${percentage}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default Analytics;