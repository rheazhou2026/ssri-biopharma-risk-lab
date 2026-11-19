/* Published final regression coefficients: Zhou, IEEE ICDMW 2025, Eq. (5).
   Every numeric feature is expected to be in normalized illustrative 0..1 space.
   Since source training-set normalization parameters are unavailable, this function
   should NOT be interpreted as a calibrated/replicated production model. */
(function(root){
'use strict';
const clamp=x=>Math.max(0,Math.min(1,Number(x)||0));
function subindices(p){
  const d=clamp(p.duration),u=p.unilateral?1:0,s=clamp(p.fit);
  const t=clamp(p.prior),c=clamp(p.concurrent),v=p.vc?1:0;
  return {dependency:(.16*d+.071*u+.065*s)/(.16+.071+.065),buffer:(.159*t+.058*c+.020*v)/(.159+.058+.020)};
}
function evaluate(p,overrides={}){
 const {dependency:computedDependency,buffer:computedBuffer}=subindices(p);
 const dependency=overrides.dependency===undefined?computedDependency:clamp(overrides.dependency);
 const buffer=overrides.buffer===undefined?computedBuffer:clamp(overrides.buffer);
 const duration=overrides.duration===undefined?clamp(p.duration):clamp(overrides.duration);
 const deal=clamp(p.deal), prior=clamp(p.prior), concurrent=clamp(p.concurrent), phase=clamp(p.phase), unilateral=p.unilateral?1:0;
 const terms=[
 ['Intercept',.320],['Duration',1.750*duration],['Duration²',1.082*duration*duration],['Duration × dependency',-3.356*duration*dependency],['Dependency',.289*dependency],['Dependency × buffer',1.196*dependency*buffer],['Deal size',.069*deal],['Deal size × prior terminations',.009*deal*prior],['Prior terminations',-.813*prior],['Concurrent alliances',-.403*concurrent],['Buffer',.073*buffer],['Clinical phase',-.070*phase],['Unilateral exit right',.209*unilateral],['Phase × unilateral right',.021*phase*unilateral]
 ];
 return {score:terms.reduce((a,b)=>a+b[1],0),dependency,buffer,terms};
}
if (root.exports !== undefined) root.exports={evaluate,subindices,clamp}; else root.SSRIModel={evaluate,subindices,clamp};
})(typeof module!=='undefined'&&module.exports?module:window);
