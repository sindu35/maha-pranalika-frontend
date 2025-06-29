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

  const [errors, setErrors] = useState({});

  const handleInputChange = (section, name, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));

    // Clear specific error when user starts typing
    if (errors[name] || errors[`${section}_${name}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors[`${section}_${name}`];
        return newErrors;
      });
    }
  };

  const handleArrayCheckboxChange = (section, field, value, checked) => {
    setFormData((prev) => {
      const currentArray = section ? prev[section][field] : prev[field];
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter((item) => item !== value);

      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: newArray,
          },
        };
      } else {
        return {
          ...prev,
          [field]: newArray,
        };
      }
    });

    // Clear error when user makes selection
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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

    // Clear specific nested error
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
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

  const validateForm = () => {
    const newErrors = {};

    // Personal Information Validation
    if (!formData.personal_information.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (formData.personal_information.fullName.trim().length < 2) {
      newErrors.fullName = "Full Name must be at least 2 characters long.";
    }

    if (!formData.personal_information.dob) {
      newErrors.dob = "Date of Birth is required.";
    } else {
      const dobDate = new Date(formData.personal_information.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (dobDate > today) {
        newErrors.dob = "Date of Birth cannot be in the future.";
      } else if (age < 16) {
        newErrors.dob = "Applicant must be at least 16 years old.";
      } else if (age > 100) {
        newErrors.dob = "Please enter a valid date of birth.";
      }
    }

    if (!formData.personal_information.gender) {
      newErrors.gender = "Gender is required.";
    }

    if (!formData.personal_information.passportNumber.trim()) {
      newErrors.passportNumber = "Passport Number is required.";
    } else if (
      !/^[A-Z0-9]{6,12}$/i.test(formData.personal_information.passportNumber.trim())
    ) {
      newErrors.passportNumber =
        "Passport Number must be 6 to 12 alphanumeric characters.";
    }

    if (!formData.personal_information.passportExpiry) {
      newErrors.passportExpiry = "Passport Expiry Date is required.";
    } else {
      const expiryDate = new Date(formData.personal_information.passportExpiry);
      const today = new Date();
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(today.getMonth() + 6);
      
      if (expiryDate <= today) {
        newErrors.passportExpiry = "Passport Expiry Date must be in the future.";
      } else if (expiryDate <= sixMonthsFromNow) {
        newErrors.passportExpiry = "Passport should be valid for at least 6 months.";
      }
    }

    if (!formData.personal_information.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone Number is required.";
    } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.personal_information.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number (10-15 digits).";
    }

    if (!formData.personal_information.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal_information.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.personal_information.address.trim()) {
      newErrors.address = "Address is required.";
    } else if (formData.personal_information.address.trim().length < 10) {
      newErrors.address = "Address must be at least 10 characters long.";
    }

    // Consultation Details Validation
    if (formData.consultation_details.visaTypes.length === 0) {
      newErrors.visaTypes = "At least one Visa Type must be selected.";
    }

    if (formData.consultation_details.preferredCountries.length === 0) {
      newErrors.preferredCountries = "At least one Preferred Country must be selected.";
    }

    // Education & Experience Validation
    formData.education_experience.qualification.forEach((edu, index) => {
      if (!edu.qualification.trim() || !edu.institute.trim() || !edu.year.trim()) {
        newErrors[`qualification_${index}`] = "All education fields are required.";
      } else {
        const year = parseInt(edu.year);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1950 || year > currentYear) {
          newErrors[`qualification_${index}`] = `Year must be between 1950 and ${currentYear}.`;
        }
      }
    });

    if (!formData.education_experience.currentOccupation.trim()) {
      newErrors.currentOccupation = "Current Occupation is required.";
    }

    if (!formData.education_experience.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = "Years of Experience is required.";
    } else {
      const experience = parseFloat(formData.education_experience.yearsOfExperience);
      if (isNaN(experience) || experience < 0 || experience > 50) {
        newErrors.yearsOfExperience = "Please enter a valid number of years (0-50).";
      }
    }

    // Language Proficiency Validation
    formData.languageProficiency.languages.forEach((lang, index) => {
      if (!lang.language.trim()) {
        newErrors[`languages_${index}`] = "Language name is required.";
      }
      if (!lang.speaking && !lang.reading && !lang.writing) {
        newErrors[`languages_${index}_skills`] = "At least one language skill must be selected.";
      }
      if (!lang.examsTaken.trim()) {
        newErrors[`languages_${index}_exams`] = "Exams taken information is required.";
      }
    });

    // Additional Details Validation
    if (!formData.addtionalDetails.previouslyappliedforvisa) {
      newErrors.previouslyappliedforvisa = "Please specify if you have previously applied for a visa.";
    }

    if (!formData.addtionalDetails.anyvisarejections) {
      newErrors.anyvisarejections = "Please specify if you have any visa rejections.";
    }

    if (!formData.addtionalDetails.anylegailissues) {
      newErrors.anylegailissues = "Please specify if you have any legal issues.";
    }

    // Document Checklist Validation
    if (formData.documentedChecklist.length === 0) {
      newErrors.documentedChecklist = "At least one document must be selected.";
    }

    // Declaration Validation
    if (!formData.declaration.signature.trim()) {
      newErrors.signature = "Signature is required.";
    } else if (formData.declaration.signature.trim().length < 2) {
      newErrors.signature = "Signature must be at least 2 characters long.";
    }

    if (!formData.declaration.date) {
      newErrors.date = "Declaration date is required.";
    } else {
      const declDate = new Date(formData.declaration.date);
      const today = new Date();
      if (declDate > today) {
        newErrors.date = "Declaration date cannot be in the future.";
      }
    }

    if (!formData.declaration.declared) {
      newErrors.declared = "You must accept the declaration to proceed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
      alert("Form submitted successfully!");
      // Here you would typically send the data to your backend
    } else {
      alert("Please fix the errors in the form before submitting.");
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
                  {key.replace(/([A-Z])/g, " $1").replace(/^[a-z]/, (c) => c.toUpperCase())}:
                  <input
                    type={
                      key.includes("dob") || key.includes("Expiry")
                        ? "date"
                        : key === "email"
                        ? "email"
                        : key === "phoneNumber"
                        ? "tel"
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
                {errors[key] && (
                  <div className="error-message">{errors[key]}</div>
                )}
              </div>
            ) : null
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
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            {errors.gender && (
              <div className="error-message">{errors.gender}</div>
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
                rows="3"
                placeholder="Enter your complete address"
              />
            </label>
            {errors.address && (
              <div className="error-message">{errors.address}</div>
            )}
          </div>
        </section>

        <section>
          <h2>Purpose of Consultation</h2>
          <div>
            <h3>Visa Types:</h3>
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
                {type.charAt(0).toUpperCase() + type.slice(1)} Visa
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
                placeholder="Specify other visa type"
              />
            </label>
            {errors.visaTypes && (
              <div className="error-message">{errors.visaTypes}</div>
            )}
          </div>

          <div>
            <h3>Preferred Countries:</h3>
            {["usa", "canada", "uk", "australia", "germany", "france"].map((country) => (
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
                placeholder="Specify other country"
              />
            </label>
            {errors.preferredCountries && (
              <div className="error-message">{errors.preferredCountries}</div>
            )}
          </div>

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
              placeholder="Enter referrer's name (optional)"
            />
          </label>
        </section>

        <section>
          <h2>Education & Experience</h2>
          <h3>Educational Qualifications:</h3>
          {formData.education_experience.qualification.map((edu, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <h4>Education #{index + 1}</h4>
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
                  placeholder="e.g., Bachelor's Degree"
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
                  placeholder="e.g., University Name"
                />
              </label>
              <label>
                Year:
                <input
                  type="number"
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
                  placeholder="e.g., 2020"
                  min="1950"
                  max={new Date().getFullYear()}
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
                style={{ marginTop: "10px" }}
              >
                Delete Education
              </button>
              {errors[`qualification_${index}`] && (
                <div className="error-message">{errors[`qualification_${index}`]}</div>
              )}
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
              placeholder="e.g., Software Engineer"
            />
          </label>
          {errors.currentOccupation && (
            <div className="error-message">{errors.currentOccupation}</div>
          )}

          <label>
            Years of Experience:
            <input
              type="number"
              value={formData.education_experience.yearsOfExperience}
              onChange={(e) =>
                handleInputChange(
                  "education_experience",
                  "yearsOfExperience",
                  e.target.value
                )
              }
              placeholder="e.g., 5"
              min="0"
              max="50"
              step="0.5"
            />
          </label>
          {errors.yearsOfExperience && (
            <div className="error-message">{errors.yearsOfExperience}</div>
          )}
        </section>

        <section>
          <h2>Language Proficiency</h2>
          {formData.languageProficiency.languages.map((lang, index) => (
            <div key={index} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <h4>Language #{index + 1}</h4>
              <label>
                Language:
                <input
                  type="text"
                  value={lang.language}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "languageProficiency",
                      "languages",
                      index,
                      "language",
                      e.target.value
                    )
                  }
                  placeholder="e.g., English"
                />
              </label>
              {errors[`languages_${index}`] && (
                <div className="error-message">{errors[`languages_${index}`]}</div>
              )}

              <div>
                <h5>Language Skills:</h5>
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
                {errors[`languages_${index}_skills`] && (
                  <div className="error-message">{errors[`languages_${index}_skills`]}</div>
                )}
              </div>

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
                  placeholder="e.g., IELTS - 7.5, TOEFL - 100"
                />
              </label>
              {errors[`languages_${index}_exams`] && (
                <div className="error-message">{errors[`languages_${index}_exams`]}</div>
              )}

              <button
                type="button"
                onClick={() =>
                  deleteNestedItem("languageProficiency", "languages", index)
                }
                disabled={formData.languageProficiency.languages.length === 1}
                style={{ marginTop: "10px" }}
              >
                Delete Language
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
          <h2>Additional Details</h2>
          <label>
            Have you previously applied for a visa?
            <select
              value={formData.addtionalDetails.previouslyappliedforvisa}
              onChange={(e) =>
                handleInputChange(
                  "addtionalDetails",
                  "previouslyappliedforvisa",
                  e.target.value
                )
              }
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {errors.previouslyappliedforvisa && (
            <div className="error-message">{errors.previouslyappliedforvisa}</div>
          )}

          <label>
            Do you have any visa rejections?
            <select
              value={formData.addtionalDetails.anyvisarejections}
              onChange={(e) =>
                handleInputChange(
                  "addtionalDetails",
                  "anyvisarejections",
                  e.target.value
                )
              }
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {errors.anyvisarejections && (
            <div className="error-message">{errors.anyvisarejections}</div>
          )}

          <label>
            Do you have any legal issues?
            <select
              value={formData.addtionalDetails.anylegailissues}
              onChange={(e) =>
                handleInputChange(
                  "addtionalDetails",
                  "anylegailissues",
                  e.target.value
                )
              }
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
          {errors.anylegailissues && (
            <div className="error-message">{errors.anylegailissues}</div>
          )}
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
            "financialDocuments",
            "medicalCertificates",
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
          {errors.documentedChecklist && (
            <div className="error-message">{errors.documentedChecklist}</div>
          )}
        </section>

        <section>
          <h2>Declaration</h2>
          <label>
            Digital Signature:
            <input
              type="text"
              value={formData.declaration.signature}
              onChange={(e) =>
                handleInputChange("declaration", "signature", e.target.value)
              }
              placeholder="Type your full name as signature"
            />
          </label>
          {errors.signature && (
            <div className="error-message">{errors.signature}</div>
          )}

          <label>
            Date:
            <input
              type="date"
              value={formData.declaration.date}
              onChange={(e) =>
                handleInputChange("declaration", "date", e.target.value)
              }
              max={new Date().toISOString().split('T')[0]}
            />
          </label>
          {errors.date && (
            <div className="error-message">{errors.date}</div>
          )}

          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={formData.declaration.declared}
              onChange={(e) =>
                handleInputChange("declaration", "declared", e.target.checked)
              }
              style={{ width: "20px", height: "20px", marginRight: "10px" }}
            />
            <span>
              I declare that the information provided above is true and correct to the best of my knowledge. 
              I understand that any false information may result in the rejection of my application.
            </span>
          </label>
          {errors.declared && (
            <div className="error-message">{errors.declared}</div>
          )}
        </section>

        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px", marginTop: "20px" }}>
          Submit Application
        </button>
      </form>
    </div>
  );
}