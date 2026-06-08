const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateHeaderState() {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 20);
}

function closeNavigation() {
  siteNav?.classList.remove('is-open');
  navToggle?.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav?.classList.toggle('is-open') ?? false;
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.addEventListener('click', (event) => {
  if (event.target.matches('a')) closeNavigation();
});

document.querySelectorAll('.faq-item').forEach((item, index) => {
  const button = item.querySelector('button');
  const answer = item.querySelector('p');
  if (!button || !answer) return;

  answer.id = answer.id || `faq-answer-${index + 1}`;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', answer.id);

  button.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

const revealTargets = document.querySelectorAll(
  [
    '.hero-copy > *',
    '.feature-strip article',
    '.video-card',
    '.problem-grid article',
    '.framed-media',
    '.scene-grid article',
    '.feature-list article',
    '.deep-media',
    '.deep-copy',
    '.flow-steps article',
    '.partner-copy > *',
    '.faq-item',
    '.contact-card',
  ].join(',')
);

revealTargets.forEach((target, index) => {
  target.classList.add('reveal');
  target.style.transitionDelay = `${Math.min(index % 6, 5) * 65}ms`;
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const videoModal = document.querySelector('.video-modal');
const modalVideo = document.querySelector('.modal-video');
const openVideoButtons = document.querySelectorAll('.video-open');
const closeVideoButton = document.querySelector('.modal-close');
let lastVideoTrigger = null;

function openVideoModal(event) {
  lastVideoTrigger = event?.currentTarget ?? document.activeElement;
  videoModal?.classList.add('is-open');
  videoModal?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  closeVideoButton?.focus();
  modalVideo?.play().catch(() => {});
}

function closeVideoModal() {
  videoModal?.classList.remove('is-open');
  videoModal?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (modalVideo) {
    modalVideo.pause();
    modalVideo.currentTime = 0;
  }
  if (lastVideoTrigger instanceof HTMLElement) lastVideoTrigger.focus();
}

openVideoButtons.forEach((button) => button.addEventListener('click', openVideoModal));
closeVideoButton?.addEventListener('click', closeVideoModal);
videoModal?.addEventListener('click', (event) => {
  if (event.target.classList.contains('video-modal-backdrop')) closeVideoModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeVideoModal();
    closeNavigation();
  }
});
