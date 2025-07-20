import React, { useState, useEffect } from "react";
import "../styles/firmform.css";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

import { useNavigate } from "react-router-dom";

export default function Firmregistration() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          if (response.status === 200) {
            setUserId(response.data.user.id);
          } else {
            alert("Session expired. Please login again.");
            localStorage.removeItem("token");
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

  const [formData, setFormData] = useState({
    basic_details: {
      fullName: "",
      fatherSpouseName: "",
      dob: "",
      email: "",
      mobile: "",
      altContact: "",
      address: "",
    },
    firm_details: {
      firmName: "",
      registrationType: "",
      businessNature: "",
      officeAddress: "",
    },
    partner_details: {
      director2Name: "",
      director2Email: "",
      pan: "",
      aadhaar: "",
      addressProof: "",
    },
    documents: {
      panCard: null,
      aadhaarCard: null,
      photos: null,
      addressProofDoc: null,
      dsc: null,
      noc: null,
    },
    declaration: {
      signature: null,
      name: "",
      date: "",
      declared: false,
    },
  });

  const [errors, setErrors] = useState({});

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (field, file) => {
    if (field === "signature") {
      setFormData((prev) => ({
        ...prev,
        declaration: {
          ...prev.declaration,
          signature: file,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file,
        },
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.basic_details.fullName)
      newErrors.fullName = "Full name is required";
    if (!formData.basic_details.email.includes("@"))
      newErrors.email = "Valid email required";

    if (!formData.basic_details.mobile) {
      newErrors.mobile = "Valid mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.basic_details.mobile)) {
      newErrors.mobile =
        "Mobile number must start with 6, 7, 8, or 9 and be 10 digits long";
    }

    if (formData.basic_details.dob) {
      const dob = new Date(formData.basic_details.dob);
      const today = new Date();
      if (isNaN(dob.getTime()) || dob > today) {
        newErrors.dob = "Please enter a valid date of birth";
      }
      const year = dob.getFullYear();
      const month = dob.getMonth() + 1;
      const day = dob.getDate();
      if (
        year < 1900 ||
        year > today.getFullYear() ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        newErrors.dob = "Please enter a valid date of birth";
      }
    } else {
      newErrors.dob = "Date of birth is required";
    }

    if (formData.basic_details.altContact) {
      if (!/^[6-9]\d{9}$/.test(formData.basic_details.altContact)) {
        newErrors.altContact =
          "Alternative contact number must start with 6, 7, 8, or 9 and be 10 digits long";
      }
    } else {
      newErrors.altContact = "Alternative contact number is required";
    }

    if (formData.basic_details.fatherSpouseName) {
      if (!/^[a-zA-Z\s]+$/.test(formData.basic_details.fatherSpouseName)) {
        newErrors.fatherSpouseName =
          "Father/Spouse name must contain only letters and spaces";
      }
    } else {
      newErrors.fatherSpouseName = "Father/Spouse name is required";
    }

    if (!formData.basic_details.address) {
      newErrors.address = "Residential address is required";
    } else if (formData.basic_details.address.length < 10) {
      newErrors.address =
        "Residential address must be at least 10 characters long";
    }

    if (!formData.firm_details.firmName) {
      newErrors.firmName = "Proposed name of the firm is required";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(formData.firm_details.firmName)) {
      newErrors.firmName =
        "Firm name must contain only letters, numbers, and spaces";
    }

    if (!formData.firm_details.registrationType) {
      newErrors.registrationType = "Type of registration is required";
    }

    if (!formData.firm_details.businessNature) {
      newErrors.businessNature = "Main nature of business is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firm_details.businessNature)) {
      newErrors.businessNature =
        "Business nature must contain only letters and spaces";
    }

    if (!formData.firm_details.officeAddress) {
      newErrors.officeAddress = "Office/business address is required";
    } else if (formData.firm_details.officeAddress.length < 10) {
      newErrors.officeAddress =
        "Office/business address must be at least 10 characters long";
    }
    if (!formData.partner_details.director2Name) {
      newErrors.director2Name = "Full name of Director 2 is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.partner_details.director2Name)) {
      newErrors.director2Name =
        "Director 2 name must contain only letters and spaces";
    }

    if (!formData.partner_details.director2Email) {
      newErrors.director2Email = "Director 2 email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.partner_details.director2Email
      )
    ) {
      newErrors.director2Email =
        "Director 2 email must be a valid email address";
    }

    if (!formData.partner_details.pan) {
      newErrors.pan = "PAN is required";
    } else if (
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.partner_details.pan)
    ) {
      newErrors.pan = "PAN must be in the format ABCDE1234F";
    }

    if (!formData.partner_details.aadhaar) {
      newErrors.aadhaar = "Aadhaar number is required";
    } else if (!/^\d{12}$/.test(formData.partner_details.aadhaar)) {
      newErrors.aadhaar = "Aadhaar number must be 12 digits long";
    }

    if (!formData.partner_details.addressProof) {
      newErrors.addressProof = "Address proof is required";
    } else if (
      !/^[a-zA-Z0-9\s]+$/.test(formData.partner_details.addressProof)
    ) {
      newErrors.addressProof =
        "Address proof must contain only letters, numbers, and spaces";
    }

    if (!formData.documents.panCard)
      newErrors.panCard = "PAN card document is required";
    if (!formData.documents.aadhaarCard)
      newErrors.aadhaarCard = "Aadhaar card document is required";
    if (!formData.documents.photos)
      newErrors.photos = "Passport size photos are required";
    if (!formData.documents.addressProofDoc)
      newErrors.addressProofDoc =
        "Electricity bill/rent agreement for address proof is required";

    if (!formData.declaration.signature)
      newErrors.signature = "Signature is required";

    if (formData.declaration.name) {
      if (!/^[a-zA-Z\s]+$/.test(formData.declaration.name)) {
        newErrors.name = "Name must contain only letters and spaces";
      }
    } else {
      newErrors.name = "Name is required";
    }

    if (!formData.declaration.date) {
      newErrors.date = "Date is required";
    } else {
      const date = new Date(formData.declaration.date);
      const today = new Date();
      if (isNaN(date.getTime()) || date > today) {
        newErrors.date = "Please enter a valid date";
      }
    }

    if (!formData.declaration.declared)
      newErrors.declared =
        "You must declare that the information provided is true and correct";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append("basic_details", JSON.stringify(formData.basic_details));
    fd.append("firm_details", JSON.stringify(formData.firm_details));
    fd.append("partner_details", JSON.stringify(formData.partner_details));
    fd.append("declaration.name", formData.declaration.name);
    fd.append("declaration.date", formData.declaration.date);
    fd.append("declaration.declared", formData.declaration.declared);
    fd.append("userId", userId);

    // Append documents
    Object.entries(formData.documents).forEach(([key, file]) => {
      if (file) fd.append(key, file);
    });

    // Append signature separately (it's in declaration)
    if (formData.declaration.signature) {
      fd.append("signature", formData.declaration.signature);
    }

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Razorpay SDK failed to load. Please try again.");
        setIsSubmitting(false);
        return;
      }
      axios
        .post(`${apiUrl}` + "/firm/register-firm", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          const data = response.data;
          setFormData({
            basic_details: {
              fullName: "",
              fatherSpouseName: "",
              dob: "",
              email: "",
              mobile: "",
              altContact: "",
              address: "",
            },
            firm_details: {
              firmName: "",
              registrationType: "",
              businessNature: "",
              officeAddress: "",
            },
            partner_details: {
              director2Name: "",
              director2Email: "",
              pan: "",
              aadhaar: "",
              addressProof: "",
            },
            documents: {
              panCard: null,
              aadhaarCard: null,
              photos: null,
              addressProofDoc: null,
              dsc: null,
              noc: null,
            },
            declaration: {
              signature: null,
              name: "",
              date: "",
              declared: false,
            },
          });
          const options = {
            key: data.key, // Replace with your Razorpay key ID
            amount: 10000,
            currency: "INR",
            name: "Firm Registration",
            description: "Registration Fee Payment",
            order_id: data.orderId,

            handler: async function (response) {
              try {
                const verify = await axios.post(
                  `${apiUrl}` + "/firm/verify-payment",
                  {
                    orderId: data.orderId,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                  }
                );

                if (verify.data.success) {
                  navigate("/payment-success", {
                    state: {
                      fullName: formData.basic_details.fullName,
                      transactionId: response.razorpay_payment_id,
                      amount: options.amount,
                    },
                  });
                } else {
                  alert(
                    " Payment verification failed. Please contact support."
                  );
                }
              } catch (verifyError) {
                console.error("Verification error:", verifyError);
                alert(
                  "Server error during payment verification. Please contact support."
                );
              } finally {
                setIsSubmitting(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
              },
            },
            prefill: {
              name: formData.basic_details.fullName,
              email: formData.basic_details.email,
              contact: formData.basic_details.mobile,
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
          console.error("Error registering firm:", error);
          alert("Error registering firm. Please try again.");
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

  return (
    <div className="firm-registration">
      <h2>Firm Registration</h2>
      <form onSubmit={handleSubmit}>
        <section>
          <h3>Basic Details</h3>
          <label>
            Full Name of Applicant / Director:
            <input
              type="text"
              value={formData.basic_details.fullName}
              onChange={(e) =>
                handleChange("basic_details", "fullName", e.target.value)
              }
            />
            {errors.fullName && (
              <span className="error">{errors.fullName}</span>
            )}
          </label>
          <label>
            Father/Spouse Name:
            <input
              type="text"
              value={formData.basic_details.fatherSpouseName}
              onChange={(e) =>
                handleChange(
                  "basic_details",
                  "fatherSpouseName",
                  e.target.value
                )
              }
            />
            {errors.fatherSpouseName && (
              <span className="error">{errors.fatherSpouseName}</span>
            )}
          </label>
          <label>
            Date of Birth:
            <input
              type="date"
              value={formData.basic_details.dob}
              onChange={(e) =>
                handleChange("basic_details", "dob", e.target.value)
              }
            />
            {errors.dob && <span className="error">{errors.dob}</span>}
          </label>
          <label>
            Email:
            <input
              type="email"
              value={formData.basic_details.email}
              onChange={(e) =>
                handleChange("basic_details", "email", e.target.value)
              }
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <label>
            Mobile Number:
            <input
              type="tel"
              value={formData.basic_details.mobile}
              onChange={(e) =>
                handleChange("basic_details", "mobile", e.target.value)
              }
            />
            {errors.mobile && <span className="error">{errors.mobile}</span>}
          </label>
          <label>
            Alternate Contact Number:
            <input
              type="tel"
              value={formData.basic_details.altContact}
              onChange={(e) =>
                handleChange("basic_details", "altContact", e.target.value)
              }
            />
            {errors.altContact && (
              <span className="error">{errors.altContact}</span>
            )}
          </label>
          <label>
            Residential Address:
            <textarea
              value={formData.basic_details.address}
              onChange={(e) =>
                handleChange("basic_details", "address", e.target.value)
              }
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </label>
        </section>

        <section>
          <h3>Firm Details</h3>
          <label>
            Proposed Name of the Firm / Company:
            <input
              type="text"
              value={formData.firm_details.firmName}
              onChange={(e) =>
                handleChange("firm_details", "firmName", e.target.value)
              }
            />
            {errors.firmName && (
              <span className="error">{errors.firmName}</span>
            )}
          </label>
          <label>
            Type of Registration Required:
            <select
              value={formData.firm_details.registrationType}
              onChange={(e) =>
                handleChange("firm_details", "registrationType", e.target.value)
              }
            >
              <option value="">Select Registration Type</option>
              <option value="proprietorship">Proprietorship</option>
              <option value="partnership">Partnership</option>
              <option value="llp">LLP</option>
              <option value="private_limited">Private Limited</option>
              <option value="public_limited">Public Limited</option>
              <option value="cooperative">Cooperative</option>
            </select>
            {errors.registrationType && (
              <span className="error">{errors.registrationType}</span>
            )}
          </label>
          <label>
            Main Nature of Business:
            <input
              type="text"
              value={formData.firm_details.businessNature}
              onChange={(e) =>
                handleChange("firm_details", "businessNature", e.target.value)
              }
            />
            {errors.businessNature && (
              <span className="error">{errors.businessNature}</span>
            )}
          </label>
          <label>
            Office/Business Address:
            <textarea
              value={formData.firm_details.officeAddress}
              onChange={(e) =>
                handleChange("firm_details", "officeAddress", e.target.value)
              }
            />
            {errors.officeAddress && (
              <span className="error">{errors.officeAddress}</span>
            )}
          </label>
        </section>

        <section>
          <h3>Partner/Director Details</h3>
          <label>
            Full Name of Director:
            <input
              type="text"
              value={formData.partner_details.director2Name}
              onChange={(e) =>
                handleChange("partner_details", "director2Name", e.target.value)
              }
            />
            {errors.director2Name && (
              <span className="error">{errors.director2Name}</span>
            )}
          </label>
          <label>
            Director Email:
            <input
              type="email"
              value={formData.partner_details.director2Email}
              onChange={(e) =>
                handleChange(
                  "partner_details",
                  "director2Email",
                  e.target.value
                )
              }
            />
            {errors.director2Email && (
              <span className="error">{errors.director2Email}</span>
            )}
          </label>
          <label>
            PAN:
            <input
              type="text"
              value={formData.partner_details.pan}
              onChange={(e) =>
                handleChange("partner_details", "pan", e.target.value)
              }
            />
            {errors.pan && <span className="error">{errors.pan}</span>}
          </label>
          <label>
            Aadhaar Number:
            <input
              type="text"
              value={formData.partner_details.aadhaar}
              onChange={(e) =>
                handleChange("partner_details", "aadhaar", e.target.value)
              }
            />
            {errors.aadhaar && <span className="error">{errors.aadhaar}</span>}
          </label>
          <label>
            Address Proof:
            <input
              type="text"
              value={formData.partner_details.addressProof}
              onChange={(e) =>
                handleChange("partner_details", "addressProof", e.target.value)
              }
            />
            {errors.addressProof && (
              <span className="error">{errors.addressProof}</span>
            )}
          </label>
        </section>

        <section>
          <h3>Documents Upload</h3>
          <label>
            PAN Card of all partners/directors:{" "}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange("panCard", e.target.files[0])}
            />
            {errors.panCard && <span className="error">{errors.panCard}</span>}
          </label>
          <label>
            Aadhaar Card all partners/directors:{" "}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleFileChange("aadhaarCard", e.target.files[0])
              }
            />
            {errors.aadhaarCard && (
              <span className="error">{errors.aadhaarCard}</span>
            )}
          </label>
          <label>
            Passport size photos:{" "}
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileChange("photos", e.target.files[0])}
            />
            {errors.photos && <span className="error">{errors.photos}</span>}
          </label>
          <label>
            Electricity bill / rent agreement for address proof:{" "}
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                handleFileChange("addressProofDoc", e.target.files[0])
              }
            />
            {errors.addressProofDoc && (
              <span className="error">{errors.addressProofDoc}</span>
            )}
          </label>
          <label>
            Digital Signature Certificate:{" "}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange("dsc", e.target.files[0])}
            />
          </label>
          <label>
            NOC from property owner:{" "}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange("noc", e.target.files[0])}
            />
          </label>
        </section>

        <section>
          <h3>Declaration</h3>
          <label>
            Signature:
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => handleFileChange("signature", e.target.files[0])}
            />
            {errors.signature && (
              <span className="error">{errors.signature}</span>
            )}
          </label>
          <label>
            Name:
            <input
              type="text"
              value={formData.declaration.name}
              onChange={(e) =>
                handleChange("declaration", "name", e.target.value)
              }
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </label>
          <label>
            Date:
            <input
              type="date"
              value={formData.declaration.date}
              onChange={(e) =>
                handleChange("declaration", "date", e.target.value)
              }
            />
            {errors.date && <span className="error">{errors.date}</span>}
          </label>

          <div
            style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}
          >
            <input
              type="checkbox"
              checked={formData.declaration.declared}
              onChange={(e) =>
                handleChange("declaration", "declared", e.target.checked)
              }
              style={{ marginTop: "3px" }}
            />
            <span style={{ fontSize: "14px", lineHeight: "1.5" }}>
              I declare that the information provided is true and correct.
            </span>
          </div>

          {errors.declared && <span className="error">{errors.declared}</span>}
        </section>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
