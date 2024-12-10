import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import apiRequest from "../services/api"; // Helper function for API calls
import { getCurrentUser } from "../services/auth";
// import "../styles/Account.css"

const Account = () => {
  const [tickets, setTickets] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    // Fetch tickets and RSVPs when the page loads
    const fetchAccountData = async () => {
      try {
        console.log("user:", user);
        setLoading(true);
        const ticketsResponse = await apiRequest(
          "GET",
          `users/${user.UserID}/tickets`
        );
        console.log("ticketsResponse:", ticketsResponse);
        const rsvpsResponse = await apiRequest(
          "GET",
          `users/${user.UserID}/rsvps`
        );
        console.log("rsvpsResponse:", rsvpsResponse);
        console.log("ticketsResponse:", ticketsResponse);
        setTickets(ticketsResponse.data);
        setRsvps(rsvpsResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching account data:", err);
        setError("Failed to load account data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const handleRefundRequest = async (ticketId, paymentRef) => {
    try {
      await apiRequest("POST", "payments/refund", {
        ticketId,
        refNum: paymentRef,
      });
      alert("Refund requested successfully!");
      // Optionally refetch tickets to update the state
    } catch (err) {
      console.error("Error requesting refund:", err);
      alert("Failed to request refund.");
    }
  };

  const handleListResale = async (ticketId, resalePrice) => {
    try {
      await apiRequest("POST", "tickets/resell", {
        ticketId,
        price: resalePrice,
        userId: user.UserID,
      });
      alert("Ticket listed for resale successfully!");
      // Optionally refetch tickets to update the state
    } catch (err) {
      console.error("Error listing ticket for resale:", err);
      alert("Failed to list ticket for resale.");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    const timeParts = time.split(":");
    const timeAsDate = new Date();
    timeAsDate.setHours(
      parseInt(timeParts[0]),
      parseInt(timeParts[1]),
      parseInt(timeParts[2])
    );
    return timeAsDate.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div>
      <Header />
      <main>
        <h1>My Account</h1>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <section>
          <h2>My Tickets</h2>
          {tickets.map((ticket) => (
            <div key={ticket.Ticket_ID} className="ticket-card">
              <p>
                <strong>Event:</strong> {ticket.EventID}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(ticket.Date)}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(ticket.Time)}
              </p>
              <p>
                <strong>Location:</strong> {ticket.Location_Name}
              </p>
              {ticket.refundStatus === null ? (
                ticket.resaleListingId === null ? (
                  <button
                    onClick={() =>
                      handleRefundRequest(ticket.Ticket_ID, ticket.Pmt_Ref_Num)
                    }
                  >
                    Request Refund
                  </button>
                ) : null
              ) : (
                <p>
                  <strong>Refund Status:</strong> {ticket.refundStatus}
                </p>
              )}
              {ticket.resaleListingId === null ? (
                ticket.refundStatus === null ? (
                  <button
                    onClick={() => {
                      const resalePrice = prompt("Enter resale price:");
                      if (resalePrice) {
                        handleListResale(ticket.Ticket_ID, resalePrice);
                      }
                    }}
                  >
                    List for Resale
                  </button>
                ) : null
              ) : (
                <p>Ticket is listed for resale</p>
              )}
            </div>
          ))}
        </section>

        <section>
          <h2>My RSVPs</h2>
          {rsvps.map((rsvp) => (
            <div key={rsvp.EventID} className="rsvp-card">
              <p>
                <strong>Event:</strong> {rsvp.EventID}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(rsvp.Date)}
              </p>
              <p>
                <strong>Time:</strong> {formatTime(rsvp.Time)}
              </p>
              <p>
                <strong>Location:</strong> {rsvp.Location_Name}
              </p>
              <p>
                <strong>Status:</strong> {rsvp.Status}
              </p>
            </div>
          ))}
        </section>

        <button onClick={() => (window.location.href = "/edit-account")}>
          Edit Account Details
        </button>
      </main>
    </div>
  );
};

export default Account;
