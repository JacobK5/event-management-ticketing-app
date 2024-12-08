import React, { useState } from "react";
import apiRequest from "../services/api";
import { getCurrentUser } from "../services/auth";

// NOTE: Still need to implement adding discounts here

const Create_Event = () => {
  const [showTicketInput, setShowTicketInput] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    locationName: "",
    locationAddress: "",
    date: "",
    time: "",
    type: "",
    description: "",
    categories: [],
  });

  const [ticketTiers, setTicketTiers] = useState([]);

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

  const handleTicketTierChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTicketTiers = [...ticketTiers];
    updatedTicketTiers[index][name] = value;
    setTicketTiers(updatedTicketTiers);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const eventDetails = {
      ...formData,
      organizerUserId: getCurrentUser().UserID,
      tickets: ticketTiers,
      discountCodes: [], // empty for now, will add later
    };

    try {
      const response = await apiRequest("POST", "/events", eventDetails);
      console.log("Event created successfully:", response);
      window.location.href = "/"; // will update to redirect to the event page for the newly created event
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <main className="center-content">
      <div>
        <h2 className="form_title">Create Event</h2>

        <form className="form_box" onSubmit={handleSubmit}>
          <label className="input_title">
            Event Name:
            <input
              className="form-group"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="input_title">
            Location Name:
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
            Location Address:
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
            Date:
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
            Time:
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
            Category:
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

          <label className="input_title">
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
          </label>

          {showTicketInput && (
            <>
              <button type="button" onClick={addTicketTier}>
                Add Ticket Tier
              </button>
              {ticketTiers.map((tier, index) => (
                <div key={index} className="ticket-tier">
                  <label>
                    Tier:
                    <input
                      type="text"
                      name="tier"
                      value={tier.tier}
                      onChange={(e) => handleTicketTierChange(index, e)}
                      required
                    />
                  </label>
                  <label>
                    Price:
                    <input
                      type="number"
                      name="price"
                      value={tier.price}
                      onChange={(e) => handleTicketTierChange(index, e)}
                      required
                    />
                  </label>
                  <label>
                    Quantity:
                    <input
                      type="number"
                      name="quantity"
                      value={tier.quantity}
                      onChange={(e) => handleTicketTierChange(index, e)}
                      required
                    />
                  </label>
                  <label>
                    Details:
                    <input
                      type="text"
                      name="details"
                      value={tier.details}
                      onChange={(e) => handleTicketTierChange(index, e)}
                      required
                    />
                  </label>
                  <button type="button" onClick={() => removeTicketTier(index)}>
                    -
                  </button>
                </div>
              ))}
            </>
          )}

          <label className="input_title">
            Description:
            <input
              className="textarea"
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </label>

          <button className="submit" type="submit">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default Create_Event;
