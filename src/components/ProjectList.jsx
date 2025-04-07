import { useEffect, useReducer, useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";

// Reducer function to manage project state
const projectReducer = (state, action) => {
  switch (action.type) {
    case "SET_PROJECTS":
      return action.payload;
    case "ADD_PROJECT":
      return [...state, action.payload];
    case "EDIT_PROJECT":
      return state.map((project) =>
        project.id === action.payload.id ? action.payload : project
      );
    case "DELETE_PROJECT":
      return state.filter((project) => project.id !== action.payload);
    default:
      return state;
  }
};

export default function ProjectList() {
  const { token } = useContext(AppContext);
  const [projects, dispatch] = useReducer(projectReducer, []);
  const [editForm, setEditForm] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  // Fetch Projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          dispatch({ type: "SET_PROJECTS", payload: data });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchProjects();
  }, [token]);

  // Status color function
  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      case "completed":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          dispatch({ type: "DELETE_PROJECT", payload: id });
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  // Handle Edit
  const handleEdit = (project) => {
    setEditForm(project.id);
    setEditData({
      title: project.title,
      description: project.description,
      status: project.status,
    });
  };

  // Submit Edit
  const handleEditSubmit = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const updatedProject = await res.json();
        dispatch({ type: "EDIT_PROJECT", payload: updatedProject });

        // Close edit form
        setEditForm(null);
      }
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Project List</h2>

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 text-black">Title</th>
              <th className="px-4 py-2 text-black">Description</th>
              <th className="px-4 py-2 text-black">Status</th>
              <th className="px-4 py-2 text-center text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr key={project.id} className="border-t">
                  <td className="px-4 py-2  text-black">
                    {editForm === project.id ? (
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({ ...editData, title: e.target.value })
                        }
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      project.title
                    )}
                  </td>
                  <td className="px-4 py-2 text-black">
                    {editForm === project.id ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="border px-2 py-1 w-full"
                      />
                    ) : (
                      project.description
                    )}
                  </td>
                  <td className="px-4 py-2 ">
                    {editForm === project.id ? (
                      <select
                        value={editData.status}
                        onChange={(e) =>
                          setEditData({ ...editData, status: e.target.value })
                        }
                        className="border px-2 py-1 w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center text-black">
                    <div className="flex flex-wrap justify-center gap-2">
                      {editForm === project.id ? (
                        <>
                          <button
                            onClick={() => handleEditSubmit(project.id)}
                            className="btn btn-success text-black px-4 py-1 rounded w-full sm:w-auto"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditForm(null)}
                            className="btn btn-neutral text-white px-4 py-1 rounded w-full sm:w-auto"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(project)}
                            className="btn btn-warning text-black px-4 py-1 rounded w-full sm:w-auto"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="btn btn-error text-black px-4 py-1 rounded w-full sm:w-auto"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4  text-black">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
