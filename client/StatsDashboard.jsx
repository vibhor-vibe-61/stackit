import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import questionService from "../services/questionService";

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement);

export default function StatsDashboard() {
  const [tagStats, setTagStats] = useState([]);
  const [activityStats, setActivityStats] = useState([]);

  useEffect(() => {
    questionService.getTagStats().then((res) => setTagStats(res.data));
    questionService.getActivityStats().then((res) => setActivityStats(res.data));
  }, []);

  const barData = {
    labels: tagStats.map((t) => t.tag),
    datasets: [
      {
        label: "Questions per Tag",
        data: tagStats.map((t) => t.count),
        backgroundColor: "rgba(59, 130, 246, 0.6)", // blue-500
      },
    ],
  };

  const lineData = {
    labels: activityStats.map((a) => a.date),
    datasets: [
      {
        label: "Questions per Day",
        data: activityStats.map((a) => a.count),
        fill: false,
        borderColor: "#10b981", // emerald-500
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold mb-4">📊 Stats Dashboard</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Questions per Tag</h2>
        <Bar data={barData} />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Daily Question Activity</h2>
        <Line data={lineData} />
      </div>
    </div>
  );
}
