/* Qualitative teaching geometry. Internal coordinates are not economic units. */
(function(root){'use strict';
 const base={full:85,level:20};
 function supply(t,full,level){return {q:.6*full+.4*full*(2*t-t*t),p:level+(70-level)*t*t};}
 function equilibrium(intercept,full,level){
  if(intercept-level<=.6*full)return {q:intercept-level,p:level,section:'Horizontal'};
  if(intercept-full>=70)return {q:full,p:intercept-full,section:'Vertical'};
  let lo=0,hi=1;for(let i=0;i<64;i++){const t=(lo+hi)/2,a=supply(t,full,level);if(intercept-a.q>a.p)lo=t;else hi=t;}
  return {...supply((lo+hi)/2,full,level),section:'Intermediate'};
 }
 function calculate(s){
  const initial={horizontal:70,intermediate:109,vertical:170}[s.initial];
  const stance=Math.sign(s.change)*(s.instrument==='T'?-1:1);
  const initialC=s.instrument==='T'?-24*s.change/100*.45:0;
  const initialI=s.instrument==='T'?-24*s.change/100*.15:0;
  const autonomous=s.instrument==='T'?initialC+initialI:24*s.change/100;
  let shift=autonomous*(1+s.multiplier/100);
  const full=base.full+(['lras','both'].includes(s.as)?30*(stance>0?Math.max(0,s.lras):stance<0?Math.min(0,s.lras):0)/100:0);
  const level=base.level-(['sras','both'].includes(s.as)?18*s.sras/100:0);
  // Spending and supply are independent; the permitted ranges stay on plot.
  return {initial,final:initial+shift,autonomous,initialC,initialI,shift,full,level,a:equilibrium(initial,85,20),b:equilibrium(initial+shift,full,level)};
 }
 // Capacity changes are illustrated between the vertical sections near the top.
 // Only a pure cost change uses the separated horizontal sections.
 function supplyShiftArrow(full,level){
  if(full===85)return {a:{q:30,p:20},b:{q:30,p:level}};
  return {a:{q:85,p:150},b:{q:full,p:150}};
 }
 const api=Object.freeze({supply,equilibrium,calculate,supplyShiftArrow});root.FiscalModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
