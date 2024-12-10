import React from "react";
import SearchBar from "../components/SearchBar";

const Home = () => {
  return (
    <main className="center-content">
      <h1 className="logo">Eventure</h1>
      <div className="search-container">
        <SearchBar />
      </div>
    </main>
  );
};

export default Home;
