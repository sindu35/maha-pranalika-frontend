import React, { useState } from "react";
import "../styles/visa.css";

export default function VisaOverseas() {
  const [formData, setFormData] = useState({
    personal_information: {
      fullName: "",
      dob: "",
      gender: "",
      passportNumber: "",
      passportExpiry: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
    consultation_details: {
      visaTypes: [],
      otherVisaType: "",
      preferredCountries: [],
      otherPreferredCountry: "",
      referrerName: "",
    },
    education_experience: {
      qualification: [{ qualification: "", institute: "", year: "" }],
      currentOccupation: "",
      yearsOfExperience: "",
    },
    languageProficiency: {
      languages: [
        {
          language: "",
          speaking: false,
          reading: false,
          writing: false,
          examsTaken: "",
        },
      ],
    },
    addtionalDetails: {
      previouslyappliedforvisa: "",
      anyvisarejections: "",
      anylegailissues: "",
    },
    documentedChecklist: [],
    declaration: {
      signature: "",
      date: "",
      declared: false,
    },
  });

  const handleInputChange = (section, name, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  const handleArrayCheckboxChange = (section, field, value, checked) => {
    setFormData((prev) => {
      const currentArray = prev[section][field];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: checked
            ? [...currentArray, value]
            : currentArray.filter((item) => item !== value),
        },
      };
    });
  };

  const handleNestedArrayChange = (section, field, index, name, value) => {
    const updatedArray = [...formData[section][field]];
    updatedArray[index][name] = value;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: updatedArray,
      },
    }));
  };

  const addNestedItem = (section, field, newItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], newItem],
      },
    }));
  };

  const deleteNestedItem = (section, field, index) => {
    const updated = [...formData[section][field]];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: updated,
      },
    }));
  };

  const [error, setError] = useState("");

  const validateForm = () => {
    const newErrors = [];
    if (!formData.personal_information.fullName) {
      newErrors.fullName = "Full Name is required.";
    }

    if (!formData.personal_information.dob) {
      newErrors.dob = "Date of Birth is required.";
    } else if (new Date(formData.personal_information.dob) > new Date()) {
      newErrors.dob = "Date of Birth cannot be in the future.";
    }

    if (!formData.personal_information.passportNumber) {
      newErrors.passportNumber = "Passport Number is required.";
    } else if (
      !/^[A-Z0-9]{6,9}$/.test(formData.personal_information.passportNumber)
    ) {
      newErrors.passportNumber =
        "Passport Number must be 6 to 9 alphanumeric characters.";
    }

    if (!formData.personal_information.passportExpiry) {
      newErrors.passportExpiry = "Passport Expiry Date is required.";
    } else if (
      new Date(formData.personal_information.passportExpiry) < new Date()
    ) {
      newErrors.passportExpiry = "Passport Expiry Date cannot be in the past.";
    }

    if (!formData.personal_information.phoneNumber) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^\d{10}$/.test(formData.personal_information.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be 10 digits.";
    }

    if (!formData.personal_information.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.personal_information.email)) {
      newErrors.email = "Email format is invalid.";
    }

    if (!formData.personal_information.address) {
      newErrors.address = "Address is required.";
    }

    if (formData.consultation_details.visaTypes.length === 0) {
      newErrors.visaTypes = "At least one Visa Type must be selected.";
    }

    if (!formData.declaration.signature) {
      newErrors.signature = "Signature is required.";
    }

    if (!formData.declaration.date) {
      newErrors.date = "Date is required.";
    }

    if (!formData.declaration.declared) {
      newErrors.declared = "Declaration must be accepted.";
    }

    if(!formData.personal_information.gender){
      newErrors.gender = "Gender is Required"
    }

    

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="visa-form">
      <h1>Overseas Consultation – Client Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Personal Information</h2>
          {Object.entries(formData.personal_information).map(([key, val]) =>
            key !== "gender" && key !== "address" ? (
              <div key={key}>
                <label>
                  {key}:
                  <input
                    type={
                      key.includes("dob") || key.includes("Expiry")
                        ? "date"
                        : key === "email"
                        ? "email"
                        : "text"
                    }
                    name={key}
                    value={val}
                    onChange={(e) =>
                      handleInputChange(
                        "personal_information",
                        key,
                        e.target.value
                      )
                    }
                    
                  />
                </label>
                {error[key] && (
                  <div className="error-message">{error[key]}</div>
                )}
              </div>
            ) : // errors code

            null
          )}
          <div>
            <label>
              Gender:
              <select
                name="gender"
                value={formData.personal_information.gender}
                onChange={(e) =>
                  handleInputChange(
                    "personal_information",
                    "gender",
                    e.target.value
                  )
                }
                
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            {error["gender"] && (
              <div className="error-message">{ error["gender"] }</div>
            )}
          </div>
          <div>
            <label>
              Address:
              <textarea
                name="address"
                value={formData.personal_information.address}
                onChange={(e) =>
                  handleInputChange(
                    "personal_information",
                    "address",
                    e.target.value
                  )
                }
                
              />
            </label>
          </div>
        </section>

        <section>
          <h2>Purpose of Consultation</h2>
          {["student", "work", "business", "pr", "family"].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                name="visaTypes"
                value={type}
                checked={formData.consultation_details.visaTypes.includes(type)}
                onChange={(e) =>
                  handleArrayCheckboxChange(
                    "consultation_details",
                    "visaTypes",
                    type,
                    e.target.checked
                  )
                }
              />
              {type} Visa
            </label>
          ))}
          <label>
            Other Visa Type:
            <input
              type="text"
              value={formData.consultation_details.otherVisaType}
              onChange={(e) =>
                handleInputChange(
                  "consultation_details",
                  "otherVisaType",
                  e.target.value
                )
              }
            />
          </label>

          {["usa", "canada", "uk"].map((country) => (
            <label key={country}>
              <input
                type="checkbox"
                name="preferredCountries"
                value={country}
                checked={formData.consultation_details.preferredCountries.includes(
                  country
                )}
                onChange={(e) =>
                  handleArrayCheckboxChange(
                    "consultation_details",
                    "preferredCountries",
                    country,
                    e.target.checked
                  )
                }
              />
              {country.toUpperCase()}
            </label>
          ))}
          <label>
            Other Preferred Country:
            <input
              type="text"
              value={formData.consultation_details.otherPreferredCountry}
              onChange={(e) =>
                handleInputChange(
                  "consultation_details",
                  "otherPreferredCountry",
                  e.target.value
                )
              }
            />
          </label>
          <label>
            Referrer's Name:
            <input
              type="text"
              value={formData.consultation_details.referrerName}
              onChange={(e) =>
                handleInputChange(
                  "consultation_details",
                  "referrerName",
                  e.target.value
                )
              }
            />
          </label>
        </section>

        <section>
          <h2>Education & Experience</h2>
          {formData.education_experience.qualification.map((edu, index) => (
            <div key={index}>
              <label>
                Qualification:
                <input
                  type="text"
                  value={edu.qualification}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "education_experience",
                      "qualification",
                      index,
                      "qualification",
                      e.target.value
                    )
                  }
                />
              </label>
              <label>
                Institute:
                <input
                  type="text"
                  value={edu.institute}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "education_experience",
                      "qualification",
                      index,
                      "institute",
                      e.target.value
                    )
                  }
                />
              </label>
              <label>
                Year:
                <input
                  type="text"
                  value={edu.year}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "education_experience",
                      "qualification",
                      index,
                      "year",
                      e.target.value
                    )
                  }
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  deleteNestedItem(
                    "education_experience",
                    "qualification",
                    index
                  )
                }
                disabled={
                  formData.education_experience.qualification.length === 1
                }
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addNestedItem("education_experience", "qualification", {
                qualification: "",
                institute: "",
                year: "",
              })
            }
          >
            Add Education
          </button>

          <label>
            Current Occupation:
            <input
              type="text"
              value={formData.education_experience.currentOccupation}
              onChange={(e) =>
                handleInputChange(
                  "education_experience",
                  "currentOccupation",
                  e.target.value
                )
              }
            />
          </label>
          <label>
            Years of Experience:
            <input
              type="text"
              value={formData.education_experience.yearsOfExperience}
              onChange={(e) =>
                handleInputChange(
                  "education_experience",
                  "yearsOfExperience",
                  e.target.value
                )
              }
            />
          </label>
        </section>

        <section>
          <h2>Language Proficiency</h2>
          {formData.languageProficiency.languages.map((lang, index) => (
            <div key={index}>
              {["speaking", "reading", "writing"].map((skill) => (
                <label key={skill}>
                  <input
                    type="checkbox"
                    checked={lang[skill]}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "languageProficiency",
                        "languages",
                        index,
                        skill,
                        e.target.checked
                      )
                    }
                  />
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
                </label>
              ))}
              <label>
                Exams Taken:
                <input
                  type="text"
                  value={lang.examsTaken}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "languageProficiency",
                      "languages",
                      index,
                      "examsTaken",
                      e.target.value
                    )
                  }
                />
              </label>
              <button
                type="button"
                onClick={() =>
                  deleteNestedItem("languageProficiency", "languages", index)
                }
                disabled={formData.languageProficiency.languages.length === 1}
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addNestedItem("languageProficiency", "languages", {
                language: "",
                speaking: false,
                reading: false,
                writing: false,
                examsTaken: "",
              })
            }
          >
            Add Language
          </button>
        </section>

        <section>
          <h2>Document Checklist</h2>
          {[
            "passportCopy",
            "passportPhoto",
            "resumeCV",
            "educationalCertificates",
            "ieltsTOEFLScorecard",
            "workExperienceLetters",
            "previousVisaDocuments",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                value={item}
                checked={formData.documentedChecklist.includes(item)}
                onChange={(e) =>
                  handleArrayCheckboxChange(
                    "",
                    "documentedChecklist",
                    item,
                    e.target.checked
                  )
                }
              />
              {item
                .replace(/([A-Z])/g, " $1")
                .replace(/^[a-z]/, (c) => c.toUpperCase())}
            </label>
          ))}
        </section>

        <section>
          {/* declaration */}
          <h2>Declaration</h2>
          <label>
            Signature:
            <input
              type="text"
              value={formData.declaration.signature}
              onChange={(e) =>
                handleInputChange("declaration", "signature", e.target.value)
              }
              
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              value={formData.declaration.date}
              onChange={(e) =>
                handleInputChange("declaration", "date", e.target.value)
              }
              
            />
          </label>
          <label style={{ display: "flex" }}>
            <input
              type="checkbox"
              checked={formData.declaration.declared}
              onChange={(e) =>
                handleInputChange("declaration", "declared", e.target.checked)
              }
              
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
            />
            <span>
              I declare that the information provided is true and correct:
            </span>
          </label>
        </section>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
