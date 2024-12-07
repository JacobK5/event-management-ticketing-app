import React, { useState } from "react";
import Header from "./components/Header";
import Organizer_Header from "./components/Organizer_Header";
import Home from "./pages/Home";
import Organizer_Home from "./pages/Organizer_Home";
import Create_Event from "./pages/Create_Event";
import Create_Discount from "./pages/Create_Discount";
import EventCard from "./components/EventCard";
// import Counter from "./pages/Example";



const App = () => {

  const [isOrganizer, setOrganizer] = useState(true);

  // Function to toggle between user and admin mode
  const toggleMode = () => {
    setOrganizer((prevMode) => !prevMode); // Switch mode
  };

  return (
    <>
      { isOrganizer ? (
        <>
          <Organizer_Header/>
          <Create_Discount/>
          <EventCard/>
        </>
        
      ) : (
        <>
          <Header/>
          <Home/>
        </>
        
      )}
      
      
      

    </>
  );
};

export default App;
