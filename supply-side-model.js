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
 function calculate({initial, policy, impact}) {
  const intercept = {horizontal:80, intermediate:109, vertical:170}[initial];
  const strength = impact / 100;
  const full = base.full + (policy === 'price-controls' ? 0 : 30 * strength);
  const level = base.level - 18 * strength;
  return {
   intercept, full, level,
   a: equilibrium(intercept, base.full, base.level),
   b: equilibrium(intercept, full, level)
  };
 }
 const api=Object.freeze({base,supply,equilibrium,calculate});root.SupplySideModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
