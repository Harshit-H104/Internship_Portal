import React from "react";
import "./App.css";

function ContactUs() {
  return (
    <div className="contact-wrapper">

      <div className="contact-container">

        {/* Left Side Info */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>
            Have questions about internships or need help? 
            We're here to assist you.
          </p>

          <div className="contact-details">
            <p><strong>Email:</strong> support@internshipportal.com</p>
            <p><strong>Phone:</strong> +91 9876543210</p>
            <p><strong>Location:</strong> Varanasi, India</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="contact-form">
          <h2>Contact Us</h2>

          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea rows="5" placeholder="Your Message" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>

      </div>

    </div>
  );
}

export default ContactUs;