import React, { useContext } from "react";
import Placement from "./pages/Placement";
import Game from "./pages/Game";
import { GameContext } from "./context/GameContext";

const App = () => {
  const { state } = useContext(GameContext);

  const pages = {
    placement: <Placement />,
    game: <Game />,
  };

  return <>{pages[state.phase]}</>;
};

export default App;
