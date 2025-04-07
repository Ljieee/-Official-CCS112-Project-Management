import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Project from "./pages/Project";
import ProjectDetail from "./components/ProjectDetail";   // Import the ProjectDetail component
import Tasks from "./pages/Tasks";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Layout from "./pages/Layout";  
import { useContext, useEffect } from "react";
import { AppContext } from "./Context/AppContext";
import './App.css';
import Create from "./pages/posts/Create";

function App() {
  const { token, setToken } = useContext(AppContext);  

  // Sync token with localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  // Helper component to manage protected routes
  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    return token ? children : <Navigate to="/login" state={{ from: location }} />;
  };

  // Redirect logged-in users away from auth pages
  const RedirectIfAuthenticated = ({ children }) => {
    return token ? <Navigate to="/" /> : children;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Prevent access to /login and /register when logged in */}
        <Route 
          path="/login" 
          element={<RedirectIfAuthenticated><Login /></RedirectIfAuthenticated>} 
        />
        <Route 
          path="/register" 
          element={<RedirectIfAuthenticated><Register /></RedirectIfAuthenticated>} 
        />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />  {/*  Add this route */}
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/create" element={<Create />} />
        </Route>

        {/* Redirect invalid routes to '/' */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
