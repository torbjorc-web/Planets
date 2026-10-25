(() => {
  const canvas = document.querySelector('#space');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const button = document.querySelector('#toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const planetInfo = {
    merkur: { name: 'Merkur', diameter: '4 880 km', year: '88 jorddager', type: 'Steinplanet', description: 'Den minste planeten og den nærmeste Solen. Merkur har en svært tynn atmosfære og store temperatursvingninger mellom dag og natt.', url: 'https://science.nasa.gov/mercury/facts/' },
    venus: { name: 'Venus', diameter: '12 104 km', year: '225 jorddager', type: 'Steinplanet', description: 'Venus er omtrent like stor som Jorden, men den tette atmosfæren holder på varmen og gjør den til solsystemets varmeste planet.', url: 'https://science.nasa.gov/venus/venus-facts/' },
    jorden: { name: 'Jorden', diameter: '12 756 km', year: '365 dager', type: 'Steinplanet', description: 'Hjemmeplaneten vår er en dynamisk verden med flytende vann på overflaten. Omtrent 71 % av overflaten er dekket av hav.', url: 'https://science.nasa.gov/earth/facts/' },
    mars: { name: 'Mars', diameter: '6 792 km', year: '687 jorddager', type: 'Steinplanet', description: 'Den røde planeten er en kald ørkenverden. NASA-rovere har funnet spor etter at Mars en gang hadde elver, innsjøer og et våtere klima.', url: 'https://science.nasa.gov/mars/facts/' },
    jupiter: { name: 'Jupiter', diameter: '142 984 km', year: 'omtrent 12 år', type: 'Gasskjempe', description: 'Jupiter er solsystemets største planet. Den store røde flekken er en enorm storm, og de fire største månene ble først observert av Galileo.', url: 'https://science.nasa.gov/jupiter/jupiter-facts/' },
    saturn: { name: 'Saturn', diameter: '120 536 km', year: 'omtrent 29 år', type: 'Gasskjempe', description: 'Saturn er kjent for det omfattende ringsystemet sitt. Ringene består av mange is- og steinpartikler i baner rundt planeten.', url: 'https://science.nasa.gov/saturn/facts/' },
    uranus: { name: 'Uranus', diameter: '51 118 km', year: 'omtrent 84 år', type: 'Iskjempe', description: 'Uranus er en iskjempe som roterer nesten på siden. Den blågrønne fargen kommer fra metan i atmosfæren.', url: 'https://science.nasa.gov/uranus/facts/' },
    neptun: { name: 'Neptun', diameter: '49 528 km', year: 'omtrent 165 år', type: 'Iskjempe', description: 'Neptun er den ytterste planeten og har svært kraftige vinder. NASA-sonden Voyager 2 fløy forbi planeten i 1989.', url: 'https://science.nasa.gov/neptune/neptune-facts/' },
    ceres: { name: 'Ceres', diameter: 'omtrent 940 km', year: '4,6 jordår', type: 'Dvergplanet i asteroidebeltet', description: 'Ceres er det største objektet i asteroidebeltet mellom Mars og Jupiter, og den eneste dvergplaneten i det indre solsystemet.', url: 'https://science.nasa.gov/dwarf-planets/ceres/facts/' },
    pluto: { name: 'Pluto', diameter: '2 377 km', year: '248 jordår', type: 'Dvergplanet i Kuiperbeltet', description: 'Pluto er en dvergplanet i Kuiperbeltet utenfor Neptun. NASA-sonden New Horizons fløy forbi Pluto i 2015.', url: 'https://science.nasa.gov/dwarf-planets/pluto/facts/' },
    luna: { name: 'Månen', diameter: '3 475 km', year: '27,3 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Jorden', description: 'Månen er Jordens eneste naturlige satellitt. Den bruker omtrent 27,3 dager på én runde rundt Jorden.', url: 'https://science.nasa.gov/moon/' },
    phobos: { name: 'Phobos', diameter: '22 km', year: '7 timer 39 minutter', periodLabel: 'Omløpstid', type: 'Måne rundt Mars', description: 'Phobos er den største av Mars’ to måner og går så raskt rundt planeten at den fullfører tre omløp på én Mars-dag.', url: 'https://science.nasa.gov/mars/moons/' },
    deimos: { name: 'Deimos', diameter: '12 km', year: '30 timer 18 minutter', periodLabel: 'Omløpstid', type: 'Måne rundt Mars', description: 'Deimos er den minste og ytterste av Mars’ to måner. Den har en ujevn form og en overflate dekket av løst støv.', url: 'https://science.nasa.gov/mars/moons/' },
    io: { name: 'Io', diameter: '3 643 km', year: '1,77 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Jupiter', description: 'Io er det mest vulkansk aktive legemet vi kjenner til i solsystemet. Tidekreftene fra Jupiter varmer opp månens indre.', url: 'https://science.nasa.gov/jupiter/moons/' },
    europa: { name: 'Europa', diameter: '3 122 km', year: '3,55 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Jupiter', description: 'Europa har en isete overflate, og observasjoner tyder på at et saltvannshav finnes under isen.', url: 'https://science.nasa.gov/jupiter/moons/' },
    ganymedes: { name: 'Ganymedes', diameter: '5 268 km', year: '7,15 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Jupiter', description: 'Ganymedes er den største månen i solsystemet – større enn planeten Merkur – og den eneste månen vi kjenner med eget magnetfelt.', url: 'https://science.nasa.gov/jupiter/moons/' },
    callisto: { name: 'Callisto', diameter: '4 821 km', year: '16,69 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Jupiter', description: 'Callisto er Jupiters ytterste store galileiske måne. Den gamle overflaten er tett dekket av nedslagskratre.', url: 'https://science.nasa.gov/jupiter/moons/' },
    enceladus: { name: 'Enceladus', diameter: '504 km', year: '1,37 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Saturn', description: 'Enceladus sender ut vannrike geysirer fra sprekker nær sørpolen. Materialet bidrar til Saturns E-ring.', url: 'https://science.nasa.gov/saturn/moons/' },
    rhea: { name: 'Rhea', diameter: '1 527 km', year: '4,52 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Saturn', description: 'Rhea er Saturns nest største måne. Den består hovedsakelig av vannis og har en sterkt kraterpreget overflate.', url: 'https://science.nasa.gov/saturn/moons/' },
    titan: { name: 'Titan', diameter: '5 150 km', year: '15,95 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Saturn', description: 'Titan er Saturns største måne og den eneste månen med en tett atmosfære. Innsjøer og elver av flytende metan finnes på overflaten.', url: 'https://science.nasa.gov/saturn/moons/' },
    miranda: { name: 'Miranda', diameter: '472 km', year: '1,41 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Uranus', description: 'Miranda er en liten uransk måne med et uvanlig variert landskap av klipper, daler og store kratere.', url: 'https://science.nasa.gov/uranus/moons/' },
    ariel: { name: 'Ariel', diameter: '1 158 km', year: '2,52 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Uranus', description: 'Ariel er en av Uranus’ store måner. Dype forkastninger og daler viser at overflaten har vært formet av geologisk aktivitet.', url: 'https://science.nasa.gov/uranus/moons/' },
    umbriel: { name: 'Umbriel', diameter: '1 169 km', year: '4,14 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Uranus', description: 'Umbriel er mørk og sterkt kraterpreget. Den er en av Uranus’ fem store måner.', url: 'https://science.nasa.gov/uranus/moons/' },
    titania: { name: 'Titania', diameter: '1 578 km', year: '8,71 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Uranus', description: 'Titania er Uranus’ største måne. Dype kløfter på overflaten tyder på at månen utvidet seg mens den kjølte seg ned.', url: 'https://science.nasa.gov/uranus/moons/' },
    oberon: { name: 'Oberon', diameter: '1 523 km', year: '13,46 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Uranus', description: 'Oberon er den ytterste av Uranus’ fem store måner, med en gammel og kraterfylt overflate.', url: 'https://science.nasa.gov/uranus/moons/' },
    triton: { name: 'Triton', diameter: '2 707 km', year: '5,88 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Neptun', description: 'Triton går i bane motsatt av Neptuns rotasjonsretning. Det tyder på at månen kan ha blitt fanget inn av planetens gravitasjon.', url: 'https://science.nasa.gov/neptune/moons/' },
    proteus: { name: 'Proteus', diameter: 'omtrent 420 km', year: '1,12 dager', periodLabel: 'Omløpstid', type: 'Måne rundt Neptun', description: 'Proteus er Neptuns nest største kjente måne. Den er mørk, uregelmessig og har mange nedslagskratre.', url: 'https://science.nasa.gov/neptune/moons/' }
  };
  const dialog = document.querySelector('#planet-dialog');
  const dialogClose = dialog?.querySelector('.dialog-close');

  function showPlanet(key) {
    const planet = planetInfo[key];
    if (!planet || !dialog) return;
    dialog.querySelector('#planet-title').textContent = planet.name;
    dialog.querySelector('#planet-description').textContent = planet.description;
    dialog.querySelector('#planet-diameter').textContent = planet.diameter;
    dialog.querySelector('#planet-year').textContent = planet.year;
    dialog.querySelector('#planet-period-label').textContent = planet.periodLabel || 'Et år varer';
    dialog.querySelector('#planet-type').textContent = planet.type;
    dialog.querySelector('#planet-source').href = planet.url;
    dialog.showModal();
  }

  document.querySelectorAll('.planet-trigger, .orbit-planet').forEach(trigger => {
    trigger.addEventListener('click', () => showPlanet(trigger.dataset.planet));
  });
  dialogClose?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    const planetKey = dialog.querySelector('#planet-title').textContent.toLowerCase();
    document.querySelector(`[data-planet="${planetKey}"]`)?.focus();
  });

  const layers = [
    { count: 100, speed: .10, size: .65, alpha: .34 },
    { count: 75, speed: .23, size: 1.05, alpha: .58 },
    { count: 36, speed: .42, size: 1.55, alpha: .82 }
  ];
  let width = 0, height = 0, pixelRatio = 1, stars = [];
  let shootingStar = null, nextMeteorAt = 0, animationFrame = 0;
  let running = !reducedMotion.matches, lastFrame = 0;

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
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    makeStars();
    render(performance.now());
  }

  function startMeteor(now) {
    if (now < nextMeteorAt || shootingStar || Math.random() > .006) return;
    shootingStar = {
      x: Math.random() * width * .8 + width * .1,
      y: Math.random() * height * .35,
      vx: -(3 + Math.random() * 3), vy: 2 + Math.random() * 2,
      life: 0, duration: 42 + Math.random() * 26,
      length: 75 + Math.random() * 100
    };
    nextMeteorAt = now + 4500 + Math.random() * 9000;
  }

  function paintMeteor(delta) {
    if (!shootingStar) return;
    const meteor = shootingStar;
    meteor.life += delta;
    meteor.x += meteor.vx * delta;
    meteor.y += meteor.vy * delta;
    const progress = meteor.life / meteor.duration;
    if (progress >= 1) { shootingStar = null; return; }
    const opacity = Math.sin(progress * Math.PI) * .85;
    const tailX = meteor.x - meteor.vx * meteor.length / 5;
    const tailY = meteor.y - meteor.vy * meteor.length / 5;
    const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
    gradient.addColorStop(0, `rgba(230,242,255,${opacity})`);
    gradient.addColorStop(1, 'rgba(135,177,255,0)');
    ctx.globalAlpha = 1;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(tailX, tailY); ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
    ctx.beginPath(); ctx.arc(meteor.x, meteor.y, 1.7, 0, Math.PI * 2); ctx.fill();
  }

  function render(now) {
    const delta = Math.min((now - (lastFrame || now)) / 16.67, 2.5);
    lastFrame = now;
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
        star.y += star.speed * delta; star.x += star.drift * delta;
        if (star.y > height + 2) { star.y = -2; star.x = Math.random() * width; }
        if (star.x < -2) star.x = width + 2;
        if (star.x > width + 2) star.x = -2;
      }
    }
    if (running) { startMeteor(now); paintMeteor(delta); }
    ctx.globalAlpha = 1;
    if (running) animationFrame = requestAnimationFrame(render);
  }

  function setRunning(value) {
    running = value;
    if (button) {
      button.textContent = running ? 'Pause stjernene' : 'Start stjernene';
      button.setAttribute('aria-pressed', String(running));
    }
    cancelAnimationFrame(animationFrame);
    lastFrame = performance.now();
    render(lastFrame);
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
