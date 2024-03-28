import React from "react";
import { Route, Routes } from "react-router-dom";
import Placement from "./pages/Placement";
import Game from "./pages/Game";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Placement />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
};

export default App;
