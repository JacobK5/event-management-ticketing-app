import React, { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  const fetchMessage = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/test");
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error fetching message:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Event Management App</h1>
      <button onClick={fetchMessage}>Get Message from Backend</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
