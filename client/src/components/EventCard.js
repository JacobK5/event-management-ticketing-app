import React, { useState } from "react";
import "./EventCard.css";

const EventCard = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isFreeEvent, setIsFreeEvent] = useState(false);

  const showDetails = (freeEvent) => {
    setIsFreeEvent(freeEvent);
    setIsPopupVisible(true);
  };

  const hideDetails = () => {
    setIsPopupVisible(false);
  };

  return (
    <div>
      {/* Event Card */}
      <div className="event-card">
        <h2 className="event-title">Event Title</h2>
        <p className="event-info">Date | Time</p>
        <p className="event-location">Location</p>
        <button
          className="details-btn"
          onClick={() => showDetails(false)} // Change to true for free events
        >
          Details
        </button>
      </div>

      {/* Event Details Popup */}
      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <h2 className="popup-title">Event Title</h2>
            <p className="popup-info">Date | Time</p>
            <p className="popup-location">Location</p>
            <p className="popup-description">Description</p>
            <div className="popup-buttons">
              {!isFreeEvent && (
                <>
                  <button className="popup-btn">Purchase Ticket</button>
                  <button className="popup-btn">Resale Options</button>
                </>
              )}
              {isFreeEvent && <button className="popup-btn">RSVP</button>}
            </div>
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
