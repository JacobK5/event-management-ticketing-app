import React, { useState } from "react";
import { isAuthenticated, logout } from "../services/auth";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const loggedIn = isAuthenticated();

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    // Optionally redirect to the home page or login page after logging out
    window.location.href = "/";
  };

  return (
    <header>
      <nav className="menu">
        <div className="menu-left">
          <a href="#" className="menu-item">
            Concerts
          </a>
          <a href="#" className="menu-item">
            Sports
          </a>
          <a href="#" className="menu-item">
            Theatre
          </a>
          <a href="#" className="menu-item">
            Family
          </a>
        </div>
        <div className="menu-right">
          {loggedIn ? (
            <div className="dropdown">
              <a href="#" className="dropbtn">
                👤 Account{" "}
              </a>
              <div className="dropdown-content">
                <a href="/account">My Account</a>
                <a onClick={handleLogout}>Logout</a>
              </div>
            </div>
          ) : (
            <a href="/login" className="menu-item sign-in">
              👤 Sign In
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
