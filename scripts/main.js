import { startGame } from "./game.js";
import { loadNav } from "./nav.js";

export const logoWrapper = document.getElementById('logo-wrapper');
export const logo = document.getElementById('logo');

export const moveScout = (x, y) => {
  logoWrapper.style.left = `${x}px`;
  logoWrapper.style.top = `${y}px`;
}

document.addEventListener('gameWon', () => {
  loadNav();
});

startGame();
