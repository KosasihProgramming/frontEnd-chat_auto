import logo from "./logo.svg";
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./auth/auth";
import Instructions from "./pages/instructions";
import AISettings from "./pages/mainSettingsAI";
function App() {
  const isLogin = localStorage.getItem("isLogin") === "true";

  return (
    <div className="App">
      <Router>
        {isLogin ? (
          <>
            <Routes>
              {/* <Route path="/" element={<Login />} /> */}
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/" element={<AISettings />} />
              {/* <Route path="*" element={<Navigate to="/" />} /> */}
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
