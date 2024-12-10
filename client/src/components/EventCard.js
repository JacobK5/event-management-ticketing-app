import React, { useState, useEffect } from "react";
import "../styles/EventCard.css";
import { getCurrentUser } from "../services/auth";
import apiRequest from "../services/api";

const EventCard = ({ event }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  console.log("event:", event);

  //I'll leave this here in case this is where you wanna use it
  useEffect(() => {
    const fetchTicketsSummary = async () => {
      const response = await apiRequest(
        "GET",
        `events/${event.EventID}/tickets/summary`
      );
      console.log("tickets summary response:", response);
    };
    const fetchDiscounts = async () => {
      const response = await apiRequest(
        "GET",
        `events/${event.EventID}/discounts`
      );
      console.log("discounts response:", response);
    };

    fetchTicketsSummary();
    fetchDiscounts();
  }, []);

  // Determine if the event is free based on ticket price
  const isFreeEvent = event.isPaid === 0;

  // use to show edit button and other stuff for the organizer if needed
  const userIsOrganizer = getCurrentUser()?.UserID === event.OrganizerID;

  const formattedDate = new Date(event.Date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeParts = event.Time.split(":");
  const timeAsDate = new Date();
  timeAsDate.setHours(
    parseInt(timeParts[0]),
    parseInt(timeParts[1]),
    parseInt(timeParts[2])
  );
  const formattedTime = timeAsDate.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const showDetails = () => {
    setIsPopupVisible(true);
  };

  const hideDetails = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      {/* Event Card */}
      <div className="event-card">
        <h2 className="event-title">{event.EventID}</h2>{" "}
        {/* Display EventID as the title */}
        <p className="event-info">
          {formattedDate} | {formattedTime}
        </p>{" "}
        {/* Display date and time */}
        <p className="event-location">{event.Location_Name}</p>{" "}
        {/* Display event location */}
        <button
          className="details-btn"
          onClick={showDetails} // Show details popup
        >
          Details
        </button>
      </div>

      {/* Event Details Popup */}
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2 className="popup-title">{event.EventID}</h2>{" "}
            {/* Display EventID */}
            <p className="popup-info">
              {formattedDate} | {formattedTime}
            </p>{" "}
            {/* Display date and time */}
            <p className="popup-location">{event.Location_Name}</p>{" "}
            {/* Display location */}
            <p className="popup-description">{event.Description}</p>{" "}
            {/* Display description */}
            <div className="popup-buttons">
              {!isFreeEvent && (
                <>
                  <button onClick={() => (window.location.href = `/events/payment/${event.EventID}`)} className="popup-btn">
                      Purchase Ticket</button>
                  <button className="popup-btn">Resale Options</button>
                </>
              )}
              {isFreeEvent && <button className="popup-btn">RSVP</button>}
            </div>
            {userIsOrganizer && (
              <button
                className="popup-btn"
                onClick={() =>
                  (window.location.href = `/events/edit/${event.EventID}`)
                }
              >
                Edit Event
              </button>
            )}
            <button className="close-btn" onClick={hideDetails}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
