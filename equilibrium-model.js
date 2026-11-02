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
  const initial={horizontal:60,intermediate:109,vertical:170}[s.initial];
  const autonomous=s.ad==='none'?0:(s.ad==='increase'?1:-1)*26*s.spending/100;
  const shift=autonomous*s.multiplier/100;
  const full=base.full+(['lras','both'].includes(s.as)?16*s.lras/100:0);
  const level=base.level-(['sras','both'].includes(s.as)?10*s.sras/100:0);
  return {initial,final:initial+shift,autonomous,shift,full,level,a:equilibrium(initial,85,20),b:equilibrium(initial+shift,full,level)};
 }
 const api=Object.freeze({supply,equilibrium,calculate});root.EquilibriumModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
