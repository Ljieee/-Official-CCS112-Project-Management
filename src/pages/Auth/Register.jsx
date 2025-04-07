import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { AppContext } from '../../Context/AppContext';

const Register = () => {
  const { token } = useContext(AppContext);   
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "post",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        navigate('/login');
      } else {
        setErrors(data.errors || { general: "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ general: "Something went wrong. Please try again." });
      setLoading(false);
    }
  }

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex justify-content-center">

        {/* Title Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold mt-10 mb-6 px-4">Register now! {token}</h1>
        </div>

        {/* Form Section */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleRegister}>
              <fieldset className="fieldset">
                <label className="fieldset-label">Username</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="E.g Juan Dela Cruz"
                  value={formData.name}
                  onChange={(e) => setformData({ ...formData, name: e.target.value })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}

                <label className="fieldset-label">Email</label>
                <input
                  type="email"
                  required
                  className="input"
                  placeholder="E.g juan@gmail.com"
                  value={formData.email}
                  onChange={(e) => setformData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}

                <label className="fieldset-label">Password</label>
                <input
                  type="password"
                  required
                  className="input"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setformData({ ...formData, password: e.target.value })}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}

                <label className="fieldset-label">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="input"
                  placeholder="Confirm Password"
                  value={formData.password_confirmation}
                  onChange={(e) => setformData({ ...formData, password_confirmation: e.target.value })}
                />
                {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>}

                <button 
                  className={`btn btn-neutral mt-4 hover:btn btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </button>

                <div className="mt-4">
                  <p>Already have an account? 
                    <Link to="/login" className="text-blue-600 hover:underline ml-2">
                      Login
                    </Link>
                  </p>
                </div>

              </fieldset>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
