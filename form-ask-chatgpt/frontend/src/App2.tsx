import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import AskSpecificVideo from "./askSpecificVideo"; // Importa la página AskSpecificVideo
import GeneralPage from "./HomePage"; // Asume que App.tsx contiene el componente principal

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/specific-video" element={<AskSpecificVideo />} />
        <Route path="/general" element={<GeneralPage />} />
      </Routes>
    </Router>
  );
};

export default App;
