import React from "react";
import "./App.css";

function AboutUs() {
  return (
    <div className="about-wrapper">

      {/* 1 Hero */}
      <section className="about-hero">
        <h1>Welcome to Internship Portal</h1>
        <p>Your Gateway to Professional Growth</p>
      </section>

      {/* 2 Vision */}
      <section className="about-section">
        <h2>Our Vision</h2>
        <p>
          To become India's most trusted internship platform connecting
          students with real-world industry experience.
        </p>
      </section>

      {/* 3 Mission */}
      <section className="about-section dark">
        <h2>Our Mission</h2>
        <p>
          Making internships simple, transparent, and accessible
          for every student across the country.
        </p>
      </section>

      {/* 4 What We Do */}
      <section className="about-section">
        <h2>What We Do</h2>
        <p>
          We provide a seamless platform where students can explore,
          apply, and track internships effortlessly.
        </p>
      </section>

      {/* 5 Features */}
      <section className="about-cards">
        <div className="about-card">
          <h3>Easy Applications</h3>
          <p>One-click internship applications.</p>
        </div>
        <div className="about-card">
          <h3>Verified Companies</h3>
          <p>Opportunities from trusted recruiters.</p>
        </div>
        <div className="about-card">
          <h3>Application Tracking</h3>
          <p>Monitor all your applied internships.</p>
        </div>
      </section>

      {/* 6 Our Impact */}
      <section className="about-section dark">
        <h2>Our Impact</h2>
        <p>1000+ Students Connected | 200+ Companies | 500+ Internships</p>
      </section>

      {/* 7 Why Choose Us */}
      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <p>
          We focus on simplicity, security, and speed to ensure
          the best experience for students and recruiters.
        </p>
      </section>

      {/* 8 Our Values */}
      <section className="about-section dark">
        <h2>Our Core Values</h2>
        <p>Transparency • Innovation • Growth • Integrity</p>
      </section>

      {/* 9 Future Goals */}
      <section className="about-section">
        <h2>Our Future Goals</h2>
        <p>
          Expanding globally and introducing AI-powered internship matching.
        </p>
      </section>

      {/* 10 Closing CTA */}
      <section className="about-cta">
        <h2>Start Your Journey With Us</h2>
        <p>Explore internships and build your career today.</p>
      </section>

    </div>
  );
}

export default AboutUs;