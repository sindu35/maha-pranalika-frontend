import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./Search";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("login to access this service");
      window.location.href = "/";
    } else {
      axios
        .get(`${apiUrl}` + "/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.user.role === "admin") {
            setIsAdmin(true);
          } else {
            alert("You are not authorized to access this page.");
            window.location.href = "/";
          }
        })
        .catch((error) => {
          alert("Error fetching user data. Please try again.");
          localStorage.removeItem("token");
          window.location.href = "/";
        });
    }
  }, []);

  return (
    <div>
      <Search />
    </div>
  );
}
