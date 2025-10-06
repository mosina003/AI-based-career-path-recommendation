import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import ManualPrediction from "./pages/ManualPrediction"; // ✅ ADD MANUAL PREDICTION IMPORT

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home as entry page */}
        <Route path="/" element={<Home />} />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Career Prediction routes */}
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/manual-prediction" element={<ManualPrediction />} /> {/* ✅ ADD MANUAL PREDICTION ROUTE */}
        <Route path="/results" element={<Results />} />
        
        {/* Dashboard and profile (no protection for now) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
