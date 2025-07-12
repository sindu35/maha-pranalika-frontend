import React, { useEffect, useState } from "react";
import axios from "axios";

import "../styles/getusers.css";

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/getUsers");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Unable to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current page
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="user-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-list-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="header">
        <h2>User List</h2>
        <div className="total-count">
          Total Users: {users.length}
        </div>
      </div>

      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Services</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {
              const services = [];

              if (user.firm_registration?.length > 0)
                services.push("Firm Registration");
              if (user.cibil_score_restoration?.length > 0)
                services.push("CIBIL Restoration");
              if (user.cibil_training?.length > 0)
                services.push("CIBIL Training");
              if (user.visa_assistance?.length > 0)
                services.push("Visa Assistance");
              if (user.msme?.length > 0) services.push("MSME");

              return (
                <tr key={user._id}>
                  <td className="name-cell">{user.name}</td>
                  <td className="email-cell">{user.email}</td>
                  <td className="services-cell">
                    {services.length > 0 ? (
                      <div className="services-list">
                        {services.map((service, index) => (
                          <span key={index} className="service-tag">
                            {service}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-services">None</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="pagination-info">
          <div className="per-page">
            <label>Show: </label>
            <select value={usersPerPage} onChange={handleUsersPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span> per page</span>
          </div>
          
          <div className="showing-info">
            Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
          </div>
        </div>

        <div className="pagination-buttons">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="pagination-btn nav-btn"
          >
            Previous
          </button>

          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              className={`pagination-btn ${
                page === currentPage ? "active" : ""
              } ${typeof page !== 'number' ? "ellipsis" : ""}`}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="pagination-btn nav-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetUsers;