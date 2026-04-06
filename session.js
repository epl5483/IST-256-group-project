import React, { useEffect, useState } from "react";

const STORAGE_KEY = "conference_session";

function SessionManager() {
  const [sessions, setSessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    sessionID: "",
    sessionTitle: "",
    workshop: "",
    duration: "",
    registrationFee: "",
    speaker: "",
    additionalInfo: "",
  });

  const [errors, setErrors] = useState({});

  
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setSessions(stored);
  }, []);

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);


  const validateField = (name, value) => {
    let error = "";

    if (!value && ["sessionID", "sessionTitle", "workshop", "duration", "registrationFee", "speaker"].includes(name)) {
      return "This is a required field";
    }

    if (value) {
      if (["sessionID", "sessionTitle", "workshop", "speaker"].includes(name) && value.length < 4) {
        return `${name} must be at least 4 characters`;
      }
      if (name === "duration" && value.length < 1) {
        return "Duration must be at least 1 character";
      }
      if (name === "registrationFee" && value.length < 2) {
        return "Registration Fee must be at least 2 characters";
      }
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      newErrors[key] = validateField(key, form[key]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some((e) => e);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please correct the errors before submitting.");
      return;
    }

    const newSession = {
      ...form,
      additionalInfo: form.additionalInfo || "Not provided",
    };

    if (editIndex !== null) {
      const updated = [...sessions];
      updated[editIndex] = newSession;
      setSessions(updated);
      setEditIndex(null);
      alert("Session updated successfully!");
    } else {
      setSessions((prev) => [...prev, newSession]);
      alert("Session successfully registered!");
    }

    setForm({
      sessionID: "",
      sessionTitle: "",
      workshop: "",
      duration: "",
      registrationFee: "",
      speaker: "",
      additionalInfo: "",
    });
    setErrors({});
  };

 
  const handleEdit = (index) => {
    const s = sessions[index];
    setForm(s);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };


  const filteredSessions = sessions.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.sessionID.toLowerCase().includes(q) ||
      s.sessionTitle.toLowerCase().includes(q) ||
      s.workshop.toLowerCase().includes(q) ||
      s.speaker.toLowerCase().includes(q)
    );
  });

  const getInputClass = (name) => {
    if (!form[name]) return "";
    return errors[name] ? "is-invalid" : "is-valid";
  };

  return (
    <div className="container my-4">
      <h2>Session Management</h2>

      {/* SEARCH */}
      <div className="mb-3">
        <input
          type="text"
          id="searchInput"
          className="form-control"
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FORM */}
      <form id="signupForm" onSubmit={handleSubmit} noValidate>
        {[
          { label: "Session ID", name: "sessionID" },
          { label: "Session Title", name: "sessionTitle" },
          { label: "Workshop", name: "workshop" },
          { label: "Duration", name: "duration" },
          { label: "Registration Fee", name: "registrationFee" },
          { label: "Speaker", name: "speaker" },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="form-label">{field.label}</label>
            <input
              type="text"
              name={field.name}
              className={`form-control ${getInputClass(field.name)}`}
              value={form[field.name]}
              onChange={handleChange}
              required
            />
            {errors[field.name] && (
              <div className="invalid-feedback d-block">{errors[field.name]}</div>
            )}
          </div>
        ))}

        {/* Additional Info */}
        <div className="mb-3">
          <label className="form-label">Additional Info</label>
          <textarea
            name="additionalInfo"
            className="form-control"
            value={form.additionalInfo}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">
          {editIndex !== null ? "Update Session" : "Add Session"}
        </button>
      </form>

      <hr />

      {/* SESSION LIST */}
      <h3>All Sessions</h3>
      <div id="sessionCard" className="mt-3">
        {filteredSessions.length === 0 ? (
          <p className="text-muted">No sessions found.</p>
        ) : (
          filteredSessions.map((session, index) => (
            <div className="card mb-3 p-3" key={index}>
              <h5>{session.sessionID}</h5>
              <p>Session Title: {session.sessionTitle}</p>
              <p>Workshop: {session.workshop}</p>
              <p>Duration: {session.duration}</p>
              <p>Registration Fee: {session.registrationFee}</p>
              <p>Speaker: {session.speaker}</p>
              <p>Additional Info: {session.additionalInfo}</p>

              <button
                className="btn btn-warning me-2"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SessionManager;

