import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/TatvaAuth";
import Dashboard from "./components/ProductVerify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth and Dashboard routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/ProductVerify" element={<Dashboard />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;