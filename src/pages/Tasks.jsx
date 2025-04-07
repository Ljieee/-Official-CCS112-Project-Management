import React from "react";
import TaskItem from "../components/TaskItem";  // Import TaskItem component

const Tasks = () => {
  // Replace this with your actual project ID
  const projectId = 1;  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">Tasks Page</h1>
        <p className="text-lg mb-6 text-gray-600 text-center">
          Welcome to the Tasks page. You can add, view, and manage your tasks here.
        </p>

        {/* Card container for tasks */}
        <div className="bg-gray-50 rounded-lg shadow-md p-6">
          <TaskItem projectId={projectId} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
