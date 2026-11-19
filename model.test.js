const assert=require('node:assert/strict');
const {test}=require('node:test');
const {evaluate,subindices}=require('../model.js');
const zero={duration:0,deal:0,prior:0,concurrent:0,phase:0,fit:0,unilateral:false,vc:false};
test('zero inputs return regression intercept',()=>assert.equal(evaluate(zero).score,.320));
test('sub-indices span 0 to 1 for all maximum features',()=>{const p={duration:1,deal:1,prior:1,concurrent:1,phase:1,fit:1,unilateral:true,vc:true};const indices=subindices(p);assert.ok(Math.abs(indices.dependency-1)<1e-10);assert.ok(Math.abs(indices.buffer-1)<1e-10)});
test('scores sum all final coefficient contributions',()=>{const p={duration:.55,deal:.2,prior:.1,concurrent:.3,phase:.4,fit:.5,unilateral:true,vc:false};const result=evaluate(p);assert.ok(Math.abs(result.terms.reduce((sum,x)=>sum+x[1],0)-result.score)<1e-12)});
test('counterfactual dependency override keeps base state intact',()=>{const p={...zero,duration:.7};const base=evaluate(p),override=evaluate(p,{dependency:1});assert.notEqual(base.score,override.score);assert.equal(evaluate(p).score,base.score)});
test('unilateral exit right affects regression terms and dependency index',()=>{const a=evaluate({...zero,unilateral:false}),b=evaluate({...zero,unilateral:true});assert.ok(b.score>a.score)});
