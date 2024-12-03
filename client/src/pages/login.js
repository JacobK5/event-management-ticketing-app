import React, { useState } from "react";
import apiRequest from "../services/api";
import { login } from "../services/auth";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await apiRequest("POST", "/users/login", formData);
      if (response.status === 200) {
        login(response); // Save user data in localStorage
        window.location.href = "/"; // Redirect to the homepage after successful login
      } else {
        alert("Invalid username or password, please try again");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid username or password, please try again");
    }
  };

  return (
    <main className="center-content">
      <form className="form_box" onSubmit={handleSubmit}>
        <label className="form_title">Login: </label>
        <label className="input_title">
          Email:
          <input
            className="form-group"
            type="text"
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button className="submit" type="submit">
            Submit
          </button>
          <a href="/register">Register</a>
        </div>
      </form>
    </main>
  );
};

export default Login;
