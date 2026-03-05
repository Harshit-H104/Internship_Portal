import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Applied = () => {
  const [appliedInternships, setAppliedInternships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppliedInternships = async () => {
      try {
        const response = await fetch("http://localhost:3001/applied", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAppliedInternships(data);
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    fetchAppliedInternships();
  }, [navigate]);

  return (
    <div className="applied-page">
      <div className="applied-container">
        <h2 className="applied-title">Applied Internships</h2>

        {appliedInternships.length > 0 ? (
          <div className="applied-grid">
            {appliedInternships.map((internship, index) => (
              <div key={index} className="applied-card">
                <h3>{internship.company}</h3>

                <p><strong>Role:</strong> {internship.role}</p>
                <p><strong>Office:</strong> {internship.location?.office}</p>
                <p><strong>Stipend:</strong> {internship.location?.stipend}</p>
                <p><strong>Phone:</strong> {internship.phone}</p>
                <p><strong>Email:</strong> {internship.email}</p>

                <a
                  href={internship.resumeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="resume-link"
                >
                  View Resume
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No internships applied yet.</p>
        )}
      </div>
    </div>
  );
};

export default Applied;