import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Function to fetch user details
  async function getUser() {
    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user", {   // Use full backend URL
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json"   // ✅ Include Accept header
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);

        //  Store user in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        console.error("Failed to fetch user:", await res.json());
      }

    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }

  useEffect(() => {
    if (token) {
      getUser();
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
