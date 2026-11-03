/* Equilibrium controller. Shared suite presentation resources are unchanged. */
(()=>{'use strict';
 const M=MonetaryModel,NS='http://www.w3.org/2000/svg',$=id=>document.getElementById(id),svg=$('diagram'),drawing=$('ad-drawing');
 const X=q=>100+380*q/120,Y=p=>430-380*p/200;
 const colours={ad:'#2563eb',as:'#16a34a',ink:'#374151',red:'#dc2626'};
 let summary='';
 const units=()=>600/(svg.getBoundingClientRect().width||600);
 function node(tag,attrs={},value,parent=drawing){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(value!==undefined)n.textContent=value;parent.append(n);return n;}
 function line(x1,y1,x2,y2,stroke=colours.ink,extra={}){return node('line',{x1,y1,x2,y2,stroke,'stroke-width':2,'vector-effect':'non-scaling-stroke',...extra});}
 function text(x,y,value,extra={}){return node('text',{x,y,fill:colours.ink,'font-size':14,'text-anchor':'middle',...extra},value);}
 function tip(n,message){n.dataset.tip=message;n.setAttribute('aria-label',message);n.setAttribute('tabindex','0');n.setAttribute('role','button');return n;}
 const dir=v=>Math.abs(v)<1e-6?'Unchanged':v>0?'↑':'↓';
 const size=v=>v===0?'Zero':v<34?'Small':v<67?'Medium':'Large';
 function state(){const change=+$('spending').value,instrument=$('policy').value;return {initial:$('initial').value,instrument,change,multiplier:+$('multiplier').value,mlHolds:$('ml-holds').checked,importCosts:instrument==='ER'&&$('import-costs').checked,lras:$('long-run').checked&&change!==0?+$('capacity').value:0};}
 function demand(intercept,label,colour,old){const q0=Math.max(0,intercept-200),q1=Math.min(120,intercept);tip(line(X(q0),Y(intercept-q0),X(q1),Y(intercept-q1),colour,{'stroke-width':colour==='#9333ea'?1.5:2.5,'stroke-opacity':colour==='#9333ea'?.6:1,'data-curve':'','data-intercept':intercept,'clip-path':'url(#ad-plot-clip)'}),label+': planned expenditure on domestic output at each general price level.');const q=old?Math.min(q1-6,q0+20):q1-6;tip(text(X(q)-8,Y(intercept-q)-16*units(),label,{fill:colour,class:'ad-bold','text-anchor':'end'}),'Aggregate demand curve.');}
 function supply(full,level,label,colour,other){let d=`M${X(0)},${Y(level)} L${X(.6*full)},${Y(level)}`;for(let i=1;i<=100;i++){const p=M.supply(i/100,full,level);d+=` L${X(p.q)},${Y(p.p)}`;}d+=` L${X(full)},${Y(200)}`;tip(node('path',{d,fill:'none',stroke:colour,'stroke-width':2.5,'vector-effect':'non-scaling-stroke','data-curve':'','clip-path':'url(#ad-plot-clip)'}),label+': aggregate supply.');let lx=X(full)+12*units(),ly=85,anchor='start';if(other&&full!==other.full){const left=full<other.full;lx=X(full)+(left?-12:12)*units();anchor=left?'end':'start';}else if(other&&level!==other.level){lx=X(.24*full);ly=Y(level)+(level>other.level?-12:23)*units();anchor='middle';}tip(text(lx,ly,label,{fill:colour,class:'ad-bold','text-anchor':anchor}),'Aggregate supply curve.');}
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
 function render(){window.WidgetInterface?.closeExplanation();EconDiagramPresentation.resetPresentation(svg);drawing.replaceChildren();const s=state(),r=M.calculate(s),adChanged=Math.abs(r.shift)>1e-7,asChanged=r.full!==85||r.level!==20;
 $('capacity-controls').hidden=!$('long-run').checked;$('long-run-explanation').hidden=!$('long-run').checked;
 $('multiplier').setAttribute('aria-valuetext',s.multiplier===0?'No Further Rounds':size(s.multiplier));
 const exchange=s.instrument==='ER';$('exchange-options').hidden=!exchange;$('instrument-label').textContent=exchange?'Exchange Rate':'Interest Rate';$('change-low').textContent=exchange?'Depreciation':'Decrease';$('change-high').textContent=exchange?'Appreciation':'Increase';
 $('capacity').disabled=s.change===0;$('capacity').setAttribute('aria-valuetext',s.lras===0?'Maintain':size(Math.abs(s.lras))+(s.lras>0?' increase':' decrease'));
 $('spending').setAttribute('aria-valuetext',s.change===0?'Maintain':size(Math.abs(s.change))+' '+(exchange?(s.change<0?'depreciation':'appreciation'):(s.change<0?'decrease':'increase')));
 line(100,430,490,430,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});line(100,430,100,40,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});text(100,30,'GPL',{'font-size':12,class:'ew-axis-title'});text(490,448,'RNY',{'font-size':12,'text-anchor':'middle',class:'ew-axis-title'});text(88,446,'0',{'font-size':12});
 if(adChanged&&$('show-multiplier').checked&&s.multiplier>0){
  demand(r.initial+r.autonomous,'ADₐ','#9333ea',false);
  demand(r.initial+r.autonomous+(r.shift-r.autonomous)*.6,'ADᵦ','#9333ea',false);
 }

 if(adChanged)demand(r.initial,'AD₀','#93b4f2',true);demand(r.final,adChanged?'AD₁':'AD₀',colours.ad,false);
 if(asChanged)supply(85,20,'AS₀','#8fcea3',{full:r.full,level:r.level});supply(r.full,r.level,asChanged?'AS₁':'AS₀',colours.as,asChanged?{full:85,level:20}:null);
 if(adChanged&&$('show-shifts').checked){const p=55,q=r.initial-p;if(q>=0&&q<=120&&q+r.shift>=0&&q+r.shift<=120)shiftArrow({q,p},{q:q+r.shift,p},'ad');else {const p=100;shiftArrow({q:r.initial-p,p},{q:r.final-p,p},'ad');}}
 if(asChanged&&$('show-shifts').checked){const arrow=M.supplyShiftArrow(r.full,r.level);shiftArrow(arrow.a,arrow.b,'as');}
 points(r.a,r.b,false);
 const parts=[];
 if(s.change!==0){parts.push(exchange?(s.change<0?'Depreciation':'Appreciation'):'Interest Rate '+dir(s.change));parts.push(exchange?'(X−M) '+dir(r.autonomous):'C & I '+dir(r.autonomous));}
 parts.push('AD '+dir(r.shift));if(r.level!==20)parts.push('COP '+dir(r.level-20),'SRAS '+dir(20-r.level));if(r.full!==85)parts.push('LRAS '+dir(r.full-85));parts.push('GPL '+dir(r.b.p-r.a.p),'RNY '+dir(r.b.q-r.a.q));summary=parts.join(' · ');$('ad-summary').textContent=summary;$('diagram-desc').textContent=summary;
 const initialOutcome=M.equilibrium(r.final,85,20);
 $('long-run-text').textContent=(exchange?'Exchange-rate changes can affect export investment and the domestic-currency cost of imported capital equipment. These influences can work in opposite directions. ':'Interest-rate changes can affect investment in capital, technology and productivity. Confidence, credit conditions and other influences can alter the response. ')+'Choose a possible increase or decrease in capacity relative to the initial baseline; this is an assumption, not an automatic prediction. A fall in investment alone need not reduce the absolute level of productive capacity. '+(s.change===0?'Select an interest-rate or exchange-rate change to explore a possible capacity effect. ':s.lras===0?'No capacity change is selected. ':s.lras>0?'Selected scenario: LRAS increases. ':'Selected scenario: LRAS decreases. ')+'The AD-only outcome would be GPL '+dir(initialOutcome.p-r.a.p)+' and RNY '+dir(initialOutcome.q-r.a.q)+'.';
 const channel=exchange?(s.mlHolds?'The Marshall–Lerner condition holds: depreciation raises (X−M) and AD; appreciation lowers them.':'The Marshall–Lerner condition does not hold: this case assumes the elasticity sum is below one. Depreciation lowers (X−M) and AD; appreciation raises them.'):'A lower interest rate can raise C and I by reducing borrowing costs and the incentive to save. A higher rate can reduce C and I. The exchange-rate channel is excluded.';
 $('mechanism').innerHTML='<p>'+channel+'</p>'+(exchange?'<p>'+(s.importCosts?'Imported input costs are included: appreciation lowers COP and increases SRAS; depreciation raises COP and decreases SRAS. This channel is separate from the Marshall–Lerner condition.':'Imported input cost effects are hidden; SRAS is held fixed.')+' Initial trade balance is assumed. Equality, the J-curve and adjustment lags are excluded.</p>':'')+'<p>'+(s.multiplier===0?'No Further Rounds retains the initial spending response.':'The multiplier adds induced consumption to the initial spending response.')+' Purple ADₐ shows the initial spending stage; ADᵦ is a later illustrative cumulative stage. They are spending stages, not separate equilibria.</p><p>E₀ is the initial equilibrium. E₁ combines the AD change with the selected supply effects. GPL '+dir(r.b.p-r.a.p)+'; RNY '+dir(r.b.q-r.a.q)+'. The AS section affects how adjustment divides between GPL and RNY. Geometry is illustrative.</p>';

 styleLabels();
 }
 function styleLabels(){
 const P=EconDiagramPresentation,C=EconDiagramConfig,segments=[],labels=[],families=[];
 for(const t of drawing.querySelectorAll('text'))P.styleText(t,t.classList.contains('ad-bold')?'curve':t.classList.contains('ad-point')||/^[PY][₀₁]/.test(t.textContent)?'main':'small',!t.classList.contains('ew-axis-title'));
 for(const t of drawing.querySelectorAll('.ew-axis-title')){const b=t.getBBox();if(b.x<8)t.setAttribute('x',+t.getAttribute('x')+8-b.x);if(b.x+b.width>592)t.setAttribute('x',+t.getAttribute('x')+592-b.x-b.width);}
 const demandFamily=[];const curveNodes=[...drawing.querySelectorAll('[data-curve]')];
 for(const curve of drawing.querySelectorAll('[data-curve]')){
  const length=curve.getTotalLength(),count=curve.tagName==='line'?1:160;
  for(let i=0;i<count;i++){const a=curve.getPointAtLength(length*i/count),b=curve.getPointAtLength(length*(i+1)/count);segments.push({x1:a.x,y1:a.y,x2:b.x,y2:b.y});}
  const label=curve.nextElementSibling;if(!label?.classList.contains('ad-bold'))continue;
  const id='label-'+label.textContent;let near,anchor;
  if(curve.tagName==='line'){
   near={x1:+curve.getAttribute('x1'),y1:+curve.getAttribute('y1'),x2:+curve.getAttribute('x2'),y2:+curve.getAttribute('y2')};anchor={x:near.x2,y:near.y2};if(curve.getAttribute('stroke')==='#9333ea'){const t=label.textContent==='ADₐ'?.3:.55;anchor={x:near.x1+(near.x2-near.x1)*t,y:near.y1+(near.y2-near.y1)*t};}if(curve.getAttribute('stroke')!=='#9333ea')demandFamily.push({...near,id});
  }else{
   // Adapt the nonlinear AS to the same solver using its relevant straight section.
   const end=curve.getPointAtLength(length),start=curve.getPointAtLength(0);
   const horizontal=+label.getAttribute('y')>200;
   near=horizontal?{x1:X(0),y1:start.y,x2:(end.x-100)*.6+100,y2:start.y}:{x1:end.x,y1:Y(70),x2:end.x,y2:Y(200)};
   anchor=horizontal?{x:near.x2,y:near.y2}:{x:end.x,y:85};
  }
  label.setAttribute('text-anchor','start');P.styleText(label,'curve');const width=label.getBBox().width;
  label.setAttribute('x',Math.max(108,Math.min(anchor.x+12,590-width)));label.setAttribute('y',Math.max(66,Math.min(410,anchor.y+4)));
  let candidates;
  const siblings=curveNodes.filter(c=>c.tagName===curve.tagName&&c.getAttribute('stroke')!=='#9333ea');
  if(siblings.length===2&&siblings.includes(curve)){
   const matrix=svg.getScreenCTM(),screen=p=>new DOMPoint(p.x,p.y).matrixTransform(matrix),box=label.getBoundingClientRect(),other=siblings.find(c=>c!==curve);
   if(curve.tagName==='line'){
    const thisP=+curve.dataset.intercept,otherP=+other.dataset.intercept,upper=thisP>otherP;
    const q=Math.min(...siblings.map(c=>+c.getAttribute('x2')))-18*units();
    const y=Y(thisP-(q-100)*120/380),a=screen({x:q,y});
    candidates=[6,12,20,28].map(g=>({x:a.x-box.width/2,y:upper?a.y-box.height-g:a.y+g}));
   }else{
    const end=curve.getPointAtLength(curve.getTotalLength()),otherEnd=other.getPointAtLength(other.getTotalLength()),start=curve.getPointAtLength(0),otherStart=other.getPointAtLength(0);
    if(Math.abs(end.x-otherEnd.x)>1e-6){const a=screen({x:end.x,y:85}),left=end.x<otherEnd.x;candidates=[6,12,20,28].map(g=>({x:left?a.x-box.width-g:a.x+g,y:a.y}));}
    else {const a=screen({x:X(25),y:start.y}),upper=start.y<otherStart.y;candidates=[6,12,20,28].map(g=>({x:a.x-box.width/2,y:upper?a.y-box.height-g:a.y+g}));}
   }
  }
  if(candidates)candidates=candidates.flatMap(c=>[0,-16,16,-32,32,-64,64].map(dx=>({...c,x:c.x+dx})));
  const intermediate=curve.getAttribute('stroke')==='#9333ea';
  if(intermediate){label.setAttribute('x',510);label.setAttribute('y',200+(label.textContent==='ADₐ'?0:28)*units());candidates=undefined;}
  labels.push({id,element:label,kind:intermediate?'point':'curve',candidates,role:'curve',anchorUser:anchor,nearSegmentUser:intermediate?undefined:near,maxDistancePx:intermediate?undefined:C.gaps.compactCurveProximityPx,leader:intermediate});
 }
 for(const label of drawing.querySelectorAll('.ad-point')){
  const x=+label.dataset.pointX,y=+label.dataset.pointY,old=label.textContent==='E₀';
  label.setAttribute('x',x+(old?-18:18));label.setAttribute('y',y-16);label.setAttribute('text-anchor',old?'end':'start');label.setAttribute('fill',old?colours.ink:'#4169e1');
  labels.push({id:'label-'+label.textContent,element:label,kind:'point',role:'main',anchorUser:{x,y},leader:true,candidates:(()=>{
   const matrix=svg.getScreenCTM(),own=new DOMPoint(x,y).matrixTransform(matrix),otherLabel=[...drawing.querySelectorAll('.ad-point')].find(e=>e!==label),other=otherLabel?new DOMPoint(+otherLabel.dataset.pointX,+otherLabel.dataset.pointY).matrixTransform(matrix):null,box=label.getBoundingClientRect(),result=[];
   for(let radius=16;radius<=160;radius+=8)for(let i=0;i<16;i++){const cx=own.x+radius*Math.cos(i*Math.PI/8),cy=own.y+radius*Math.sin(i*Math.PI/8);if(!other||Math.hypot(cx-own.x,cy-own.y)<Math.hypot(cx-other.x,cy-other.y)-.5)result.push({x:cx-box.width/2,y:cy-box.height/2});}return result;
  })()});
 }
 if(demandFamily.length)families.push({id:'ad',segments:demandFamily,referenceX:290});
 const fixed=[...drawing.querySelectorAll('text:not(.ad-bold):not(.ad-point),circle,[data-shift-arrow]')];
 P.layoutSvg(svg,{labels,fixedElements:fixed,segments,parallelFamilies:families});
 }
 function resetShocks(){$('spending').value=0;$('multiplier').value='50';$('capacity').value=0;}
 document.querySelector('.controls').addEventListener('input',e=>{if(e.target.id==='initial'||e.target.id==='policy')resetShocks();if(e.target.id==='policy'){$('import-costs').checked=false;$('ml-holds').checked=true;}if(e.target.id==='spending'&&+$('spending').value===0)$('capacity').value=0;render();});
 $('reset').onclick=()=>{$('initial').value='intermediate';$('policy').value='IR';resetShocks();$('long-run').checked=false;$('import-costs').checked=false;$('ml-holds').checked=true;$('tooltips').checked=true;$('show-shifts').checked=false;$('show-multiplier').checked=false;$('image-style').value='colour';$('export-status').textContent='';render();};
 window.EconPilot=Object.freeze({chrome:()=>{},refresh:()=>{},schedule:()=>{},legendEntries:()=>[],summaryText:()=>summary});
 window.EconWidgetPresentation=Object.freeze({refresh:render});window.MonetaryWidget=Object.freeze({state,render,calculate:()=>M.calculate(state())});window.addEventListener('resize',render);render();
})();
