import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/userpage.css";

const apiUrl = import.meta.env.VITE_API_URL;

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/user/getUserById/${id}`)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user:", err);
        setUser(null);
      });
  }, [id]);

  if (!user) return <p className="loading">Loading user data...</p>;

  return (
    <div className="user-page">
      <div className="user-header">
        <h2>{user.name}</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <hr />

      {/* Firm Registrations */}
      {user.firm_registration?.length > 0 && (
        <div className="form-section">
          <h3>Firm Registrations</h3>
          {user.firm_registration.map((form) => (
            <div key={form._id} className="form-card">
              <p>
                <strong>Firm Name:</strong> {form.firm_details?.firmName}
              </p>
              <p>
                <strong>Applicant:</strong> {form.basic_details?.fullName}
              </p>
              <p>
                <strong>PAN:</strong> {form.partner_details?.pan}
              </p>
              <p>
                <strong>Mobile:</strong> {form.basic_details?.mobile}
              </p>
              <p>
                <strong>Reg. Type:</strong>{" "}
                {form.firm_details?.registrationType}
              </p>
              <p>
                <strong>Submitted On:</strong>{" "}
                {form.declaration?.date
                  ? new Date(form.declaration.date).toLocaleDateString()
                  : "N/A"}
              </p>

              <div className="action-buttons">
                <button
                  className="resolve-btn"
                  onClick={() => alert(`Firm entry ${form._id} resolved.`)}
                >
                  Resolve
                </button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CIBIL Trainings */}
      {user.cibil_training?.length > 0 && (
        <div className="form-section cibiltrainings-section">
          <h3>CIBIL Trainings</h3>
          {user.cibil_training.map((entry) => (
            <div key={entry._id} className="form-card">
              <p>
                <strong>Full Name:</strong> {entry.fullName}
              </p>
              <p>
                <strong>Email:</strong> {entry.email}
              </p>
              <p>
                <strong>Phone:</strong> {entry.phone}
              </p>
              <p>
                <strong>Education:</strong> {entry.education}
              </p>
              <p>
                <strong>Preferred Mode:</strong> {entry.preferedTrainingMode}
              </p>
              <p>
                <strong>City:</strong> {entry.city}
              </p>
              <p>
                <strong>Experience:</strong> {entry.experience}
              </p>
              <p>
                <strong>Remarks:</strong> {entry.remarks}
              </p>
              <p>
                <strong>Submitted On:</strong>{" "}
                {new Date(entry.createdAt).toLocaleDateString()}
              </p>

              <div className="action-buttons">
                <button
                  className="resolve-btn"
                  onClick={() => alert(`CIBIL entry ${entry._id} resolved.`)}
                >
                  Resolve
                </button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {user.cibil_score_restoration?.length > 0 && (
        <div className="form-section cibilrepairs-section">
          <h3>CIBIL Score Restoration</h3>
          {user.cibil_score_restoration.map((entry) => (
            <div key={entry._id} className="form-card">
              <p>
                <strong>Full Name:</strong> {entry.fullName}
              </p>
              <p>
                <strong>Email:</strong> {entry.email}
              </p>
              <p>
                <strong>Mobile:</strong> {entry.mobile}
              </p>
              <p>
                <strong>PAN:</strong> {entry.pan}
              </p>
              <p>
                <strong>Aadhaar:</strong> {entry.aadhaar}
              </p>
              <p>
                <strong>Occupation:</strong> {entry.occupation}
              </p>
              <p>
                <strong>Income:</strong> ₹{entry.income}
              </p>
              <p>
                <strong>CIBIL Score:</strong> {entry.cibilScore}
              </p>
              <p>
                <strong>Loan Info:</strong> {entry.hasLoan} ({entry.loanType})
              </p>
              <p>
                <strong>Bank:</strong> {entry.bank}
              </p>
              <p>
                <strong>EMI:</strong> ₹{entry.emi}
              </p>
              <p>
                <strong>Signature Date:</strong>{" "}
                {new Date(entry.signatureDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Documents:</strong>
              </p>
              <ul style={{ paddingLeft: "20px", marginTop: "-10px" }}>
                {entry.documents &&
                  Object.entries(entry.documents).map(([key, url]) => (
                    <li key={key}>
                      <a href={url} target="_blank" rel="noreferrer">
                        {key}
                      </a>
                    </li>
                  ))}
              </ul>

              <div className="action-buttons">
                <button
                  className="resolve-btn"
                  onClick={() =>
                    alert(`Resolved CIBIL Restoration ID: ${entry._id}`)
                  }
                >
                  Resolve
                </button>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Delete this CIBIL restoration entry?"
                    );
                    if (!confirmDelete) return;

                    try {
                      await axios.delete(
                        `${apiUrl}/cibilrestoration/delete/${entry._id}`
                      );
                      setUser((prev) => ({
                        ...prev,
                        cibil_score_restoration:
                          prev.cibil_score_restoration.filter(
                            (e) => e._id !== entry._id
                          ),
                      }));
                      alert("Entry deleted successfully.");
                    } catch (err) {
                      console.error("Delete failed:", err);
                      alert("Deletion failed.");
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
