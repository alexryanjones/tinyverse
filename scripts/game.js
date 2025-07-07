import { logoWrapper, moveScout } from './main.js';
import { isMobile, portalSize } from './utils.js';

const gameLevels = 3;
const maxScale = 4;
const greyScaleModifier = isMobile ? 0.5 : 1;

let currentPortal = null;
let currentGreyScale = 1;
let lastDistance = null;
let currentBackgroundIndex = 0;
let portalsPassed = 0;
let moveInterval;
let greyActive = true;
let isGameOver = false;

let game = null;
let grey = null;
let gameOver = null;
let backgroundElements = null;

let lastMouseX = null;
let mouseMoveTimeout;
let latestMousePos = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
};

let mouseMoveListener = null;
let touchMoveListener = null;

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

  moveScout(mouseX, mouseY);

  lastMouseX = mouseX;
  clearTimeout(mouseMoveTimeout);
  mouseMoveTimeout = setTimeout(() => {
    logo.style.transform = 'rotate(0deg)';
  }, 100);
};


export const handleMouse = (callback) => {
  mouseMoveListener = (e) => {
    updateCursor(e);
    callback(e);
  };
  touchMoveListener = (e) => {
    const touch = e.touches[0];
    if (touch) {
      const touchEvent = { clientX: touch.clientX, clientY: touch.clientY };
      updateCursor(touchEvent);
      callback(touchEvent);
    }
  };

  document.addEventListener('mousemove', mouseMoveListener);
  document.addEventListener('touchmove', touchMoveListener);
};

const removeMouseHandlers = () => {
  if (mouseMoveListener) {
    document.removeEventListener('mousemove', mouseMoveListener);
    mouseMoveListener = null;
  }
  if (touchMoveListener) {
    document.removeEventListener('touchmove', touchMoveListener);
    touchMoveListener = null;
  }
};

export const createPortal = () => {
  if (currentPortal) currentPortal.remove();

  const sparkleContainer = document.createElement('div');
  const sparkle = document.createElement('img');
  sparkle.src = 'assets/images/portal-spark.gif';
  sparkleContainer.classList.add('portal');
  sparkle.classList.add('sparkle');
  sparkleContainer.appendChild(sparkle);

  const maxX = window.innerWidth - portalSize;
  const maxY = window.innerHeight - portalSize;
  sparkleContainer.style.left = `${Math.floor(Math.random() * maxX)}px`;
  sparkleContainer.style.top = `${Math.floor(Math.random() * maxY)}px`;

  game.appendChild(sparkleContainer);
  currentPortal = sparkleContainer;

  const swapToRealPortal = () => {
    const portal = document.createElement('img');
    portal.src = 'assets/images/portal.gif';
    portal.classList.add('portal');
    portal.style.left = sparkleContainer.style.left;
    portal.style.top = sparkleContainer.style.top;

    game.replaceChild(portal, sparkleContainer);
    currentPortal = portal;
  };

  sparkle.onload = () => {
    setTimeout(swapToRealPortal, 500);
  };
};

export const checkPortalCollision = (event) => {
  if (!currentPortal) return;
  const rect = currentPortal.getBoundingClientRect();
  if (
    event.clientX > rect.left &&
    event.clientX < rect.right &&
    event.clientY > rect.top &&
    event.clientY < rect.bottom
  ) {
    passPortal();
  }
};

export const setGreyScale = (scale) => {
  currentGreyScale = scale;
  grey.style.transform = `translate(-50%, -50%) scale(${
    currentGreyScale * greyScaleModifier
  })`;
};

export const passPortal = () => {
  if (isGameOver) return;
  currentBackgroundIndex =
    (currentBackgroundIndex + 1) % backgroundElements.length;
  portalsPassed >= gameLevels ? showBackground(true) : showBackground();
  setGreyScale(currentGreyScale / 2);

  if (portalsPassed >= gameLevels) {
    const gameWonEvent = new CustomEvent('gameWon');
    document.dispatchEvent(gameWonEvent);
    removeMouseHandlers();
  } else {
    portalsPassed++;
    createPortal();
  }
};

export const destroyGrey = () => {
  greyActive = false;
  clearInterval(moveInterval);
  grey.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  grey.style.transform = 'translate(-50%, -50%) scale(0)';
  grey.style.opacity = '0';
};

export const moveGrey = () => {
  if (!greyActive) return;
  const dx = latestMousePos.x - grey.offsetLeft;
  const dy = latestMousePos.y - grey.offsetTop;
  grey.style.left = `${grey.offsetLeft + dx * 0.2}px`;
  grey.style.top = `${grey.offsetTop + dy * 0.2}px`;
  const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

  if (lastDistance !== null && distance < lastDistance) {
    currentGreyScale += 0.05;
    currentGreyScale = Math.min(currentGreyScale, maxScale);
    setGreyScale(currentGreyScale);
  }
  checkGreyCollision();
  lastDistance = distance;
};

export const checkGreyCollision = () => {
  if (!grey || !logoWrapper) return;
  const greyRect = grey.getBoundingClientRect();
  const logoRect = logoWrapper.getBoundingClientRect();
  const overlap = !(
    greyRect.right < logoRect.left ||
    greyRect.left > logoRect.right ||
    greyRect.bottom < logoRect.top ||
    greyRect.top > logoRect.bottom
  );
  if (overlap) {
    isGameOver = true;
    gameOver.classList.add('show');
    clearInterval(moveInterval);
  }
};

const resetGame = () => {
  portalsPassed = 0;
  currentGreyScale = 1;
  lastDistance = null;
  currentBackgroundIndex = 0;
  isGameOver = false;
  
  showBackground();
  setGreyScale(1);
  
  grey.style.transition = 'none';
  grey.style.left = `100%`;
  grey.style.top = `100%`;
  grey.style.opacity = '1';
  grey.style.transform = 'translate(-50%, -50%) scale(1)';
  
  grey.offsetHeight;
  
  grey.style.transition =
  'top 0.5s linear, left 0.5s linear, scale 0.01s ease-in';
  
  greyActive = true;

  createPortal();
  
  gameOver.classList.remove('show');
  clearInterval(moveInterval);
  moveInterval = setInterval(moveGrey, 50);
};

const showBackground = (setOriginal) => {
  if (setOriginal) currentBackgroundIndex = 0;
  backgroundElements.forEach((el, i) => {
    el.classList.toggle('active', i === currentBackgroundIndex);
  });
};

export const startGame = async () => {
  const content = document.getElementById('content');
  try {
    const res = await fetch('game.html');
    const html = await res.text();
    content.innerHTML = html;
    game = document.getElementById('game');
    grey = document.getElementById('grey');
    backgroundElements = document.querySelectorAll('#backgrounds .bg');
    showBackground();
    moveScout(window.innerWidth / 2, window.innerHeight / 2);
    gameOver = document.getElementById('game-over');
    gameOver.addEventListener('click', resetGame);
  } catch (err) {
    console.error('Failed to load game.html:', err);
    content.innerHTML = '<p>Error loading game view.</p>';
    return;
  }
  moveInterval = setInterval(moveGrey, 50);
  handleMouse(checkPortalCollision);
  createPortal();
};