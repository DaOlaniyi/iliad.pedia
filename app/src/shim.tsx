import { Shimmer } from "@shimmer-from-structure/react";

type Stat = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
};

type StatsGridProps = {
  stats: Stat[];
};

const statsTemplate: Stat[] = [
  {
    label: "Total Revenue",
    value: "$00,000",
    change: "+0.0%",
    trend: "up",
  },
  {
    label: "Active Users",
    value: "0,000",
    change: "+0.0%",
    trend: "up",
  },
  {
    label: "Conversion",
    value: "0.0%",
    change: "-0.0%",
    trend: "down",
  },
  {
    label: "Avg. Order",
    value: "$000",
    change: "+0.0%",
    trend: "up",
  },
];

const StatsGrid = ({ stats }: StatsGridProps) => (
  <div className="stats-grid">
    {stats.map((stat, index) => (
      <div key={index} className="stat-card">
        <p className="stat-label">{stat.label}</p>
        <h3 className="stat-value">{stat.value}</h3>
        <span className={`stat-change ${stat.trend}`}>
          {stat.trend === "up" ? "↑" : "↓"} {stat.change}
        </span>
      </div>
    ))}
  </div>
);

export default function Shim() {
  const loading = true; // Replace with your loading state
  const stats: Stat[] | null = null; // Replace with fetched data

  return (
    <Shimmer
      loading={loading}
      templateProps={{ stats: statsTemplate }}
    >
      <StatsGrid stats={stats ?? statsTemplate} />
    </Shimmer>
  );
}