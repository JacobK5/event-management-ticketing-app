import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import apiRequest from "../services/api"; // Helper for API requests
import Header from "../components/Header";
import { getCurrentUser } from "../services/auth";

const OrganizerEvents = () => {
  const [events, setEvents] = useState([]);
  const user = getCurrentUser();

  console.log("user:", user);
  if (user.Organizer_SSN === null) {
    // Redirect to home if the user is not an organizer
    window.location.href = "/";
  }

  useEffect(() => {
    const fetchOrganizerEvents = async () => {
      try {
        const response = await apiRequest(
          "GET",
          `events/organizer/${user.UserID}`
        );
        console.log("Organizer events:", response);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching organizer events:", error);
      }
    };

    fetchOrganizerEvents();
  }, []);

  return (
    <>
      <Header />
      <main className="center-content">
        <h1>Your Events</h1>
        <div className="events-container">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard key={event.EventID} event={event} />
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default OrganizerEvents;
