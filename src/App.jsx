import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MENU from "./pages/MENU.jsx";
import Game1 from "./pages/Game1.jsx"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<MENU />} />

        {/* Страница Game1 */}
        <Route path="/Game1" element={<Game1 />} />
      </Routes>
    </Router>
  );
}

export default App;
