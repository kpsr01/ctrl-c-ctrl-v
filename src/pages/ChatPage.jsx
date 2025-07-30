import React, { useState } from "react";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    "Chat with HR",
    "Weekly Report",
    "Form Builder",
    "Excel Automation",
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { type: "user", content: chatInput }]);
    setChatInput("");
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300 bg-gray-800 flex flex-col pt-20 border-r border-gray-700`}
      >
        <button
          className="mt-4 text-white p-2 rounded-full hover:bg-gray-700/25 transition backdrop-blur-md bg-gray-800/50"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? "←" : "→"}
        </button>

        {sidebarOpen && (
          <div className="mt-4 space-y-2 px-4 overflow-y-auto">
            {chatHistory.map((item, index) => (
              <div
                key={index}
                className="p-2 rounded hover:bg-gray-700 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 h-full">
        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 animate-fade-in-up">
                <div className="mt-20 text-6xl mb-4 animate-bounce-slow">
                  💬
                </div>
                <p className="text-xl mb-2">Start a conversation!</p>
                <p className="text-sm">
                  Describe what kind of form, presentation, or spreadsheet you
                  need
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg backdrop-blur-sm animate-fade-in-side transform transition-all duration-300 hover:scale-[1.02] ${
                    message.type === "user"
                      ? "bg-purple-600/90 ml-auto max-w-md shadow-lg shadow-purple-500/20"
                      : "bg-gray-800/90 mr-auto max-w-md border border-gray-700/50 shadow-lg shadow-purple-500/10"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`absolute -top-2 w-6 h-6 rounded-full flex items-center justify-center text-sm animate-fade-in ${
                        message.type === "user"
                          ? "bg-purple-500 -right-2"
                          : "bg-gray-700 -left-2"
                      }`}
                    >
                      {message.type === "user" ? "👤" : "🤖"}
                    </div>
                    <div className="mt-1">{message.content}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your request here..."
              className="w-full p-4 pr-12 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-purple-300"
              aria-label="Send"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5m0 0l-6 6m6-6l6 6" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
