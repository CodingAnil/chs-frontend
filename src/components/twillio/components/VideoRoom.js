import React, { useState, useEffect, useRef } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import { callPostApi } from "../../../_service";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Monitor,
  MonitorOff,
  PhoneCall,
  PhoneOff,
} from "lucide-react";

const VideoRoom = ({ appointmentId, token, handleLogout, mode }) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenTrack = useRef(null);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Connect to the room when component mounts
  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    // Connect to the Twilio video room
    Video.connect(token, {
      name: appointmentId,
      audio: true,
      video: true,
    })
      .then((room) => {
        setRoom(room);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
      })
      .catch((error) => {
        console.error("Error connecting to room:", error);
      });

    // Cleanup function to disconnect from the room when component unmounts
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [appointmentId, token]);

  // Toggle audio
  const toggleAudio = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        if (isAudioEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (room) {
      room.localParticipant.videoTracks.forEach((publication) => {
        if (isVideoEnabled) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia();
        const track = new Video.LocalVideoTrack(stream.getTracks()[0]);
        screenTrack.current = track;

        // Publish screen track
        await room.localParticipant.publishTrack(track);
        setIsScreenSharing(true);

        // When user stops screen sharing from browser UI
        track.on("ended", () => {
          room.localParticipant.unpublishTrack(track);
          track.stop();
          screenTrack.current = null;
          setIsScreenSharing(false);
        });
      } catch (error) {
        console.error("Error sharing screen:", error);
      }
    } else {
      // Stop screen sharing
      if (screenTrack.current) {
        room.localParticipant.unpublishTrack(screenTrack.current);
        screenTrack.current.stop();
        screenTrack.current = null;
        setIsScreenSharing(false);
      }
    }
  };

  const initiateCall = async () => {
    if (!token || !appointmentId) {
      console.error("Appointment ID is missing");
      return;
    }

    try {
      // callSocket.emit("join-room", { userId: user?.profile?._id });
      await callPostApi("doctor/call/start", {
        appointment_id: appointmentId,
        token: token,
        mode,
      });
    } catch (error) {
      console.error("Call initiation failed:", error);
    }
  };

  // Handle room disconnect
  const leaveRoom = () => {
    if (room) {
      room.disconnect();
      handleLogout();
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  let render;
  if (room) {
    render = (
      <div className="video-room">
        <div className="timer">{formatTime(seconds)}</div>

        <div className="remote-participants">
          {participants.map((participant) => (
            <Participant
              key={participant.sid}
              participant={participant}
              isLocal={false}
            />
          ))}
        </div>

        <div className="local-participant">
          <Participant
            key="local"
            participant={room.localParticipant}
            isLocal={true}
          />
        </div>

        <div className="controls">
          <button onClick={initiateCall} title="Start Call">
            <PhoneCall />
          </button>
          <button onClick={toggleAudio} title="Toggle Audio">
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </button>
          <button onClick={toggleVideo} title="Toggle Video">
            {isVideoEnabled ? <VideoIcon /> : <VideoOff />}
          </button>
          <button onClick={toggleScreenShare} title="Share Screen">
            {isScreenSharing ? <MonitorOff /> : <Monitor />}
          </button>
          <button onClick={leaveRoom} title="Leave Room">
            <PhoneOff />
          </button>
        </div>
      </div>
      // <div className="video-room">
      //   <h2>Room: {`Appointment-${appointmentId}`}</h2>
      //   <div className="participants">
      //     <div className="local-participant">
      //       <h3>Your Video</h3>
      //       <Participant
      //         key="local"
      //         participant={room.localParticipant}
      //         isLocal={true}
      //       />
      //     </div>
      //     <div className="remote-participants">
      //       <h3>Remote Participants ({participants.length})</h3>
      //       {participants.map((participant) => (
      //         <Participant
      //           key={participant.sid}
      //           participant={participant}
      //           isLocal={false}
      //         />
      //       ))}
      //     </div>
      //   </div>
      //   <div className="controls">
      //     <button onClick={initiateCall}>Start Call</button>
      //     <button onClick={toggleAudio}>
      //       {isAudioEnabled ? "Mute Audio" : "Unmute Audio"}
      //     </button>
      //     <button onClick={toggleVideo}>
      //       {isVideoEnabled ? "Turn Off Video" : "Turn On Video"}
      //     </button>
      //     <button onClick={toggleScreenShare}>
      //       {isScreenSharing ? "Stop Sharing" : "Share Screen"}
      //     </button>
      //     <button onClick={leaveRoom}>Leave Room</button>
      //   </div>
      // </div>
    );
  } else {
    render = <p>Connecting to room...</p>;
  }

  return render;
};

export default VideoRoom;
