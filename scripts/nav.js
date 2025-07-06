import { logoWrapper, handleMouse } from './main.js';

let elements = [];
let nav = null;
let currentSection = null;
let collisionsEnabled = true;

export const loadNav = async () => {

  const content = document.getElementById('content');
  try {
    document.body.style.backgroundImage = `url('assets/images/backgrounds/bg-water.jpeg')`;
    const res = await fetch('nav.html');
    const html = await res.text();
    content.innerHTML = html;

    nav = document.getElementById('nav');

    const links = [
      { name: 'Music', corner: { left: '5%', top: '5%' }, rotate: 'rotate(-15deg)' },
      { name: 'DJs', corner: { left: '85%', top: '5%' }, rotate: 'rotate(60deg)' },
      { name: 'Community', corner: { left: '5%', top: '80%' }, rotate: 'rotate(0deg)' },,
      { name: 'Art', corner: { left: '85%', top: '80%' }, rotate: 'rotate(90deg)' },
    ];

    links.forEach((link) => {
      const sparkleContainer = document.createElement('div');
      const sparkle = document.createElement('img');
      sparkle.src = 'assets/images/portal-spark.gif';
      sparkleContainer.classList.add('portal');
      sparkle.classList.add('sparkle');
      sparkleContainer.appendChild(sparkle);

      sparkleContainer.style.left = link.corner.left;
      sparkleContainer.style.top = link.corner.top;

      nav.appendChild(sparkleContainer);

      const swapToRealPortal = () => {
        if (!sparkleContainer.parentNode) return;
        const portalWrapper = document.createElement('div');
        portalWrapper.classList.add('portal');
        portalWrapper.setAttribute('data-label', link.name);
        portalWrapper.style.left = sparkleContainer.style.left;
        portalWrapper.style.top = sparkleContainer.style.top;
        
        const portalImg = document.createElement('img');
        portalImg.classList.add('portal-img');
        portalImg.style.transform = link.rotate;
        portalImg.src = 'assets/images/portal.gif';

        portalWrapper.appendChild(portalImg);

        nav.replaceChild(portalWrapper, sparkleContainer);
        elements.push(portalWrapper);
      }

      sparkle.onload = () => {
        setTimeout(swapToRealPortal, 500);
      };
    });
    
    handleMouse(checkNavCollision);
  } catch (err) {
    console.error('Failed to load game.html:', err);
    content.innerHTML = '<p>Error loading game view.</p>';
    return;
  }

};

export const checkNavCollision = () => {
  if (!collisionsEnabled) return;
  const logoRect = logoWrapper.getBoundingClientRect();

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const overlap = !(
      rect.right < logoRect.left ||
      rect.left > logoRect.right ||
      rect.bottom < logoRect.top ||
      rect.top > logoRect.bottom
    );

    if (overlap) {
      collisionsEnabled = false; 
      const label = element.getAttribute('data-label');
      if (label === 'Back') {
        const original = element.getAttribute('data-original-label');
        if (original) {
          element.setAttribute('data-label', original);
          element.removeAttribute('data-original-label');
        }

        elements.forEach((el) => {
          el.style.display = '';
        });

        if (currentSection) {
          const sectionId = currentSection.toLowerCase();
          const sectionEl = document.getElementById(sectionId);
          if (sectionEl) {
            sectionEl.style.display = 'none';
          }
        }

        currentSection = null;
      } else {
        currentSection = label;
        element.setAttribute('data-original-label', label);
        element.setAttribute('data-label', 'Back');

        elements.forEach((el) => {
          if (el !== element) el.style.display = 'none';
        });

        handleSectionDisplay(label);
      }

      setTimeout(() => {
        collisionsEnabled = true;
      }, 750);

    }
  });
};

const handleSectionDisplay = (section) => {
  const sectionId = section.toLowerCase();
  const sectionEl = document.getElementById(sectionId);
  if (sectionEl) {
    sectionEl.style.display = 'flex';
  }
};