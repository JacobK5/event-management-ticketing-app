import React, { useState } from "react";

const Create_Event = () => {
  const [showInput, setShowInput] = useState(false); // State to control visibility of the input box

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setShowInput(selectedValue === "ticket"); // Show input if "ticket" is selected
  };

  // note: for tickets will need to be able to add new tiers and specify number of tickets in each tier
  return (
    <>
      <main className="center-content">
        <div>
          <h2 class="form_title">Create Event</h2>

          {/* Form to fill in user details */}
          <form class="form_box">
            <label class="input_title">
              Event Name:
              <input class="form-group" type="text" name="name" required />
            </label>

            <label class="input_title">
              Location:
              <input class="form-group" type="text" name="name" required />
            </label>

            <label class="input_title">
              Time:
              <input class="timearea" type="time" name="time" required />
              <input class="timearea" type="time" name="time" required />
            </label>

            <label class="input_title">
              Category:
              <select class="form-group" id="category" required>
                <option value="" disabled>
                  -- Select a Category --
                </option>

                <option value="">Concerts</option>

                <option value="" disabled>
                  Sports
                </option>

                <option value="" disabled>
                  Theatre
                </option>

                <option value="" disabled>
                  Family
                </option>
              </select>
            </label>

            <label class="input_title">
              Type:
              <select
                style={{
                  width: "80px", // Fixed width to avoid shifting
                  marginBottom: "20px",
                  transition: "width 0.3s ease", // Smooth resize animation
                }}
                id="type"
                onChange={handleSelectChange}
                required
              >
                <option value="" disabled>
                  -- Select a Type of Event --
                </option>

                <option value="rsvp">RVSP</option>
                <option value="ticket">Ticket</option>
              </select>
              {showInput && (
                <input
                  style={{
                    marginBottom: "20px",
                    marginLeft: "15px",
                    width: "80px", // Fixed width to avoid shifting
                    transition: "width 0.3s ease", // Smooth resize animation
                  }}
                  type="text"
                  placeholder="Enter Price"
                />
              )}
            </label>

            <label class="input_title">Description:</label>

            <label class="input_title">
              <input class="textarea" type="text" name="desc" />
            </label>
            {/* submit button uploads data and sends to view event page */}
            <button class="submit" type="submit">
              Submit
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Create_Event;
