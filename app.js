const bank=[{"w": "ကၠ", "s": "Ja"}, {"w": "ကြ", "s": "Kra"}, {"w": "ကျ", "s": "Kla"}, {"w": "ကွ", "s": "Kwa"}, {"w": "ခၠ", "s": "Cha"}, {"w": "ခြ", "s": "Khra"}, {"w": "ချ", "s": "Khla"}, {"w": "ခွ", "s": "Khwa"}, {"w": "ဃြ", "s": "Khra"}, {"w": "ဃွ", "s": "Khwa"}, {"w": "ဆှ", "s": "Chga"}, {"w": "တြ", "s": "Tra"}, {"w": "တွ", "s": "Twa"}, {"w": "ထြ", "s": "Tra"}, {"w": "ထွ", "s": "Twa"}, {"w": "ထှ", "s": "Tga"}, {"w": "ဒြ", "s": "Dra"}, {"w": "ဒွ", "s": "Dwa"}, {"w": "ပၠ", "s": "Pya"}, {"w": "ပြ", "s": "Pra"}, {"w": "ပျ", "s": "Pla"}, {"w": "ပွ", "s": "Pwa"}, {"w": "ပှ", "s": "Pga"}, {"w": "ဖၠ", "s": "Pya"}, {"w": "ဖြ", "s": "Pra"}, {"w": "ဖျ", "s": "Pla"}, {"w": "ဖွ", "s": "Pwa"}, {"w": "ဖှ", "s": "Pga"}, {"w": "ဘၠ", "s": "Bya"}, {"w": "ဘြ", "s": "Bra"}, {"w": "ဘျ", "s": "Bla"}, {"w": "ဘွ", "s": "Bwa"}, {"w": "ဘှ", "s": "Bga"}, {"w": "မၠ", "s": "Mya"}, {"w": "မြ", "s": "Mra"}, {"w": "မျ", "s": "Mla"}, {"w": "မွ", "s": "Mwa"}, {"w": "မှ", "s": "Mga"}, {"w": "ယွ", "s": "Ywa"}, {"w": "လွ", "s": "Lwa"}, {"w": "သြ", "s": "Thra"}, {"w": "သျ", "s": "Thla"}, {"w": "သွ", "s": "Thwa"}, {"w": "ဟွ", "s": "Hwa"}];
let qs=[],i=0,selected=null,correct=0;
function shuffle(a){a=[...a];for(let j=a.length-1;j>0;j--){const k=Math.floor(Math.random()*(j+1));[a[j],a[k]]=[a[k],a[j]]}return a}
function makeQ(x,idx){
  if(idx<4){
    const pool=[...new Set(bank.map(z=>z.s).filter(s=>s!==x.s))];
    const opts=shuffle([x.s,...shuffle(pool).slice(0,3)]);
    return {type:'writtenToSound',prompt:x.w,opts,answer:x.s};
  } else {
    const pool=bank.map(z=>z.w).filter(w=>w!==x.w);
    const opts=shuffle([x.w,...shuffle(pool).slice(0,3)]);
    return {type:'soundToWritten',prompt:x.s,opts,answer:x.w};
  }
}
function render(){
 const q=qs[i];selected=null;document.getElementById('count').textContent=(i+1)+' of '+qs.length;
 document.getElementById('prompt').textContent=q.prompt;
 const wrap=document.getElementById('choices');wrap.innerHTML='';
 q.opts.forEach(o=>{const b=document.createElement('button');b.className='choice';b.textContent=o;b.onclick=()=>{[...wrap.children].forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected=o;document.getElementById('next').disabled=false};wrap.appendChild(b)});
 document.getElementById('next').disabled=true;
}
document.getElementById('start').onclick=()=>{qs=shuffle(bank).slice(0,10).map(makeQ);document.getElementById('setup').classList.add('hidden');document.getElementById('test').classList.remove('hidden');render()};
document.getElementById('next').onclick=()=>{if(selected===qs[i].answer)correct++;i++;if(i>=qs.length){document.getElementById('test').classList.add('hidden');document.getElementById('result').classList.remove('hidden');document.getElementById('score').textContent=correct+' / '+qs.length+' ('+Math.round(correct/qs.length*100)+'%)'}else render()};
