import { logoWrapper } from './main.js';
import { isMobile, latestMousePos, moveScout } from './utils.js';

let elements = [];
let nav = null;
let currentSection = null;

const restingX = window.innerWidth * 0.5;
const restingY = window.innerHeight * 0.85;

console.log(isMobile);

export const loadNav = async () => {
  const content = document.getElementById('content');
  
  try {
    const res = await fetch('nav.html');
    const html = await res.text();
    content.innerHTML = html;

    nav = document.getElementById('nav');

    document.querySelectorAll('.dj-container .card').forEach((card) => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });

    const links = [
      { name: 'Music', corner: { left: isMobile ? '25%' : '10%', top: isMobile ? '25%' : '10%' }, rotate: 'rotate(-15deg)' },
      { name: 'DJs', corner: { left: isMobile ? '75%' : '90%', top: isMobile ? '25%' : '10%' }, rotate: 'rotate(60deg)' },
      { name: 'Community', corner: { left: isMobile ? '25%' : '10%', top: isMobile ? '75%' : '85%' }, rotate: 'rotate(0deg)' },,
      { name: 'Art', corner: { left: isMobile ? '75%' : '90%', top: isMobile ? '75%' : '85%' }, rotate: 'rotate(90deg)' },
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
        portalWrapper.style.pointerEvents = 'auto';
        portalWrapper.addEventListener('click', () => animateScoutToPortal(portalWrapper));
        
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
    
    // Set scout to resting position
    logoWrapper.style.transition = 'top 0.3s ease-in, left 0.3s ease-out';
    logoWrapper.style.transform = 'translate(-50%, -50%)';
    logoWrapper.style.zIndex = '1002';
    moveScout(restingX, restingY, latestMousePos.x, true);
  } catch (err) {
    console.error('Failed to load nav.html:', err);
    content.innerHTML = '<p>Error loading nav view.</p>';
    return;
  }

};

const handleSectionDisplay = (section) => {
  const sectionId = section.toLowerCase();
  const sectionEl = document.getElementById(sectionId);
  if (sectionEl) {
    sectionEl.style.display = 'flex';
  }
};

const animateScoutToPortal = (target) => {
  const rect = target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const currentX = logoWrapper.getBoundingClientRect().left + logoWrapper.offsetWidth / 2;

  moveScout(centerX, centerY, currentX);

  setTimeout(() => {
    const label = target.getAttribute('data-label');

    if (label === 'Back') {
      const original = target.getAttribute('data-original-label');
      if (original) {
        target.setAttribute('data-label', original);
        target.removeAttribute('data-original-label');
      }

      elements.forEach((el) => (el.style.display = ''));
      if (currentSection) {
        const el = document.getElementById(currentSection.toLowerCase());
        if (el) el.style.display = 'none';
      }

      currentSection = null;
    } else {
      currentSection = label;
      target.setAttribute('data-original-label', label);
      target.setAttribute('data-label', 'Back');

      elements.forEach((el) => {
        if (el !== target) el.style.display = 'none';
      });

      handleSectionDisplay(label);
    }

    setTimeout(() => {
      moveScout(restingX, restingY, centerX, true);
    }, 300);
  }, 300);
};