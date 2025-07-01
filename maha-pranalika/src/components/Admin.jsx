import React , {useState,useEffect} from 'react'
import axios from 'axios';

export default function Admin() {

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("login to access this service");
          window.location.href = "/";
        } else {
          axios
            .get("http://localhost:5000/api/auth/verify", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              console.log("User verification response:", response.data.user.role);
              if(response.data.user.role === "admin") {
                setIsAdmin(true);
              }
                else {
                alert("You are not authorized to access this page.");
                // window.location.href = "/";
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
    <div>Admin</div>

  )
}
