import React, { useState, useEffect } from "react";
import "../styles/msme.css";
import YesNo from "../components/YesNo";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

import { useNavigate } from "react-router-dom";

export default function CibilRepairForm() {
  const navigate = useNavigate(); 
  const [userId, setUserId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherValue, setOtherValue] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state

  // Initial form data structure
  const initialFormData = {
    userId: "",
    basic_info: {
      client_name: "",
      primary_product: "",
      total_no_of_leads: "",
      name_of_lead: "",
      type_of_organisation: [],
      lead_entity: "",
      doe: "",
      address: "",
      city: "",
      state: "",
      district: "",
      pincode: "",
    },
    contact_info: {
      contact_person: "",
      designation: "",
      phone: "",
      email: "",
    },
    cluster_details: {
      no_of_participating: "",
      average_years: "",
      total_employment: "",
      common_challenges: [],
      key_interventions: "",
    },
    documents: {
      issues: [],
    },
    declaration: {
      signature: "",
      declaration_date: "",
      declared: false,
    },
  };

  const [formData, setFormData] = useState(initialFormData);

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    } else {
      axios
        .get(`${apiUrl}`+"/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setUserId(response.data.user.id);
            setFormData((prev) => ({ ...prev, userId: response.data.user.id }));
          } else {
            alert("Session expired. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/";
          }
        })
        .catch((error) => {
          alert("Error fetching user data. Please try again.");
        });
    }
  }, []);

  const handleCheckboxArrayChange = (e, section, field) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      const currentArray = prev[section][field] || [];
      let updatedArray;

      if (value === "Other") {
        // Handle "Other" option separately
        if (checked) {
          setSelectedOptions((prev) => [...prev, "Other"]);
          updatedArray = [...currentArray, otherValue || "Other"];
        } else {
          setSelectedOptions((prev) => prev.filter((opt) => opt !== "Other"));
          updatedArray = currentArray.filter(
            (item) => item !== "Other" && item !== otherValue
          );
          setOtherValue("");
        }
      } else {
        updatedArray = checked
          ? [...currentArray, value]
          : currentArray.filter((item) => item !== value);
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: updatedArray,
        },
      };
    });
  };

  // Handle "Other" value change
  const handleOtherValueChange = (e, section, field) => {
    const newValue = e.target.value;
    setOtherValue(newValue);

    if (selectedOptions.includes("Other")) {
      setFormData((prev) => {
        const currentArray = prev[section][field] || [];
        const filteredArray = currentArray.filter(
          (item) => item !== "Other" && item !== otherValue
        );
        const updatedArray = newValue
          ? [...filteredArray, newValue]
          : filteredArray;

        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: updatedArray,
          },
        };
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    const b = formData.basic_info;
    const c = formData.contact_info;
    const cl = formData.cluster_details;
    const d = formData.documents;
    const de = formData.declaration;

    if (!b.client_name) newErrors.client_name = "Cluster name is required";
    if (!b.primary_product)
      newErrors.primary_product = "Primary product is required";
    if (!b.total_no_of_leads)
      newErrors.total_no_of_leads = "Total number of firms is required";
    if (!b.name_of_lead)
      newErrors.name_of_lead = "Name of lead organization is required";
    if (b.type_of_organisation.length === 0)
      newErrors.type_of_organisation =
        "Select at least one type of organization";
    if (!b.lead_entity)
      newErrors.lead_entity = "Registration number is required";
    if (!b.doe) {
      newErrors.doe = "Date of establishment is required";
    } else {
      const doe = new Date(b.doe);
      if (isNaN(doe.getTime()) || doe > today)
        newErrors.doe = "Enter a valid date of establishment";
    }
    if (!b.address) newErrors.address = "Cluster office address is required";
    if (!b.city) newErrors.city = "City is required";
    if (!b.district) newErrors.district = "District is required";
    if (!b.pincode || !/^\d{6}$/.test(b.pincode))
      newErrors.pincode = "Valid 6-digit pincode is required";
    if (!b.state) newErrors.state = "State is required";

    if (!c.contact_person)
      newErrors.contact_person = "Contact person name is required";
    if (!c.designation) newErrors.designation = "Designation is required";
    if (!c.phone || !/^[6-9]\d{9}$/.test(c.phone))
      newErrors.phone = "Valid 10-digit phone number required";
    if (!c.email || !c.email.includes("@"))
      newErrors.email = "Valid email is required";

    if (!cl.no_of_participating)
      newErrors.no_of_participating = "Number of SMEs is required";
    if (!cl.average_years)
      newErrors.average_years = "Average years of operation is required";
    if (!cl.total_employment)
      newErrors.total_employment = "Total employment is required";
    if (!cl.common_challenges || cl.common_challenges.length === 0)
      newErrors.common_challenges = "Select at least one challenge";
    if (!cl.key_interventions)
      newErrors.key_interventions = "Key interventions are required";

    if (!d.issues || d.issues.length === 0)
      newErrors.issues = "Please select at least one document";

    if (!de.signature) newErrors.signature = "Signature is required";
    if (!de.declaration_date) {
      newErrors.declaration_date = "Signature date is required";
    } else {
      const date = new Date(de.declaration_date);
      if (isNaN(date.getTime()) || date > today)
        newErrors.declaration_date = "Please enter a valid date";
    }

    if (de.declared !== true)
      newErrors.declared =
        "You must declare that the information provided is true";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    if (!validate()) return;

    // Set loading state
    setIsSubmitting(true);

    // Debug: Log the formData to see what's being sent
    console.log("Form Data before submit:", formData);
    console.log("Declaration section:", formData.declaration);

    // Prepare the data in the exact format expected by your schema
    const submitData = {
      userId: formData.userId,
      basic_info: {
        client_name: formData.basic_info.client_name || "",
        primary_product: formData.basic_info.primary_product || "",
        total_no_of_leads: formData.basic_info.total_no_of_leads || "",
        name_of_lead: formData.basic_info.name_of_lead || "",
        type_of_organisation: formData.basic_info.type_of_organisation || [],
        lead_entity: formData.basic_info.lead_entity || "",
        doe: formData.basic_info.doe || "",
        address: formData.basic_info.address || "",
        city: formData.basic_info.city || "",
        state: formData.basic_info.state || "",
        district: formData.basic_info.district || "",
        pincode: formData.basic_info.pincode || "",
      },
      contact_info: {
        contact_person: formData.contact_info.contact_person || "",
        designation: formData.contact_info.designation || "",
        phone: formData.contact_info.phone || "",
        email: formData.contact_info.email || "",
      },
      cluster_details: {
        no_of_participating: formData.cluster_details.no_of_participating || "",
        average_years: formData.cluster_details.average_years || "",
        total_employment: formData.cluster_details.total_employment || "",
        common_challenges: formData.cluster_details.common_challenges || [],
        key_interventions: formData.cluster_details.key_interventions || "",
      },
      documents: {
        issues: formData.documents.issues || [],
      },
      declaration: {
        signature: formData.declaration.signature || "",
        declaration_date: formData.declaration.declaration_date || "",
        declared: formData.declaration.declared || false,
      },
    };

    // Debug: Log the final submit data
    console.log("Submit Data:", submitData);

    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Send as JSON instead of FormData
      axios
        .post(`${apiUrl}`+"/msme/register-msme", submitData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Registration successful:", response.data);
          const data = response.data;
          setFormData({
            userId: "",
      basic_info: {
        client_name: "",
        primary_product: "",
        total_no_of_leads: "",
        name_of_lead: "",
        type_of_organisation: [],
        lead_entity: "",
        doe: "",
        address: "",
        city: "",
        state: "",
        district: "",
        pincode: "",
      },
      contact_info: {
        contact_person: "",
        designation: "",
        phone: "",
        email: "",
      },
      cluster_details: {
        no_of_participating: "",
        average_years: "",
        total_employment: "",
        common_challenges: [],
        key_interventions: "",
      },
      documents: {
        issues: [],
      },
      declaration: {
        signature: "",
        declaration_date: "",
        declared: false,
      },
         }     )
          const options = {
            key: data.key, // Replace with your Razorpay key ID
            amount: 9000000,
            currency: "INR",
            name: "Msme ",
            description: "Msme Fee Payment",
            order_id: data.orderId,
            handler: async function (response) {
              try {
                const verify = await axios.post(
                  `${apiUrl}`+"/msme/verify-payment",
                  {
                    orderId: data.orderId,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                  }
                );

                if (verify.data.success) {
                  alert("Payment successful! You are registered for MSME training.");
                
                  navigate("/payment-success", {
                    state: {
                      fullName: submitData.basic_info.client_name,
                      transactionId: response.razorpay_payment_id,
                      amount: options.amount,
                    },
                  });
                } else {
                  alert("Payment verification failed. Please contact support.");
                  setIsSubmitting(false);
                }
              } catch (verifyError) {
                console.error("Verification error:", verifyError);
                alert("Server error during payment verification. Please contact support.");
                setIsSubmitting(false);
              }
            },
            modal: {
              ondismiss: function () {
                console.log("Payment modal closed by user");
                setIsSubmitting(false);
              },
            },
            prefill: {
              name: submitData.basic_info.client_name,
              email: submitData.contact_info.email,
              contact: submitData.contact_info.phone,
            },
            theme: {
              color: "#3399cc",
            },
          };
         
          const paymentObject = new window.Razorpay(options);
          paymentObject.open();

          paymentObject.on("payment.failed", function (response) {
            console.error("Payment failed:", response.error);
            alert(`Payment failed: ${response.error.description}`);
            setIsSubmitting(false);
          });
        })
        .catch((error) => {
          console.error("Submission error:", error);
          console.log("Error response:", error.response?.data);
          alert("Submission failed. Please try again.");
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Registration failed";
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        alert("Network error. Please check your connection and try again.");
      } else {
        alert("Registration failed. Please try again later.");
      }
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("handleChange called:", { name, value, type, checked }); // Debug log

    if (!name || !name.includes(".")) return;

    const [section, field] = name.split(".");
    let newValue = value;

    if (type === "checkbox" && field === "declared") {
      newValue = checked;
    }

    console.log(`Updating ${section}.${field} to:`, newValue); // Debug log

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: newValue,
      },
    }));
  };

  return (
    <div className="msme-form">
      <h1>
        MSME Cluster Registration Form <br />
        (For use by associations/cluster groups)
      </h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Section A: Basic Information</h2>

          <label>1.Cluster Name:</label>
          <input
            type="text"
            name="basic_info.client_name"
            value={formData.basic_info.client_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.client_name && (
            <p className="error-message">{errors.client_name}</p>
          )}

          <label>2. Primary Product / Service of the Cluster: </label>
          <input
            type="text"
            name="basic_info.primary_product"
            value={formData.basic_info.primary_product}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.primary_product && (
            <p className="error-message">{errors.primary_product}</p>
          )}

          <label>3. Total Number of Firms in the Cluster:</label>
          <input
            type="text"
            name="basic_info.total_no_of_leads"
            value={formData.basic_info.total_no_of_leads}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.total_no_of_leads && (
            <p className="error-message">{errors.total_no_of_leads}</p>
          )}

          <label>4. Name of Lead Organization / SPV:</label>
          <input
            type="text"
            name="basic_info.name_of_lead"
            value={formData.basic_info.name_of_lead}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.name_of_lead && (
            <p className="error-message">{errors.name_of_lead}</p>
          )}

          <label>5. Type of Organization:</label>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {[
              "Registered Society",
              "Section 8 Company",
              "Trust",
              "Producer Company",
            ].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  value={type}
                  checked={formData.basic_info.type_of_organisation.includes(
                    type
                  )}
                  onChange={(e) =>
                    handleCheckboxArrayChange(
                      e,
                      "basic_info",
                      "type_of_organisation"
                    )
                  }
                  disabled={isSubmitting}
                />
                {type}
              </label>
            ))}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="Other"
                checked={selectedOptions.includes("Other")}
                onChange={(e) =>
                  handleCheckboxArrayChange(
                    e,
                    "basic_info",
                    "type_of_organisation"
                  )
                }
                disabled={isSubmitting}
              />
              Other:
            </label>

            {selectedOptions.includes("Other") && (
              <input
                type="text"
                placeholder="Specify"
                value={otherValue}
                onChange={(e) =>
                  handleOtherValueChange(
                    e,
                    "basic_info",
                    "type_of_organisation"
                  )
                }
                className="border border-gray-300 px-2 py-1 rounded-md"
                disabled={isSubmitting}
              />
            )}
          </div>
          {errors.type_of_organisation && (
            <p className="error-message">{errors.type_of_organisation}</p>
          )}

          <label>6. Registration Number of SPV / Lead Entity:</label>
          <input
            type="text"
            name="basic_info.lead_entity"
            value={formData.basic_info.lead_entity}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.lead_entity && (
            <p className="error-message">{errors.lead_entity}</p>
          )}

          <label>7. Date of Establishment:</label>
          <input
            type="date"
            name="basic_info.doe"
            value={formData.basic_info.doe}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.doe && <p className="error-message">{errors.doe}</p>}

          <label>8. Address of the Cluster Office:</label>
          <textarea
            name="basic_info.address"
            value={formData.basic_info.address}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.address && <p className="error-message">{errors.address}</p>}

          <div style={{ display: "flex", gap: 80 }}>
            <div>
              <label style={{ width: "40px" }}>City:</label>
              <input
                type="text"
                name="basic_info.city"
                value={formData.basic_info.city}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.city && <p className="error-message">{errors.city}</p>}
            </div>
            <div>
              <label style={{ width: "40px" }}>District:</label>
              <input
                type="text"
                name="basic_info.district"
                value={formData.basic_info.district}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.district && (
                <p className="error-message">{errors.district}</p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 80 }}>
            <div>
              <label style={{ width: "40px" }}>State:</label>
              <input
                type="text"
                name="basic_info.state"
                value={formData.basic_info.state}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.state && <p className="error-message">{errors.state}</p>}
            </div>
            <div>
              <label style={{ width: "40px" }}>Pincode:</label>
              <input
                type="text"
                name="basic_info.pincode"
                value={formData.basic_info.pincode}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              {errors.pincode && (
                <p className="error-message">{errors.pincode}</p>
              )}
            </div>
          </div>
        </section>
        <section>
          <h2>Section B: Contact Information</h2>
          <label>Name of Cluster Contact Person:</label>
          <input
            type="text"
            name="contact_info.contact_person"
            value={formData.contact_info.contact_person}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.contact_person && (
            <p className="error-message">{errors.contact_person}</p>
          )}

          <label>Designation:</label>
          <input
            type="text"
            name="contact_info.designation"
            value={formData.contact_info.designation}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.designation && (
            <p className="error-message">{errors.designation}</p>
          )}

          <label>Phone Number:</label>
          <input
            type="text"
            name="contact_info.phone"
            value={formData.contact_info.phone}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}

          <label>Email Address:</label>
          <input
            type="text"
            name="contact_info.email"
            value={formData.contact_info.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </section>
        <section>
          <h2>Section C: Cluster Details</h2>
          <label>13. Number of Participating Units (SMEs):</label>
          <input
            type="text"
            name="cluster_details.no_of_participating"
            value={formData.cluster_details.no_of_participating}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.no_of_participating && (
            <p className="error-message">{errors.no_of_participating}</p>
          )}

          <label>14. Average Years of Operation of Cluster Firms:</label>
          <input
            type="text"
            name="cluster_details.average_years"
            value={formData.cluster_details.average_years}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.average_years && (
            <p className="error-message">{errors.average_years}</p>
          )}

          <label>15. Total Employment in Cluster:</label>
          <input
            type="text"
            name="cluster_details.total_employment"
            value={formData.cluster_details.total_employment}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.total_employment && (
            <p className="error-message">{errors.total_employment}</p>
          )}

          <label>16. Common Challenges Faced by the Cluster:</label>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {[
              "Marketing",
              "Finance",
              "Technology",
              "Infrastructure",
              "Export Readiness",
            ].map((challenge) => (
              <label key={challenge}>
                <input
                  type="checkbox"
                  value={challenge}
                  checked={formData.cluster_details.common_challenges.includes(
                    challenge
                  )}
                  onChange={(e) =>
                    handleCheckboxArrayChange(
                      e,
                      "cluster_details",
                      "common_challenges"
                    )
                  }
                  disabled={isSubmitting}
                />
                {challenge}
              </label>
            ))}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                value="Other"
                checked={selectedOptions.includes("Other")}
                onChange={(e) =>
                  handleCheckboxArrayChange(
                    e,
                    "cluster_details",
                    "common_challenges"
                  )
                }
                disabled={isSubmitting}
              />
              Other:
            </label>

            {selectedOptions.includes("Other") && (
              <input
                type="text"
                placeholder="Specify"
                value={otherValue}
                onChange={(e) =>
                  handleOtherValueChange(
                    e,
                    "cluster_details",
                    "common_challenges"
                  )
                }
                className="border border-gray-300 px-2 py-1 rounded-md"
                disabled={isSubmitting}
              />
            )}
          </div>
          {errors.common_challenges && (
            <p className="error-message">{errors.common_challenges}</p>
          )}

          <label>17. Key Interventions Required:</label>
          <textarea
            name="cluster_details.key_interventions"
            value={formData.cluster_details.key_interventions}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.key_interventions && (
            <p className="error-message">{errors.key_interventions}</p>
          )}
        </section>
        <section>
          <h2>Section D: Documents to Attach</h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            {[
              "Copy of SPV Registration Certificate",
              "PAN & GST of Lead Organization",
              "Aadhaar of Authorized Signator",
              "MSME Udyam Registrations of Cluster Firms",
              "Consent Letters from Member Units",
              "Cluster Map / Layout (if applicable)",
              "Draft DPR (if available)",
            ].map((doc) => (
              <label key={doc}>
                <input
                  type="checkbox"
                  value={doc}
                  checked={formData.documents.issues.includes(doc)}
                  onChange={(e) =>
                    handleCheckboxArrayChange(e, "documents", "issues")
                  }
                  disabled={isSubmitting}
                />
                {doc}
              </label>
            ))}
          </div>
          {errors.issues && <p className="error-message">{errors.issues}</p>}
        </section>
        <section>
          <h2>Declaration</h2>
          <label>Signature:</label>
          <input
            type="text"
            name="declaration.signature"
            value={formData.declaration.signature}
            onChange={handleChange}
            placeholder="Enter your full name as signature"
            disabled={isSubmitting}
          />
          {errors.signature && (
            <p className="error-message">{errors.signature}</p>
          )}

          <label>Date:</label>
          <input
            type="date"
            name="declaration.declaration_date"
            value={formData.declaration.declaration_date}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.declaration_date && (
            <p className="error-message">{errors.declaration_date}</p>
          )}

          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              name="declaration.declared"
              checked={formData.declaration.declared}
              onChange={handleChange}
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
              disabled={isSubmitting}
            />
            <span>
              I declare that the information provided above is true and correct
              to the best of my knowledge. I understand that any false
              information may result in the rejection of my application.
            </span>
          </label>
          {errors.declared && (
            <p className="error-message">{errors.declared}</p>
          )}
        </section>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ 
            padding: "10px 20px", 
            fontSize: "16px", 
            marginTop: "20px",
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
            backgroundColor: isSubmitting ? "#ccc" : "#3399cc",
            color: "white",
            border: "none",
            borderRadius: "4px"
          }}
         
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}