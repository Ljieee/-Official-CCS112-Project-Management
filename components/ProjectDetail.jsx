import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { useParams, useNavigate } from "react-router-dom";

const ProjectDetail = () => {
  const { token } = useContext(AppContext);
  const { id } = useParams(); // Get project ID from URL params
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details and tasks
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const projectRes = await fetch(
          `http://127.0.0.1:8000/api/projects/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const taskRes = await fetch(
          `http://127.0.0.1:8000/api/projects/${id}/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (projectRes.ok && taskRes.ok) {
          const projectData = await projectRes.json();
          const taskData = await taskRes.json();

          setProject(projectData);
          setTasks(taskData);
        } else {
          setError("Project not found or unauthorized access.");
        }
      } catch (error) {
        setError("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, token]);

  // Handle navigation back to projects list
  const handleBack = () => {
    navigate("/projects");
  };

  if (loading) {
    return <div className="text-center text-lg text-black">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p className="text-black">{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Project Details</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
        >
          Back to Projects
        </button>
      </div>

      {/* Project Info */}
      {project && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">{project.name}</h2>
          <p className="text-black">
            <strong>Description:</strong> {project.description}
          </p>
          <p className="text-black mt-2">
            <strong>Status:</strong> {project.status}
          </p>
          <p className="text-black mt-2">
            <strong>Created at:</strong>{" "}
            {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Tasks Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-black">Tasks</h2>

        {tasks.length > 0 ? (
          <table className="w-full table-auto text-black">
            <thead>
              <tr className="bg-gray-100 text-black">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t">
                  <td className="px-4 py-2">{task.title}</td>
                  <td
                    className={`px-4 py-2 ${
                      task.status === "completed"
                        ? "text-green-500"
                        : task.status === "ongoing"
                        ? "text-blue-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(task.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-black">No tasks available for this project.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
