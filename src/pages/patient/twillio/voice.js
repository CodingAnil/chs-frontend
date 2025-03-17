import React, { useState, useEffect } from "react";
import { Device } from "@twilio/voice-sdk";
import { getTwilioToken } from "./services";

const VoiceCall = ({ username, recipientIdentity }) => {
  const [device, setDevice] = useState(null);
  const [call, setCall] = useState(null);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const setupVoice = async () => {
      try {
        setStatus("Getting token...");
        // Get Twilio token
        const response = await getTwilioToken(username);
        const token = response.token;

        setStatus("Setting up device...");
        // Create a new Twilio Voice device
        const twilioDevice = new Device(token, {
          codecPreferences: ["opus", "pcmu"],
          fakeLocalDTMF: true,
          logLevel: 1,
        });

        // Register event handlers
        twilioDevice.on("registered", () => {
          console.log("Device registered");
          setStatus("Ready to make calls");
        });

        twilioDevice.on("error", (error) => {
          console.error("Device error:", error);
          setStatus(`Error: ${error.message}`);
        });

        twilioDevice.on("incoming", (incomingCall) => {
          setCall(incomingCall);
          setIsCallInProgress(true);
          setStatus(`Incoming call from ${incomingCall.parameters.From}`);

          incomingCall.on("disconnect", () => {
            setIsCallInProgress(false);
            setCall(null);
            setStatus("Call ended");
          });
        });

        // Register the device
        await twilioDevice.register();
        setDevice(twilioDevice);
      } catch (error) {
        console.error("Error setting up voice device:", error);
        setStatus(`Setup error: ${error?.message}`);
      }
    };

    if (username) {
      setupVoice();
    }

    return () => {
      if (device) {
        device.destroy();
      }
    };
  }, [username]);

  const makeCall = async () => {
    if (!device || !recipientIdentity) {
      setStatus(
        "Cannot make call - device not ready or recipient not specified"
      );
      return;
    }

    try {
      setStatus(`Calling ${recipientIdentity}...`);
      const newCall = await device.connect({
        params: {
          To: recipientIdentity,
          From: username,
        },
      });

      setCall(newCall);
      setIsCallInProgress(true);
      setStatus(`Connected to ${recipientIdentity}`);

      newCall.on("disconnect", () => {
        setIsCallInProgress(false);
        setCall(null);
        setStatus("Call ended");
      });

      newCall.on("error", (error) => {
        console.error("Call error:", error);
        setStatus(`Call error: ${error.message}`);
      });
    } catch (error) {
      console.error("Error making call:", error);
      setStatus(`Error making call: ${error.message}`);
    }
  };

  const hangUp = () => {
    if (call) {
      call.disconnect();
      setStatus("Hanging up...");
    }
  };

  const answerCall = () => {
    if (call) {
      call.accept();
      setStatus("Call accepted");
    }
  };

  return (
    <div className="voice-call-container">
      <h2>Voice Call</h2>
      <div className="status-display">
        <p>Status: {status}</p>
      </div>

      {!isCallInProgress ? (
        <div className="call-controls">
          <button
            onClick={makeCall}
            disabled={!device || !recipientIdentity}
            className="call-button"
          >
            📞 Call {recipientIdentity}
          </button>
        </div>
      ) : (
        <div className="active-call">
          <p>Call in progress with {recipientIdentity || "unknown"}</p>
          {call && call.direction === "incoming" && !call.isAccepted ? (
            <button onClick={answerCall} className="answer-button">
              Answer
            </button>
          ) : null}
          <button onClick={hangUp} className="hangup-button">
            Hang Up
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceCall;
