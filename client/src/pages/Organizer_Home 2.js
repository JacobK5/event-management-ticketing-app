import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Create_Event from "./Create_Event"

const Organizer_Home = () => {
  return (
    <>
    
      <main className="center-content">
        <BrowserRouter>
          <a href="create_event" class="create">Create New Event</a>

          <a href="discount" class="create">Create Discount Code</a>

        <Routes>
        {/* Define routes for components */}
          <Route path="create_event" element={<Create_Event/>} />
          <Route path="discount" element={<Create_Event />} />

        </Routes>

        </BrowserRouter>
      </main>
    </>
    
    
  );
};

export default Organizer_Home;
