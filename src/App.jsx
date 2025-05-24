import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import CopilotPanel from "./components/CopilotPanel";
import { io } from "socket.io-client";
import { saveMessage, getMessages } from "./storage"; // ✅ Correct import

const socket = io("http://localhost:5000");
const currentUser = "You";

export default function App() {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [messagesFromApp, setMessagesFromApp] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeView, setActiveView] = useState("sidebar");
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Load messages from localStorage for currentChatUser when it changes
  useEffect(() => {
    if (currentChatUser) {
      const msgs = getMessages(currentChatUser);
      setChatMessages(msgs);
    } else {
      setChatMessages([]);
    }
  }, [currentChatUser]);

  // Merge localStorage and messagesFromApp for consistency
  useEffect(() => {
    if (currentChatUser) {
      const localMsgs = getMessages(currentChatUser);
      const merged = [...new Map([...localMsgs, ...messagesFromApp].map(m => [m.time + m.text, m])).values()];
      setChatMessages(merged);
    }
  }, [messagesFromApp, currentChatUser]);

  // Listen for incoming messages from socket
  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      if (msg.sender !== currentUser) {
        
        saveMessage(msg.sender, msg); // ✅ Save to localStorage
        setMessagesFromApp((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, []);

  // Send message function
  const sendMessage = (text) => {
    if (!text.trim() || !currentChatUser) return;

    const msgObj = {
      sender: currentUser,
      receiver: currentChatUser,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      seen: false,
    };

    socket.emit("send_message", msgObj);
    // saveMessage(currentChatUser, msgObj); 
    console.log("Saving message to:", currentChatUser, msgObj);
saveMessage(currentChatUser, msgObj);
// ✅ Save to localStorage
    setMessagesFromApp((prev) => [...prev, msgObj]);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop view */}
      <div className="hidden md:flex w-full">
        <Sidebar
          users={users}
          currentUser={currentUser}
          messagesFromApp={messagesFromApp}
          onChatSelect={(user) => {
            setCurrentChatUser(user);
            setActiveView("chat");
          }}
        />

        {currentChatUser ? (
          <ChatPanel
            messages={chatMessages}
            sendMessage={sendMessage}
            currentUser={currentUser}
            isCopilotOpen={isCopilotOpen}
            openCopilot={() => setIsCopilotOpen(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}

        <CopilotPanel onClose={() => setIsCopilotOpen(false)} />
      </div>

      {/* Mobile view */}
      <div className="block md:hidden w-full h-full">
        {activeView === "sidebar" && (
          <Sidebar
            users={users}
            currentUser={currentUser}
            messagesFromApp={messagesFromApp}
            onChatSelect={(user) => {
              setCurrentChatUser(user);
              setActiveView("chat");
            }}
          />
        )}

        {activeView === "chat" && currentChatUser && (
          <ChatPanel
            messages={chatMessages}
            sendMessage={sendMessage}
            currentUser={currentUser}
            isCopilotOpen={false}
            openCopilot={() => setActiveView("copilot")}
            onBack={() => setActiveView("sidebar")}
          />
        )}

        {activeView === "copilot" && (
          <CopilotPanel onClose={() => setActiveView("chat")} />
        )}
      </div>
    </div>
  );
}
