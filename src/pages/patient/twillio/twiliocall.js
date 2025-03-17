import React, { useState } from "react";
import VoiceCall from "./voice";

const CommunicationApp = () => {
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [recipientIdentity, setRecipientIdentity] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    if (username) {
      setIsJoined(true);
    }
  };

  const handleLeave = () => {
    setIsJoined(false);
  };

  return (
    <div className="communication-app">
      <h1>Twilio Voice Call App</h1>

      {!isJoined ? (
        <form onSubmit={handleJoin} className="join-form">
          <div className="form-group">
            <label htmlFor="username">Your Name:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <button type="submit">Join</button>
        </form>
      ) : (
        <div className="communication-container">
          <h2>Welcome, {username}</h2>
          
          <div className="recipient-input">
            <label htmlFor="recipient">Call Recipient:</label>
            <input
              type="text"
              id="recipient"
              placeholder="Recipient Identity"
              value={recipientIdentity}
              onChange={(e) => setRecipientIdentity(e.target.value)}
            />
          </div>

          <div className="active-component">
            <VoiceCall username={username} recipientIdentity={recipientIdentity} />
          </div>

          <button onClick={handleLeave} className="leave-button">
            Leave
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunicationApp;