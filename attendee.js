import React, { useEffect, useState } from "react";

const STORAGE_KEY = "conference_attendees";

function AttendeeSignup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gradeLevel: "",
    institution: "",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setAttendees(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendees));
  }, [attendees]);

  const validateField = (name, value) => {
    let error = "";

    if (!value && ["fullName", "email", "gradeLevel", "institution"].includes(name)) {
      error = "This is a required field";
    }

    if (!error && value) {
      if (name === "fullName" && value.trim().length < 2) {
        error = "Name must be at least 2 characters";
      }
      if (name === "email") {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          error = "Invalid email format";
        }
      }
      if (name === "contactNumber" && value) {
        if (!/^\d{10}$/.test(value)) {
          error = "Number must be 10 digits";
        }
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      newErrors[key] = validateField(key, form[key]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please correct the errors before submitting.");
      return;
    }

    const formData = {
      ...form,
      contactNumber: form.contactNumber || "Not provided",
    };

    setAttendees((prev) => [...prev, formData]);
    alert("Attendee successfully registered!");

    setForm({
      fullName: "",
      email: "",
      gradeLevel: "",
      institution: "",
      contactNumber: "",
    });
    setErrors({});
  };

  const deleteAttendee = (index) => {
    setAttendees((prev) => prev.filter((_, i) => i !== index));
  };

  const getInputClass = (name) => {
    if (!form[name]) return "";
    return errors[name] ? "is-invalid" : "is-valid";
  };

  return (
    <div className="container my-4">
      <h2 className="mb-3">Conference Attendee Registration</h2>

      <form id="signupForm" onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className={`form-control ${getInputClass("fullName")}`}
            value={form.fullName}
            onChange={handleChange}
            required
          />
          {errors.fullName && (
            <div className="invalid-feedback d-block">{errors.fullName}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${getInputClass("email")}`}
            value={form.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <div className="invalid-feedback d-block">{errors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Grade Level</label>
          <input
            type="text"
            name="gradeLevel"
            className={`form-control ${getInputClass("gradeLevel")}`}
            value={form.gradeLevel}
            onChange={handleChange}
            required
          />
          {errors.gradeLevel && (
            <div className="invalid-feedback d-block">{errors.gradeLevel}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Institution</label>
          <input
            type="text"
            name="institution"
            className={`form-control ${getInputClass("institution")}`}
            value={form.institution}
            onChange={handleChange}
            required
          />
          {errors.institution && (
            <div className="invalid-feedback d-block">{errors.institution}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Contact Number (optional)</label>
          <input
            type="text"
            name="contactNumber"
            className={`form-control ${getInputClass("contactNumber")}`}
            value={form.contactNumber}
            onChange={handleChange}
          />
          {errors.contactNumber && (
            <div className="invalid-feedback d-block">
              {errors.contactNumber}
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Register Attendee
        </button>
      </form>

      <hr className="my-4" />

      <h3>Registered Attendees</h3>
      <div id="userCard" className="mt-3">
        {attendees.length === 0 && (
          <p className="text-muted">No attendees registered yet.</p>
        )}
        {attendees.map((attendee, index) => (
          <div className="card mb-3 p-3" key={index}>
            <h5>{attendee.fullName}</h5>
            <p>Email: {attendee.email}</p>
            <p>Grade Level: {attendee.gradeLevel}</p>
            <p>Institution: {attendee.institution}</p>
            <p>Contact Number: {attendee.contactNumber}</p>
            <button
              className="btn btn-danger"
              onClick={() => deleteAttendee(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttendeeSignup;
