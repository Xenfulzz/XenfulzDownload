// VEYRA website. Edit RELEASE when you publish a new version; the page updates itself.
const RELEASE = {
  version: '1.4.0',
  file: 'VEYRA-1.4.0-x64.msi',
  // The installer is attached to a GitHub release (the website upload limit is 25 MB).
  // For a new version: create release v<version>, attach the MSI, then update these values.
  url: 'https://github.com/Xenfulzz/XenfulzDownload/releases/download/v1.4.0/VEYRA-1.4.0-x64.msi',
  size: '85 MB',
  sha256: '7D2BBECFE24B08C4C13AA3113160B9FC1C56604F27FAB8D268EB34FD3A8141BD',
};

(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // ---- Release details everywhere they appear ----
  $$('[data-version]').forEach((el) => { el.textContent = `Version ${RELEASE.version}`; });
  $$('[data-version-short]').forEach((el) => { el.textContent = RELEASE.version; });
  $$('[data-file]').forEach((el) => { el.textContent = RELEASE.file; });
  $$('[data-size]').forEach((el) => { el.textContent = RELEASE.size; });
  $$('[data-sha]').forEach((el) => { el.textContent = RELEASE.sha256; });
  $$('[data-download]').forEach((el) => { el.setAttribute('href', RELEASE.url); });
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  // ---- Toast, like the app's notifications ----
  const toast = $('.toast');
  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 3200);
  };

  // ---- Download feedback ----
  $$('[data-download]').forEach((link) => {
    link.addEventListener('click', () => {
      showToast('Downloading VEYRA… If Windows warns you, choose More info, then Run anyway.');
    });
  });

  // ---- Copy checksum ----
  const copyButton = $('[data-copy-sha]');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(RELEASE.sha256);
        showToast('Checksum copied');
      } catch {
        const range = document.createRange();
        range.selectNodeContents($('[data-sha]'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        showToast('Press Ctrl+C to copy the selected checksum');
      }
    });
  }

  // ---- Navigation: frosted bar after scrolling, mobile menu ----
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = $('.nav-toggle');
  const links = $('#nav-links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !links.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
  });

  // ---- Reveal on scroll (skipped when the visitor prefers less motion) ----
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealed = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealed.forEach((el) => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    // Stagger cards in the same grid slightly.
    revealed.forEach((el) => {
      const siblings = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
      const index = siblings.indexOf(el);
      if (index > 0) el.style.transitionDelay = `${Math.min(index, 8) * 60}ms`;
      observer.observe(el);
    });
  }
})();
