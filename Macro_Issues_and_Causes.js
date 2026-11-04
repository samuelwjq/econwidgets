/* Preset case flow and AD–AS diagram. */
(()=>{'use strict';
 const M=EquilibriumModel,NS='http://www.w3.org/2000/svg',$=id=>document.getElementById(id),svg=$('diagram'),drawing=$('ad-drawing');
 const X=q=>100+380*q/120,Y=p=>430-380*p/200;
 const colours={ad:'#2563eb',as:'#16a34a',ink:'#374151',red:'#dc2626'};
 let summary='';
 const units=()=>600/(svg.getBoundingClientRect().width||600);
 function node(tag,attrs={},value,parent=drawing){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(value!==undefined)n.textContent=value;parent.append(n);return n;}
 function line(x1,y1,x2,y2,stroke=colours.ink,extra={}){return node('line',{x1,y1,x2,y2,stroke,'stroke-width':2,'vector-effect':'non-scaling-stroke',...extra});}
 function text(x,y,value,extra={}){return node('text',{x,y,fill:colours.ink,'font-size':14,'text-anchor':'middle',...extra},value);}
 function tip(n,message){n.dataset.tip=message;n.setAttribute('aria-label',message);n.setAttribute('tabindex','0');n.setAttribute('role','button');return n;}
 const dir=v=>Math.abs(v)<1e-6?'Unchanged':v>0?'↑':'↓';
 const categories = window.MacroIssuesCases;
 let categoryIndex = 0;
 const caseSelect = $('case-select'), initialSelect = $('initial-select'), slider = $('shift-size');
 const states = ['Spare Capacity', 'Near Capacity', 'At Capacity'];
 function selectedCase() {
  return categories[categoryIndex].cases[Number(caseSelect.value)];
 }
 function currentCase() {
  const selected = selectedCase();
  const preset = selected.equilibria.find(preset => preset.label === initialSelect.value);
  return {...selected, ...preset};
 }
 function updateCaseMenu() {
  caseSelect.replaceChildren(...categories[categoryIndex].cases.map((entry, i) => new Option(entry.title, i)));
  for (const [i, button] of [...$('categories').children].entries()) {
   button.setAttribute('aria-pressed', String(i === categoryIndex));
  }
 }
 function restart() {
  slider.value = 0;
  const entry = selectedCase();
  initialSelect.replaceChildren(...states.map(state => {
   const option = new Option(state,state);
   option.disabled = !entry.equilibria.some(preset => preset.label === state);
   return option;
  }));
  initialSelect.value = entry.equilibria.find(preset => preset.initial === entry.initial).label;
  render();
 }
 function demand(intercept,label,colour,old){const q0=Math.max(0,intercept-200),q1=Math.min(120,intercept);tip(line(X(q0),Y(intercept-q0),X(q1),Y(intercept-q1),colour,{'stroke-width':2.5,'data-curve':'','data-intercept':intercept,'clip-path':'url(#ad-plot-clip)'}),label+': planned expenditure on domestic output at each general price level.');const q=old?Math.min(q1-6,q0+20):q1-6;tip(text(X(q)-8,Y(intercept-q)-16*units(),label,{fill:colour,class:'ad-bold','text-anchor':'end'}),'Aggregate demand curve.');}
 function supply(full,level,label,colour,other){let d=`M${X(0)},${Y(level)} L${X(.6*full)},${Y(level)}`;for(let i=1;i<=100;i++){const p=M.supply(i/100,full,level);d+=` L${X(p.q)},${Y(p.p)}`;}d+=` L${X(full)},${Y(200)}`;tip(node('path',{d,fill:'none',stroke:colour,'stroke-width':2.5,'vector-effect':'non-scaling-stroke','data-curve':'','clip-path':'url(#ad-plot-clip)'}),label+': aggregate supply.');let lx=X(full)+12*units(),ly=85,anchor='start';if(other&&full!==other.full){const left=full<other.full;lx=X(full)+(left?-12:12)*units();anchor=left?'end':'start';}else if(other&&level!==other.level){lx=X(.24*full);ly=Y(level)+(level>other.level?-12:23)*units();anchor='middle';}tip(text(lx,ly,label,{fill:colour,class:'ad-bold','text-anchor':anchor}),'Aggregate supply curve.');}
 function coordinatePair(a,b,shifted){
  const equalP=Math.abs(a.p-b.p)<1e-6,equalQ=Math.abs(a.q-b.q)<1e-6;
  for(const k of ['p','q']){
   const equal=k==='p'?equalP:equalQ,axis=k==='p',v0=a[k],v1=b[k],pos=v=>axis?Y(v):X(v),near=Math.abs(pos(v0)-pos(v1))<42*units();
   const values=!shifted?[[v0,axis?'P₀':'Y₀',0]]:equal?[[v0,axis?'P₀=P₁':'Y₀=Y₁',0]]:[[v0,axis?'P₀':'Y₀',0],[v1,axis?'P₁':'Y₁',1]];
   values.forEach(([v,label,i])=>{
    const px=pos(v),sign=pos(v1)>pos(v0)?1:-1,shift=near&&!equal?(i?sign:-sign)*21*units():0;
    if(axis){const yy=px+shift;if(shift)line(100,px,88,yy,'#9ca3af',{'stroke-width':1});text(84,yy+4,label,{fill:'#000','text-anchor':'end','font-size':12});}
    else {const xx=px+shift;if(shift)line(px,430,xx,446,'#9ca3af',{'stroke-width':1});text(xx,459,label,{fill:'#000','font-size':12});}
   });
  }
 }
 function points(a,b,shifted) {
  const same = Math.hypot(a.q-b.q,a.p-b.p) < 1e-6;
  for (const point of !same ? [a,b] : [a]) {
   line(100,Y(point.p),X(point.q),Y(point.p),'#9ca3af',{'stroke-width':1,'stroke-dasharray':'4 4'});
   line(X(point.q),Y(point.p),X(point.q),430,'#9ca3af',{'stroke-width':1,'stroke-dasharray':'4 4'});
  }
  coordinatePair(a,b,shifted);
  const pairs = !shifted ? [[a,'E₀']] : same ? [[a,'E₀ = E₁']] : [[a,'E₀'],[b,'E₁']];
  for (const [point,label] of pairs) {
   const x=X(point.q),y=Y(point.p);
   node('circle',{cx:x,cy:y,r:3.5,fill:label==='E₁'?'#4169e1':colours.ink});
   tip(text(x,y-16*units(),label,{fill:'#000',class:'ad-point','font-size':14,'data-point-x':x,'data-point-y':y}),
    'An intersection of AD and AS: macroeconomic equilibrium.');
  }
 }
 function shiftArrow(a,b,kind) {
  line(X(a.q),Y(a.p),X(b.q),Y(b.p),colours.red,{'marker-end':'url(#ad-red-arrow)','data-shift-arrow':kind});
 }
 function outputGap(q,full) {
  const x0=X(q), x1=X(full), y=480;
  line(x0,y,x1,y,colours.ink,{'stroke-width':1});
  for (const x of [x0,x1]) line(x,y-4,x,y+4,colours.ink,{'stroke-width':1});
  text((x0+x1)/2,502,'Negative Output Gap',{'font-size':12});
 }
 function render() {
  window.WidgetInterface?.closeExplanation();
  EconDiagramPresentation.resetPresentation(svg);
  drawing.replaceChildren();
  const entry=currentCase();
  const amount = Number(slider.value);
  const scale = 0.014 * amount;
  const ad = (entry.shift.ad??0) * scale;
  const costs = (entry.shift.costs??0) * scale;
  const capacity = (entry.shift.capacity??0) * scale;
  const curve = entry.shift.ad && entry.shift.capacity ? 'AD + LRAS' :
    entry.shift.capacity ? 'LRAS' : entry.shift.costs ? 'SRAS' : 'AD';
  const decrease = entry.shift.costs > 0 || entry.shift.ad < 0 || entry.shift.capacity < 0;
  const direction = decrease ? 'Decrease' : 'Increase';
  $('shift-label').textContent = curve;
  $('shift-end').textContent = direction;
  slider.setAttribute('aria-label', 'Size of '+curve+' '+direction);
  slider.setAttribute('aria-valuetext',amount===0?'No Shift':amount===100?'Largest '+direction:amount+'% of slider range');
  const initial=entry.initial, final=initial+ad, full=M.base.full+capacity, level=M.base.level+costs;
  const a=M.equilibrium(initial,M.base.full,M.base.level), b=M.equilibrium(final,full,level);
  const asChanged=costs!==0||capacity!==0;

  line(100,430,490,430,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});
  line(100,430,100,40,colours.ink,{'marker-end':'url(#ad-axis-arrow)'});
  text(100,30,'GPL',{'font-size':12,class:'ew-axis-title'});
  text(490,448,'RNY',{'font-size':12,class:'ew-axis-title'});
  text(88,446,'0',{'font-size':12});
  if(ad) demand(initial,'AD₀','#93b4f2',true);
  demand(final,ad?'AD₁':'AD₀',colours.ad,false);
  if(asChanged) supply(M.base.full,M.base.level,'AS₀','#8fcea3',{full,level});
  supply(full,level,asChanged?'AS₁':'AS₀',colours.as,asChanged?M.base:null);
  if($('show-shifts').checked) {
   if(ad) {
    const p=Math.max(Math.max(initial,final)-108,Math.min(100,Math.min(initial,final)-18));
    shiftArrow({q:initial-p,p},{q:final-p,p},'ad');
   }
   if(asChanged) {
    const arrow=M.supplyShiftArrow(full,level);
    shiftArrow(arrow.a,arrow.b,'as');
   }
  }
  points(a,b,amount>0);
  if(entry.outputGap && full-b.q>1e-6) outputGap(b.q,full);
  styleLabels();

  const parts=[];
  const category = categories[categoryIndex].category;
  const priceChange = b.p-a.p, outputChange = b.q-a.q;
  const initialGap = Math.max(0,M.base.full-a.q), finalGap = Math.max(0,full-b.q);
  const gapWidens = finalGap-initialGap>1e-6;
  const observed = {
   'Actual Growth': outputChange>1e-6,
   'Potential Growth': capacity>1e-6,
   'Sustained Growth': outputChange>1e-6 && capacity>1e-6,
   'Negative Growth': outputChange < -1e-6,
   'Inflation': priceChange>1e-6,
   'Deflation': priceChange < -1e-6,
   'Unemployment': gapWidens
  }[category];
  if(ad) parts.push('AD '+dir(ad));
  if(costs) parts.push('SRAS '+dir(-costs));
  if(capacity) parts.push('LRAS '+dir(capacity));
  if(amount===0) parts.push('Initial Equilibrium','No Shift');
  else parts.push('GPL '+dir(priceChange),'RNY '+dir(outputChange));
  if(entry.outputGap && gapWidens) parts.push(initialGap<1e-6?'Negative Output Gap Opens':'Negative Output Gap Widens');
  parts.push((entry.target??category)+(observed?' Observed':' Not Observed'));
  summary=parts.join(' · ');
  if ($('ad-summary').textContent!==summary) $('ad-summary').textContent=summary;
  $('diagram-desc').textContent=categories[categoryIndex].category+' · '+entry.title+'. '+summary;
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
   near={x1:+curve.getAttribute('x1'),y1:+curve.getAttribute('y1'),x2:+curve.getAttribute('x2'),y2:+curve.getAttribute('y2')};anchor={x:near.x2,y:near.y2};demandFamily.push({...near,id});
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
  const siblings=curveNodes.filter(c=>c.tagName===curve.tagName);
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
  labels.push({id,element:label,kind:'curve',candidates,role:'curve',anchorUser:anchor,nearSegmentUser:near,maxDistancePx:svg.getBoundingClientRect().width<C.gaps.compactCurveWidthPx?C.gaps.compactCurveProximityPx:C.gaps.curveProximityPx,leader:false});
 }
 for(const label of drawing.querySelectorAll('.ad-point')){
  const x=+label.dataset.pointX,y=+label.dataset.pointY,old=label.textContent==='E₀';
  label.setAttribute('x',x+(old?-18:18));label.setAttribute('y',y-16);label.setAttribute('text-anchor',old?'end':'start');label.setAttribute('fill','#000000');
  labels.push({id:'label-'+label.textContent,element:label,kind:'point',role:'main',anchorUser:{x,y},leader:true,candidates:(()=>{
   const matrix=svg.getScreenCTM(),own=new DOMPoint(x,y).matrixTransform(matrix),otherLabel=[...drawing.querySelectorAll('.ad-point')].find(e=>e!==label),other=otherLabel?new DOMPoint(+otherLabel.dataset.pointX,+otherLabel.dataset.pointY).matrixTransform(matrix):null,box=label.getBoundingClientRect(),result=[];
   for(let radius=16;radius<=160;radius+=8)for(let i=0;i<16;i++){const cx=own.x+radius*Math.cos(i*Math.PI/8),cy=own.y+radius*Math.sin(i*Math.PI/8);if(!other||Math.hypot(cx-own.x,cy-own.y)<Math.hypot(cx-other.x,cy-other.y)-.5)result.push({x:cx-box.width/2,y:cy-box.height/2});}return result;
  })()});
 }
 if(demandFamily.length)families.push({id:'ad',segments:demandFamily,referenceX:290});
 const fixed=[...drawing.querySelectorAll('text:not(.ad-bold):not(.ad-point),circle,[data-shift-arrow]')];
 P.layoutSvg(svg,{labels,fixedElements:fixed,segments,parallelFamilies:families});
 }
 for (const [i, group] of categories.entries()) {
  const button=document.createElement('button');
  button.type='button';
  button.textContent=group.category;
  button.addEventListener('click',()=>{
   if(categoryIndex===i) return;
   categoryIndex=i;
   updateCaseMenu();
   restart();
  });
  $('categories').append(button);
 }
 caseSelect.addEventListener('change',restart);
 initialSelect.addEventListener('change',render);
 slider.addEventListener('input',render);
 for(const id of ['show-shifts','tooltips']) $(id).addEventListener('change',render);
 $('reset').onclick=()=>{
  categoryIndex=0;
  updateCaseMenu();
  $('tooltips').checked=true;
  $('show-shifts').checked=false;
  $('image-style').value='colour';
  $('export-status').textContent='';
  restart();
 };
 window.EconPilot=Object.freeze({chrome:()=>{},refresh:()=>{},schedule:()=>{},legendEntries:()=>[],summaryText:()=>summary});
 window.EconWidgetPresentation=Object.freeze({refresh:render});
 window.addEventListener('resize',render);
 updateCaseMenu();
 restart();
})();
