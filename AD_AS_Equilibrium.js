/* Equilibrium controller. Shared suite presentation resources are unchanged. */
(()=>{'use strict';
 const M=EquilibriumModel,NS='http://www.w3.org/2000/svg',$=id=>document.getElementById(id),svg=$('diagram'),drawing=$('ad-drawing');
 const X=q=>100+380*q/120,Y=p=>430-380*p/160;
 const colours={ad:'#2563eb',as:'#16a34a',ink:'#374151',red:'#dc2626'};
 let summary='';
 const units=()=>600/(svg.getBoundingClientRect().width||600);
 function node(tag,attrs={},value,parent=drawing){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(value!==undefined)n.textContent=value;parent.append(n);return n;}
 function line(x1,y1,x2,y2,stroke=colours.ink,extra={}){return node('line',{x1,y1,x2,y2,stroke,'stroke-width':2,'vector-effect':'non-scaling-stroke',...extra});}
 function text(x,y,value,extra={}){return node('text',{x,y,fill:colours.ink,'font-size':14,'text-anchor':'middle',...extra},value);}
 function tip(n,message){n.dataset.tip=message;n.setAttribute('aria-label',message);n.setAttribute('tabindex','0');n.setAttribute('role','button');return n;}
 const dir=v=>Math.abs(v)<1e-6?'Unchanged':v>0?'↑':'↓';
 const size=v=>v===0?'Zero':v<34?'Small':v<67?'Medium':'Large';
 function state(){const change=+$('ad-shift').value,cop=+$('cop').value;return {initial:$('initial').value,ad:change===0?'none':change>0?'increase':'decrease',spending:Math.abs(change),multiplier:+$('multiplier').value,as:'both',sras:-cop,lras:+$('capacity').value,cop};}
 function demand(intercept,label,colour,old){const q0=Math.max(0,intercept-160),q1=Math.min(120,intercept);tip(line(X(q0),Y(intercept-q0),X(q1),Y(intercept-q1),colour,{'stroke-width':2.5,'data-curve':'','data-intercept':intercept,'clip-path':'url(#ad-plot-clip)'}),label+': planned expenditure on domestic output at each general price level.');const q=old?Math.min(q1-6,q0+20):q1-6;tip(text(X(q)-8,Y(intercept-q)-16*units(),label,{fill:colour,class:'ad-bold','text-anchor':'end'}),'Aggregate demand curve.');}
 function supply(full,level,label,colour,other){let d=`M${X(0)},${Y(level)} L${X(.6*full)},${Y(level)}`;for(let i=1;i<=100;i++){const p=M.supply(i/100,full,level);d+=` L${X(p.q)},${Y(p.p)}`;}d+=` L${X(full)},${Y(160)}`;tip(node('path',{d,fill:'none',stroke:colour,'stroke-width':2.5,'vector-effect':'non-scaling-stroke','data-curve':'','clip-path':'url(#ad-plot-clip)'}),label+': aggregate supply.');let lx=X(full)+12*units(),ly=85,anchor='start';if(other&&full!==other.full){const left=full<other.full;lx=X(full)+(left?-12:12)*units();anchor=left?'end':'start';}else if(other&&level!==other.level){lx=X(.24*full);ly=Y(level)+(level>other.level?-12:23)*units();anchor='middle';}tip(text(lx,ly,label,{fill:colour,class:'ad-bold','text-anchor':anchor}),'Aggregate supply curve.');}
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
  pairs.forEach(([p,label,i])=>{const x=X(p.q),y=Y(p.p);node('circle',{cx:x,cy:y,r:3.5,fill:i<0?colours.ink:'#4169e1'});tip(text(x,y-16*units(),label,{fill:'#000',class:'ad-point','font-size':14,'data-point-x':x,'data-point-y':y}), 'An intersection of AD and AS: macroeconomic equilibrium.');});
 }


 function shiftArrow(a,b,kind){if(Math.hypot(a.q-b.q,a.p-b.p)>1e-7)line(X(a.q),Y(a.p),X(b.q),Y(b.p),colours.red,{'marker-end':'url(#ad-red-arrow)','data-shift-arrow':kind});}
 function render(){window.WidgetInterface?.closeExplanation();drawing.replaceChildren();const s=state(),r=M.calculate(s),adChanged=Math.abs(r.shift)>1e-7,asChanged=r.full!==85||r.level!==20;
 $('multiplier').setAttribute('aria-valuetext',size(s.multiplier));
 for(const id of ['ad-shift','cop','capacity']){const v=+$(id).value;$(id).setAttribute('aria-valuetext',v===0?'Unchanged':size(Math.abs(v))+' '+(v>0?'increase':'decrease'));}
 line(100,430,490,430,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});line(100,430,100,40,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});text(100,30,'General Price Level',{'font-size':12,class:'ew-axis-title'});text(588,448,'Real National Income',{'font-size':12,'text-anchor':'end',class:'ew-axis-title'});text(88,446,'0',{'font-size':12});
 if(adChanged)demand(r.initial,'AD₀','#93b4f2',true);demand(r.final,adChanged?'AD₁':'AD₀',colours.ad,false);
 if(asChanged)supply(85,20,'AS₀','#8fcea3',{full:r.full,level:r.level});supply(r.full,r.level,asChanged?'AS₁':'AS₀',colours.as,asChanged?{full:85,level:20}:null);
 if(adChanged&&$('show-ad-arrow').checked){const p=55,q=r.initial-p;if(q>=0&&q<=120&&q+r.shift>=0&&q+r.shift<=120)shiftArrow({q,p},{q:q+r.shift,p},'ad');else {const p=100;shiftArrow({q:r.initial-p,p},{q:r.final-p,p},'ad');}}
 if(asChanged&&$('show-as-arrow').checked){const arrow=M.supplyShiftArrow(r.full,r.level);shiftArrow(arrow.a,arrow.b,'as');}
 points(r.a,r.b,false);
 const parts=[adChanged?'AD '+dir(r.shift):'AD Unchanged'];if(asChanged){if(r.level!==20)parts.push('SRAS '+dir(20-r.level));if(r.full!==85)parts.push('LRAS '+dir(r.full-85));}else parts.push('AS Unchanged');parts.push('P '+dir(r.b.p-r.a.p),'RNY '+dir(r.b.q-r.a.q));summary=parts.join(' · ');$('ad-summary').textContent=summary;$('diagram-desc').textContent=summary;
 const adWords=adChanged?'AD '+(r.shift>0?'increases (Rightwards Shift).':'decreases (Leftwards Shift).'):s.ad!=='none'?'AD is unchanged because '+(s.multiplier===0?'the multiplier is set to Zero.':'the initial spending change is Zero.'):'AD is unchanged.';
 const asWords=[];if(r.level!==20)asWords.push('SRAS '+(r.level<20?'increases (Downwards Shift)':'decreases (Upwards Shift)'));if(r.full!==85)asWords.push('LRAS '+(r.full>85?'increases (Rightwards Shift)':'decreases (Leftwards Shift)'));
 $('mechanism').innerHTML='<p><strong>'+adWords+' '+(asWords.length?asWords.join('; ')+'.':'AS is unchanged.')+'</strong></p><p>E₀ starts on the '+r.a.section.toLowerCase()+' section; E₁ lies on the '+r.b.section.toLowerCase()+' section. P '+(Math.abs(r.b.p-r.a.p)<1e-6?'is unchanged':r.b.p>r.a.p?'increases':'decreases')+'; real national income '+(Math.abs(r.b.q-r.a.q)<1e-6?'is unchanged':r.b.q>r.a.q?'increases':'decreases')+'.</p><p>For the same initial spending change, a larger multiplier gives a larger total AD shift. The AS section determines how the equilibrium adjustment is divided between price and real national income. The controls are qualitative; the diagram is not a numerical forecast.</p>';
 styleLabels();
 }
 function styleLabels(){
 for(const t of drawing.querySelectorAll('text')){const role=t.classList.contains('ad-bold')?'curve':/^[PY][₀₁]/.test(t.textContent)||t.classList.contains('ad-point')?'main':'small';EconDiagramPresentation.styleText(t,role,!t.classList.contains('ew-axis-title'));}
 const samples=[];for(const path of drawing.querySelectorAll('[data-curve]')){const length=path.getTotalLength(),matrix=path.getScreenCTM();for(let j=0;j<=600;j++){const p=path.getPointAtLength(length*j/600);samples.push(new DOMPoint(p.x,p.y).matrixTransform(matrix));}}
 // Point labels keep their horizontal centre exactly over their own point.
 const pointLabels=[...drawing.querySelectorAll('text.ad-point')],placed=[];
 for(const label of pointLabels){let box=label.getBoundingClientRect();while(placed.some(b=>box.left<b.right+3&&box.right>b.left-3&&box.top<b.bottom+3&&box.bottom>b.top-3)){label.setAttribute('y',+label.getAttribute('y')-20*units());box=label.getBoundingClientRect();}placed.push(box);}
 for(const label of drawing.querySelectorAll('text.ad-bold')){const box=label.getBoundingClientRect(),bounds=svg.getBoundingClientRect(),others=[...drawing.querySelectorAll('text')].filter(e=>e!==label);let chosen;
 for(let radius=0;radius<=100&&!chosen;radius+=4){for(let angle=0;angle<24;angle++){const dx=radius*Math.cos(angle*Math.PI/12),dy=radius*Math.sin(angle*Math.PI/12),r={left:box.left+dx,right:box.right+dx,top:box.top+dy,bottom:box.bottom+dy};if(r.left<bounds.left+5||r.right>bounds.right-5||r.top<bounds.top+5||r.bottom>bounds.bottom-5)continue;if(samples.some(p=>p.x>r.left-4&&p.x<r.right+4&&p.y>r.top-4&&p.y<r.bottom+4))continue;if(others.some(e=>{const b=e.getBoundingClientRect();return r.left<b.right+2&&r.right>b.left-2&&r.top<b.bottom+2&&r.bottom>b.top-2;}))continue;chosen={dx,dy};break;}}
 if(chosen){label.setAttribute('transform',`translate(${chosen.dx*units()} ${chosen.dy*units()})`);if(label.classList.contains('ad-point')&&Math.hypot(chosen.dx,chosen.dy)>24)line(+label.getAttribute('x'),+label.getAttribute('y')+5*units(),+label.getAttribute('x')+chosen.dx*units(),+label.getAttribute('y')+(chosen.dy+5)*units(),'#9ca3af',{'stroke-width':1});}else label.dataset.clearance='unresolved';
 }
 for(const t of drawing.querySelectorAll('.ew-axis-title')){const b=t.getBBox();if(b.x<8)t.setAttribute('x',+t.getAttribute('x')+8-b.x);if(b.x+b.width>592)t.setAttribute('x',+t.getAttribute('x')+592-b.x-b.width);}
 }
 function resetShocks(){$('ad-shift').value=0;$('multiplier').value=50;$('cop').value=0;$('capacity').value=0;}
 document.querySelector('.controls').addEventListener('input',e=>{if(e.target.id==='initial')resetShocks();render();});
 $('reset').onclick=()=>{$('initial').value='intermediate';resetShocks();$('tooltips').checked=true;$('show-ad-arrow').checked=false;$('show-as-arrow').checked=false;$('image-style').value='colour';$('export-status').textContent='';render();};
 window.EconPilot=Object.freeze({chrome:()=>{},refresh:()=>{},schedule:()=>{},legendEntries:()=>[],summaryText:()=>summary});
 window.EconWidgetPresentation=Object.freeze({refresh:render});window.EquilibriumWidget=Object.freeze({state,render,calculate:()=>M.calculate(state())});window.addEventListener('resize',render);render();
})();
