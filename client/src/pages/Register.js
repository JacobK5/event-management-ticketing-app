import React, { useState } from "react";
import makeRequest from "../services/api";
import { login } from "../services/auth";
import Header from "../components/Header";
import "../styles/form.css";

const Register = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    dob: "",
    accountType: "",
    organizerSSN: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setFormData({
      ...formData,
      accountType: selectedValue,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    const isAttendee = formData.accountType === "rsvp";
    const organizerSSN =
      formData.accountType === "ticket" ? formData.organizerSSN : null;

    console.log("submitting data:", formData);

    try {
      const response = await makeRequest("POST", "/users/register", formData);
      console.log("response:", response);

      if (response.status === 201) {
        console.log("registured successfully");
        console.log('response.data:', response.data);
        // Log in the user
        login(response.data.userId);
        // Redirect to the home page
        window.location.href = "/";
      } else {
        setErrorMessage("Failed to register user");
        console.error("Failed to register user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Header />
      <main classNames="center-content">
        {/* Form to fill in user details */}
        <form className="register_box" onSubmit={handleSubmit}>
          <h2 className="form_title">Create Account</h2>
          <label className="input_title">
            First Name:
            <input
              className="form-group"
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="input_title">
            Last Name:
            <input
              className="form-group"
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="input_title">
            Email:
            <input
              className="form-group"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="input_title">
            Password:
            <input
              className="form-group"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="input_title">
            Phone Number:
            <input
              className="form-group"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="input_title">
            Date of Birth:
            <input
              className="form-group"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
          </label>
          <label className="input_title">
            Account Type:
            <select
              style={{
                width: "80px", // Fixed width to avoid shifting
                marginBottom: "20px",
                marginLeft: "5px",
                transition: "width 0.3s ease", // Smooth resize animation
              }}
              id="type"
              name="accountType"
              value={formData.accountType}
              onChange={handleSelectChange}
              required
            >
              <option value="" disabled>
                -- Select Type of Account --
              </option>
              <option value="rsvp">Attendee</option>
              <option value="ticket">Organizer</option>
            </select>
            {formData.accountType === "ticket" && (
              <input
                style={{
                  marginBottom: "20px",
                  marginLeft: "15px",
                  width: "120px", // Fixed width to avoid shifting
                  transition: "width 0.3s ease", // Smooth resize animation
                }}
                type="text"
                name="organizerSSN"
                placeholder="Enter SSN"
                value={formData.organizerSSN}
                onChange={handleInputChange}
                required
              />
            )}
          </label>
          <button className="submit" type="submit">
            Submit
          </button>
          {/* creates account and logs user in according to what account type they chose */}

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
      </main>
    </>
  );
};

export default Register;
