/* deck.js — shared runtime: entrance cascade, count-up numbers, in-slide step builds.
   Conventions:
   - <body data-prev="slide-X.html" data-next="slide-Y.html">
   - .rise + style="--i:N" → staggered entrance (N*90ms delay)
   - [data-count="2431"] → number counts up on load (keeps prefix/suffix text around it)
   - [data-step="N"] → hidden until the Nth ArrowRight press (N starts at 1). ArrowRight
     reveals steps first, then navigates. ArrowLeft un-reveals, then navigates back.
   - Open with #all → everything revealed instantly, no animations (screenshots/PPTX). */
(function () {
  const body = document.body;
  const showAll = location.hash === '#all';
  // Add the motion class synchronously so hidden states never apply when JS is off.
  if (showAll) body.classList.add('noanim');
  else body.classList.add('anim');

  // entrance: flip to .ready on the next frame so transitions run
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('ready')));

  // count-up
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count.replace(/,/g, ''));
    const fmt = n => el.dataset.count.includes(',') ? Math.round(n).toLocaleString('en-US') : String(Math.round(n));
    if (showAll) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 750;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });

  // steps
  const stepEls = [...document.querySelectorAll('[data-step]')];
  const maxStep = stepEls.reduce((m, e) => Math.max(m, +e.dataset.step), 0);
  let cur = showAll ? maxStep : 0;
  const apply = () => stepEls.forEach(e => e.classList.toggle('step-on', +e.dataset.step <= cur));
  apply();

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      if (cur < maxStep) { cur++; apply(); }
      else if (body.dataset.next) location.href = body.dataset.next;
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft') {
      if (cur > 0) { cur--; apply(); }
      else if (body.dataset.prev) location.href = body.dataset.prev;
      e.preventDefault();
    }
  });
})();
