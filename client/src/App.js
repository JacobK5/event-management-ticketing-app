import React, { useState } from "react";
import Header from "./components/Header";
import Organizer_Header from "./components/Organizer_Header";
import Home from "./pages/Home";
import Organizer_Home from "./pages/Organizer_Home";
import Create_Event from "./pages/Create_Event";
import Edit_Event from "./pages/Edit_Event";
import Create_Discount from "./pages/Create_Discount";
import Login from "./pages/login";
import Register from "./pages/Register";
import "./styles/style.css";
// import Counter from "./pages/Example";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ViewEvents from "./pages/ViewEvents";
import Account from "./pages/Account";
import Edit_Account from "./pages/Edit_Account";
import OrganizerEvents from "./pages/OrganizerEvents";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/create" element={<Create_Event />} />
        <Route path="/events/view/:category?" element={<ViewEvents />} />
        <Route
          path="/events/view/search/:searchTerm"
          element={<ViewEvents />}
        />
        <Route path="/discounts/create" element={<Create_Discount />} />
        <Route path="/account" element={<Account />} />
        <Route path="/my-events" element={<OrganizerEvents />} />
        <Route path="/edit-account" element={<Edit_Account />} />
        <Route path="/events/edit/:id" element={<Edit_Event />} /> 
      </Routes>
    </Router>
  );
};

export default App;
