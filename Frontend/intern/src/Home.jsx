import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Opp from "./Opp.json";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:3001/profile", {
          withCredentials: true,
        });
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const apply = (internship, index) => {
    setSelectedInternship({ internship, index });
  };

  const submitApplication = async (e) => {
    e.preventDefault();

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3001/apply",
        {
          opportunity: {
            company: selectedInternship?.internship?.Company,
            role: selectedInternship?.internship?.Role,
            location: {
              office: selectedInternship?.internship?.Location?.Office,
              stipend: selectedInternship?.internship?.Location?.Stipend,
            },
          },
          phone,
          email,
          resumeLink,
        },
        { withCredentials: true }
      );

      setDisabledButtons((prev) => [...prev, selectedInternship.index]);
      setSelectedInternship(null);
      setPhone("");
      setEmail("");
      setResumeLink("");

      alert("Applied Successfully ✅");
    } catch (error) {
      alert("Session expired. Please login again.");
      navigate("/login");
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h2 className="home-title">Available Internships</h2>

        <div className="internship-grid">
          {(Opp?.Internships || []).map((internship, index) => (
            <div key={index} className="internship-card">
              <h3>{internship.Role}</h3>
              <p><b>Company:</b> {internship.Company}</p>
              <p><b>Office:</b> {internship.Location?.Office}</p>
              <p><b>Stipend:</b> {internship.Location?.Stipend}</p>
              <p><b>Duration:</b> {internship.Internship?.Duration}</p>

              <button
                onClick={() => apply(internship, index)}
                disabled={disabledButtons.includes(index)}
                className={`apply-btn ${
                  disabledButtons.includes(index) ? "disabled" : ""
                }`}
              >
                {disabledButtons.includes(index) ? "Applied" : "Apply Now"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedInternship && (
        <div className="modal-overlay">
          <div className="modal-box premium-modal">
            <h3 className="modal-title">
              Apply for {selectedInternship.internship.Role}
            </h3>

            <form onSubmit={submitApplication} className="modal-form">
              <input
                type="tel"
                placeholder="Phone (10 digits)"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 10) setPhone(value);
                }}
                className="modal-input"
              />

              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="modal-input"
              />

              <input
                type="text"
                placeholder="Resume Link (Google Drive / Portfolio)"
                required
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                className="modal-input"
              />

              <div className="modal-buttons">
                <button type="submit" className="submit-btn">
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInternship(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;