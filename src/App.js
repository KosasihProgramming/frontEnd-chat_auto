import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./auth/auth";
import Instructions from "./pages/instructions";
import AISettings from "./pages/mainSettingsAI";
import Navbar from "../src/component/navbar"; // Pastikan lokasi path sesuai
import Conversation from "./pages/conversation";
import Device from "./pages/device";

function App() {
  const isLogin = localStorage.getItem("isLogin") === "true";

  return (
    <div className="App">
      <Router>
        {/* Navbar akan muncul di semua halaman */}
        <Navbar />
        {isLogin ? (
          <>
            <Routes>
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/device" element={<Device />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/" element={<AISettings />} />
            </Routes>
          </>
        ) : (
          <>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
