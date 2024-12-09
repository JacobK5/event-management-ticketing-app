import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import apiRequest from "../services/api"; // Helper function for making API requests
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";

const ViewEvents = () => {
  const { category, searchTerm } = useParams(); // Extract URL parameters
  const [events, setEvents] = useState([]); // State to store events
  console.log("rendering");

  useEffect(() => {
    console.log("category:", category);
    console.log("searchTerm:", searchTerm);

    const fetchEvents = async () => {
      try {
        // Construct query parameters
        const queryParams = new URLSearchParams();
        if (category) queryParams.append("category", category);
        if (searchTerm) queryParams.append("searchTerm", searchTerm);

        // Make the API request with query parameters
        const response = await apiRequest(
          "GET",
          `events?${queryParams.toString()}`
        );
        console.log("events response:", response);

        // Set the fetched events in state
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [category, searchTerm]); // Re-run effect if parameters change

  return (
    <>
      <Header /> {/* Fixed navigation bar */}
      <main className="center-content view-events-page">
        {" "}
        {/* Align with global styles */}
        <div className="search-container">
          <SearchBar /> {/* Styled search bar */}
        </div>
        <h1 className="logo">Events</h1> {/* Add logo styling */}
        <div className="events-container">
          {events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event.EventID}
                event={event} // Pass event props to EventCard
              />
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default ViewEvents;
