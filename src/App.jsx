import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AndroidCompact from "./pages/MENU"; // главная страница
import Game1 from "./pages/Game1"; // игра 1

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
