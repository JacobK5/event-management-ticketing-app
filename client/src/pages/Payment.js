import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import apiRequest from "../services/api";
import { getCurrentUser } from "../services/auth";
import { UNSAFE_ErrorResponseImpl, useParams } from 'react-router-dom';

const Payment = () => {
  const {id} = useParams();
  const user = getCurrentUser(); //getting userid
  const [event, setEvent] = useState([]);
  const [ticket, setTicket] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [resale, setResale] = useState([]);
  const [tier, setTier] = useState([]); 
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

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        
        console.log("event:", id);
        const eventInfo = await apiRequest(
          "GET",
          `/events/${id}`
        );

        const resaleInfo = await apiRequest(
          "GET",
          `/events/${id}/resale-tickets`
        );
        console.log("resale:", resaleInfo.data);
        
        const response = await apiRequest(
          "GET",
          `events/${id}/tickets/summary`
        );

        const discountInfo = await apiRequest(
          "GET",
          `events/${id}/discounts`
        );
        console.log("discount:", discountInfo);
        console.log("tickets summary response:", response);
        setResale(resaleInfo.data);
        setEvent(eventInfo.data); 
        setTicket(response.data);
        // setTicketTiers(event.ticket);
      } catch (error) {
        console.error("Error fetching Account:", error);
      }
    }; fetchEventData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDiscount = (discAmt,price) => {
    discAmt ="$5.00";
      if (discAmt[0]=='$'){
        setTier(parseFloat(price)-parseFloat(discAmt.replace("$", "")));
      } else {
        percent_string= discAmt.replace("%", "");
        percent = parseFloat(percent_string)/100;
        setTier(parseFloat(price)*(1-percent));
      }
    };
  
  return (
    <>
    <Header/>
    <main className="center-content">
      <div>
        <h2 className="form_title">Payment</h2>
        <label></label>
        <form className="form_box" onSubmit={handleSubmit}>
          <label className="input_title ">
            Event Name: {event.EventID}
          </label>
          <label className="input_title">
            Ticket Type: 
            <select
              className="form-group"
              id="ticketTier"
              name="ticket"
              value={tier}
              onChange= {(e) => setTier(e.target.value)}
              required
            >
              <option value="" disabled>
                -- Select a Tier --
              </option>
              {/* insert map for each ticket tier */}
              {/* {
                ticket.map((ticket) => (
                <option value={ticket.Price}>{ticket.Tier}</option>
              ))}; */}
              {
                resale.map((resale) => (
                <option value={resale.Resale_Price}>Resale Listing </option>
              ))};
             
              
            </select>
          </label>
          <label className="form-group input_title">
            Price: {tier} 
          </label>
          <label className="input_title">
            Discount Code:
            <input
              className="form-group"
              type="text"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleInputChange}
            />
            <button onClick={handleDiscount}>  Check </button>
          </label>

          <label className="input_title">
            Mastercard
            <input
              className="form-group"
              style={{marginRight:'10px'}}
              type="checkbox"
              name="method"
              value={formData.locationName}
              onChange={handleInputChange}
              required
            />
            Visa <input
              className="form-group"
              type="checkbox"
              name="method"
              value={formData.locationName}
              onChange={handleInputChange}
              required
            />
          </label>

          <label className="input_title">
            Card Number:
            <input
              className="form-group"
              type="text"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleInputChange}
              required
            />
          </label>
          <div>
          <label className="input_title">
            Expr Date. 
            <input
              className="form-group"
              style={{width:'10%'}}
              type="text"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleInputChange}
              required
            /> 
            CVV: 
            <input
              className="form-group"
              style={{width:'10%'}}
              type="text"
              name="locationAddress"
              value={formData.locationAddress}
              onChange={handleInputChange}
              required
            />
          </label>
          </div>

          <label className="input_title form-group">
            Date: {today}
          </label>
          <div>
            <button className="submit" type="submit">Submit</button>
          </div>
          
        </form>
      </div>
    </main>
    </>
  );
};

export default Payment;
