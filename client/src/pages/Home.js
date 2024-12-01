import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import Organizer_Home from "./Organizer_Home";

const Home = () => {
  // will be replaced by a useEffect that get's the user's data and checks if they are an organizer
  const [isOrganizer, setOrganizer] = useState(false);

  if (isOrganizer) {
    return <Organizer_Home />;
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
