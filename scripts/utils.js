export const logoWrapper = document.getElementById('logo-wrapper');

export const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
export const portalSize = 100; // Size of the portal in pixels;
export let latestMousePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

export const moveScout = (x, y, lastX, rest) => {
  const deltaX = x - lastX;

  const moveRight = 'translate(-50%, -50%) scaleX(-1)';
  const moveLeft = 'translate(-50%, -50%) scaleX(1)';

  if (lastX !== null && Math.abs(deltaX) > 2) {
    if (deltaX > 0) {
      logoWrapper.style.transform = moveRight;
      logo.style.transform = 'rotate(-15deg)';
    } else if (deltaX < 0) {
      logoWrapper.style.transform = moveLeft;
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

export const getRandomPosition = (elementWidth, elementHeight) => {
  const marginX = window.innerWidth * 0.1;
  const marginY = window.innerHeight * 0.1;
  const x =
    Math.random() * (window.innerWidth - 2 * marginX - elementWidth) + marginX;
  const y =
    Math.random() * (window.innerHeight - 2 * marginY - elementHeight) + marginY;
  
  return { x, y };
};