import React, { useEffect, useReducer, useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { taskReducer, initialState } from "../reducers/TaskReducers";

export default function TaskItem() {
  const { token } = useContext(AppContext);
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const [formData, setFormData] = useState({
    title: "",
    status: "pending",
  });

  const [editId, setEditId] = useState(null);
  const [projectId, setProjectId] = useState(""); // Current Project ID
  const [validProjectIds, setValidProjectIds] = useState([]); // Store valid project IDs

  // Status color function
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Fetch valid project IDs initially
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const ids = data.map((project) => project.id);
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

  // Fetch tasks when valid project ID is entered
  useEffect(() => {
    if (!projectId || !validProjectIds.includes(parseInt(projectId))) return;

    async function fetchTasks() {
      dispatch({ type: "LOADING" });

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/projects/${projectId}/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          dispatch({ type: "FETCH_TASKS", payload: data });
        } else {
          throw new Error("Failed to fetch tasks");
        }
      } catch (error) {
        dispatch({ type: "ERROR", payload: error.message });
      }
    }

    fetchTasks();
  }, [projectId, token, validProjectIds]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Project ID Change with validation
  const handleProjectChange = (e) => {
    const value = e.target.value;

    if (value === "" || (parseInt(value) > 0 && validProjectIds.includes(parseInt(value)))) {
      setProjectId(value);
    }
  };

  // Add or update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId || !validProjectIds.includes(parseInt(projectId))) {
      alert("Please select a valid project ID.");
      return;
    }

    const url = editId
      ? `http://127.0.0.1:8000/api/projects/${projectId}/tasks/${editId}`
      : `http://127.0.0.1:8000/api/projects/${projectId}/tasks`;

    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        if (editId) {
          dispatch({ type: "UPDATE_TASK", payload: data });
          setEditId(null);
        } else {
          dispatch({ type: "ADD_TASK", payload: data });
        }

        setFormData({ title: "", status: "pending" });
      } else {
        console.error("Failed to add or update task");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectId}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        dispatch({ type: "DELETE_TASK", payload: taskId });
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Set edit mode
  const handleEdit = (task) => {
    setEditId(task.id);
    setFormData({
      title: task.title,
      status: task.status,
    });
  };

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold text-black mb-4">Task List</h2>

      {/* Project ID Selector */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-black mb-2">Select Project ID</label>
        <input
          type="number"
          value={projectId}
          onChange={handleProjectChange}
          placeholder="Enter Valid Project ID"
          className="w-full px-4 py-2 border rounded-lg  text-black"
          min="1"
        />
        {projectId && !validProjectIds.includes(parseInt(projectId)) && (
          <p className="text-red-500 mt-2">Invalid Project ID</p>
        )}
      </div>

      {/* Task Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4  text-black">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task Title"
            required
            className="w-full px-4 py-2 border rounded"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded  text-black"
          >
            <option value="pending">Pending</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <button
            type="submit"
            className={`bg-${editId ? "yellow" : "blue"}-500 hover:bg-${
              editId ? "yellow" : "blue"
            }-600 text-black px-4 py-2 rounded`}
          >
            {editId ? "Update" : "Add"} Task
          </button>
        </div>
      </form>

      {/* Task Table */}
      <table className="w-full table-auto bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-black">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.tasks.map((task) => (
            <tr key={task.id} className="border-t">
              <td className="px-4 py-2">{task.title}</td>
              <td className="px-4 py-2">
                <span className={`px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <button onClick={() => handleEdit(task)} className="btn btn-primary mr-2 text-black">
                  Edit
                </button>
                <button onClick={() => handleDelete(task.id)} className="btn btn-error text-black">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
