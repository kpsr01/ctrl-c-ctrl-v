import React, { useState, useRef, useEffect } from 'react';
import './ChatPage.css';
import { generateSchema } from '../services/apiService';

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
                : message.isError
                ? 'bg-red-800/90 mr-auto max-w-md border border-red-700/50 shadow-lg shadow-red-500/10 hover:shadow-red-500/20'
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
                <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-sm animate-fade-in ${
                  message.isError ? 'bg-red-700' : 'bg-gray-700'
                }`}>
                  {message.isError ? '❌' : '🤖'}
                </div>
              )}
              <div className="mt-1">
                {message.content}
                {message.timestamp && (
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ChatInputBox Component
const ChatInputBox = ({ chatInput, setChatInput, handleSubmit, isLoading }) => {
  return (
    <div className="p-2 md:p-6 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-4">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Describe the form you want to create..."
          className="flex-1 p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !chatInput.trim()}
          className="px-6 py-4 bg-purple-600 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">Send</span>
                <span className="ml-2 transform transition-transform duration-300 group-hover:translate-x-2">→</span>
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

// PreviewPanel Component
const PreviewPanel = ({ schema, isLoading }) => {
  return (
    <div className="w-full h-full bg-gray-800/50 backdrop-blur-md p-2 md:p-6 border-l border-gray-700/50 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Preview</h2>
        <div className="flex gap-2">
          <button 
            className="px-4 py-2 bg-gray-700/50 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform hover:bg-gray-700/70"
            disabled={!schema}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">Edit</span>
            </span>
          </button>
          <button 
            className="px-4 py-2 bg-purple-600 rounded-lg font-semibold transition-all duration-500 ease-out hover:shadow-lg hover:shadow-purple-500/30 relative group overflow-hidden transform disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!schema}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative inline-flex items-center transition-transform duration-300 group-hover:scale-110">
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">Export</span>
            </span>
          </button>
        </div>
      </div>
      <div className="bg-gray-900/70 h-[40vh] md:h-[80vh] rounded-lg p-4 border border-gray-700 shadow-xl backdrop-blur-sm overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Generating schema...</p>
            </div>
          </div>
        ) : schema ? (
          <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
            {JSON.stringify(schema, null, 2)}
          </pre>
        ) : (
          <div className="text-gray-400 text-center mt-20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl mb-2">Generated schema will appear here</p>
            <p className="text-sm">Start by describing the form you want to create</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [selectedType, setSelectedType] = useState('form');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [schema, setSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMessage = { type: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      console.log('🚀 Generating schema for:', chatInput);
      
      // Call the LLM service
      const response = await generateSchema(chatInput, selectedType);
      
      console.log('✅ Schema generated:', response);
      
      // Update schema state
      setSchema(response.schema);
      
      // Add AI response to messages
      const aiMessage = {
        type: 'ai',
        content: `Generated ${response.type} schema successfully! The schema has been displayed in the preview panel.`,
        schema: response.schema,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('❌ Error generating schema:', error);
      setError(error.message);
      
      // Add error message to chat
      const errorMessage = {
        type: 'ai',
        content: `Sorry, I encountered an error: ${error.message}`,
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setChatInput('');
    }
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

      {/* Error notification */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-col lg:flex-row w-full h-full gap-4 lg:gap-0">
        {/* Left Side - Preview Panel (70%) */}
        <div className="w-full lg:w-[70%]">
          <PreviewPanel schema={schema} isLoading={isLoading} />
        </div>
        {/* Right Side - Main Chat Area (30%) */}
        <div className="w-full lg:w-[30%] flex flex-col min-w-0">
          <ChatConversation messages={messages} />
          <ChatInputBox 
            chatInput={chatInput} 
            setChatInput={setChatInput} 
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>

    </div>
  );
}