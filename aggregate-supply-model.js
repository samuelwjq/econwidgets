/* Illustrative relationships; no multiplier, calibration or numerical forecast. */
(function(root){
 'use strict';
 const components=Object.freeze({C:'Consumption',I:'Investment',G:'Government expenditure',X:'Exports',M:'Imports'});
 function shock(component,amount){return component==='M'?-amount:amount;}
 function supply(t,full,steepness){return {q:.6*full+.4*full*(2*t-t*t),p:steepness+(70-steepness)*t*t};}
 function equilibrium(intercept,full,steepness){
  if(intercept-steepness<=.6*full)return {q:intercept-steepness,p:steepness,section:'horizontal'};
  if(intercept-full>=70)return {q:full,p:intercept-full,section:'vertical'};
  let lo=0,hi=1;for(let i=0;i<64;i++){const mid=(lo+hi)/2,s=supply(mid,full,steepness);if(intercept-s.q>s.p)lo=mid;else hi=mid;}
  return {...supply((lo+hi)/2,full,steepness),section:'upward-sloping'};
 }
 function parameters(factor,amount){let full=85,level=20;
 if(['labour','raw'].includes(factor))level+=amount*.4;
 if(factor==='exchange')level-=amount*.4;
 if(['resources','productivity'].includes(factor))full+=amount*.7;
 if(factor==='productivity')level-=amount*.3;
 return {full,level};}
 function position(u){u=Math.max(0,Math.min(1,u));if(u<=1/3)return {q:51*u*3,p:20};if(u<=2/3)return supply((u-1/3)*3,85,20);return {q:85,p:70+(u-2/3)*150};}
 const api=Object.freeze({parameters,position,components,shock,supply,equilibrium,baseIntercept:110});
 root.AggregateSupplyModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
