(() => {
  const canvas=document.querySelector('#galaxy');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const slider=document.querySelector('#zoom-level');
  const label=document.querySelector('#view-label');
  const title=document.querySelector('#fact-title');
  const copy=document.querySelector('#fact-copy');
  const motionToggle=document.querySelector('#motion-toggle');
  const sun={x:.48,y:.13};
  let width=0,height=0,dpr=1,zoom=1,pan={x:0,y:0},drag=null,motionAngle=0,lastFrame=0;
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let moving=!reduceMotion;
  let seed=73421;
  const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
  const backgroundStars=Array.from({length:320},()=>({x:random(),y:random(),r:.25+random()*.85,a:.2+random()*.62,p:random()*Math.PI*2}));
  const galaxyStars=[];
  for(let arm=0;arm<4;arm++){
    const tilt=arm*Math.PI/2;
    for(let i=0;i<720;i++){
      const radius=.035+Math.pow(random(),.72)*.77;
      const angle=tilt+radius*8.5+(random()-.5)*(.09+radius*.26);
      const spread=(random()-.5)*.045;
      galaxyStars.push({x:Math.cos(angle)*(radius+spread),y:Math.sin(angle)*(radius+spread)*.48,r:.3+random()*1.1,a:.19+random()*.63,c:random()});
    }
  }
  function resize(){
    const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();
  }
  function viewDescription(){
    const value=Number(slider.value);zoom=Math.pow(14,value/100);
    if(value<18){label.textContent='Melkeveien · oversikt';title.textContent='En galakse blant mange';copy.textContent='Melkeveien er en stavspiralgalakse med hundrevis av milliarder stjerner. Den lyse kjernen ligger langt fra oss; vårt solsystem er markert i en av galaksens ytre armer.';}
    else if(value<48){label.textContent='Melkeveien · spiralarmene';title.textContent='Ute i en spiralarm';copy.textContent='Spiralarmene inneholder stjerner, gass og støv. Solsystemet ligger i den mindre Orion-armen, mellom to av Melkeveiens store spiralstrukturer.';}
    else if(value<78){label.textContent='Orion-armen · vår region';title.textContent='Vår plass i Orion-armen';copy.textContent='Solsystemet ligger omtrent 26 000 lysår fra Melkeveiens sentrum. Herfra ser vi inn mot den tette galaktiske kjernen og utover mot galaksens ytre områder.';}
    else{label.textContent='Solsystemets stjernenabolag';title.textContent='Solen er én stjerne blant mange';copy.textContent='De lyse prikkene er andre stjerner i nærheten, vist som en illustrasjon. Avstandene mellom stjernene er enorme; selv de nærmeste stjernene ligger flere lysår unna.';}
    draw();
  }
  function draw(){
    if(!width||!height)return;
    ctx.clearRect(0,0,width,height);
    const cx=width/2,cy=height/2,base=Math.min(width,height)*.43;
    backgroundStars.forEach((star,i)=>{ctx.globalAlpha=star.a*(reduceMotion?1:.75+.25*Math.sin(performance.now()*.0007+star.p));ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(star.x*width,star.y*height,star.r,0,Math.PI*2);ctx.fill();});
    ctx.globalAlpha=1;
    const scaled=base*zoom;
    const focus=Math.min(1,Math.max(0,(zoom-1)/2.6));
    const rotate=(x,y)=>[x*Math.cos(motionAngle)-y*Math.sin(motionAngle),x*Math.sin(motionAngle)+y*Math.cos(motionAngle)];
    const [sunX,sunY]=rotate(sun.x,sun.y);
    const targetX=pan.x+sunX*focus,targetY=pan.y+sunY*focus;
    const toScreen=(x,y)=>{const [rx,ry]=rotate(x,y);return[cx+(rx-targetX)*scaled,cy+(ry-targetY)*scaled*.84];};
    const glow=ctx.createRadialGradient(...toScreen(0,0),0,...toScreen(0,0),scaled*.82);
    glow.addColorStop(0,'rgba(255,218,155,.25)');glow.addColorStop(.16,'rgba(222,171,255,.13)');glow.addColorStop(.58,'rgba(89,124,208,.035)');glow.addColorStop(1,'rgba(9,11,25,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    galaxyStars.forEach(star=>{
      const [x,y]=toScreen(star.x,star.y);if(x<-4||x>width+4||y<-4||y>height+4)return;
      ctx.globalAlpha=star.a*(.78+star.c*.22);ctx.fillStyle=star.c>.94?'#fff1c8':star.c>.72?'#c5d7ff':'#e6d7ff';ctx.beginPath();ctx.arc(x,y,Math.min(3,star.r*Math.min(zoom,2.5)),0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;
    const [gx,gy]=toScreen(0,0);
    if(gx>-width&&gx<2*width&&gy>-height&&gy<2*height){
      const core=ctx.createRadialGradient(gx,gy,0,gx,gy,Math.max(8,scaled*.13));core.addColorStop(0,'#fff5ce');core.addColorStop(.16,'#ffe6a6');core.addColorStop(.55,'#e6b7ff66');core.addColorStop(1,'#d3adff00');ctx.fillStyle=core;ctx.beginPath();ctx.arc(gx,gy,Math.max(8,scaled*.13),0,Math.PI*2);ctx.fill();
    }
    const [sx,sy]=toScreen(sun.x,sun.y);
    if(sx>-20&&sx<width+20&&sy>-20&&sy<height+20){
      ctx.save();ctx.strokeStyle='#ffe6a688';ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(sx,sy,Math.max(9,Math.min(22,7+zoom*1.5)),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.shadowColor='#ffe38a';ctx.shadowBlur=13;ctx.fillStyle='#fff1b1';ctx.beginPath();ctx.arc(sx,sy,Math.max(3,Math.min(6,2.6+zoom*.3)),0,Math.PI*2);ctx.fill();ctx.restore();
      ctx.font='12px Manrope, sans-serif';ctx.fillStyle='#fff1c3';ctx.fillText('Solsystemet',sx+12,sy-10);
    }
    ctx.globalAlpha=1;
  }
  function setZoom(value){slider.value=String(Math.max(0,Math.min(100,value)));viewDescription();}
  document.querySelector('#zoom-in').addEventListener('click',()=>setZoom(Number(slider.value)+10));
  document.querySelector('#zoom-out').addEventListener('click',()=>setZoom(Number(slider.value)-10));
  document.querySelector('#reset-view').addEventListener('click',()=>{pan={x:0,y:0};setZoom(0);});
  slider.addEventListener('input',viewDescription);
  canvas.addEventListener('wheel',event=>{event.preventDefault();setZoom(Number(slider.value)+(event.deltaY<0?5:-5));},{passive:false});
  canvas.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY,panX:pan.x,panY:pan.y};canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener('pointermove',event=>{if(!drag)return;const scale=Math.min(width,height)*.43*zoom;pan.x=drag.panX-(event.clientX-drag.x)/scale;pan.y=drag.panY-(event.clientY-drag.y)/(scale*.84);draw();});
  canvas.addEventListener('pointerup',()=>{drag=null;});canvas.addEventListener('pointercancel',()=>{drag=null;});
  new ResizeObserver(resize).observe(canvas);
  const syncMotionButton=()=>{if(!motionToggle)return;motionToggle.textContent=moving?'Pause bevegelse':'Start bevegelse';motionToggle.setAttribute('aria-pressed',String(moving));};
  if(motionToggle)motionToggle.addEventListener('click',()=>{moving=!moving;syncMotionButton();});
  const animate=(now)=>{if(lastFrame&&moving)motionAngle+=Math.min((now-lastFrame)/1000,.05)*.035;lastFrame=now;draw();requestAnimationFrame(animate);};
  syncMotionButton();
  viewDescription();resize();
  if(!reduceMotion)requestAnimationFrame(animate);
})();
