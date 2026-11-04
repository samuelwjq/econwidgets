/* Qualitative teaching geometry. Internal coordinates are not economic units. */
(function(root){'use strict';
 const base=Object.freeze({full:85,level:30});
 function supply(t,full,level){return {q:.6*full+.4*full*(2*t-t*t),p:level+(70-level)*t*t};}
 function equilibrium(intercept,full,level){
  if(intercept-level<=.6*full)return {q:intercept-level,p:level,section:'Horizontal'};
  if(intercept-full>=70)return {q:full,p:intercept-full,section:'Vertical'};
  let lo=0,hi=1;for(let i=0;i<64;i++){const t=(lo+hi)/2,a=supply(t,full,level);if(intercept-a.q>a.p)lo=t;else hi=t;}
  return {...supply((lo+hi)/2,full,level),section:'Intermediate'};
 }
 // Capacity changes are illustrated between the vertical sections near the top.
 // Only a pure cost change uses the separated horizontal sections.
 function supplyShiftArrow(full,level){
  if(full===base.full)return {a:{q:30,p:base.level},b:{q:30,p:level}};
  return {a:{q:base.full,p:150},b:{q:full,p:150}};
 }
 const api=Object.freeze({base,supply,equilibrium,supplyShiftArrow});root.EquilibriumModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
