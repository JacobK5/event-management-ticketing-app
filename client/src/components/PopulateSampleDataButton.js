import React from "react";
import apiRequest from "../services/api";

const PopulateSampleDataButton = () => {
  const handlePopulateData = async () => {
    try {
      const response = await apiRequest("POST", "sample-data/populate");
      console.log(response.data.message);
      alert("Sample data populated successfully!");
    } catch (error) {
      console.error("Error populating sample data:", error);
      alert("Failed to populate sample data.");
    }
  };

  return (
    <button onClick={handlePopulateData} style={{ margin: "20px" }}>
      Populate Sample Data
    </button>
  );
};

export default PopulateSampleDataButton;
