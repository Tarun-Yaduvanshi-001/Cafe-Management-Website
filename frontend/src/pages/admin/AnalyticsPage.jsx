import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRevenueAnalytics } from "../../features/admin/adminSlice";
import Spinner from "../../components/common/Spinner";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { analytics, status } = useSelector((state) => state.admin);
  const [timeFrame, setTimeFrame] = useState("month");

  useEffect(() => {
    dispatch(getRevenueAnalytics(timeFrame));
  }, [dispatch, timeFrame]);

  const chartData = {
    labels: analytics ? Object.keys(analytics.revenueByCategory) : [],
    datasets: [
      {
        label: "Revenue by Category",
        data: analytics ? Object.values(analytics.revenueByCategory) : [],
        backgroundColor: "rgba(253, 224, 71, 0.6)",
        borderColor: "rgba(253, 224, 71, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#e5e7eb" } },
      title: {
        display: true,
        text: `Revenue Analytics (${timeFrame})`,
        color: "#e5e7eb",
        font: { size: 16 },
      },
    },
    scales: {
      y: { ticks: { color: "#9ca3af" }, grid: { color: "#4b5563" } },
      x: { ticks: { color: "#9ca3af" }, grid: { color: "#4b5563" } },
    },
  };

  if (status === "loading" && !analytics) return <Spinner />;

  return (
    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-dark-text">Revenue Analytics</h1>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="bg-gray-700 text-dark-text rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dark-accent"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {analytics && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-dark-text-secondary text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">
                ${analytics.totalRevenue.toFixed(2)}
              </p>
            </div>
            {/* Add more stat cards here if needed */}
          </div>

          <div className="h-96">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
