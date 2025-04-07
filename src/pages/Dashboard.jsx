import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";

const Dashboard = () => {
  const { token } = useContext(AppContext);

  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    completed: 0,
    latest: [],
  });

  const [projectId, setProjectId] = useState(""); // Store entered Project ID
  const [validProjectIds, setValidProjectIds] = useState([]); // Store valid project IDs

  // Fetch all valid project IDs
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const ids = data.map((project) => project.id); // Store only valid IDs
          setValidProjectIds(ids);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProjects();
  }, [token]);

  // Fetch task summary only if project ID is valid
  useEffect(() => {
    if (!projectId || !validProjectIds.includes(parseInt(projectId))) return;

    const fetchTaskStats = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/projects/${projectId}/task-summary`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setTaskStats(data);
        } else {
          console.error("Failed to fetch task summary");
          setTaskStats({
            total: 0,
            pending: 0,
            ongoing: 0,
            completed: 0,
            latest: [],
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTaskStats();
  }, [projectId, token, validProjectIds]);

  // Handle Project ID input change with validation
  const handleProjectChange = (e) => {
    const value = e.target.value;

    // Prevent negative or invalid IDs
    if (value === "" || (parseInt(value) > 0 && validProjectIds.includes(parseInt(value)))) {
      setProjectId(value);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center text-black">Dashboard</h1>
      <p className="text-lg mb-6 text-center  text-black">Welcome to the Project Management Dashboard!</p>

      {/* Project ID Selector */}
      <div className="mb-6 text-black">
        <label className="block text-lg font-medium mb-2">Select Project ID</label>
        <input
          type="number"
          value={projectId}
          onChange={handleProjectChange}
          placeholder="Enter Valid Project ID"
          className="w-full px-4 py-2 border rounded-lg"
          min="1"
        />
        {projectId && !validProjectIds.includes(parseInt(projectId)) && (
          <p className="text-red-500 mt-2">Invalid Project ID</p>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 text-black rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Total Tasks</h2>
          <p className="text-4xl">{taskStats.total}</p>
        </div>

        <div className="bg-blue-500 text-black p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Ongoing Tasks</h2>
          <p className="text-4xl">{taskStats.ongoing}</p>
        </div>

        <div className="bg-yellow-500 text-black p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold">Pending Tasks</h2>
          <p className="text-4xl">{taskStats.pending}</p>
        </div>

        <div className="bg-green-500 text-black p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-black">Completed Tasks</h2>
          <p className="text-4xl">{taskStats.completed}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-black">Task Progress</h2>
        <div className="relative w-full bg-gray-200 rounded-full h-6">
          <div
            className="bg-blue-500 h-6 rounded-full"
            style={{
              width: `${(taskStats.completed / taskStats.total) * 100 || 0}%`,
            }}
          ></div>
        </div>
        <p className="text-center mt-2 text-black">
          {((taskStats.completed / taskStats.total) * 100 || 0).toFixed(2)}% of tasks completed
        </p>
      </div>

      {/* Latest Tasks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4  text-black">Latest Tasks</h2>
        <ul className="divide-y divide-gray-300">
          {taskStats.latest.length > 0 ? (
            taskStats.latest.map((task, index) => (
              <li key={index} className="py-4">
                <div className="flex justify-between">
                  <span className="text-lg text-black">{task.title}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-black text-sm ${
                      task.status === "pending"
                        ? "bg-yellow-500"
                        : task.status === "ongoing"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p>No recent tasks.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
