import React from "react";
import ProjectList from "../components/ProjectList";
function Project() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-black mb-6">Projects</h1>
        <p className="text-center text-black mb-8">Here you can manage your projects.</p>

        {/* Render the ProjectList component */}
        <ProjectList />
       
      </div>
    </div>
  );
}

export default Project;
