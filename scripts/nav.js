import { isMobile, latestMousePos, moveScout, logoWrapper } from './utils.js';

const scoutRestingX = window.innerWidth * 0.5;
const scoutRestingY = window.innerHeight * 0.85;

let elements = [];
let nav = null;
let currentSection = null;

const navLinks = [
  { name: 'Music', corner: { left: isMobile ? '20%' : '10%', top: '10%' }, rotate: 'rotate(-15deg)' },
  { name: 'DJs', corner: { left: isMobile ? '80%' : '90%', top: '10%' }, rotate: 'rotate(60deg)' },
  { name: 'Community', corner: { left: isMobile ? '20%' : '10%', top: '85%' }, rotate: 'rotate(0deg)' },,
  { name: 'Art', corner: { left: isMobile ? '80%' : '90%', top: '85%' }, rotate: 'rotate(90deg)' },
];

export const loadNav = async () => {
  const content = document.getElementById('content');
  
  try {
    const res = await fetch('nav.html');
    const html = await res.text();
    content.innerHTML = html;

    nav = document.getElementById('nav');

    navLinks.forEach((link) => {
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

    handleDJCardListeners();
    
    // Set scout to resting position
    logoWrapper.style.transition = 'top 0.3s ease-in, left 0.3s ease-out';
    logoWrapper.style.transform = 'translate(-50%, -50%)';
    logoWrapper.style.zIndex = '1002';
    moveScout(scoutRestingX, scoutRestingY, latestMousePos.x, true);
  } catch (err) {
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

const handleSectionClick = (element) => {
  const navElementLabel = element.getAttribute('data-label');

  if (navElementLabel === 'Back') {
    const original = element.getAttribute('data-original-label');
    if (original) {
      element.setAttribute('data-label', original);
      element.removeAttribute('data-original-label');
    }

    elements.forEach((el) => (el.style.display = ''));
    if (currentSection) {
      const el = document.getElementById(currentSection.toLowerCase());
      if (el) el.style.display = 'none';
    }

    currentSection = null;
  } else {
    currentSection = navElementLabel;
    element.setAttribute('data-original-label', navElementLabel);
    element.setAttribute('data-label', 'Back');

    elements.forEach((el) => {
      if (el !== element) el.style.display = 'none';
    });
  }
  handleSectionDisplay(navElementLabel);
};

const animateScoutToPortal = (target) => {
  const rect = target.getBoundingClientRect();
  const targetPortalX = rect.left + rect.width / 2;
  const targetPortalY = rect.top + rect.height / 2;
  const currentX = logoWrapper.getBoundingClientRect().left + logoWrapper.offsetWidth / 2;

  moveScout(targetPortalX, targetPortalY, currentX);

  setTimeout(() => {
    handleSectionClick(target);
    setTimeout(() => {
      moveScout(scoutRestingX, scoutRestingY, targetPortalX, true);
    }, 300);
  }, 300);
};

const handleDJCardListeners = () => {
  document.querySelectorAll('.dj-container .card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  })
}