// import React, { useState, useEffect, useRef } from "react";
// import Video from "twilio-video";
// import { getTwilioToken } from './services';

// const VideoCall = ({ roomName, username }) => {
//   const [room, setRoom] = useState(null);
//   const [participants, setParticipants] = useState([]);
//   const videoRef = useRef();
//   const localVideoRef = useRef();

//   useEffect(() => {
//     const startCall = async () => {
//       try {
//         // Get Twilio token
//         const { token } = await getTwilioToken(username);

//         // Connect to the room
//         const videoRoom = await Video.connect(token, {
//           name: roomName,
//           audio: true,
//           video: true,
//         });

//         setRoom(videoRoom);

//         // Set up local video
//         if (videoRoom.localParticipant) {
//           videoRoom.localParticipant.videoTracks.forEach((publication) => {
//             if (publication.track) {
//               publication.track.attach(localVideoRef.current);
//             }
//           });
//         }

//         // Handle participants already in the room
//         videoRoom.participants.forEach((participant) => {
//           addParticipant(participant);
//         });

//         // Handle participants joining the room
//         videoRoom.on("participantConnected", (participant) => {
//           addParticipant(participant);
//         });

//         // Handle participants leaving the room
//         videoRoom.on("participantDisconnected", (participant) => {
//           removeParticipant(participant);
//         });
//       } catch (error) {
//         console.error("Error connecting to video room:", error);
//       }
//     };

//     if (roomName && username) {
//       startCall();
//     }

//     return () => {
//       if (room) {
//         room.disconnect();
//       }
//     };
//   }, [roomName, username]);

//   const addParticipant = (participant) => {
//     setParticipants((prevParticipants) => [...prevParticipants, participant]);

//     participant.on("trackSubscribed", (track) => {
//       const trackElement = track.attach();
//       videoRef.current.appendChild(trackElement);
//     });
//   };

//   const removeParticipant = (participant) => {
//     setParticipants((prevParticipants) =>
//       prevParticipants.filter((p) => p !== participant)
//     );
//   };

//   return (
//     <div className="video-call-container">
//       <h2>Video Call: {roomName}</h2>

//       <div className="video-grid">
//         <div className="local-video">
//           <h3>You ({username})</h3>
//           <div ref={localVideoRef}></div>
//         </div>

//         <div className="remote-videos" ref={videoRef}>
//           {participants.length === 0 && <p>No other participants yet</p>}
//         </div>
//       </div>

//       <div className="controls">
//         <button onClick={() => room?.disconnect()}>End Call</button>
//       </div>
//     </div>
//   );
// };

// export default VideoCall;
