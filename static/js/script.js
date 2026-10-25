(() => {
  const canvas = document.querySelector('#space');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const button = document.querySelector('#toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const planets = {
    merkur: { name: 'Merkur', diameter: '4 880 km', year: '88 jorddager', type: 'Steinplanet', description: 'Den minste planeten og den nærmeste Solen. Merkur har en svært tynn atmosfære og store temperatursvingninger mellom dag og natt.', url: 'https://science.nasa.gov/mercury/facts/' },
    venus: { name: 'Venus', diameter: '12 104 km', year: '225 jorddager', type: 'Steinplanet', description: 'Venus er omtrent like stor som Jorden, men den tette atmosfæren holder på varmen og gjør den til solsystemets varmeste planet.', url: 'https://science.nasa.gov/venus/venus-facts/' },
    jorden: { name: 'Jorden', diameter: '12 756 km', year: '365 dager', type: 'Steinplanet', description: 'Hjemmeplaneten vår er en dynamisk verden med flytende vann på overflaten. Omtrent 71 % av overflaten er dekket av hav.', url: 'https://science.nasa.gov/earth/facts/' },
    mars: { name: 'Mars', diameter: '6 792 km', year: '687 jorddager', type: 'Steinplanet', description: 'Den røde planeten er en kald ørkenverden. NASA-rovere har funnet spor etter at Mars en gang hadde elver, innsjøer og et våtere klima.', url: 'https://science.nasa.gov/mars/facts/' },
    jupiter: { name: 'Jupiter', diameter: '142 984 km', year: 'omtrent 12 år', type: 'Gasskjempe', description: 'Jupiter er solsystemets største planet. Den store røde flekken er en enorm storm, og de fire største månene ble først observert av Galileo.', url: 'https://science.nasa.gov/jupiter/jupiter-facts/' },
    saturn: { name: 'Saturn', diameter: '120 536 km', year: 'omtrent 29 år', type: 'Gasskjempe', description: 'Saturn er kjent for det omfattende ringsystemet sitt. Ringene består av mange is- og steinpartikler i baner rundt planeten.', url: 'https://science.nasa.gov/saturn/facts/' },
    uranus: { name: 'Uranus', diameter: '51 118 km', year: 'omtrent 84 år', type: 'Iskjempe', description: 'Uranus er en iskjempe som roterer nesten på siden. Den blågrønne fargen kommer fra metan i atmosfæren.', url: 'https://science.nasa.gov/uranus/facts/' },
    neptun: { name: 'Neptun', diameter: '49 528 km', year: 'omtrent 165 år', type: 'Iskjempe', description: 'Neptun er den ytterste planeten og har svært kraftige vinder. NASA-sonden Voyager 2 fløy forbi planeten i 1989.', url: 'https://science.nasa.gov/neptune/neptune-facts/' }
  };
  const dialog = document.querySelector('#planet-dialog');
  const closeButton = dialog?.querySelector('.dialog-close');

  function showPlanet(key) {
    const planet = planets[key];
    if (!planet || !dialog) return;
    dialog.querySelector('#planet-title').textContent = planet.name;
    dialog.querySelector('#planet-description').textContent = planet.description;
    dialog.querySelector('#planet-diameter').textContent = planet.diameter;
    dialog.querySelector('#planet-year').textContent = planet.year;
    dialog.querySelector('#planet-type').textContent = planet.type;
    dialog.querySelector('#planet-source').href = planet.url;
    dialog.showModal();
  }

  document.querySelectorAll('.planet-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => showPlanet(trigger.dataset.planet));
  });
  closeButton?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    const key = dialog.querySelector('#planet-title').textContent.toLowerCase();
    document.querySelector('[data-planet="' + key + '"]')?.focus();
  });

  const layers = [
    { count: 100, speed: .10, size: .65, alpha: .34 },
    { count: 75, speed: .23, size: 1.05, alpha: .58 },
    { count: 36, speed: .42, size: 1.55, alpha: .82 }
  ];
  let width = 0, height = 0, ratio = 1, stars = [];
  let meteor = null, nextMeteor = 0, frame = 0, running = !reducedMotion.matches, last = 0;

  function makeStars() {
    stars = layers.flatMap((layer, depth) => Array.from({ length: layer.count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      radius: layer.size * (.55 + Math.random() * .9),
      speed: layer.speed * (.65 + Math.random() * .7),
      alpha: layer.alpha * (.55 + Math.random() * .45),
      phase: Math.random() * Math.PI * 2,
      twinkle: .35 + Math.random() * .65,
      drift: (Math.random() - .5) * layer.speed * .35,
      depth
    })));
  }

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    makeStars();
    draw(performance.now());
  }

  function drawMeteor(delta) {
    if (!meteor) return;
    meteor.life += delta;
    meteor.x += meteor.vx * delta;
    meteor.y += meteor.vy * delta;
    const progress = meteor.life / meteor.duration;
    if (progress >= 1) { meteor = null; return; }
    const opacity = Math.sin(progress * Math.PI) * .85;
    const tailX = meteor.x - meteor.vx * meteor.length / 5;
    const tailY = meteor.y - meteor.vy * meteor.length / 5;
    const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
    gradient.addColorStop(0, 'rgba(230,242,255,' + opacity + ')');
    gradient.addColorStop(1, 'rgba(135,177,255,0)');
    ctx.globalAlpha = 1;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(tailX, tailY); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,' + opacity + ')';
    ctx.beginPath(); ctx.arc(meteor.x, meteor.y, 1.7, 0, Math.PI * 2); ctx.fill();
  }

  function draw(now) {
    const delta = Math.min((now - (last || now)) / 16.67, 2.5);
    last = now;
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const shimmer = .72 + Math.sin(now * .0012 + star.phase) * .28 * star.twinkle;
      ctx.globalAlpha = star.alpha * shimmer;
      ctx.fillStyle = star.depth === 2 ? '#f2f5ff' : '#cbd9ff';
      ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fill();
      if (star.depth === 2 && shimmer > 1.02) {
        ctx.globalAlpha = (shimmer - 1) * .22;
        ctx.fillRect(star.x - 4, star.y - .35, 8, .7);
        ctx.fillRect(star.x - .35, star.y - 4, .7, 8);
      }
      if (running) {
        star.y += star.speed * delta;
        star.x += star.drift * delta;
        if (star.y > height + 2) { star.y = -2; star.x = Math.random() * width; }
        if (star.x < -2) star.x = width + 2;
        if (star.x > width + 2) star.x = -2;
      }
    }
    if (running) {
      if (now >= nextMeteor && !meteor && Math.random() < .006) {
        meteor = { x: Math.random() * width * .8 + width * .1, y: Math.random() * height * .35, vx: -3 - Math.random() * 3, vy: 2 + Math.random() * 2, life: 0, duration: 42 + Math.random() * 26, length: 75 + Math.random() * 100 };
        nextMeteor = now + 4500 + Math.random() * 9000;
      }
      drawMeteor(delta);
    }
    ctx.globalAlpha = 1;
    if (running) frame = requestAnimationFrame(draw);
  }

  function setRunning(value) {
    running = value;
    if (button) {
      button.textContent = running ? 'Pause stjernene' : 'Start stjernene';
      button.setAttribute('aria-pressed', String(running));
    }
    cancelAnimationFrame(frame);
    last = performance.now();
    draw(last);
  }

  button?.addEventListener('click', () => setRunning(!running));
  reducedMotion.addEventListener?.('change', event => setRunning(!event.matches));
  window.addEventListener('resize', resize);
  if (button) {
    button.textContent = running ? 'Pause stjernene' : 'Start stjernene';
    button.setAttribute('aria-pressed', String(running));
  }
  resize();
})();
