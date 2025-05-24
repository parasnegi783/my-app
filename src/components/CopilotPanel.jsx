import { useState, useEffect } from "react";
import { FaRobot, FaCopy, FaArrowLeft } from "react-icons/fa";
import axios from "axios";

export default function CopilotPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState("copilot");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");

  // Typing effect for the last AI message
  useEffect(() => {
    const lastAIMessage = [...messages].reverse().find((m) => m.from === "ai");
    if (!lastAIMessage) {
      setTypedResponse("");
      return;
    }

    let i = 0;
    setTypedResponse("");
    const fullText = lastAIMessage.text;

    const interval = setInterval(() => {
      setTypedResponse((prev) => prev + fullText[i]);
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { from: "user", text: input }]);

    try {
      // Uncommented real API call, commented mock data
      
      const res = await axios.post("https://my-app-backend-production-27f4.up.railway.app/api/chat", {
        message: input,
      });
      const reply = res.data.reply || "No reply from API.";
      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
      setLoading(false);
      setInput("");
      

      // Mock data for demo purposes
      // setTimeout(() => {
      //   const mockReply = `This is a mock reply to your message: "${input}"`;
      //   setMessages((prev) => [...prev, { from: "ai", text: mockReply }]);
      //   setLoading(false);
      //   setInput("");
      // }, 800);
    } catch (error) {
      console.error("Error in chat API:", error);
      setMessages((prev) => [...prev, { from: "ai", text: "Something went wrong." }]);
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div
      className="w-full md:w-[25%] h-full p-4 border-l flex flex-col"
      style={{
        background: `
          radial-gradient(circle at top left, #FFFFFF 0%, #F0F4FF 50%, transparent 100%), 
          radial-gradient(circle at top right, #FFFFFF 0%, #FFECEB 50%, transparent 100%), 
          radial-gradient(circle at bottom left, #C8D8FF 0%, transparent 70%), 
          radial-gradient(circle at bottom right, #F2A7A6 0%, transparent 70%)
        `,
        backgroundBlendMode: "normal",
      }}
    >
      {/* Header with Back button for mobile */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="md:hidden text-gray-700 p-2 hover:text-gray-900"
            title="Back"
          >
            <FaArrowLeft />
          </button>
          <span className="text-lg font-semibold flex items-center gap-2">
            <FaRobot />
            AI Copilot
          </span>
        </div>

        <button
          onClick={onClose}
          className="hidden md:block text-gray-700 hover:text-gray-900"
          title="Close Copilot"
        >
          ✕
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col px-2 overflow-auto space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow text-center text-gray-500">
            <div className="text-4xl mb-4">
              <FaRobot />
            </div>
            <h2 className="text-lg font-semibold mb-1">Hi, I'm Fin AI Copilot</h2>
            <p className="text-sm">Ask me anything about this conversation.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isLastAI =
              msg.from === "ai" &&
              idx === messages.map((m, i) => (m.from === "ai" ? i : -1)).filter((i) => i !== -1).pop();

            return (
              <div
                key={idx}
                className={`max-w-[80%] px-4 py-2 rounded-lg shadow-sm whitespace-pre-wrap break-words ${
                  msg.from === "user"
                    ? "bg-blue-500 text-white self-end rounded-tr-none"
                    : "bg-gray-200 text-gray-800 self-start rounded-tl-none"
                } flex flex-col`}
              >
                <div>{msg.from === "ai" && isLastAI ? typedResponse : msg.text}</div>

                <button
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                  className={`self-end mt-1 flex items-center space-x-2 text-xs ${
                    msg.from === "user"
                      ? "text-white hover:text-gray-200"
                      : "text-blue-600 hover:text-blue-500"
                  } hover:underline transition-all`}
                  title="Copy Message"
                >
                  <FaCopy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Input Section */}
      <div className="relative px-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a question..."
          className="w-full bg-white border border-gray-300 rounded-md p-2 pr-10 text-sm placeholder-gray-500"
          disabled={loading}
        />
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Send"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              ></path>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
