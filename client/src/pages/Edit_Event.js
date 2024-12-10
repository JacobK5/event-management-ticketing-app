import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import apiRequest from "../services/api";
import { getCurrentUser } from "../services/auth";
import { useParams } from "react-router-dom";

// NOTE: Still need to implement adding discounts here

const Edit_Event = () => {
  const [event, setEvent] = useState([]); // State to store event
  const [ticketTiers, setTicketTiers] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);

  const [showTicketInput, setShowTicketInput] = useState(false);
  const [formData, setFormData] = useState({
    locationName: "",
    locationAddress: "",
    date: "",
    time: "",
    type: "",
    description: "",
    categories: [],
  });
  const { id } = useParams();
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log("event:", id);
        const eventInfo = await apiRequest("GET", `/events/${id}`);
        console.log("info:", eventInfo.data);

        setEvent(eventInfo.data);
        setFormData({
          locationName: eventInfo.data.Location_Name,
          locationAddress: eventInfo.data.Location_Address,
          date: new Date(eventInfo.data.Date).toISOString().split("T")[0],
          time: eventInfo.data.Time,
          type: eventInfo.data.Type,
          description: eventInfo.data.Description,
          categories: eventInfo.data.categories,
        });
      } catch (error) {
        console.error("Error fetching Account:", error);
      }
    };
    fetchEventData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setFormData({ ...formData, type: selectedValue });
    setShowTicketInput(selectedValue === "ticket");
  };

  const addTicketTier = () => {
    setTicketTiers([
      ...ticketTiers,
      { tier: "", price: "", quantity: "", details: "" },
    ]);
  };

  const removeTicketTier = (index) => {
    const updatedTicketTiers = ticketTiers.filter((_, i) => i !== index);
    setTicketTiers(updatedTicketTiers);
  };

  const addDiscount = () => {
    setDiscountCodes([
      ...discountCodes,
      {
        code: "",
        maxUses: "",
        amount: "",
        organizerUserId: getCurrentUser().UserID,
      },
    ]);
  };

  const removeDiscount = (index) => {
    const updatedDiscount = discountCodes.filter((_, i) => i !== index);
    setDiscountCodes(updatedDiscount);
  };

  const handleTicketTierChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTicketTiers = [...ticketTiers];
    updatedTicketTiers[index][name] = value;
    setTicketTiers(updatedTicketTiers);
  };

  const handleDiscountChange = (index, event) => {
    const { name, value } = event.target;
    const updatedDiscount = [...discountCodes];
    updatedDiscount[index][name] = value;
    setDiscountCodes(updatedDiscount);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const eventDetails = {
      ...formData,
      organizerUserId: getCurrentUser().UserID,
      tickets: ticketTiers,
      discountCodes: discountCodes,
    };

    console.log("submitting:", eventDetails);

    try {
      const response = await apiRequest("PUT", `/events/${id}`, eventDetails);
      console.log("Event edited successfully:", response);
      window.location.href = "/"; // will update to redirect to the event page for the newly created event
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="center-content">
        <div>
          <h2 className="form_title">Edit Event</h2>

          <form className="form_box" onSubmit={handleSubmit}>
            <label className="input_title">Event Name: {event.EventID}</label>

            <label className="input_title">
              Current Location Name: {event.Location_Name} | Set New Loaction
              Name:
              <input
                className="form-group"
                type="text"
                name="locationName"
                value={formData.locationName}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="input_title">
              Location Address: {event.Location_Name} | Set New Location:
              <input
                className="form-group"
                type="text"
                name="locationAddress"
                value={formData.locationAddress}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="input_title">
              Current Set Date: {event.Date} | Set New Date:
              <input
                className="form-group"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="input_title">
              Current Start Time: {event.Time} | Set New Start Time:
              <input
                className="timearea"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </label>

            <label className="input_title">
              Current Set Category: {event.categories} | Set New Category:
              <select
                className="form-group"
                id="category"
                name="categories"
                value={formData.categories}
                onChange={(e) =>
                  setFormData({ ...formData, categories: [e.target.value] })
                }
                required
              >
                <option value="" disabled>
                  -- Select a Category --
                </option>
                <option value="Concerts">Concerts</option>
                <option value="Sports">Sports</option>
                <option value="Theatre">Theatre</option>
                <option value="Family">Family</option>
              </select>
            </label>

            {/* <label className="input_title">
            Type:
            <select
              style={{
                width: "80px",
                marginBottom: "20px",
                transition: "width 0.3s ease",
              }}
              id="type"
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              required
            >
              <option value="" disabled>
                -- Select a Type of Event --
              </option>
              <option value="rsvp">RVSP</option>
              <option value="ticket">Ticket</option>
            </select>
          </label> */}

            <>
              <div>
                <button
                  type="button"
                  style={{ marginBottom: "10px" }}
                  onClick={addTicketTier}
                >
                  Add Ticket Tier
                </button>
                {/* need to fix the ticket not displaying when grabbing ticket info */}
                {ticketTiers.map((ticket, index) => (
                  <div className="form-ticket">
                    <label className="input_title">
                      Tier:
                      <input
                        className="form-ticket"
                        type="text"
                        name="tier"
                        onChange={(e) => handleTicketTierChange(index, e)}
                        required
                      />
                    </label>
                    <label className="input_title">
                      Price:
                      <input
                        className="form-ticket"
                        type="number"
                        name="price"
                        // value={tier.price}
                        onChange={(e) => handleTicketTierChange(index, e)}
                        required
                      />
                    </label>
                    <label className="input_title">
                      Quantity:
                      <input
                        className="form-ticket"
                        type="number"
                        name="quantity"
                        // value={tier.quantity}
                        onChange={(e) => handleTicketTierChange(index, e)}
                        required
                      />
                    </label>
                    <label className="input_title">
                      Details:
                      <input
                        className="form-ticket"
                        type="text"
                        name="details"
                        // value={tier.details}
                        onChange={(e) => handleTicketTierChange(index, e)}
                        required
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeTicketTier(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <button
                  type="button"
                  style={{ marginBottom: "10px" }}
                  onClick={addDiscount}
                >
                  Add Discount Code
                </button>
                {discountCodes.map((tier, index) => (
                  <div key={index} className="form-ticket">
                    <label className="input_title">
                      Discount Code:
                      <input
                        className="form-ticket"
                        type="text"
                        name="code"
                        value={discountCodes.code}
                        onChange={(e) => handleDiscountChange(index, e)}
                        required
                      />
                    </label>
                    <label className="input_title">
                      Max Uses:
                      <input
                        className="form-ticket"
                        type="number"
                        name="maxUses"
                        value={discountCodes.maxUses}
                        onChange={(e) => handleDiscountChange(index, e)}
                        required
                      />
                    </label>
                    <label className="input_title">
                      Discount Amount
                      <input
                        className="form-ticket"
                        type="text"
                        name="amount"
                        value={discountCodes.amount}
                        onChange={(e) => handleDiscountChange(index, e)}
                        required
                      />
                    </label>
                    <button type="button" onClick={() => removeDiscount(index)}>
                      -
                    </button>
                  </div>
                ))}
              </div>
            </>
            <label className="input_title">
              {" "}
              Number of Attendees: {event.ticketsSold}
            </label>
            <div>
              <label className="input_title">
                Current Set Description: {event.Description}{" "}
                <br style={{ marginBottom: "10px", marginTop: "10px" }}></br>{" "}
                Set New Description:
                <div>
                  <input
                    className="textarea"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
              </label>
            </div>

            <div>
              <button className="submit" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Edit_Event;
