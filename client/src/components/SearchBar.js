import React from "react";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search by Artist, Event, or Venue..." />
      <button>Search</button>
    </div>
  );
};

export default SearchBar;
