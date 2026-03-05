import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Applied from "./Applied";
import Navbar from "./Navbar";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import AdminDashboard from "./AdminDashboard";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <Routes>
        {/* Default Route */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Register />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path="/applied"
          element={isLoggedIn ? <Applied /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* Public Routes */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;