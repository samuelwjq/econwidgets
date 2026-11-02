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
  pairs.forEach(([p,label,i])=>{const x=X(p.q),y=Y(p.p),close=Math.hypot(X(a.q)-X(b.q),Y(a.p)-Y(b.p))<64*units();node('circle',{cx:x,cy:y,r:3.5,fill:i<0?colours.ink:'#4169e1'});const dx=(close&&i?(i<0?-23:23):-18)*units(),dy=(close&&i?(i<0?-24:24):-19)*units();line(x,y,x+dx*.65,y+dy*.65,'#9ca3af',{'stroke-width':1});tip(text(x+dx,y+dy,label,{fill:'#000',class:'ad-point','font-size':14}),movement?'A position on AD; it need not be an equilibrium with AS.':'An intersection of AD and AS: macroeconomic equilibrium.');});
 }
 function render(){
  window.WidgetInterface?.closeExplanation();drawing.replaceChildren();const s=state(),move=s.mode==='movement',shift=M.shock(s.component,s.amount),changed=!move&&shift!==0,eq0=M.equilibrium(110,s.full,s.steep),eq1=M.equilibrium(110+shift,s.full,s.steep);
  for(const id of ['component-control','shift-control'])$(id).hidden=move;$('movement-control').hidden=!move;for(const id of ['as-steep-control','as-full-control'])$(id).hidden=!s.showAS;
  $('change-value').textContent=dir(s.amount);$('price-value').textContent=dir(s.price-50);
  line(100,430,490,430,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});line(100,430,100,40,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});
  text(100,30,'General Price Level',{'font-size':12,class:'ew-axis-title'});text(488,480,'Real National Income',{'font-size':12,'text-anchor':'end',class:'ew-axis-title'});text(88,446,'0',{'font-size':12});
  if(s.showAS){let d=`M${X(0)},${Y(s.steep)} L${X(.6*s.full)},${Y(s.steep)}`;for(let i=1;i<=100;i++){const p=M.supply(i/100,s.full,s.steep);d+=` L${X(p.q)},${Y(p.p)}`;}d+=` L${X(s.full)},${Y(120)}`;tip(node('path',{d,fill:'none',stroke:colours.as,'stroke-width':2.5,'vector-effect':'non-scaling-stroke'}),'Keynesian AS: spare capacity at low output, rising costs as capacity is approached, and a full-employment output limit.');tip(text(X(s.full)+10,65,'AS',{fill:colours.as,class:'ad-bold','text-anchor':'start'}),'The vertical section represents full-employment output.');}
  curve.span=120;
  if(move){curve(110,'AD',colours.ad);const a={q:60,p:50},b={q:110-s.price,p:s.price};if(s.price!==50){line(X(a.q)+6,Y(a.p)+6,X(b.q)+6,Y(b.p)+6,colours.red,{'marker-end':'url(#ad-red-arrow)'});}points(a,b,true);
   summary=`AD Unchanged · Price Level ${dir(s.price-50)} · Real Output Demanded ${dir(50-s.price)}`;
   $('mechanism').innerHTML='<p>A change in the general price level causes a <strong>movement along the same AD curve</strong>. A lower price level increases real output demanded; a higher price level reduces it, ceteris paribus. C, I, G, X and M are held unchanged as autonomous determinants.</p><p>Points A and B are positions on AD. If AS is displayed, it is a reference curve: moving the selected point does not create a new AD–AS equilibrium.</p>';
  }else{
   if(changed)curve(110,'AD₀',colours.initial,Math.abs(shift)<12?-24:0);curve(110+shift,changed?'AD₁':'AD₀',colours.ad,Math.abs(shift)<12&&changed?0:0);
   if(changed)line(X(60),Y(50),X(60+shift),Y(50),colours.red,{'marker-end':'url(#ad-red-arrow)'});
   if(s.showAS)points(eq0,eq1,false);
   const impact=[`${s.component} ${dir(s.amount)}`];if(['X','M'].includes(s.component))impact.push(`Net Exports ${shift===0?'Unchanged':shift>0?'↑':'↓'}`);impact.push(shift===0?'AD Unchanged':shift>0?'AD Shifts Right':'AD Shifts Left');if(s.showAS)impact.push(`PL ${dir(eq1.p-eq0.p)}`,`Real Y ${dir(eq1.q-eq0.q)}`);summary=impact.join(' · ');
   const reason=s.component==='M'?'Imports are subtracted in AD = C + I + G + (X − M). Holding C, I, G and X constant, higher imports reduce net exports and demand for domestic output; lower imports increase them.':s.component==='X'?'Holding imports constant, higher exports increase net exports (X − M), while lower exports reduce net exports.':`An autonomous change in ${M.components[s.component].toLowerCase()} changes planned expenditure on domestic output at every general price level, holding other determinants constant.`;
   $('mechanism').innerHTML=`<p class="ad-equation">AD = C + I + G + (X − M)</p><p>${reason}</p><p>${shift===0?'The selected component is unchanged, so AD stays at AD₀.':`This is a <strong>shift of AD</strong>: ${shift>0?'more':'less'} real output is demanded at every general price level. AD₀ is the initial curve and AD₁ is the new curve.`}</p><p>${s.showAS?`The new equilibrium lies on the <strong>${eq1.section} section of AS</strong>. On the horizontal section, output can change without a price-level change; on the vertical section, real output is fixed at full employment. In between, both can change.`:'AS is hidden, so no equilibrium price-level or real-income outcome is inferred from the AD shift alone.'}</p><p>Changes are qualitative and illustrative. No multiplier rounds are included. AS controls reshape a reference supply curve; both AD₀ and AD₁ are compared against the same AS.</p>`;
  }
  $('ad-summary').textContent=summary;$('diagram-desc').textContent=summary;
  const rows=move?[['AD curve','Unchanged'],['General price level',dir(s.price-50)],['Real output demanded',dir(50-s.price)]]:[[M.components[s.component],dir(s.amount)],...(['X','M'].includes(s.component)?[['Net exports (X − M)',dir(shift)]]:[]),['AD',shift===0?'Unchanged':shift>0?'Shifts right':'Shifts left'],...(s.showAS?[['Equilibrium price level',dir(eq1.p-eq0.p)],['Equilibrium real national income',dir(eq1.q-eq0.q)]]:[['Equilibrium outcomes','Show AS to determine them']])];
  $('summary-body').replaceChildren(...rows.map(([a,b])=>{const tr=document.createElement('tr');for(const v of [a,b]){const td=document.createElement('td');td.textContent=v;tr.append(td);}return tr;}));
  for(const t of drawing.querySelectorAll('text')){const role=t.classList.contains('ad-bold')?'curve':/^[PY][₀₁]/.test(t.textContent)||t.classList.contains('ad-point')?'main':'small';EconDiagramPresentation.styleText(t,role,!t.classList.contains('ew-axis-title'));}
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
 $('reset').onclick=()=>{$('mode').value='shift';$('component').value='C';$('change').value=0;$('price-level').value=50;$('show-as').checked=false;$('as-steep').value=20;$('as-full').value=85;$('tooltips').checked=true;$('image-style').value='colour';$('export-status').textContent='';render();};
 window.addEventListener('resize',render);
 render();
})();
