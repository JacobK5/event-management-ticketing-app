import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState(""); // State to track the input value
  const navigate = useNavigate(); // React Router hook for navigation

  const handleSearch = () => {
    if (query.trim()) {
      // Redirect to the search results page with the query
      navigate(`/events/view/search/${query}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by Artist, Event, or Venue..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Update state on input change
        onKeyPress={handleKeyPress} // Trigger search on Enter key
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
