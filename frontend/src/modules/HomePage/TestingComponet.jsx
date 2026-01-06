import React, { useState } from "react";

function TestingComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/TestingData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, contact }),
    });

    const data = await res.json();
    setResponse(data.message);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Send POST Request (No DB)</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="number"
          placeholder="Enter Contact number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Send</button>
      </form>

      {response && <p style={{ color: "green" }}>{response}</p>}
    </div>
  );
}

export default TestingComponent;
