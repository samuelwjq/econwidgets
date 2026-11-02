/* Illustrative relationships; no multiplier, calibration or numerical forecast. */
(function(root){
 'use strict';
 const components=Object.freeze({C:'Consumption',I:'Investment',G:'Government expenditure',X:'Exports',M:'Imports'});
 function shock(component,amount){return component==='M'?-amount:amount;}
 function supply(t,full,steepness){return {q:.6*full+.4*full*(2*t-t*t),p:20+50*Math.pow(t,steepness)};}
 function equilibrium(intercept,full,steepness){
  if(intercept-20<=.6*full)return {q:intercept-20,p:20,section:'horizontal'};
  if(intercept-full>=70)return {q:full,p:intercept-full,section:'vertical'};
  let lo=0,hi=1;for(let i=0;i<64;i++){const mid=(lo+hi)/2,s=supply(mid,full,steepness);if(intercept-s.q>s.p)lo=mid;else hi=mid;}
  return {...supply((lo+hi)/2,full,steepness),section:'upward-sloping'};
 }
 const api=Object.freeze({components,shock,supply,equilibrium,baseIntercept:110});
 root.AggregateDemandModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
