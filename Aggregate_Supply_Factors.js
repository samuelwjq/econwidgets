/* AD teaching controller and presentation bridge. Shared resources are read-only. */
(()=>{'use strict';
 const M=AggregateSupplyModel,C=EconDiagramConfig,NS='http://www.w3.org/2000/svg',$=id=>document.getElementById(id),svg=$('diagram'),drawing=$('ad-drawing');
 const X=q=>100+380*q/120,Y=p=>430-380*p/120;
 const colours={initial:'#93b4f2',ad:'#2563eb',as:'#16a34a',ink:'#374151',red:'#dc2626'};
 let summary='',pending=false;
 const units=()=>600/(svg.getBoundingClientRect().width||600);
 function node(tag,attrs={},text,parent=drawing){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;parent.append(n);return n;}
 function line(x1,y1,x2,y2,stroke=colours.ink,extra={}){return node('line',{x1,y1,x2,y2,stroke,'stroke-width':2,'vector-effect':'non-scaling-stroke',...extra});}
 function text(x,y,value,extra={}){return node('text',{x,y,fill:colours.ink,'font-size':14,'text-anchor':'middle',...extra},value);}
 function tip(n,message){n.dataset.tip=message;n.setAttribute('aria-label',message);n.setAttribute('tabindex','0');n.setAttribute('role','button');return n;}
 const dir=v=>Math.abs(v)<1e-7?'Unchanged':v>0?'↑':'↓';

 function legendEntries(){return [];}
 function curve(intercept,label,colour,offset=0){const q0=Math.max(0,intercept-120),q1=Math.min(120,intercept,q0+120);tip(line(X(q0),Y(intercept-q0),X(q1),Y(intercept-q1),colour,{'stroke-width':2.5,'clip-path':'url(#ad-plot-clip)','data-ad-intercept':intercept}),label+' shows planned expenditure on domestic output at each general price level.');
  const q=label==='AD₀'&&offset!==0?q0+20:q1-6,p=intercept-q;return tip(text(X(q)-8,Y(p)-16*units()+offset*units(),label,{fill:colour,'text-anchor':'end',class:'ad-bold'}),label==='AD'?'The AD curve is unchanged.':'Initial and new aggregate demand curves.');}
 function coordinatePair(a,b){
  const equalP=Math.abs(a.p-b.p)<1e-6,equalQ=Math.abs(a.q-b.q)<1e-6;
  for(const k of ['p','q']){
   const equal=k==='p'?equalP:equalQ,axis=k==='p',v0=a[k],v1=b[k],pos=v=>axis?Y(v):X(v),near=Math.abs(pos(v0)-pos(v1))<42*units();
   const values=equal?[[v0,axis?'P₀=P₁':'Y₀=Y₁',0]]:[[v0,axis?'P₀':'Y₀',0],[v1,axis?'P₁':'Y₁',1]];
   values.forEach(([v,label,i])=>{
    const px=pos(v),sign=pos(v1)>pos(v0)?1:-1,shift=near&&!equal?(i?sign:-sign)*21*units():0;
    if(axis){const yy=px+shift;if(shift)line(100,px,88,yy,'#9ca3af',{'stroke-width':1});text(84,yy+4,label,{fill:'#000','text-anchor':'end','font-size':12});}
    else {const xx=px+shift;if(shift)line(px,430,xx,446,'#9ca3af',{'stroke-width':1});text(xx,459,label,{fill:'#000','font-size':12});}
   });
  }
 }
 function points(a,b,movement){
  if(true){for(const p of [a,b]){line(100,Y(p.p),X(p.q),Y(p.p),'#9ca3af',{'stroke-width':1,'stroke-dasharray':'4 4'});line(X(p.q),Y(p.p),X(p.q),430,'#9ca3af',{'stroke-width':1,'stroke-dasharray':'4 4'});}coordinatePair(a,b);}
  const same=Math.hypot(a.q-b.q,a.p-b.p)<1e-6;
  const pairs=same?[[a,movement?'A = B':'E₀ = E₁',0]]:[[a,movement?'A':'E₀',-1],[b,movement?'B':'E₁',1]];
  pairs.forEach(([p,label,i])=>{const x=X(p.q),y=Y(p.p),close=Math.hypot(X(a.q)-X(b.q),Y(a.p)-Y(b.p))<64*units();node('circle',{cx:x,cy:y,r:3.5,fill:i<0?colours.ink:'#4169e1'});const dx=(movement?(i<0?-12:12):close&&i&&Math.abs(X(a.q)-X(b.q))<24*units()?i*10:0)*units(),dy=(movement?(i<0?12:-12):-16)*units();tip(text(x+dx,y+dy,label,{fill:'#000',class:'ad-point','font-size':14}),movement?'A position on AS; it need not be an equilibrium with AD.':'An intersection of AD and AS: macroeconomic equilibrium.');});
 }

 const factors={labour:'Cost of Labour',raw:'Price of Raw Materials',exchange:'Exchange Rate',resources:'Quantity of Resources',productivity:'Productivity'};
 function state(){return {mode:$('mode').value,factor:$('component').value,amount:+$('change').value,start:$('start').value,movement:+$('movement').value,showAD:$('show-ad').checked};}
 function supplyCurve(full,level,label,colour){let d=`M${X(0)},${Y(level)} L${X(.6*full)},${Y(level)}`;for(let i=1;i<=100;i++){const p=M.supply(i/100,full,level);d+=` L${X(p.q)},${Y(p.p)}`;}d+=` L${X(full)},${Y(120)}`;tip(node('path',{'data-as-curve':'',d,fill:'none',stroke:colour,'stroke-width':2.5,'vector-effect':'non-scaling-stroke'}),label+': aggregate supply at each general price level.');const current=state(),next=M.parameters(current.factor,current.amount);let lx=X(full)+12*units(),ly=75,anchor='start',side='';
 if(current.mode==='shift'&&current.amount){
  if(next.full!==85){const other=label==='AS₀'?next.full:85;side=full<other?'left':'right';lx=X(full)+(side==='left'?-12:12)*units();anchor=side==='left'?'end':'start';}
  else {const other=label==='AS₀'?next.level:20;lx=X(.3*full);ly=Y(level)+(level>other?-12:24)*units();anchor='middle';}
 }
 const caption=tip(text(lx,ly,label,{fill:colour,class:'ad-bold','text-anchor':anchor}),'Aggregate supply curve.');if(side){caption.dataset.side=side;caption.dataset.curveX=X(full);}}
 function render(){window.WidgetInterface?.closeExplanation();drawing.replaceChildren();const s=state(),move=s.mode==='movement',p=M.parameters(s.factor,s.amount);
 $('start-control').hidden=!move;$('movement-control').hidden=!move;$('component-control').hidden=move;$('shift-control').hidden=move;
 document.querySelector('label[for="change"]').textContent={labour:'Cost',raw:'Price',exchange:'Exchange Rate',resources:'Resources',productivity:'Productivity'}[s.factor];
 $('factor-decrease').textContent=s.factor==='exchange'?'Depreciation':'Decrease';
 $('factor-increase').textContent=s.factor==='exchange'?'Appreciation':'Increase';
 line(100,430,490,430,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});line(100,430,100,40,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});text(100,30,'General Price Level',{'font-size':12,class:'ew-axis-title'});text(588,448,'Real National Income',{'font-size':12,'text-anchor':'end',class:'ew-axis-title'});text(88,446,'0',{'font-size':12});
 $('show-ad').closest('label').hidden=move;
 if(s.showAD&&!move)curve(110,'AD',colours.ad);
 if(move){supplyCurve(85,20,'AS',colours.as);const start={horizontal:.22,intermediate:.5,vertical:.8}[s.start],end=s.movement>=0?start+(1-start)*s.movement/100:start+start*s.movement/100,a=M.position(start),b=M.position(end);
 if(s.movement)line(X(a.q),Y(a.p),X(b.q),Y(b.p),colours.red,{'marker-end':'url(#ad-red-arrow)'});
 points(a,b,true);summary=`AS Unchanged · P ${dir(b.p-a.p)} · Real Output Supplied ${dir(b.q-a.q)}`;
 $('mechanism').innerHTML='<p>A stays fixed at the selected starting position. B moves along the same AS curve. The straight arrow connects A to B; the points may lie on different sections of the unchanged AS curve.</p><p>On horizontal SRAS, output varies at an unchanged price level. On the intermediate section, price and output vary together. On vertical LRAS, price varies at unchanged full-employment output.</p><p>The slider selects a position along AS; price alone cannot uniquely locate a point on its horizontal section, and output alone cannot locate one on its vertical section. A and B are supply combinations, not necessarily equilibria. Optional AD is a reference only.</p>';
 }else{if(s.amount)supplyCurve(85,20,'AS₀','#8fcea3');supplyCurve(p.full,p.level,s.amount?'AS₁':'AS₀',colours.as);
 if(s.amount){
  const a=s.factor==='resources'?{q:85,p:90}:s.factor==='productivity'?M.supply(.35,85,20):{q:30,p:20};
  const b=s.factor==='resources'?{q:p.full,p:90}:s.factor==='productivity'?M.supply(.35,p.full,p.level):{q:30,p:p.level};
  line(X(a.q),Y(a.p),X(b.q),Y(b.p),colours.red,{'marker-end':'url(#ad-red-arrow)','data-as-shift-arrow':''});
 }
 const parts=[factors[s.factor]+' '+dir(s.amount)];
 if(s.factor==='exchange'&&s.amount)parts.push(s.amount>0?'Appreciation':'Depreciation');
 if(s.factor==='productivity'){parts.push('COP '+dir(p.level-20)+' & Productive Capacity '+dir(p.full-85),'SRAS & LRAS '+(s.amount===0?'Unchanged':s.amount>0?'Increase':'Decrease'));}
 else if(s.factor!=='resources')parts.push('COP '+dir(p.level-20),'SRAS '+(p.level===20?'Unchanged':p.level<20?'Increases':'Decreases'));
 if(s.factor==='resources')parts.push('Productive Capacity '+dir(p.full-85),'LRAS '+(p.full===85?'Unchanged':p.full>85?'Increases':'Decreases'));
 if(s.showAD){const a=M.equilibrium(110,85,20),b=M.equilibrium(110,p.full,p.level);points(a,b,false);parts.push('P '+dir(b.p-a.p),'RNY '+dir(b.q-a.q));}summary=parts.join(' · ');
 const reason={labour:'Labour costs change unit production costs, holding productivity constant.',raw:'Raw-material prices change production costs.',exchange:'An increase means domestic-currency appreciation: imported inputs become cheaper, lowering production costs. A decrease means depreciation and reverses the effect. Only the imported-input channel is shown; AD is fixed.',resources:'The quantity of resources changes productive capacity. This case holds the horizontal SRAS price level fixed.',productivity:'Higher productivity lowers unit production costs AND raises productive capacity: SRAS moves down and LRAS moves right. Lower productivity reverses both changes.'}[s.factor];
 $('mechanism').innerHTML='<p>'+reason+'</p><p>The intermediate section adjusts smoothly between the horizontal and vertical sections. AS₀ remains fixed. AS₁ represents the changed costs and/or capacity.</p><p>'+(s.showAD?'AD is fixed. E₀ and E₁ show the initial and new macroeconomic equilibria.':'AD is hidden, so equilibrium price and income outcomes are not inferred from AS alone.')+'</p><p>Geometry is illustrative; no numerical calibration or multiplier rounds are included.</p>';
 }
 $('ad-summary').textContent=summary;$('diagram-desc').textContent=summary;
  for(const t of drawing.querySelectorAll('text')){const role=t.classList.contains('ad-bold')?'curve':/^[PY][₀₁]/.test(t.textContent)||t.classList.contains('ad-point')?'main':'small';EconDiagramPresentation.styleText(t,role,!t.classList.contains('ew-axis-title'));}
  // Keep complete curve-label boxes clear of every curve, not merely their anchor.
  const samples=[];for(const path of drawing.querySelectorAll('[data-ad-intercept],[data-as-curve]')){const len=path.getTotalLength(),m=path.getScreenCTM();for(let j=0;j<=400;j++){const p=path.getPointAtLength(len*j/400);samples.push(new DOMPoint(p.x,p.y).matrixTransform(m));}}
  for(const label of drawing.querySelectorAll('text.ad-bold')){
   const box=label.getBoundingClientRect(),bounds=svg.getBoundingClientRect();let chosen=null;
   const all=[...drawing.querySelectorAll('text')].filter(e=>e!==label);
   for(let radius=0;radius<=100&&!chosen;radius+=4){for(let angle=0;angle<16;angle++){
    const dx=radius*Math.cos(angle*Math.PI/8),dy=radius*Math.sin(angle*Math.PI/8),r={left:box.left+dx,right:box.right+dx,top:box.top+dy,bottom:box.bottom+dy};
    if(label.dataset.side){const cx=bounds.left+Number(label.dataset.curveX)/units();if(label.dataset.side==='left'&&r.right>cx-4||label.dataset.side==='right'&&r.left<cx+4)continue;}
    if(r.left<bounds.left+4||r.right>bounds.right-4||r.top<bounds.top+4||r.bottom>bounds.bottom-4)continue;
    if(samples.some(p=>p.x>r.left-4&&p.x<r.right+4&&p.y>r.top-4&&p.y<r.bottom+4))continue;
    if(all.some(e=>{const b=e.getBoundingClientRect();return r.left<b.right+3&&r.right>b.left-3&&r.top<b.bottom+3&&r.bottom>b.top-3;}))continue;
    chosen={dx,dy};break;
   }}
   if(chosen)label.setAttribute('transform',`translate(${chosen.dx*units()} ${chosen.dy*units()})`);
  }
  for(const t of drawing.querySelectorAll('.ew-axis-title')){const b=t.getBBox();if(b.x<8)t.setAttribute('x',+t.getAttribute('x')+8-b.x);if(b.x+b.width>592)t.setAttribute('x',+t.getAttribute('x')+592-b.x-b.width);}
 }
 function chrome(){const controls=document.querySelector('.controls'),layout=document.querySelector('.layout');if(!controls.closest('.ew-fullscreen-stage')&&controls.nextElementSibling!==layout)layout.before(controls);}
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;});}
 // Interface/export hooks use this model's own read-only presentation bridge.
 window.EconPilot=Object.freeze({chrome,refresh:()=>{},schedule,legendEntries,summaryText:()=>summary});
 window.EconWidgetPresentation=Object.freeze({refresh:render});
 window.AggregateSupplyWidget=Object.freeze({state,render});
 document.querySelector('.controls').addEventListener('input',render);
 for(const id of ['component','start','mode'])$(id).addEventListener('change',()=>{$('change').value=0;$('movement').value=0;render();});
 $('reset').onclick=()=>{$('mode').value='movement';$('start').value='horizontal';$('component').value='labour';$('change').value=0;$('movement').value=0;$('show-ad').checked=false;$('tooltips').checked=true;$('image-style').value='colour';$('export-status').textContent='';render();};
 window.addEventListener('resize',render);render();})();
