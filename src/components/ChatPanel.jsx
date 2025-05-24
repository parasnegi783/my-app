import React, { useEffect, useState, useRef } from "react";
import { FaRegSmile, FaMoon, FaTimes, FaRobot, FaArrowLeft } from "react-icons/fa";

export default function ChatPanel({
  messages,
  sendMessage,
  currentUser,
  isCopilotOpen,
  openCopilot,
  onBack,
}) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    console.log("Messages received:", messages);

  }, [messages]);

  // Handle key press (send message on Enter)
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  // Send message function
  const onSend = () => {
    if (input.trim() === "") return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div
      className={`transition-all duration-300 p-4 bg-gray-50 flex flex-col h-full ${
        isCopilotOpen ? "md:w-[55%]" : "md:w-[80%] w-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {/* Back Button (Mobile only) */}
          {onBack && (
            <button className="md:hidden p-2" onClick={onBack}>
              <FaArrowLeft />
            </button>
          )}
          {/* Show chat partner name here */}
          <h2 className="text-2xl font-semibold">{currentUser}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="md:hidden p-2" onClick={openCopilot}>
            <FaRobot />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded mb-2 max-w-[70%] ${
              msg.sender === currentUser
                ? "bg-blue-100 self-end ml-auto"
                : "bg-red-50 self-start"
            }`}
          >
            {/* Username */}
            <div className="font-semibold text-sm text-gray-700 mb-1">
              {msg.sender}
            </div>

            {/* Message Text */}
            <p>{msg.text}</p>

            {/* Seen and Time */}
            <div className="text-xs text-gray-500 text-right">
              {msg.seen ? "Seen · " : ""}
              {msg.time}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border rounded-xl bg-white shadow-sm px-4 py-2 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          placeholder="Send a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <button
          className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
