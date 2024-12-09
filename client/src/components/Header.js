import React, { useState } from "react";
import { isAuthenticated, logout } from "../services/auth";
import { useLocation } from "react-router-dom";
import "../styles/drop_menu.css"
const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const loggedIn = isAuthenticated();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    // Optionally redirect to the home page or login page after logging out
    window.location.href = "/";
  };

  const isActiveCategory = (category) => {
    return location.pathname === `/events/view${category}`;
  };

  return (
    <header>
      <nav className="menu">
        <div className="menu-left">
          <a
            href="/events/view"
            className={`menu-item ${isActiveCategory("") ? "active" : ""}`}
          >
            All
          </a>
          <a
            href="/events/view/concerts"
            className={`menu-item ${
              isActiveCategory("/concerts") ? "active" : ""
            }`}
          >
            Concerts
          </a>
          <a
            href="/events/view/sports"
            className={`menu-item ${
              isActiveCategory("/sports") ? "active" : ""
            }`}
          >
            Sports
          </a>
          <a
            href="/events/view/theatre"
            className={`menu-item ${
              isActiveCategory("/theatre") ? "active" : ""
            }`}
          >
            Theatre
          </a>
          <a
            href="/events/view/family"
            className={`menu-item ${
              isActiveCategory("/family") ? "active" : ""
            }`}
          >
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
