import React from "react";
import Create_Event from "./Create_Event";

const Organizer_Home = () => {
  return (
    <>
      <main className="center-content">
        <a href="events/create" className="create">
          Create New Event
        </a>
        <a href="discounts/create" className="create">
          Create Discount Code
        </a>
      </main>
    </>
  );
};

export default Organizer_Home;
