import React, { useState, useEffect } from "react";
import makeRequest from "../services/api";
import { login } from "../services/auth";
import Header from "../components/Header";
import apiRequest from "../services/api"; // Helper function for API calls
import { getCurrentUser } from "../services/auth";
import '../styles/form.css';

const Edit_Account = () => {
  const [account, setAccount] = useState(null);
  const user = getCurrentUser();
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("user:", user);
        const userProfile = await apiRequest(
          "GET",
          `users/profile/${user.UserID}`
        );
        console.log("userprofile:", userProfile);
        setAccount(userProfile.data);
        setFormData({
          fname: userProfile.data.Fname,
          lname: userProfile.data.Lname,
          email: userProfile.data.Email,
          phoneNumber: userProfile.data.Phone_number,
          password: userProfile.data.Password,
          dob: userProfile.data.DOB,
        });
      } catch (error) {
        console.error("Error fetching Account:", error);
      }
    };

    fetchUserData();
  }, []);
  
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);

    console.log("submitting data:", formData);

    try {
      const response = await makeRequest("PUT",  `users/profile/${user.UserID}`, formData);
      console.log("response:", response);

      if (response.status === 200) {
        console.log("updated successfully");
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
  console.log("account:", account);
  

  return (
    <>
    <Header/>
    <main classNames="center-content">
      {/* Form to fill in user details */}
      <form className="register_box" onSubmit={handleSubmit}>
        <h2 className="form_title">Edit Account</h2>
       
          <label className="input_title" >
            Set First Name: {account?.Fname} | New First Name: 
            <input
              className="form-group"
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
            />
          </label>

          <label className="input_title">
            Set Last Name: {account?.Lname} | New Last Name: 
            <input
              className="form-group"
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
            />
          </label>
          <label className="input_title">
            Set Email: {account?.Email} | New Email: 
            <input
              className="form-group"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
    
            />
          </label>

          <label className="input_title">
            Set Password: {account?.Password.split('').map(() => '*')} | New Password: 
            <input
              className="form-group"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}

            />
          </label>
          <label className="input_title">
            Set Phone Number: {account?.Phone_number} | New Phone Number: 
            <input
              className="form-group"
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}

            />
          </label>
          <label className="input_title">
            Date of Birth: {
            new Date(account?.DOB ?? new Date()).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })} 
          </label>
          <button className="submit" type="submit">Submit</button>
          {/* creates account and logs user in according to what account type they chose */}
          

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </form>
      
      </main>
    </>
      

  );
};

export default Edit_Account;
