import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/userpage.css";

const apiUrl = import.meta.env.VITE_API_URL;
import { useToast } from "../utils/ToastContext";

export default function UserPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isresolvedvisa, setIsResolvedVisa] = useState(false);
  const [isresolvedMSME, setIsResolvedMSME] = useState(false);
  const { addToast } = useToast();
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
  const handleToggleResolvedFirm = (id, isCurrentlyResolved) => {
    const endpoint = isCurrentlyResolved ? "/undoResolveFirm" : "/resolveFirm";

    axios
      .post(`${apiUrl}/firm${endpoint}`, { firmId: id })
      .then((res) => {
        addToast(res.data.message || "Status updated", "success");

        // Update local state
        setUser((prev) => ({
          ...prev,
          firm_registration: prev.firm_registration.map((form) =>
            form._id === id
              ? { ...form, isResolved: !isCurrentlyResolved }
              : form
          ),
        }));
      })
      .catch((err) => {
        addToast("Resolve toggle failed", "error");
        console.error(
          "Toggle resolve firm error:",
          err.response?.data || err.message
        );
      });
  };

  const handleToggleResolvedCibilTraining = (
    trainingId,
    isCurrentlyResolved
  ) => {
    const endpoint = isCurrentlyResolved
      ? "/undoResolveCibilTraining"
      : "/resolveCibilTraining";

    axios
      .post(`${apiUrl}/cibil${endpoint}`, {
        userId: user._id,
        trainingId: trainingId,
      })
      .then((res) => {
        addToast(res.data.message || "Status updated", "success");

        setUser((prev) => ({
          ...prev,
          cibil_training: prev.cibil_training.map((entry) =>
            entry._id === trainingId
              ? { ...entry, isResolved: !isCurrentlyResolved }
              : entry
          ),
        }));
      })
      .catch((err) => {
        console.error(
          "Toggle resolve CIBIL Training error:",
          err.response?.data || err.message
        );
        addToast("Failed to update resolve status", "error");
      });
  };

  const handleToggleResolvedCibilRepair = (repairId, isCurrentlyResolved) => {
    const endpoint = isCurrentlyResolved
      ? "/undoResolveCibilRepair"
      : "/resolveCibilRepair";

    axios
      .post(`${apiUrl}/cibil-repair${endpoint}`, {
        userId: user._id,
        repairId,
      })
      .then((res) => {
        addToast(res.data.message || "Status updated", "success");

        setUser((prev) => ({
          ...prev,
          cibil_score_restoration: prev.cibil_score_restoration.map((entry) =>
            entry._id === repairId
              ? { ...entry, isResolved: !isCurrentlyResolved }
              : entry
          ),
        }));
      })
      .catch((err) => {
        console.error(
          "Toggle resolve CIBIL Repair error:",
          err.response?.data || err.message
        );
        addToast("Failed to update resolve status", "error");
      });
  };

  const handleResolvedVisa = (id) => {
    setIsResolvedVisa(true);
    alert(`visa entry ${id} resolved.`);
  };
  const handleToggleResolvedMSME = (formId, isResolved) => {
    const endpoint = isResolved ? "/undoResolveMsme" : "/resolveMsme";
    axios
      .post(`${apiUrl}/msme${endpoint}`, { userId: user._id, msmeId: formId })
      .then((res) => {
        addToast(res.data.message, "success");
        setUser((prev) => ({
          ...prev,
          msme: prev.msme.map((form) =>
            form._id === formId ? { ...form, isResolved: !isResolved } : form
          ),
        }));
      })
      .catch((err) => {
        console.error("MSME resolve error:", err);
        addToast("Failed to toggle MSME status", "error");
      });
  };

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
                <strong>Full Name:</strong>{" "}
                {form.basic_details?.fullName || "N/A"}
              </p>
              <p>
                <strong>Father/Spouse Name:</strong>{" "}
                {form.basic_details?.fatherSpouseName || "N/A"}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {form.basic_details?.dob || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {form.basic_details?.email || "N/A"}
              </p>
              <p>
                <strong>Mobile:</strong> {form.basic_details?.mobile || "N/A"}
              </p>
              <p>
                <strong>Alternate Contact:</strong>{" "}
                {form.basic_details?.altContact || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {form.basic_details?.address || "N/A"}
              </p>
              <p>
                <strong>Firm Name:</strong>{" "}
                {form.firm_details?.firmName || "N/A"}
              </p>
              <p>
                <strong>Registration Type:</strong>{" "}
                {form.firm_details?.registrationType || "N/A"}
              </p>
              <p>
                <strong>Nature of Business:</strong>{" "}
                {form.firm_details?.businessNature || "N/A"}
              </p>
              <p>
                <strong>Office Address:</strong>{" "}
                {form.firm_details?.officeAddress || "N/A"}
              </p>
              <p>
                <strong>Director 2 Name:</strong>{" "}
                {form.partner_details?.director2Name || "N/A"}
              </p>
              <p>
                <strong>Director 2 Email:</strong>{" "}
                {form.partner_details?.director2Email || "N/A"}
              </p>
              <p>
                <strong>PAN:</strong> {form.partner_details?.pan || "N/A"}
              </p>
              <p>
                <strong>Aadhaar:</strong>{" "}
                {form.partner_details?.aadhaar || "N/A"}
              </p>
              <p>
                <strong>Address Proof Type:</strong>{" "}
                {form.partner_details?.addressProof || "N/A"}
              </p>
              <p>
                <strong>Documents:</strong>
              </p>
              <ul style={{ paddingLeft: "20px", marginTop: "-10px" }}>
                {form.documents &&
                  Object.entries(form.documents).map(([key, url]) => (
                    <li key={key}>
                      <a href={url} target="_blank" rel="noreferrer">
                        {key}
                      </a>
                    </li>
                  ))}
              </ul>
              <p>
                <strong>Declared By:</strong> {form.declaration?.name || "N/A"}
              </p>
              <p>
                <strong>Declaration Date:</strong>{" "}
                {form.declaration?.date
                  ? new Date(form.declaration.date).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Signature:</strong>{" "}
                {form.declaration?.signature ? "Provided" : "Not provided"}
              </p>
              <p>
                <strong>Agreed to Declaration:</strong>{" "}
                {form.declaration?.declared ? "Yes" : "No"}
              </p>

              <div className="action-buttons">
                <button
                  className="resolve-btn"
                  onClick={() =>
                    handleToggleResolvedFirm(form._id, form.isResolved)
                  }
                >
                  {form.isResolved ? "Undo" : "Resolved"}
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this firm?"
                    );
                    if (!confirmDelete) return;

                    try {
                      await axios.delete(`${apiUrl}/firm/deleteFirm`, {
                        data: { userId: user._id, firmId: form._id },
                      });

                      setUser((prev) => ({
                        ...prev,
                        firm_registration: prev.firm_registration.filter(
                          (entry) => entry._id !== form._id
                        ),
                      }));

                      addToast("Firm deleted successfully", "success");
                    } catch (err) {
                      console.error(
                        "Error deleting firm:",
                        err.response?.data || err.message
                      );
                      addToast("Failed to delete firm", "error");
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
                  onClick={() =>
                    handleToggleResolvedCibilTraining(
                      entry._id,
                      entry.isResolved
                    )
                  }
                >
                  {entry.isResolved ? "Undo" : "Resolve"}
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this CIBIL Training entry?"
                    );
                    if (!confirmDelete) return;

                    try {
                      await axios.delete(
                        `${apiUrl}/cibil/deleteCibilTraining`,
                        {
                          data: {
                            userId: user._id,
                            trainingId: entry._id,
                          },
                        }
                      );

                      setUser((prev) => ({
                        ...prev,
                        cibil_training: prev.cibil_training.filter(
                          (e) => e._id !== entry._id
                        ),
                      }));

                      addToast(
                        "CIBIL Training entry deleted successfully",
                        "success"
                      );
                    } catch (err) {
                      console.error(
                        "Error deleting CIBIL Training entry:",
                        err.response?.data || err.message
                      );
                      addToast(
                        "Failed to delete CIBIL Training entry",
                        "error"
                      );
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
                    handleToggleResolvedCibilRepair(entry._id, entry.isResolved)
                  }
                >
                  {entry.isResolved ? "Undo" : "Resolved"}
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
                        `${apiUrl}/cibil-repair/deleteCibilRepair`,
                        {
                          data: {
                            userId: user._id,
                            repairId: entry._id,
                          },
                        }
                      );

                      setUser((prev) => ({
                        ...prev,
                        cibil_score_restoration:
                          prev.cibil_score_restoration.filter(
                            (e) => e._id !== entry._id
                          ),
                      }));

                      addToast(
                        "CIBIL Repair entry deleted successfully",
                        "success"
                      );
                    } catch (err) {
                      console.error("Delete failed:", err);
                      addToast("Failed to delete CIBIL Repair entry", "error");
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

      {/*Visa - Assistance */}
      {user.visa_assistance?.length > 0 && (
        <div className="form-section visa-assistance-section">
          <h3>Visa Assistance</h3>
          {user.visa_assistance.map((entry) => (
            <div key={entry._id} className="form-card">
              {/* Personal Info */}
              <p>
                <strong>Full Name:</strong>{" "}
                {entry.personal_information?.fullName}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {entry.personal_information?.dob}
              </p>
              <p>
                <strong>Gender:</strong> {entry.personal_information?.gender}
              </p>
              <p>
                <strong>Passport Number:</strong>{" "}
                {entry.personal_information?.passportNumber}
              </p>
              <p>
                <strong>Passport Expiry:</strong>{" "}
                {entry.personal_information?.passportExpiry}
              </p>
              <p>
                <strong>Phone Number:</strong>{" "}
                {entry.personal_information?.phoneNumber}
              </p>
              <p>
                <strong>Email:</strong> {entry.personal_information?.email}
              </p>
              <p>
                <strong>Address:</strong> {entry.personal_information?.address}
              </p>

              {/* Consultation Details */}
              <p>
                <strong>Visa Types:</strong>{" "}
                {entry.consultation_details?.visaTypes?.join(", ")}
              </p>
              {entry.consultation_details?.otherVisaType && (
                <p>
                  <strong>Other Visa Type:</strong>{" "}
                  {entry.consultation_details?.otherVisaType}
                </p>
              )}
              <p>
                <strong>Preferred Countries:</strong>{" "}
                {entry.consultation_details?.preferredCountries?.join(", ")}
              </p>
              {entry.consultation_details?.otherPreferredCountry && (
                <p>
                  <strong>Other Preferred Country:</strong>{" "}
                  {entry.consultation_details?.otherPreferredCountry}
                </p>
              )}
              <p>
                <strong>Referrer Name:</strong>{" "}
                {entry.consultation_details?.referrerName}
              </p>

              {/* Education & Experience */}
              {entry.education_experience?.qualification?.map((q, idx) => (
                <p key={idx}>
                  <strong>Qualification:</strong> {q.qualification} from{" "}
                  {q.institute} ({q.year})
                </p>
              ))}
              <p>
                <strong>Current Occupation:</strong>{" "}
                {entry.education_experience?.currentOccupation}
              </p>
              <p>
                <strong>Years of Experience:</strong>{" "}
                {entry.education_experience?.yearsOfExperience}
              </p>

              {/* Language Proficiency */}
              {entry.languageProficiency?.languages?.map((lang, idx) => (
                <div key={idx}>
                  <p>
                    <strong>Language:</strong> {lang.language} | Speaking:{" "}
                    {lang.speaking ? "Yes" : "No"} | Reading:{" "}
                    {lang.reading ? "Yes" : "No"} | Writing:{" "}
                    {lang.writing ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Exams Taken:</strong> {lang.examsTaken}
                  </p>
                </div>
              ))}

              {/* Additional Details */}
              <p>
                <strong>Applied Before:</strong>{" "}
                {entry.addtionalDetails?.previouslyappliedforvisa}
              </p>
              <p>
                <strong>Visa Rejections:</strong>{" "}
                {entry.addtionalDetails?.anyvisarejections}
              </p>
              <p>
                <strong>Legal Issues:</strong>{" "}
                {entry.addtionalDetails?.anylegailissues}
              </p>

              {/* Documented Checklist */}
              <p>
                <strong>Documents:</strong>
              </p>
              <ul style={{ paddingLeft: "20px", marginTop: "-10px" }}>
                {entry.documentedChecklist?.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>

              {/* Declaration */}
              <p>
                <strong>Declaration Signed:</strong>{" "}
                {entry.declaration?.declared ? "Yes" : "No"}
              </p>
              <p>
                <strong>Signature:</strong> {entry.declaration?.signature}
              </p>
              <p>
                <strong>Submitted On:</strong>{" "}
                {entry.declaration?.date
                  ? new Date(entry.declaration.date).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* Actions */}
              <div className="action-buttons">
                {isresolvedvisa ? (
                  <button
                    className="resolve-btn"
                    onClick={() => handleResolvedVisa(entry._id)}
                  >
                    Undo
                  </button>
                ) : (
                  <button
                    className="resolve-btn"
                    onClick={() => handleResolvedVisa(entry._id)}
                  >
                    Resolved
                  </button>
                )}
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {user.msme?.length > 0 && (
        <div className="form-section msmeclusters-section">
          <h3>MSME Cluster Registrations</h3>
          {user.msme.map((entry) => (
            <div key={entry._id} className="form-card">
              {/* Basic Info */}
              <p>
                <strong>Client Name:</strong> {entry.basic_info?.client_name}
              </p>
              <p>
                <strong>Primary Product:</strong>{" "}
                {entry.basic_info?.primary_product}
              </p>
              <p>
                <strong>Total Leads:</strong>{" "}
                {entry.basic_info?.total_no_of_leads}
              </p>
              <p>
                <strong>Lead Name:</strong> {entry.basic_info?.name_of_lead}
              </p>
              <p>
                <strong>Organisation Types:</strong>{" "}
                {entry.basic_info?.type_of_organisation?.join(", ")}
              </p>
              <p>
                <strong>Lead Entity:</strong> {entry.basic_info?.lead_entity}
              </p>
              <p>
                <strong>Date of Establishment:</strong> {entry.basic_info?.doe}
              </p>
              <p>
                <strong>Address:</strong> {entry.basic_info?.address}
              </p>
              <p>
                <strong>City:</strong> {entry.basic_info?.city}
              </p>
              <p>
                <strong>District:</strong> {entry.basic_info?.district}
              </p>
              <p>
                <strong>State:</strong> {entry.basic_info?.state}
              </p>
              <p>
                <strong>Pincode:</strong> {entry.basic_info?.pincode}
              </p>

              {/* Contact Info */}
              <p>
                <strong>Contact Person:</strong>{" "}
                {entry.contact_info?.contact_person}
              </p>
              <p>
                <strong>Designation:</strong> {entry.contact_info?.designation}
              </p>
              <p>
                <strong>Phone:</strong> {entry.contact_info?.phone}
              </p>
              <p>
                <strong>Email:</strong> {entry.contact_info?.email}
              </p>

              {/* Cluster Details */}
              <p>
                <strong>Participants:</strong>{" "}
                {entry.cluster_details?.no_of_participating}
              </p>
              <p>
                <strong>Avg. Years in Business:</strong>{" "}
                {entry.cluster_details?.average_years}
              </p>
              <p>
                <strong>Total Employment:</strong>{" "}
                {entry.cluster_details?.total_employment}
              </p>
              <p>
                <strong>Common Challenges:</strong>{" "}
                {entry.cluster_details?.common_challenges?.join(", ")}
              </p>
              <p>
                <strong>Key Interventions:</strong>{" "}
                {entry.cluster_details?.key_interventions}
              </p>

              {/* Documented Issues */}
              <p>
                <strong>Issues:</strong>
              </p>
              <ul style={{ paddingLeft: "20px", marginTop: "-10px" }}>
                {entry.documents?.issues?.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>

              {/* Declaration */}
              <p>
                <strong>Declared:</strong>{" "}
                {entry.declaration?.declared ? "Yes" : "No"}
              </p>
              <p>
                <strong>Signature:</strong> {entry.declaration?.signature}
              </p>
              <p>
                <strong>Declaration Date:</strong>{" "}
                {entry.declaration?.declaration_date
                  ? new Date(
                      entry.declaration.declaration_date
                    ).toLocaleDateString()
                  : "N/A"}
              </p>

              {/* Actions */}
              <div className="action-buttons">
                <button
                  className="resolve-btn"
                  onClick={() =>
                    handleToggleResolvedMSME(entry._id, entry.isResolved)
                  }
                >
                  {entry.isResolved ? "Undo" : "Resolved"}
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this MSME entry?"
                    );
                    if (!confirmDelete) return;

                    try {
                      await axios.delete(`${apiUrl}/msme/deleteMsme`, {
                        data: { userId: user._id, msmeId: entry._id },
                      });

                      setUser((prev) => ({
                        ...prev,
                        msme: prev.msme.filter(
                          (entry) => entry._id !== entry._id
                        ),
                      }));

                      addToast("MSME form deleted successfully", "success");
                    } catch (err) {
                      console.error(
                        "Error deleting MSME form:",
                        err.response?.data || err.message
                      );
                      addToast("Failed to delete MSME form", "error");
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
