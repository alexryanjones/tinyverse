import { startGame } from "./game.js";
import { loadNav } from "./nav.js";

export const logoWrapper = document.getElementById('logo-wrapper');
export const logo = document.getElementById('logo');

document.addEventListener('gameWon', () => {
  loadNav();
});

startGame();
