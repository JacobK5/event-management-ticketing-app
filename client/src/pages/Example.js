import React, { useState, useEffect } from "react";

// This component demonstrates the basics of React hooks and functions in components.
// Main Counter component.
const Counter = () => {
  // useState allows us to create state variables.
  const [count, setCount] = useState(0); // Tracks the current count.
  const [message, setMessage] = useState("Click the button to start counting!"); // Tracks the displayed message.
  const [history, setHistory] = useState([]); // Tracks the count history.

  // useEffect runs side effects in a React component.
  useEffect(() => {
    console.log("Message is:", message);
    if (count === 0) {
      setMessage("Click the button to start counting!");
    } else {
      setMessage(`The count is now: ${count}`);
    }
    console.log("Message is now:", message);
    // When this runs you'll see that message doesn't change immediately, it changes on the next render.
    // Renders happen whenever state changes, so the message will update after the count updates.
  }, [count]); // Dependency array ensures this effect runs only when "count" changes.

  useEffect(() => {
    // This effect runs only once when the component mounts.
    console.log("Component mounted!");

    // This function will run when the component unmounts (e.g., navigating away).
    return () => {
      // You generally don't need to return anything in a useEffect, it's pretty much for cleanup.
      console.log("Component unmounted!");
    };
  }, []); // Empty array means this effect runs only once.

  // Increment count and add to history.
  const increment = () => {
    setCount(count + 1); // Updates the "count" state variable.
    setHistory([...history, count + 1]);
  };

  // Reset count and clear history.
  const reset = () => {
    setCount(0); // Resets the "count" state variable to its initial value.
    setHistory([]); // Clears the history array.
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {/* Display the message from state. */}
      <h1>{message}</h1>

      {/* Button to increment the count. */}
      <Button label="Increment" onClick={increment} />

      {/* Button to reset the count. */}
      <Button label="Reset" onClick={reset} />

      {/* Conditional rendering: Display a message when count reaches 5. */}
      {count === 5 && <p style={{ color: "green" }}>You reached 5!</p>}

      {/* Rendering the history list using the HistoryList component. */}
      <HistoryList history={history} />
    </div>
  );
};

// Button component: Demonstrates props and event handling.
const Button = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick} // Executes the passed function when the button is clicked.
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        marginRight: "10px",
      }}
    >
      {label /*The button label is dynamic and passed as a prop.*/}
    </button>
  );
};

// HistoryList component: Renders a list of previous counts using React keys.
const HistoryList = ({ history }) => {
  return (
    <ul>
      {history.map((value, index) => (
        <li key={index}>Previous Count: {value}</li> // Keys ensure React efficiently updates the list.
      ))}
    </ul>
  );
};

export default Counter;
