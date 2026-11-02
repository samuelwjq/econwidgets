/* AD teaching controller and presentation bridge. Shared resources are read-only. */
(()=>{'use strict';
 const M=AggregateDemandModel,C=EconDiagramConfig,NS='http://www.w3.org/2000/svg',$=id=>document.getElementById(id),svg=$('diagram'),drawing=$('ad-drawing');
 const X=q=>100+380*q/120,Y=p=>430-380*p/120;
 const colours={initial:'#93b4f2',ad:'#2563eb',as:'#16a34a',ink:'#374151',red:'#dc2626'};
 let summary='',pending=false;
 const units=()=>600/(svg.getBoundingClientRect().width||600);
 function node(tag,attrs={},text,parent=drawing){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text!==undefined)n.textContent=text;parent.append(n);return n;}
 function line(x1,y1,x2,y2,stroke=colours.ink,extra={}){return node('line',{x1,y1,x2,y2,stroke,'stroke-width':2,'vector-effect':'non-scaling-stroke',...extra});}
 function text(x,y,value,extra={}){return node('text',{x,y,fill:colours.ink,'font-size':14,'text-anchor':'middle',...extra},value);}
 function tip(n,message){n.dataset.tip=message;n.setAttribute('aria-label',message);n.setAttribute('tabindex','0');n.setAttribute('role','button');return n;}
 const dir=v=>Math.abs(v)<1e-7?'Unchanged':v>0?'↑':'↓';
 function state(){return {mode:$('mode').value,component:$('component').value,amount:+$('change').value,price:+$('price-level').value,showAS:$('show-as').checked,full:+$('as-full').value,steep:+$('as-steep').value};}
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
  pairs.forEach(([p,label,i])=>{const x=X(p.q),y=Y(p.p),close=Math.hypot(X(a.q)-X(b.q),Y(a.p)-Y(b.p))<64*units();node('circle',{cx:x,cy:y,r:3.5,fill:i<0?colours.ink:'#4169e1'});const dx=(movement?(i<0?-12:12):close&&i&&Math.abs(X(a.q)-X(b.q))<24*units()?i*10:0)*units(),dy=(movement?(i<0?12:-12):-16)*units();tip(text(x+dx,y+dy,label,{fill:'#000',class:'ad-point','font-size':14}),movement?'A position on AD; it need not be an equilibrium with AS.':'An intersection of AD and AS: macroeconomic equilibrium.');});
 }
 function render(){
  window.WidgetInterface?.closeExplanation();drawing.replaceChildren();const s=state(),move=s.mode==='movement',shift=M.shock(s.component,s.amount),changed=!move&&shift!==0,eq0=M.equilibrium(110,s.full,s.steep),eq1=M.equilibrium(110+shift,s.full,s.steep);
  $('show-as').closest('label').hidden=move;if(move)s.showAS=false;
  for(const id of ['component-control','shift-control'])$(id).hidden=move;$('movement-control').hidden=!move;for(const id of ['as-steep-control','as-full-control'])$(id).hidden=!s.showAS;
  $('change-value').textContent=dir(s.amount);$('price-value').textContent=dir(s.price-50);
  line(100,430,490,430,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});line(100,430,100,40,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});
  text(100,30,'General Price Level',{'font-size':12,class:'ew-axis-title'});text(588,448,'Real National Income',{'font-size':12,'text-anchor':'end',class:'ew-axis-title'});text(88,446,'0',{'font-size':12});
  if(s.showAS){let d=`M${X(0)},${Y(s.steep)} L${X(.6*s.full)},${Y(s.steep)}`;for(let i=1;i<=100;i++){const p=M.supply(i/100,s.full,s.steep);d+=` L${X(p.q)},${Y(p.p)}`;}d+=` L${X(s.full)},${Y(120)}`;tip(node('path',{'data-as-curve':'',d,fill:'none',stroke:colours.as,'stroke-width':2.5,'vector-effect':'non-scaling-stroke'}),'Keynesian AS: spare capacity at low output, rising costs as capacity is approached, and a full-employment output limit.');tip(text(X(s.full)+10,65,'AS',{fill:colours.as,class:'ad-bold','text-anchor':'start'}),'The vertical section represents full-employment output.');}
  curve.span=120;
  if(move){curve(110,'AD',colours.ad);const a={q:60,p:50},b={q:110-s.price,p:s.price};if(s.price!==50){line(X(a.q)+6,Y(a.p)+6,X(b.q)+6,Y(b.p)+6,colours.red,{'marker-end':'url(#ad-red-arrow)'});}points(a,b,true);
   summary=`AD Unchanged · Price Level ${dir(s.price-50)} · Real Output Demanded ${dir(50-s.price)}`;
   $('mechanism').innerHTML='<p>A change in the general price level causes a <strong>movement along the same AD curve</strong>. A lower price level increases real output demanded; a higher price level reduces it, ceteris paribus. C, I, G, X and M are held unchanged as autonomous determinants.</p><p>Points A and B are positions on AD. AS is hidden in this mode. Moving the selected point does not create a new AD–AS equilibrium.</p>';
  }else{
   if(changed)curve(110,'AD₀',colours.initial,Math.abs(shift)<12?-24:0);curve(110+shift,changed?'AD₁':'AD₀',colours.ad,Math.abs(shift)<12&&changed?0:0);
   if(changed)line(X(60),Y(50),X(60+shift),Y(50),colours.red,{'marker-end':'url(#ad-red-arrow)'});
   if(s.showAS)points(eq0,eq1,false);
   const impact=[`${M.components[s.component]} (${s.component}) ${dir(s.amount)}`];if(['X','M'].includes(s.component))impact.push(`Net Exports (X−M) ${shift===0?'Unchanged':shift>0?'↑':'↓'}`);impact.push(shift===0?'AD Unchanged':shift>0?'AD Increases (Rightwards Shift)':'AD Decreases (Leftwards Shift)');if(s.showAS)impact.push(`P ${dir(eq1.p-eq0.p)}`,`RNY ${dir(eq1.q-eq0.q)}`);summary=impact.join(' · ');
   const reason=s.component==='M'?'Imports are subtracted in AD = C + I + G + (X − M). Holding C, I, G and X constant, higher imports reduce net exports and demand for domestic output; lower imports increase them.':s.component==='X'?'Holding imports constant, higher exports increase net exports (X − M), while lower exports reduce net exports.':`An autonomous change in ${M.components[s.component].toLowerCase()} changes planned expenditure on domestic output at every general price level, holding other determinants constant.`;
   $('mechanism').innerHTML=`<p class="ad-equation">AD = C + I + G + (X − M)</p><p>${reason}</p><p>${shift===0?'The selected component is unchanged, so AD stays at AD₀.':`This is a <strong>shift of AD</strong>: ${shift>0?'more':'less'} real output is demanded at every general price level. AD₀ is the initial curve and AD₁ is the new curve.`}</p><p>${s.showAS?`The new equilibrium lies on the <strong>${eq1.section} section of AS</strong>. On the horizontal section, output can change without a price-level change; on the vertical section, real output is fixed at full employment. In between, both can change.`:'AS is hidden, so no equilibrium price-level or real-income outcome is inferred from the AD shift alone.'}</p><p>Changes are qualitative and illustrative. No multiplier rounds are included. AS controls reshape a reference supply curve; both AD₀ and AD₁ are compared against the same AS.</p>`;
  }
  $('ad-summary').textContent=summary;$('diagram-desc').textContent=summary;
  const rows=move?[['AD curve','Unchanged'],['General price level',dir(s.price-50)],['Real output demanded',dir(50-s.price)]]:[[M.components[s.component],dir(s.amount)],...(['X','M'].includes(s.component)?[['Net exports (X − M)',dir(shift)]]:[]),['AD',shift===0?'Unchanged':shift>0?'Shifts right':'Shifts left'],...(s.showAS?[['Equilibrium price level',dir(eq1.p-eq0.p)],['Equilibrium real national income',dir(eq1.q-eq0.q)]]:[['Equilibrium outcomes','Show AS to determine them']])];

  for(const t of drawing.querySelectorAll('text')){const role=t.classList.contains('ad-bold')?'curve':/^[PY][₀₁]/.test(t.textContent)||t.classList.contains('ad-point')?'main':'small';EconDiagramPresentation.styleText(t,role,!t.classList.contains('ew-axis-title'));}
  // Keep complete curve-label boxes clear of every curve, not merely their anchor.
  const samples=[];for(const path of drawing.querySelectorAll('[data-ad-intercept],[data-as-curve]')){const len=path.getTotalLength(),m=path.getScreenCTM();for(let j=0;j<=400;j++){const p=path.getPointAtLength(len*j/400);samples.push(new DOMPoint(p.x,p.y).matrixTransform(m));}}
  for(const label of drawing.querySelectorAll('text.ad-bold')){
   const box=label.getBoundingClientRect(),bounds=svg.getBoundingClientRect();let chosen=null;
   const all=[...drawing.querySelectorAll('text')].filter(e=>e!==label);
   for(let radius=0;radius<=100&&!chosen;radius+=4){for(let angle=0;angle<16;angle++){
    const dx=radius*Math.cos(angle*Math.PI/8),dy=radius*Math.sin(angle*Math.PI/8),r={left:box.left+dx,right:box.right+dx,top:box.top+dy,bottom:box.bottom+dy};
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
 window.AggregateDemandWidget=Object.freeze({state,render});
 document.querySelector('.controls').addEventListener('input',render);
 $('component').addEventListener('change',()=>{$('change').value=0;render();});
 $('mode').addEventListener('change',()=>{$('change').value=0;$('price-level').value=50;render();});
 $('reset').onclick=()=>{$('mode').value='movement';$('component').value='C';$('change').value=0;$('price-level').value=50;$('show-as').checked=false;$('as-steep').value=20;$('as-full').value=85;$('tooltips').checked=true;$('image-style').value='colour';$('export-status').textContent='';render();};
 window.addEventListener('resize',render);
 render();
})();
