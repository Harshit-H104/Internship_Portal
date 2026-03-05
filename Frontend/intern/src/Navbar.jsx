import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:3001/logout", {
      method: "POST",
      credentials: "include",
    });

    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Internship Portal</h2>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        {isLoggedIn && <Link to="/applied">Applied</Link>}
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      

        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">logout</Link>
        )}
      </div>
    </nav>
  );
}
export default Navbar;