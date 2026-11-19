'use strict';
const {evaluate,clamp}=SSRIModel;
const config=[
 ['duration','Alliance duration','Relative duration', 'Longer alliance history'],
 ['deal','Deal size','Relative upfront commitment','Normalized to a hypothetical deal range'],
 ['prior','Prior terminations','Relative historical count','Previous alliance discontinuations'],
 ['concurrent','Concurrent alliances','Relative partnership count','Other active collaborations'],
 ['phase','Clinical development phase','Preclinical → Phase III','0 = preclinical, 1 = Phase III'],
 ['fit','Strategic fit / mismatch','High fit → Low fit','Paper coding: higher means weaker fit']
];
const presets={
 balanced:{duration:.43,deal:.46,prior:.22,concurrent:.55,phase:.48,fit:.28,unilateral:false,vc:true},
 dependent:{duration:.92,deal:.70,prior:.10,concurrent:.12,phase:.70,fit:.72,unilateral:false,vc:false},
 exposed:{duration:.77,deal:.86,prior:.04,concurrent:.06,phase:.82,fit:.92,unilateral:true,vc:false},
 buffered:{duration:.57,deal:.38,prior:.66,concurrent:.89,phase:.52,fit:.15,unilateral:false,vc:true}
};
let state={...presets.balanced};
const $=id=>document.getElementById(id);
const sliders=$('sliders');
for(const [key,title,scale,hint] of config){const item=document.createElement('div');item.className='control';item.innerHTML=`<div class="ctrlhead"><label for="${key}">${title}</label><output id="out-${key}">0.00</output></div><input id="${key}" type="range" min="0" max="1" step="0.01" aria-label="${title}"><small>${scale} · ${hint}</small>`;sliders.append(item);$(key).addEventListener('input',()=>{state[key]=Number($(key).value);$('preset').value='custom';render()})}
for(const key of ['unilateral','vc'])$(key).addEventListener('change',()=>{state[key]=$(key).checked;$('preset').value='custom';render()});
$('preset').addEventListener('change',()=>{const k=$('preset').value;if(presets[k]){state={...presets[k]};render()}});
$('reset').addEventListener('click',()=>{state={...presets.balanced};$('preset').value='balanced';render()});
function format(n){return n.toFixed(3)};
function drawGauge(score){const can=$('gauge'),ctx=can.getContext('2d'),w=can.width,h=can.height;ctx.clearRect(0,0,w,h);const cx=w/2,cy=142,r=98;const stroke=(from,to,color,width)=>{ctx.beginPath();ctx.arc(cx,cy,r,from,to);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()};stroke(Math.PI,2*Math.PI,'#1d3947',18);stroke(Math.PI,Math.PI+Math.PI*clamp(score),'#6fe1c2',18);const theta=Math.PI+Math.PI*clamp(score);ctx.beginPath();ctx.arc(cx+r*Math.cos(theta),cy+r*Math.sin(theta),6,0,Math.PI*2);ctx.fillStyle='#effbf5';ctx.fill();ctx.fillStyle='#8eabb9';ctx.textAlign='center';ctx.font='13px DM Sans, sans-serif';ctx.fillText('INDICATIVE POSITION',cx,165)}
function drawContrib(terms){const max=Math.max(...terms.map(x=>Math.abs(x[1])),.01);$('contributions').innerHTML=terms.map(([name,v])=>`<div class="contrib"><span>${name}</span><div class="barline"><div class="${v<0?'barneg':'barpos'}" style="width:${(Math.abs(v)/max*49).toFixed(2)}%"></div></div><span>${v>=0?'+':''}${v.toFixed(3)}</span></div>`).join('')}
function heatmap(){const c=$('heatmap'),ctx=c.getContext('2d'),W=c.width,H=c.height;ctx.clearRect(0,0,W,H);const L=65,R=25,T=20,B=56,n=40,ww=W-L-R,hh=H-T-B;let cells=[],min=Infinity,max=-Infinity;for(let y=0;y<n;y++)for(let x=0;x<n;x++){const v=evaluate(state,{duration:(x+.5)/n,dependency:1-(y+.5)/n}).score;cells.push({x,y,v});min=Math.min(min,v);max=Math.max(max,v)}for(const q of cells){const norm=(q.v-min)/(max-min||1);let hue=205-165*norm;ctx.fillStyle=`hsl(${hue} 52% ${28+35*norm}%)`;ctx.fillRect(L+q.x*ww/n,T+q.y*hh/n,ww/n+.6,hh/n+.6)}ctx.strokeStyle='#6c8a96';ctx.lineWidth=1;ctx.strokeRect(L,T,ww,hh);ctx.fillStyle='#bad0d3';ctx.font='12px DM Sans, sans-serif';ctx.textAlign='center';for(let i=0;i<=4;i++){const xx=L+i*ww/4;ctx.fillText((i/4).toFixed(2),xx,H-33);ctx.fillText((1-i/4).toFixed(2),L-30,T+i*hh/4+4)}ctx.fillText('NORMALIZED ALLIANCE DURATION →',L+ww/2,H-10);ctx.save();ctx.translate(16,T+hh/2);ctx.rotate(-Math.PI/2);ctx.fillText('DEPENDENCY →',0,0);ctx.restore();ctx.textAlign='right';ctx.fillStyle='#e1f4ef';ctx.fillText(`Max ${max.toFixed(2)}`,W-27,35);ctx.fillText(`Min ${min.toFixed(2)}`,W-27,H-38)}
function compare(){const variants=[['Current profile',{...state}],['No unilateral exit',{...state,unilateral:false}],['With unilateral exit',{...state,unilateral:true}],['More diversified supply',{...state,concurrent:Math.min(1,state.concurrent+.3)}],['Lower strategic mismatch',{...state,fit:Math.max(0,state.fit-.3)}]];const results=variants.map(([name,p])=>({name,value:evaluate(p).score})),min=Math.min(0,...results.map(x=>x.value)),max=Math.max(.01,...results.map(x=>x.value)),spread=max-min||1;$('compare').innerHTML=results.map(x=>`<div class="comparisonrow"><div class="comparisonlabel"><span>${x.name}</span><b>${format(x.value)}</b></div><div class="comparisonbar"><div style="width:${(100*(x.value-min)/spread).toFixed(2)}%"></div></div></div>`).join('')}
function render(){for(const [key] of config){$(key).value=state[key];$('out-'+key).value=Number(state[key]).toFixed(2)}for(const key of ['unilateral','vc'])$(key).checked=state[key];const o=evaluate(state);$('score').textContent=format(o.score);$('dep').textContent=format(o.dependency);$('buf').textContent=format(o.buffer);$('exit').textContent=state.unilateral?'Yes':'No';$('riskLabel').textContent='ILLUSTRATIVE MODEL OUTPUT';drawGauge(o.score);drawContrib(o.terms);heatmap();compare()}
$('csv').addEventListener('click',()=>{const result=evaluate(state);let rows=[['field','value'],...Object.entries(state).map(([k,v])=>[k,v]),['dependency',result.dependency],['buffer',result.buffer],['raw_ssri',result.score],...result.terms.map(([k,v])=>['term_'+k,v])];const csv=rows.map(r=>r.map(x=>'"'+String(x).replaceAll('"','""')+'"').join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='ssri-scenario.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
render();
