import { logoWrapper, handleMouse, latestMousePos } from './main.js';
import { isMobile, portalSize } from './utils.js';

const gameLevels = 4;
const maxScale = 4;
const greyScaleModifier = isMobile ? 0.5 : 1;

const backgroundImages = [
  'assets/bg-frozen.jpg',
  'assets/bg-space.jpeg',
  'assets/bg-jungle.jpg',
  'assets/bg-water.jpeg',
];

let currentPortal = null;
let currentGreyScale = 1;
let lastDistance = null;
let currentBackgroundIndex = 0;
let portalsPassed = 0;
let moveInterval;
let greyActive = true;

let game = null;
let grey = null;
let gameOver = null;

export let gamePassed = false;

export const createPortal = () => {
  if (currentPortal) currentPortal.remove();

  const portal = document.createElement('div');
  portal.classList.add('portal');

  const maxX = window.innerWidth - portalSize;
  const maxY = window.innerHeight - portalSize;
  portal.style.left = `${Math.floor(Math.random() * maxX)}px`;
  portal.style.top = `${Math.floor(Math.random() * maxY)}px`;

  const dot = document.createElement('div');
  dot.classList.add('portal-dot');
  portal.appendChild(dot);
  game.appendChild(portal);

  currentPortal = portal;
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
  currentBackgroundIndex =
    (currentBackgroundIndex + 1) % backgroundImages.length;
  document.body.style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
  setGreyScale(currentGreyScale / 2);

  if (portalsPassed >= gameLevels) {
    const gameWonEvent = new CustomEvent('gameWon');
    document.dispatchEvent(gameWonEvent);
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
    gameOver.classList.add('show');
    clearInterval(moveInterval);
  }
};

const resetGame = () => {
  portalsPassed = 0;
  currentGreyScale = 1;
  lastDistance = null;
  currentBackgroundIndex = 0;
  
  document.body.style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
  setGreyScale(1);
  
  grey.style.transition = 'none';
  grey.style.left = `0px`;
  grey.style.top = `0px`;
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

export const startGame = async () => {
  const content = document.getElementById('content');
  try {
    const res = await fetch('game.html');
    const html = await res.text();
    content.innerHTML = html;
    game = document.getElementById('game');
    grey = document.getElementById('grey');
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