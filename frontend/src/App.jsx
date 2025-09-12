// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoPlayerDashboard from "./pages/VideoPlayerDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VideosDashboard from "./components/Theme1/VideosDashboard";
import DustyDashboard from "./components/Theme2/T2Dashboard";
import BloosomDashboard from "./components/Theme6/T6Dashboard";
import RainyDashboard from "./components/Theme4/T4Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/theme1" element={<VideoPlayerDashboard />} />
        <Route path="/theme2" element={<DustyDashboard />} />
        <Route path="/theme4" element={<RainyDashboard />} />
        <Route path="/theme6" element={<BloosomDashboard />} />
        <Route path="/videos" element={<VideosDashboard/>} />
      </Routes>
    </Router>
  );
};

export default App;

/* 
Okay i need to modify this dashboard according to a rainy theme so keep the colors according to that . I want to maintain the overall structure but you are free to chang ethe styling to match a rainy atmosphere . Use shades of blue ( preferably sky blue) , also change the contents inside the cards as required and also we require to make each card as a component so its easier to import into the dashboard directly . So do that . For now keep the IfIcouldspeak as it is , also use the same imports i am using ( for images and videos if there are any) */