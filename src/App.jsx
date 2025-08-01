import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/ui/NavBar";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = "692584703083-djnu51jr4l9erbddoem9clmacqnbb36l.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        {/* <Navbar /> */}
        <main className="min-h-screen w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
