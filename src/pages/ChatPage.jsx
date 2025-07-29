import React, { useState } from 'react';

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

      {/* Sidebar */}
      <div className="w-[19%] bg-gray-800/50 backdrop-blur-md p-5 flex flex-col border-r border-gray-700/50">
        <h2 className="text-2xl font-bold mb-6 relative group">
          <span className="bg-gradient-to-r from-white via-blue-50 to-gray-100 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">Output Type</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white via-blue-50 to-gray-100 transition-all duration-300 group-hover:w-full animate-gradient glow-white"></span>
        </h2>
        <div className="space-y-4">
          <button
            className={`w-full p-4 rounded-lg transition-all duration-500 ease-out relative group overflow-hidden transform hover:-translate-y-2 hover:scale-110 backdrop-blur-sm ${
              selectedType === 'form'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40 animate-pulse-slow before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600/20 before:to-pink-600/20 before:blur-xl'
                : 'bg-gray-700/50 hover:bg-gradient-to-r hover:from-gray-700/60 hover:via-purple-600/20 hover:to-purple-500/30 hover:shadow-xl hover:shadow-purple-500/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:blur-xl before:transition-opacity before:duration-500'
            }`}
            onClick={() => setSelectedType('form')}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 inline-block group-hover:-rotate-12 group-hover:animate-bounce-slow">📝</span>
              <span className="ml-2 bg-gradient-to-r from-white to-white bg-clip-text group-hover:text-transparent">Form</span>
            </span>
          </button>
          <button
            className={`w-full p-4 rounded-lg transition-all duration-500 ease-out relative group overflow-hidden transform hover:-translate-y-2 hover:scale-110 backdrop-blur-sm ${
              selectedType === 'presentation'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40 animate-pulse-slow before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600/20 before:to-pink-600/20 before:blur-xl'
                : 'bg-gray-700/50 hover:bg-gradient-to-r hover:from-gray-700/60 hover:via-purple-600/20 hover:to-purple-500/30 hover:shadow-xl hover:shadow-purple-500/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:blur-xl before:transition-opacity before:duration-500'
            }`}
            onClick={() => setSelectedType('presentation')}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 inline-block group-hover:-rotate-12 group-hover:animate-bounce-slow">🎯</span>
              <span className="ml-2 bg-gradient-to-r from-white to-white bg-clip-text group-hover:text-transparent">Presentation</span>
            </span>
          </button>
          <button
            className={`w-full p-4 rounded-lg transition-all duration-500 ease-out relative group overflow-hidden transform hover:-translate-y-2 hover:scale-110 backdrop-blur-sm ${
              selectedType === 'spreadsheet'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/40 animate-pulse-slow before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-600/20 before:to-pink-600/20 before:blur-xl'
                : 'bg-gray-700/50 hover:bg-gradient-to-r hover:from-gray-700/60 hover:via-purple-600/20 hover:to-purple-500/30 hover:shadow-xl hover:shadow-purple-500/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-purple-500/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:blur-xl before:transition-opacity before:duration-500'
            }`}
            onClick={() => setSelectedType('spreadsheet')}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 inline-block group-hover:-rotate-12 group-hover:animate-bounce-slow">📊</span>
              <span className="ml-2 bg-gradient-to-r from-white to-white bg-clip-text group-hover:text-transparent">Spreadsheet</span>
            </span>
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Example Prompts</h3>
          <div className="h-20 relative overflow-hidden mb-8">
            <div className="absolute w-full animate-scroll-text">
              <p className="text-sm text-gray-400 py-2 transition-all duration-300 hover:text-white">"Create a survey about employee satisfaction"</p>
              <p className="text-sm text-gray-400 py-2 transition-all duration-300 hover:text-white">"Build a 7-slide presentation on AI in education"</p>
              <p className="text-sm text-gray-400 py-2 transition-all duration-300 hover:text-white">"Generate a monthly budget spreadsheet"</p>
              {/* Duplicate for seamless loop */}
              <p className="text-sm text-gray-400 py-2 transition-all duration-300 hover:text-white">"Create a survey about employee satisfaction"</p>
              <p className="text-sm text-gray-400 py-2 transition-all duration-300 hover:text-white">"Build a 7-slide presentation on AI in education"</p>
              <p className="text-sm text-gray-400 py-2 transition-all duration-300 hover:text-white">"Generate a monthly budget spreadsheet"</p>
            </div>
          </div>

          {/* Decorative Separator */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30 my-6">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4">
              <div className="w-full h-full bg-purple-500 rounded-full opacity-20 animate-pulse-slow"></div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Quick Tips</div>
              <div className="space-y-2">
                <div className="group p-2 rounded-lg bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300">
                  <div className="text-xs text-gray-400 group-hover:text-gray-300">Press <span className="text-purple-400">Tab</span> to autocomplete</div>
                </div>
                <div className="group p-2 rounded-lg bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300">
                  <div className="text-xs text-gray-400 group-hover:text-gray-300">Use <span className="text-purple-400">/help</span> for commands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-[400px]">
        <div className="flex-1 p-6 overflow-auto">
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

        {/* Input Area */}
        <div className="p-6 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50">
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
      </div>

      {/* Resizer */}
      <div 
        className="w-1 hover:w-2 bg-gray-700/50 hover:bg-purple-500/50 cursor-col-resize transition-all duration-300 active:bg-purple-500/70 group z-10"
        onMouseDown={(e) => {
          const startX = e.clientX;
          const previewPane = e.target.nextElementSibling;
          const startWidth = previewPane.offsetWidth;

          const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const newWidth = Math.max(300, Math.min(800, startWidth - deltaX));
            previewPane.style.width = `${newWidth}px`;
          };

          const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
          };

          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        }}
      >
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-0.5 h-4 bg-gray-400 mx-px"></div>
          <div className="w-0.5 h-4 bg-gray-400 mx-px"></div>
        </div>
      </div>

      {/* Preview Pane */}
      <div className="w-96 bg-gray-800/50 backdrop-blur-md p-6 border-l border-gray-700/50 min-w-[300px] max-w-[800px] transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-6">Preview</h2>
        <div className="bg-gray-900/70 h-[80vh] rounded-lg p-4 border border-gray-700 shadow-xl backdrop-blur-sm">
          {/* Preview content will be rendered here */}
          <div className="text-gray-400 text-center mt-20">
            Generated content will appear here
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient { 
          background-size: 200% 200%; 
          animation: gradient 8s ease-in-out infinite; 
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }
        .animate-float-slow { 
          animation: float-slow 8s ease-in-out infinite; 
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(20px) translateX(-10px); }
          50% { transform: translateY(0) translateX(-20px); }
          75% { transform: translateY(-20px) translateX(-10px); }
        }
        .animate-float-medium { 
          animation: float-medium 6s ease-in-out infinite; 
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(15px); }
          50% { transform: translateY(0) translateX(30px); }
          75% { transform: translateY(15px) translateX(15px); }
        }
        .animate-float-fast { 
          animation: float-fast 4s ease-in-out infinite; 
        }

        .glow-white {
          filter: drop-shadow(0 0 2px rgba(255,255,255,0.3));
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-25%) rotate(-12deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        @keyframes fade-in-side {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-side {
          animation: fade-in-side 0.5s ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes scroll-text {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-scroll-text {
          animation: scroll-text 15s linear infinite;
          animation-play-state: running;
        }
        .animate-scroll-text:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
