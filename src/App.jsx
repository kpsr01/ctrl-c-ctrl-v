import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/ui/NavBar";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
