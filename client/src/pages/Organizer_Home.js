import React from "react";
import Create_Event from "./Create_Event";

const Organizer_Home = () => {
  return (
    <>
      <main className="center-content">
        <a href="events/create" class="create">
          Create New Event
        </a>
        <a href="discounts/create" class="create">
          Create Discount Code
        </a>
      </main>
    </>
  );
};

export default Organizer_Home;
