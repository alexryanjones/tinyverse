import { startGame } from "./game.js";
import { loadNav } from "./nav.js";

document.addEventListener('gameWon', () => loadNav());

startGame();
