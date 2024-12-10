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
  const [allTickets, setAllTickets] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [resale, setResale] = useState([]);
  const [price, setPrice] = useState([]); 
  const [discountUsed, setDiscountUsed] = useState(false);
  const [formData, setFormData] = useState({
    method: '',
    creditCardInfo: '',
    creditCardNumber: '',
    creditCardExpiry: '',
    creditCardCVV: '',
    discountCode: '',
    tier: ''
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
        const allTickets = await apiRequest(
          "GET",
          `events/${id}/tickets`
        );
        console.log("all tickets:", allTickets);
        setAllTickets(allTickets.data);

        const discountInfo = await apiRequest(
          "GET",
          `events/${id}/discounts`
        );
        console.log("discount:", discountInfo);
        console.log("tickets summary response:", response);
        setResale(resaleInfo.data);
        setEvent(eventInfo.data); 
        setTicket(response.data);
        setDiscount(discountInfo.data);
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
    console.log('current user:', getCurrentUser());
    console.log('formData:', formData);
    // find ticket with selected tier
    const ticketTier = allTickets.find((ticket) => ticket.Tier === formData.tier);
    console.log('ticketTier:', ticketTier);

    event.preventDefault();
    const details = {
      ...formData,
      userId: getCurrentUser().UserID,
      ticketId: ticketTier.Ticket_ID,
      creditCardInfo: formData.creditCardNumber + "-" + formData.creditCardExpiry + "-" + formData.creditCardCVV,
    };

    console.log("details:", details);

    try {
      const response = await apiRequest("POST", "/tickets/purchase", details);
      console.log("Ticket bought successfully:", response);
      window.location.href = "/"; // will update to redirect to the event page for the newly created event
    } catch (error) {
      console.error("Error buying ticket:", error);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDiscount = () => {
    if(discountUsed){
      alert("Discount Code already used");
      return
    }
    console.log('discount:', discount);
    console.log('discount:', discount[0]);
    console.log('formData:', formData.discountCode);
      const discAmt = discount.find((disc) => disc.Code === formData.discountCode)?.Amount;
      console.log('discount:', discAmt);
      if (!discAmt){
        alert("Invalid Discount Code");
        return
      }
      if (discAmt[0]=='$'){
        setPrice(parseFloat(price)-parseFloat(discAmt.replace("$", "")));
      } else {
        const percent_string= discAmt.replace("%", "");
        const percent = parseFloat(percent_string)/100;
        setPrice(parseFloat(price)*(1-percent));
        console.log('percent:', percent);
        console.log('precent:', percent_string); 
        console.log('price:', price);
        console.log('price:', price*(1-percent))
      }
      setDiscountUsed(true);
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
              value={price}
              onChange= {(e) => {
                setPrice(e.target.value)
                setDiscountUsed(false)
                console.log('e.target.value:', e.target)
                // find tier
                const tier = ticket.find((ticket) => ticket.Price === e.target.value)?.Tier
                console.log('tier:', tier);
                setFormData({...formData, tier: tier})
                }}
              required
            >
              <option value="" disabled>
                -- Select a Tier --
              </option>
              {
                ticket.map((ticket) => (
                <option value={ticket.Price}>{ticket.Tier}</option>
              ))};
              {
                resale.map((resale) => (
                <option value={resale.Resale_Price}>Resale Listing </option>
              ))};
             
              
            </select>
          </label>
          <label className="form-group input_title">
            Price: {price} 
          </label>
          <label className="input_title">
            Discount Code:
            <input
              className="form-group"
              type="text"
              name="discountCode"
              value={formData.discountCode}
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
              value={formData.method}
              onChange={handleInputChange}
              
            />
            Visa <input
              className="form-group"
              type="checkbox"
              name="method"
              value={formData.method}
              onChange={handleInputChange}
              
            />
          </label>

          <label className="input_title">
            Card Number:
            <input
              className="form-group"
              type="text"
              name="creditCardNumber"
              value={formData.creditCardNumber}
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
              name="creditCardExpiry"
              value={formData.creditCardExpiry}
              onChange={handleInputChange}
              required
            /> 
            CVV: 
            <input
              className="form-group"
              style={{width:'10%'}}
              type="text"
              name="creditCardCVV"
              value={formData.creditCardCVV}
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
