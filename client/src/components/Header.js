import React from "react";

const Header = () => {
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
          <a href="/login" className="menu-item sign-in">
            👤 Sign In
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
