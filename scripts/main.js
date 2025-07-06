import { startGame } from "./game.js";
import { loadNav } from "./nav.js";
import { isMobile } from "./utils.js";

export const logoWrapper = document.getElementById('logo-wrapper');
export const logo = document.getElementById('logo');

let lastMouseX = null;
let mouseMoveTimeout;

export let latestMousePos = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

export const updateCursor = (event) => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;
  latestMousePos = { x: mouseX, y: mouseY };

  if (lastMouseX !== null) {
    if (mouseX > lastMouseX) {
      logoWrapper.style.transform = 'translate(-50%, -50%) scaleX(-1)';
      logo.style.transform = 'rotate(-15deg)';
    } else if (mouseX < lastMouseX) {
      logoWrapper.style.transform = 'translate(-50%, -50%) scaleX(1)';
      logo.style.transform = 'rotate(-15deg)';
    }
  }

  logoWrapper.style.left = `${mouseX}px`;
  logoWrapper.style.top = `${mouseY}px`;

  lastMouseX = mouseX;
  clearTimeout(mouseMoveTimeout);
  mouseMoveTimeout = setTimeout(() => {
    logo.style.transform = 'rotate(0deg)';
  }, 100);
};

export const handleMouse = (callback) => {
  document.addEventListener('mousemove', (e) => {
    updateCursor(e);
    callback(e);
  });

  document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (touch) {
      const touchEvent = { clientX: touch.clientX, clientY: touch.clientY };
      updateCursor(touchEvent);
      callback(touchEvent);
    }
  });
};

document.addEventListener('gameWon', () => {
  loadNav();
});

startGame();
