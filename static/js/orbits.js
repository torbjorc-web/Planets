(() => {
  const stage = document.querySelector('#orbit-stage');
  const toggle = document.querySelector('#orbit-toggle');
  const slider = document.querySelector('#orbit-speed');
  const value = document.querySelector('#orbit-speed-value');
  if (!stage || !toggle || !slider) return;
  const orbits = [...stage.querySelectorAll('.orbit')];
  const baseDurations = orbits.map(orbit => parseFloat(getComputedStyle(orbit).animationDuration));
  let paused = false;

  stage.querySelectorAll('.orbit-planet').forEach(planet => {
    planet.addEventListener('click', () => {
      document.querySelector('.planet-legend [data-planet="' + planet.dataset.planet + '"]')?.click();
    });
  });

  function setSpeed(speed) {
    orbits.forEach((orbit, index) => {
      orbit.style.animationDuration = (baseDurations[index] / speed) + 's';
    });
    value.value = Number(speed).toFixed(1).replace('.0', '') + '×';
    value.textContent = value.value;
  }

  toggle.addEventListener('click', () => {
    paused = !paused;
    stage.classList.toggle('paused', paused);
    toggle.textContent = paused ? 'Start banene' : 'Pause banene';
    toggle.setAttribute('aria-pressed', String(paused));
  });

  slider.addEventListener('input', () => setSpeed(Number(slider.value)));
  setSpeed(Number(slider.value));
})();