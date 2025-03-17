// import React, { useState, useEffect, useRef } from "react";
// import { Client } from "@twilio/conversations";
// import { getTwilioToken, createConversation, addParticipant } from "./services";

// const ConversationsComponent = ({ username }) => {
//   const [client, setClient] = useState(null);
//   const [conversation, setConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [conversationName, setConversationName] = useState("");
//   const [participantIdentity, setParticipantIdentity] = useState("");
//   const messagesEndRef = useRef(null);

//   // Initialize client
//   useEffect(() => {
//     const initializeClient = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Get token
//         const response = await getTwilioToken(username);
//         const token = response.token;

//         // Create client
//         const conversationsClient = new Client(token);

//         // Set up event listeners
//         conversationsClient.on("connectionStateChanged", (state) => {
//           console.log("Connection state changed to:", state);
//         });

//         conversationsClient.on("stateChanged", (state) => {
//           console.log("Client state changed to:", state);
//         });

//         conversationsClient.on("initialized", () => {
//           console.log("Client initialized");
//           setClient(conversationsClient);
//           setLoading(false);
//         });

//         conversationsClient.on("initFailed", ({ error }) => {
//           console.error("Failed to initialize client:", error);
//           setError("Failed to initialize: " + error.message);
//           setLoading(false);
//         });
//       } catch (err) {
//         console.error("Error initializing client:", err);
//         setError("Error initializing client: " + err.message);
//         setLoading(false);
//       }
//     };

//     if (username) {
//       initializeClient();
//     }

//     // Clean up
//     return () => {
//       if (client) {
//         client.shutdown();
//       }
//     };
//   }, [username]);

//   // Create a new conversation
//   const handleCreateConversation = async () => {
//     try {
//       if (!client || !conversationName.trim()) return;

//       // Create conversation through API
//       const result = await createConversation(conversationName);
//       const conversationSid = result.conversationSid;

//       // Get the conversation through the client
//       const newConversation = await client.getConversationBySid(
//         conversationSid
//       );
//       setConversation(newConversation);

//       // Set up message listeners
//       setupMessageListeners(newConversation);

//       setConversationName("");
//     } catch (err) {
//       console.error("Error creating conversation:", err);
//       setError("Error creating conversation: " + err.message);
//     }
//   };

//   // Add a participant to the conversation
//   const handleAddParticipant = async () => {
//     try {
//       if (!conversation || !participantIdentity.trim()) return;

//       // Add participant through API
//       await addParticipant(conversation.sid, participantIdentity);

//       setParticipantIdentity("");
//     } catch (err) {
//       console.error("Error adding participant:", err);
//       setError("Error adding participant: " + err.message);
//     }
//   };

//   // Set up message listeners for a conversation
//   const setupMessageListeners = (conv) => {
//     // Listen for new messages
//     conv.on("messageAdded", (message) => {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           sid: message.sid,
//           author: message.author,
//           body: message.body,
//           dateCreated: message.dateCreated,
//         },
//       ]);
//       scrollToBottom();
//     });

//     // Load existing messages
//     conv
//       .getMessages(30, 0, "backwards")
//       .then((paginator) => {
//         const messageList = paginator.items.map((message) => ({
//           sid: message.sid,
//           author: message.author,
//           body: message.body,
//           dateCreated: message.dateCreated,
//         }));
//         setMessages(messageList);
//         scrollToBottom();
//       })
//       .catch((err) => {
//         console.error("Error loading messages:", err);
//       });
//   };

//   // Send a new message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!conversation || !newMessage.trim()) return;

//     try {
//       await conversation.prepareMessage().setBody(newMessage).build().send();

//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//       setError("Error sending message: " + err.message);
//     }
//   };

//   // Scroll to the bottom of the messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   if (loading) {
//     return <div>Loading conversations client...</div>;
//   }

//   if (error) {
//     return <div className="error">Error: {error}</div>;
//   }

//   return (
//     <div className="conversations-container">
//       <h2>Twilio Conversations</h2>

//       {!conversation ? (
//         <div className="create-conversation">
//           <h3>Create a Conversation</h3>
//           <div className="input-group">
//             <input
//               type="text"
//               value={conversationName}
//               onChange={(e) => setConversationName(e.target.value)}
//               placeholder="Conversation name"
//             />
//             <button onClick={handleCreateConversation}>Create</button>
//           </div>
//         </div>
//       ) : (
//         <div className="active-conversation">
//           <h3>Conversation: {conversation.friendlyName}</h3>

//           <div className="add-participant">
//             <h4>Add Participant</h4>
//             <div className="input-group">
//               <input
//                 type="text"
//                 value={participantIdentity}
//                 onChange={(e) => setParticipantIdentity(e.target.value)}
//                 placeholder="Participant identity"
//               />
//               <button onClick={handleAddParticipant}>Add</button>
//             </div>
//           </div>

//           <div className="messages">
//             {messages.length === 0 ? (
//               <p>No messages yet.</p>
//             ) : (
//               messages.map((message) => (
//                 <div
//                   key={message.sid}
//                   className={`message ${
//                     message.author === username ? "own" : "other"
//                   }`}
//                 >
//                   <div className="message-author">{message.author}</div>
//                   <div className="message-body">{message.body}</div>
//                   <div className="message-time">
//                     {new Date(message.dateCreated).toLocaleTimeString()}
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           <form onSubmit={handleSendMessage} className="send-message">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type your message..."
//             />
//             <button type="submit">Send</button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConversationsComponent;
