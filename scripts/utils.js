import { logoWrapper, logo } from './main.js';

export const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
export const portalSize = 100;
export let latestMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };


export const moveScout = (x, y, lastX, rest) => {
  const deltaX = x - lastX;

  if (lastX !== null && Math.abs(deltaX) > 2) {
    if (deltaX > 0) {
      logoWrapper.style.transform = 'translate(-50%, -50%) scaleX(-1)';
      logo.style.transform = 'rotate(-15deg)';
    } else if (deltaX < 0) {
      logoWrapper.style.transform = 'translate(-50%, -50%) scaleX(1)';
      logo.style.transform = 'rotate(-15deg)';
    }
  }
  
  logoWrapper.style.left = `${x}px`;
  logoWrapper.style.top = `${y}px`;

  if (rest) {
    setTimeout(() => {
      logo.style.transform = 'rotate(0deg)';
    }, 300);
  }
};