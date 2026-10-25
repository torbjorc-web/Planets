 (async () => {
  const stage = document.querySelector('#orbit-stage');
  const toggle = document.querySelector('#orbit-toggle');
  const slider = document.querySelector('#orbit-speed');
  const speedLabel = document.querySelector('#orbit-speed-value');
  const pathLayer = document.querySelector('#orbit-lines');
  const bodyLayer = document.querySelector('#bodies-layer');
  const canvas = document.querySelector('#debris-belts');
  if (!stage || !pathLayer || !bodyLayer || !canvas) return;
  const moonFacts = await fetch('/static/data/moons.json').then(response => {
    if (!response.ok) throw new Error(`Could not load moon data (${response.status})`);
    return response.json();
  });

  const planets = [
    {id:'merkur',name:'Merkur',a:.387,e:.206,color:'#b9a995',period:.241,size:5},
    {id:'venus',name:'Venus',a:.723,e:.007,color:'#e6bd83',period:.615,size:7},
    {id:'jorden',name:'Jorden',a:1,e:.017,color:'#65a9ff',period:1,size:8},
    {id:'mars',name:'Mars',a:1.524,e:.093,color:'#ef765d',period:1.881,size:6},
    {id:'jupiter',name:'Jupiter',a:5.203,e:.049,color:'#e4b481',period:11.86,size:14},
    {id:'saturn',name:'Saturn',a:9.537,e:.057,color:'#e6d39a',period:29.46,size:12},
    {id:'uranus',name:'Uranus',a:19.19,e:.046,color:'#8ce0e5',period:84.01,size:10},
    {id:'neptun',name:'Neptun',a:30.07,e:.011,color:'#638bff',period:164.8,size:10}
  ];
  planets.forEach(planet => {
    planet.moons = Object.entries(moonFacts).filter(([,moon]) => moon.planet === planet.name)
      .map(([id,moon]) => [id,moon.name,moon.orbitalPeriodDays]);
  });
  const ctx = canvas.getContext('2d');
  const paths = new Map();
  const bodies = new Map();
  const moonNodes = [];
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0, elapsed = 0, last = 0, paused = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const radians = degrees => degrees * Math.PI / 180;

  function makeOrbitPath(planet) {
    const path = document.createElement('div');
    path.className = 'orbit-path';
    path.setAttribute('aria-hidden', 'true');
    pathLayer.append(path);
    paths.set(planet.id, path);
    const body = document.createElement('button');
    body.type = 'button'; body.className = 'orbit-object planet-body'; body.dataset.planet = planet.id;
    body.setAttribute('aria-label', `Vis fakta om ${planet.name}`);
    body.style.setProperty('--planet-color', planet.color);
    body.style.setProperty('--planet-size', `${planet.size}px`);
    bodyLayer.append(body); bodies.set(planet.id, body);
    body.addEventListener('click', () => document.querySelector(`.planet-legend [data-planet="${planet.id}"], .planet-trigger[data-planet="${planet.id}"]`)?.click());
    (planet.moons || []).forEach((moon, index) => {
      const node = document.createElement('button'); node.type = 'button'; node.className = 'orbit-object moon-body';
      node.dataset.planet = moon[0]; node.title = moon[1]; node.setAttribute('aria-label', `Vis fakta om ${moon[1]}`);
      node.addEventListener('click', () => {
        const trigger=document.querySelector(`.planet-legend [data-planet="${moon[0]}"], .planet-trigger[data-planet="${moon[0]}"]`);
        if(trigger){trigger.click();return;}
        const dialog=document.querySelector('#planet-dialog');
        if(!dialog)return;
        const parentName=planet.name;
        document.querySelector('#planet-title').textContent=moon[1];
        document.querySelector('#planet-description').textContent=`${moon[1]} går i bane rundt ${parentName}. Omløpstiden som vises i modellen er ${moon[2]} døgn. Banen er forstørret og hastigheten justert for at bevegelsen skal være synlig.`;
        const periodLabel=document.querySelector('#planet-period-label'); if(periodLabel)periodLabel.textContent=`Omløpstid rundt ${parentName}`;
        const period=document.querySelector('#planet-year'); if(period)period.textContent=`${moon[2]} døgn`;
        const type=document.querySelector('#planet-type'); if(type)type.textContent=`Naturlig satellitt av ${parentName}`;
        const source=document.querySelector('#planet-source'); if(source){source.href=moonFacts[moon[0]]?.source||'https://science.nasa.gov/solar-system/moons/';source.textContent='Åpne NASA-fakta ↗';}
        dialog.showModal();
      });
      stage.append(node); moonNodes.push({node,parent:planet.id,index,period:moon[2]});
    });
  }
  planets.forEach(makeOrbitPath);

  function resize() {
    const rect = stage.getBoundingClientRect(); width = rect.width; height = rect.height;
    canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  const observer = new ResizeObserver(resize); observer.observe(stage); resize();

  function position(planet, years, maxRadius) {
    const mean = 2*Math.PI*years/planet.period;
    let eccentric = mean;
    for (let i=0;i<7;i++) eccentric -= (eccentric-planet.e*Math.sin(eccentric)-mean)/(1-planet.e*Math.cos(eccentric));
    const x = planet.a*(Math.cos(eccentric)-planet.e), y=planet.a*Math.sqrt(1-planet.e*planet.e)*Math.sin(eccentric);
    const theta = radians(planet.id==='jorden'?0:planet.a*7.13);
    const xx=x*Math.cos(theta)-y*Math.sin(theta), yy=x*Math.sin(theta)+y*Math.cos(theta);
    const scaled = maxRadius*Math.log1p(planet.a)/Math.log1p(45);
    const normalizedX=xx/planet.a, normalizedY=yy/planet.a;
    return [width/2 + normalizedX*scaled, height/2 + normalizedY*scaled*.64];
  }
  function drawBelts(years) {
    ctx.clearRect(0,0,width,height);
    const drawRing=(inner,outer,count,color,seed)=>{
      for(let i=0;i<count;i++){
        const a=inner+((i*9301+seed*49297)%1000)/1000*(outer-inner);
        const phase=((i*7919+seed*104729)%10000)/10000*Math.PI*2;
        const period=Math.sqrt(a*a*a), angle=phase+2*Math.PI*years/period;
        const r=Math.max(5,(Math.min(width,height)*.46)*Math.log1p(a)/Math.log1p(45));
        const x=width/2+Math.cos(angle)*r, y=height/2+Math.sin(angle)*r*.64;
        ctx.fillStyle=color; ctx.fillRect(x,y, i%9===0?1.7:1, i%9===0?1.7:1);
      }
    };
    drawRing(2.1,3.3,650,'rgba(226,181,111,.7)',1);
    drawRing(30,50,500,'rgba(142,169,255,.65)',2);
  }
  function frame(now) {
    if(!last) last=now;
    const dt=Math.min((now-last)/1000,.05); last=now;
    if(!paused) elapsed+=dt*.16*Number(slider?.value||1);
    const maxRadius=Math.max(20,Math.min(width,height)*.45);
    drawBelts(elapsed);
    planets.forEach(p=>{
      const [x,y]=position(p,elapsed,maxRadius);
      const path=paths.get(p.id); const radius=maxRadius*Math.log1p(p.a)/Math.log1p(45);
      path.style.width=`${radius*2}px`; path.style.height=`${radius*1.28}px`;
      path.style.left=`${width/2-radius}px`; path.style.top=`${height/2-radius*.64}px`;
      const body=bodies.get(p.id); body.style.left=`${x}px`; body.style.top=`${y}px`;
    });
    moonNodes.forEach(m=>{
      const parent=planets.find(p=>p.id===m.parent), [px,py]=position(parent,elapsed,maxRadius);
      const angle=elapsed*18/m.period + m.index*Math.PI*2/Math.max(1,parent.moons.length);
      const orbitRadius=10+m.index*3.5;
      m.node.style.left=`${px+Math.cos(angle)*orbitRadius}px`;
      m.node.style.top=`${py+Math.sin(angle)*orbitRadius*.7}px`;
    });
    requestAnimationFrame(frame);
  }
  if(toggle) toggle.addEventListener('click',()=>{paused=!paused;toggle.textContent=paused?'Start banene':'Pause banene';toggle.setAttribute('aria-pressed',String(paused));});
  if(slider) slider.addEventListener('input',()=>{if(speedLabel)speedLabel.textContent=`${Number(slider.value).toFixed(1).replace('.0','')}×`;});
  if(reducedMotion){paused=true;if(toggle){toggle.textContent='Start banene';toggle.setAttribute('aria-pressed','true');}}
  requestAnimationFrame(frame);
})();
