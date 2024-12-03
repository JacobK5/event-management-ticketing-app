import React from "react";
import { logout } from "../services/auth";

const Organizer_Header = () => {
  const handleLogout = () => {
    // Log out the user
    logout();
    // Redirect to the home page or login page after logging out
    window.location.href = "/";
  };
  return (
    <header>
      <nav className="menu">
        <div className="menu-left"></div>

        <div className="dropdown">
          <a href="#" className="dropbtn">
            👤 Account{" "}
          </a>
          <div className="dropdown-content">
            <a href="#" className="menu-item">
              View Event
            </a>
            <a href="#">View Discount</a>
            <a onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Organizer_Header;
