import React, { useState } from 'react';
import './ChatPage.css';

// ChatConversation Component
const ChatConversation = ({ messages }) => {
  return (
    <div className="flex-1 p-2 md:p-6 overflow-auto m-4 md:m-10">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 animate-fade-in-up">
            <div className="text-6xl mb-4 animate-bounce-slow">💬</div>
            <p className="text-xl mb-2">Start a conversation!</p>
            <p className="text-sm">Describe what kind of form, presentation, or spreadsheet you need</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg backdrop-blur-sm animate-fade-in-side transform transition-all duration-300 hover:scale-[1.02] ${
              message.type === 'user'
                ? 'bg-purple-600/90 ml-auto max-w-md shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                : 'bg-gray-800/90 mr-auto max-w-md border border-gray-700/50 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20'
            }`}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'backwards'
            }}
          >
            <div className="relative">
              {message.type === 'user' ? (
                <div className="absolute -right-2 -top-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm animate-fade-in">👤</div>
              ) : (
                <div className="absolute -left-2 -top-2 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-sm animate-fade-in">🤖</div>
              )}
              <div className="mt-1">{message.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ChatInputBox Component
const ChatInputBox = ({ chatInput, setChatInput, handleSubmit }) => {
  return (
    <div className="p-2 md:p-6 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your request here..."
          className="flex-1 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
        <button
          type="submit"
          className="px-6 py-4 bg-purple-600 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
            <span className="transform transition-transform duration-300 group-hover:translate-x-1">Send</span>
            <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2">→</span>
          </span>
        </button>
      </form>
    </div>
  );
};

// PreviewPanel Component
const PreviewPanel = () => {
  return (
    <div className="w-full h-full bg-gray-800/50 backdrop-blur-md p-2 md:p-6 border-l border-gray-700/50 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700/50 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform hover:bg-gray-700/70">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">Edit</span>
            </span>
          </button>
          <button className="px-4 py-2 bg-purple-600 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform">
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">Export</span>
            </span>
          </button>
        </div>
      </div>
      <div className="bg-gray-900/70 h-[40vh] md:h-[80vh] rounded-lg p-4 border border-gray-700 shadow-xl backdrop-blur-sm">
        {/* Preview content will be rendered here */}
        <div className="text-gray-400 text-center mt-20">
          Generated content will appear here
        </div>
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [selectedType, setSelectedType] = useState('form');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setMessages([...messages, { type: 'user', content: chatInput }]);
    // TODO: Add AI response logic here
    setChatInput('');
  };

  return (
    <div className="h-screen w-screen flex bg-gray-900 text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 opacity-40">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-500/20 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float-fast"></div>
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row w-full h-full gap-4 lg:gap-0">
        {/* Left Side - Preview Panel (70%) */}
        <div className="w-full lg:w-[70%]">
          <PreviewPanel />
        </div>
        {/* Right Side - Main Chat Area (30%) */}
        <div className="w-full lg:w-[30%] flex flex-col min-w-0">
          <ChatConversation messages={messages} />
          <ChatInputBox 
            chatInput={chatInput} 
            setChatInput={setChatInput} 
            handleSubmit={handleSubmit} 
          />
        </div>
      </div>

    </div>
  );
}