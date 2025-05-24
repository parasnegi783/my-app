import React, { useState, useEffect } from "react";

const initialMessages = [
  { sender: "Luis - Github", preview: "Hey! I have a question...", time: "45m", bgColor: "bg-blue-100" },
  { sender: "Ivan - Nike", preview: "Hi there, I have a question...", time: "30m", bgColor: "bg-red-100" },
  { sender: "Lead from New York", preview: "Good morning, let me...", time: "40m", bgColor: "bg-gray-100" },
  { sender: "Booking API problems", preview: "Bug report", time: "40m", bgColor: "bg-black text-white" },
  { sender: "Miracle - Exemplary Bank", preview: "Hey there, I'm here to...", time: "45m", bgColor: "bg-gray-100" },
];

export default function Sidebar({ messagesFromApp, currentChatUser, onChatSelect }) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    if (messagesFromApp && messagesFromApp.length > 0) {
      const latestMsg = messagesFromApp[messagesFromApp.length - 1];

      // Don't include messages sent by "You"
      if (latestMsg.sender === "You") return;

      const newMsg = {
        sender: latestMsg.sender,
        preview: latestMsg.text || "New message",
        time: latestMsg.time || "Now",
        bgColor: "bg-green-100",
      };

      setMessages((prev) => {
        // Remove old messages from same sender
        const filtered = prev.filter((msg) => msg.sender !== newMsg.sender);
        // Add new message on top
        return [newMsg, ...filtered];
      });
    }
  }, [messagesFromApp]);

  return (
    <div className="w-full md:w-[25%] p-4 bg-white h-full overflow-y-auto border-r">
      <h2 className="text-xl font-bold mb-4">Chats</h2>

      <ul>
        {messages.map((msg) => (
          <li
            key={msg.sender}
            className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer ${
              msg.sender === currentChatUser ? "bg-blue-200" : msg.bgColor
            }`}
            onClick={() => onChatSelect(msg.sender)}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 font-bold text-lg mr-3">
              {msg.sender.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <p className="font-bold truncate">{msg.sender}</p>
              <p className="text-sm text-gray-600 truncate">{msg.preview}</p>
            </div>
            <span className="text-sm text-gray-500">{msg.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
