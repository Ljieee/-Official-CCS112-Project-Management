import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

const Navbar = () => {
  const { user, token, setUser, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault();

    if (!token) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,   //  Add Authorization header
          Accept: "application/json"
        }
      });

      if (res.ok) {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        console.log("Logged out successfully.");
        navigate('/login');
      } else {
        console.error("Failed to logout:", await res.json());
      }

    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">

      {/* Hamburger Menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> 
            </svg>
          </div>

          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li><Link to="/" className="nav-link">Dashboard</Link></li>
            <li><Link to="/projects" className="nav-link">Projects</Link></li>
            <li><Link to="/tasks" className="nav-link">Tasks</Link></li>
            <br />
            <Link to="/create" className="btn btn-primary hover:btn-ghost">Add Projects</Link> 
            <br />
            <hr />
            <li>
              <button 
                onClick={handleLogout} 
                className="btn btn-primary w-full"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <Link to="/" className="btn btn-ghost text-xl">PROJECT MANAGEMENT SYSTEM</Link>
      </div>

      {/* Right Section */}
      <div className="navbar-end space-x-4">
        {token && user ? (
          <span className="text-lg font-semibold mr-2">
            Welcome, {user?.name || "Loading..."} 
          
          </span>
        ) : (
          <>
            <Link to="/register" className="btn btn-ghost">Register</Link>
            <Link to="/login" className="btn btn-ghost">Login</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
