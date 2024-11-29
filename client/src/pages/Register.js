import React, { useState } from "react";

const Register = () => {
  const [showInput, setShowInput] = useState(false); // State to control visibility of the input box

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setShowInput(selectedValue === "ticket"); // Show input if "ticket" is selected
  };
  return (
    <>
      <main className="register_box">
        <div>
        <h2 class="form_title">Create Account</h2>
        
        {/* Form to fill in user details */}
        <form class="form_box">
       
            <label class="input_title">
              First Name: 
              <input class="form-group" 
                type="text"
                name="fname"
                required
              />
            </label>
            <label class="input_title">
              Last Name: 
              <input class="form-group" 
                type="text"
                name="lname"
                required
              />
            </label>
          <label class="input_title">
            Email:
            <input class="form-group"
              type="text"
              name="name"
              required
            />
          </label>

          <label class="input_title">
            Username:
            <input class="form-group"
              type="text"
              name="name"
              required
            />
          </label>

          <label class="input_title">
            Password:
            <input class="form-group"
              type="text"
              name="name"
              required
            />
          </label>

          <label class="input_title">
            Phone Number:
            <input class="form-group"
              type="text"
              name="name"
              required
            />
          </label>

          <label class="input_title">
            Date of Birth:
            <input class="form-group"
              type="date"
              name="date"
              required
            />
          </label>

          <label class="input_title">
            Account Type: 
            <select 
            style={{
              width: "80px", // Fixed width to avoid shifting
              marginBottom:"20px",
              marginLeft: "5px", 
              transition: "width 0.3s ease", // Smooth resize animation
            }}
            id="type"
            onChange={handleSelectChange}
            required
            >
              <option value="" disabled>
                -- Select Type of Account --
              </option>

              <option value="rsvp" >
                Attendee
              </option>
              <option value="ticket" >
                Organizer
              </option>
            </select>

            {showInput && (
              <input
                style={{
                  marginBottom:"20px",
                  marginLeft:"15px",
                  width: "120px", // Fixed width to avoid shifting
                  transition: "width 0.3s ease", // Smooth resize animation
                }}
                type="text"
                placeholder="Enter SSN"
              />
            )}
          </label>
          
            {/*creates account and logs user in according to what account type they chose*/}
          <button class = "submit" type="submit">Submit</button> 
        </form>
      </div>
      </main>
    </>
    
    
  );
};

export default Register;
