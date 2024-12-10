import React from "react";

const Organizer_Header = () => {
  return (
    <header>
      <nav className="menu">
        <div class="menu-left"> 
        </div>

        <div class="dropdown">
          <a href="#" class="dropbtn">👤 Account </a>
          <div class="dropdown-content">
            <a href="#" class="menu-item">View Event</a>
            <a href="#">View Discount</a>
            <a href="#">Logout</a>
          </div>
        </div>

      </nav>
    </header>
  );
};

export default Organizer_Header;
