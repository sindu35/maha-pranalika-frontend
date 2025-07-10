import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/search.css";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
        setTotalResults(0);
        return;
      }
      searchUsers(query, 1);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const searchUsers = async (searchText, pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/search`, {
        email: searchText,
        page: pageNumber,
        limit: 3,
      });

      if (pageNumber === 1) {
        setResults(res.data.users || []);
      } else {
        setResults((prev) => [...prev, ...(res.data.users || [])]);
      }

      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.currentPage || 1);
      setTotalResults(res.data.totalResults || res.data.users?.length || 0);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    searchUsers(query, nextPage);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "role-admin",
      user: "role-user",
    };
    return colors[role] || "role-user";
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-input-container">
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Search by email or name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}

          {query.trim() && (
            <div className="search-dropdown">
              {results.length > 0 ? (
                <>
                  <p className="results-count">
                    {totalResults} result{totalResults !== 1 ? "s" : ""} found
                  </p>
                  <div className="results-list">
                    {results.map((user) => (
                      <div key={user._id} className="search-result-item">
                        <div
                          className="result-content"
                          onClick={() => handleUserClick(user._id)}
                        >
                          <div className="user-avatar">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                              <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                          </div>
                          <div className="user-info">
                            <div className="user-name-row">
                              <p className="user-name">{user.name}</p>
                              <span
                                className={`role-badge ${getRoleColor(
                                  user.role
                                )}`}
                              >
                                {user.role.charAt(0).toUpperCase() +
                                  user.role.slice(1)}
                              </span>
                            </div>
                            <div className="user-email">
                              <svg
                                className="email-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                              <span>{user.email}</span>
                            </div>
                            <div className="user-date">
                              <svg
                                className="calendar-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="18"
                                  rx="2"
                                  ry="2"
                                ></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              <span>
                                {new Date(user.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {page < totalPages && (
                    <div className="load-more-container">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="load-more-btn"
                      >
                        {loading ? (
                          <>
                            <div className="spinner small"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>Load More</span>
                            <svg
                              className="chevron-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <polyline points="6,9 12,15 18,9"></polyline>
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                !loading && (
                  <div className="no-results">
                    <div className="no-results-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </div>
                    <p className="no-results-text">No results found</p>
                    <p className="no-results-subtext">
                      Try adjusting your search terms
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
