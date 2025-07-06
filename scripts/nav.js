import { logoWrapper, handleMouse } from './main.js';
import { portalSize } from './utils.js';

let links = [];

export const loadNav = async () => {

  const content = document.getElementById('content');
  try {
    document.body.style.backgroundImage = `url('assets/bg-water.jpeg')`;
    const res = await fetch('nav.html');
    const html = await res.text();
    content.innerHTML = html;

    links = [
      document.getElementById('music'),
      document.getElementById('djs'),
      document.getElementById('community'),
    ];

    links.forEach((link) => {
      const maxX = window.innerWidth - portalSize;
      const maxY = window.innerHeight - portalSize;
      link.style.left = `${Math.floor(Math.random() * maxX)}px`;
      link.style.top = `${Math.floor(Math.random() * maxY)}px`;
      const dot = document.createElement('div');
      dot.classList.add('portal-dot');
      link.appendChild(dot);
    });
    
    handleMouse(checkNavCollision);
  } catch (err) {
    console.error('Failed to load game.html:', err);
    content.innerHTML = '<p>Error loading game view.</p>';
    return;
  }

};

export const checkNavCollision = () => {
  const logoRect = logoWrapper.getBoundingClientRect();

  links.forEach((link) => {
    const rect = link.getBoundingClientRect();
    const overlap = !(
      rect.right < logoRect.left ||
      rect.left > logoRect.right ||
      rect.bottom < logoRect.top ||
      rect.top > logoRect.bottom
    );

    if (overlap) {
      link.classList.add('highlight');
      console.log('fuck', link);
    }
  });
};
