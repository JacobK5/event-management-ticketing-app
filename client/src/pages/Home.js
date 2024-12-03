import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import Organizer_Home from "./Organizer_Home";
import { getCurrentUser } from "../services/auth";
import Organizer_Header from "../components/Organizer_Header";

const Home = () => {
  const [isOrganizer, setOrganizer] = useState(false);

  useEffect(() => {
    // Get the user's data
    const user = getCurrentUser();
    // Check if the user is an organizer
    setOrganizer(user && user.Organizer_SSN);
  }, []);

  if (isOrganizer) {
    return (
      <>
        <Organizer_Header />
        <Organizer_Home />;
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="center-content">
        <h1 className="logo">Eventure</h1>
        <div className="search-container">
          <SearchBar />
        </div>
      </main>
    </>
  );
};

export default Home;
