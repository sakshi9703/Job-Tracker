import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useState } from "react";
import "./Analytics.css";

function Analytics({ stats, onStatusSelect }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const allData = [
    {
      name: "Applied",
      value: stats?.applied || 0,
      color: "#2563EB",
    },
    {
      name: "Interview",
      value: stats?.interview || 0,
      color: "#0891B2",
    },
    {
      name: "Accepted",
      value: stats?.accepted || 0,
      color: "#16A34A",
    },
    {
      name: "Rejected",
      value: stats?.rejected || 0,
      color: "#DC2626",
    },
    {
      name: "Interested",
      value: stats?.interested || 0,
      color: "#D97706",
    },
  ];

  const total = allData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const chartData = allData.filter(
    (item) => item.value > 0
  );

  const handleMouseEnter = (data) => {
    const percentage =
      total > 0
        ? ((data.value / total) * 100).toFixed(1)
        : 0;

    setActiveTooltip({
      name: data.name,
      value: data.value,
      percentage,
    });
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  if (total === 0) {
    return (
      <div className="analytics-empty">
        <div className="analytics-center-value">0</div>

        <p>No application data yet</p>

        <span>
          Add your first application to see your pipeline.
        </span>
      </div>
    );
  }

  return (
    <div className="analytics-chart-wrapper">

      {/* Donut */}
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="47%"
            innerRadius={62}
            outerRadius={98}
            paddingAngle={4}
            strokeWidth={3}
            rootTabIndex={-1}
            isAnimationActive
            onClick={(entry) => onStatusSelect(entry.name)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: "pointer" }}
          >
            {chartData.map((item) => (
              <Cell
                key={item.name}
                fill={item.color}
                cursor="pointer"
              />
            ))}
          </Pie>

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={7}
            formatter={(value) => {
              const item = allData.find(
                (entry) => entry.name === value
              );

              const percentage = total
                ? Math.round((item.value / total) * 100)
                : 0;

              return (
                <span className="analytics-legend-item">
                  {value} {percentage}%
                </span>
              );
            }}
          />

        </PieChart>
      </ResponsiveContainer>

      {/* Center information */}
      <div className="analytics-center">
        <span className="analytics-center-value">
          {total}
        </span>

        <span className="analytics-center-label">
          Applications
        </span>
      </div>

      {/* Custom tooltip */}
      {activeTooltip && (
        <div className="analytics-tooltip">
          <div className="analytics-tooltip-name">
            {activeTooltip.name}
          </div>

          <div className="analytics-tooltip-value">
            {activeTooltip.value} application
            {activeTooltip.value !== 1 ? "s" : ""}
          </div>

          <div className="analytics-tooltip-percentage">
            {activeTooltip.percentage}%
          </div>
        </div>
      )}

    </div>
  );
}

export default Analytics;