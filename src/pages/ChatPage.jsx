import React, { useState } from 'react';
import './ChatPage.css';
import { generateSchema } from '../services/apiService';
import GoogleLoginButton from '../components/ui/GoogleLoginButton';

// Calls Google Forms API to create the form (only sets title)
async function createGoogleForm(payload, accessToken) {
  const res = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: payload.info.title
      }
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to create Google Form');
  }

  return await res.json(); // returns formId
}

// Calls Google Forms API batchUpdate to add items (questions)
async function updateGoogleFormItems(formId, items, accessToken) {
  const requests = items.map(item => ({
    createItem: {
      item: item,
      location: {
        index: 0
      }
    }
  }));

  const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to update Google Form items');
  }

  return await res.json();
}

// Converts JSON schema to Google Forms API format
function convertSchemaToGoogleForm(schema) {
  const items = [];

  for (const [key, field] of Object.entries(schema.properties)) {
    const required = (schema.required || []).includes(key);
    const title = field.title || key;

    if (field.enum) {
      const choiceType = field.type === 'array' ? 'CHECKBOX' : 'DROP_DOWN';
      const options = field.enum.map((val) => ({ value: val }));
      items.push({
        title,
        questionItem: {
          question: {
            required,
            choiceQuestion: {
              type: choiceType,
              options,
              shuffle: false
            }
          }
        }
      });
    } else if (field.type === 'string' && field.format === 'date') {
      items.push({
        title,
        questionItem: {
          question: {
            required,
            dateQuestion: {}
          }
        }
      });
    } else if (field.type === 'object' && field.properties) {
      for (const [subKey, subField] of Object.entries(field.properties)) {
        const subTitle = subField.title || subKey;
        items.push({
          title: `${title} - ${subTitle}`,
          questionItem: {
            question: {
              required: false,
              textQuestion: {}
            }
          }
        });
      }
    } else {
      items.push({
        title,
        questionItem: {
          question: {
            required,
            textQuestion: {}
          }
        }
      });
    }
  }

  return {
    info: {
      title: schema.title || "Generated Form"
    },
    items
  };
}

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

// PreviewPanel Component that shows iframe of Google Form
const PreviewPanel = ({ schema, isLoading }) => {
  return (
    <div className="w-full h-full bg-gray-800/50 backdrop-blur-md p-2 md:p-6 border-l border-gray-700/50 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Preview</h2>
      </div>
      <div className="bg-gray-900/70 h-[40vh] md:h-[80vh] rounded-lg p-4 border border-gray-700 shadow-xl backdrop-blur-sm overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Generating schema...</p>
            </div>
          </div>
        ) : schema?.googleFormId ? (
          <iframe
            src={`https://docs.google.com/forms/d/${schema.googleFormId}/viewform`}
            width="100%"
            height="100%"
            className="rounded-lg border-none"
            title="Google Form Preview"
          />
        ) : (
          <div className="text-gray-400 text-center mt-20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl mb-2">Generated form will appear here</p>
            <p className="text-sm">Start by describing the form you want to create</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ChatPage() {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [schema, setSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const handleLogin = (token) => {
    setAccessToken(token);
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUser({ email: data.email, picture: data.picture }))
      .catch(() => setUser(null));
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    setSchema(null);
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    setMessages(prev => [...prev, { type: 'user', content: chatInput }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await generateSchema(chatInput, 'form');
      const rawSchema = response.schema;
      const googleFormPayload = convertSchemaToGoogleForm(rawSchema);

      if (!accessToken) {
        throw new Error('Google access token is missing. Please login again.');
      }

      // Create form with title only
      const formResult = await createGoogleForm(googleFormPayload, accessToken);

      // Add questions/items with batchUpdate
      await updateGoogleFormItems(formResult.formId, googleFormPayload.items, accessToken);

      setSchema({ googleFormId: formResult.formId });
      setMessages(prev => [...prev, { type: 'ai', content: `Generated form successfully!`, timestamp: response.timestamp }]);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, { type: 'ai', content: `Error: ${err.message}`, isError: true }]);
    } finally {
      setIsLoading(false);
      setChatInput('');
    }
  };

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">
        <GoogleLoginButton onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-gray-900 text-white relative overflow-hidden">
      {/* Floating orbs and background gradient */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-purple-900 via-gray-900 to-red-900 opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-500/20 rounded-full blur-xl animate-float-medium"></div>
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-float-fast"></div>

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:text-gray-200">✕</button>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {user && (
          <>
            <img src={user.picture} alt="User" className="w-8 h-8 rounded-full" />
            <span className="text-sm">{user.email}</span>
            <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-white">Logout</button>
          </>
        )}
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row w-full h-full gap-4 lg:gap-0">
        <div className="w-full lg:w-[70%]">
          <PreviewPanel schema={schema} isLoading={isLoading} />
        </div>
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