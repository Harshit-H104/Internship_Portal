import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Opp from "./Opp.json";
import { applyInternship } from "./api/api";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [disabledButtons, setDisabledButtons] = useState([]);

  // 🔒 AUTH CHECK
  useEffect(() => {
    axios
      .get("http://localhost:3001/home", { withCredentials: true })
      .catch(() => {
        navigate("/");
      });
  }, [navigate]);

  // ✅ APPLY FUNCTION
  const apply = async (internship, index) => {
    try {
      await applyInternship({
        company: internship.Company,
        role: internship.Role,
        stipend: internship.Location.Stipend,
        location: {
          office: internship.Location.Office,
        },
      });

      setDisabledButtons((prev) => [...prev, index]);
      alert("Applied Successfully ✅");
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Internships</h2>

      {Opp.Internships.map((internship, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "8px",
          }}
        >
          <h3>{internship.Role}</h3>
          <p><b>Company:</b> {internship.Company}</p>
          <p><b>Office:</b> {internship.Location.Office}</p>
          <p><b>Stipend:</b> {internship.Location.Stipend}</p>
          <p><b>Duration:</b> {internship.Internship.Duration}</p>

          <button
            onClick={() => apply(internship, index)}
            disabled={disabledButtons.includes(index)}
            style={{
              padding: "8px 16px",
              backgroundColor: disabledButtons.includes(index)
                ? "gray"
                : "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            {disabledButtons.includes(index) ? "Applied" : "Apply Now"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;
