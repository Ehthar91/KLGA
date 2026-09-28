const consonants=[
{l:'က',s:'Ka'},{l:'ခ',s:'Ka'},{l:'ဂ',s:'Ga'},{l:'ဃ',s:'Kha'},{l:'င',s:'Ngah'},{l:'စ',s:'Sa'},{l:'ဆ',s:'Cha'},{l:'ရှ',s:'Sha'},{l:'ည',s:'Nya'},{l:'တ',s:'Ta'},{l:'ထ',s:'Ta'},{l:'ဒ',s:'Da'},{l:'န',s:'Na'},{l:'ပ',s:'Pa'},{l:'ဖ',s:'Pa'},{l:'ဘ',s:'Ba'},{l:'မ',s:'Ma'},{l:'ယ',s:'Ya'},{l:'ရ',s:'Ra'},{l:'လ',s:'La'},{l:'ဝ',s:'Wa'},{l:'သ',s:'Tha'},{l:'ဟ',s:'Ha'},{l:'အ',s:'Ah'},{l:'ဧ',s:'Ahh'}
];
const vowels=[{v:'ါ',s:'Ah'},{v:'ံ',s:'Ee'},{v:'ၢ',s:'Uh'},{v:'ု',s:'Eu'},{v:'ူ',s:'Oo'},{v:'့',s:'Ay/Ae'},{v:'ဲ',s:'Eh'},{v:'ိ',s:'Oe'},{v:'ီ',s:'Aw'}];
const blends=[{m:'ၠ',s:'Ya',suffix:'y'},{m:'ြ',s:'Ra',suffix:'r'},{m:'ျ',s:'La',suffix:'l'},{m:'ွ',s:'Wa',suffix:'w'},{m:'ှ',s:'Ga',suffix:'g'}];
const tones=[{m:'ၢ်',n:'Uh Thee'},{m:'ာ်',n:'Ah Thee'},{m:'ၣ်',n:'Ha Thee'},{m:'း',n:'Pluh See'},{m:'ၤ',n:'Kay Poe'}];

const views={home:homeView,setup:studentSetupView,test:testView,result:resultView,teacher:teacherView};let state={};
function fresh(){return{studentName:'',grade:'',window:'',questions:[],i:0,selected:null,responses:[]}}state=fresh();
function showView(n){Object.values(views).forEach(v=>v.classList.add('hidden'));views[n].classList.remove('hidden')}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pct(rows){return rows.length?Math.round(rows.filter(r=>r.correct).length/rows.length*100):0}
function wrong(arr,ans,n=3){return shuffle(arr.filter(x=>x!==ans)).slice(0,n)}

function stemFromSound(s){
 if(s==='Ahh') return 'Ahh';
 if(s.endsWith('ah')) return s.slice(0,-2);
 if(s.endsWith('a')) return s.slice(0,-1);
 return s;
}

function blendPronunciation(c,b){
 const written=c.l+b.m;
 const exceptions={
   'ကၠ':'Ja',
   'ခၠ':'Cha',
   'ကြ':'Kra'
 };
 if(exceptions[written]) return exceptions[written];

 let stem=stemFromSound(c.s);

 if(c.l==='အ'){
   return {'ၠ':'Aya','ြ':'Ara','ျ':'Ala','ွ':'Awa','ှ':'Aga'}[b.m];
 }
 if(c.l==='ဧ'){
   return {'ၠ':'Ahhya','ြ':'Ahhra','ျ':'Ahhla','ွ':'Ahhwa','ှ':'Ahhga'}[b.m];
 }

 const cluster={'ၠ':'y','ြ':'r','ျ':'l','ွ':'w','ှ':'g'}[b.m];
 return stem+cluster+'a';
}

const cvBank=[];consonants.forEach(c=>vowels.forEach(v=>cvBank.push({w:c.l+v.v,s:(()=>{let stem=stemFromSound(c.s);if(c.l==='အ')return{'Ah':'Ah','Ee':'Ee','Uh':'Uh','Eu':'Eu','Oo':'Oo','Ay/Ae':'Ay','Eh':'Eh','Oe':'Oe','Aw':'Aw'}[v.s];if(c.l==='ဧ')return{'Ah':'Ahh','Ee':'Eeh','Uh':'Uhh','Eu':'Euh','Oo':'Ooh','Ay/Ae':'Ayy','Eh':'Ehh','Oe':'Oeh','Aw':'Aww'}[v.s];return{'Ah':stem+'ah','Ee':stem+'ee','Uh':stem+'uh','Eu':stem+'eu','Oo':stem+'oo','Ay/Ae':stem+'ay','Eh':stem+'eh','Oe':stem+'oe','Aw':stem+'aw'}[v.s]})(),c,v})));
const blendBank=[
{w:"ကၠ",s:"Ja"},
{w:"ကြ",s:"Kra"},
{w:"ကျ",s:"Kla"},
{w:"ကွ",s:"Kwa"},
{w:"ခၠ",s:"Cha"},
{w:"ခြ",s:"Khra"},
{w:"ချ",s:"Khla"},
{w:"ခွ",s:"Khwa"},
{w:"ဃြ",s:"Khra"},
{w:"ဃွ",s:"Khwa"},
{w:"ဆှ",s:"Chga"},
{w:"တြ",s:"Tra"},
{w:"တွ",s:"Twa"},
{w:"ထြ",s:"Tra"},
{w:"ထွ",s:"Twa"},
{w:"ထှ",s:"Tga"},
{w:"ဒြ",s:"Dra"},
{w:"ဒွ",s:"Dwa"},
{w:"ပၠ",s:"Pya"},
{w:"ပြ",s:"Pra"},
{w:"ပျ",s:"Pla"},
{w:"ပွ",s:"Pwa"},
{w:"ပှ",s:"Pga"},
{w:"ဖၠ",s:"Pya"},
{w:"ဖြ",s:"Pra"},
{w:"ဖျ",s:"Pla"},
{w:"ဖွ",s:"Pwa"},
{w:"ဖှ",s:"Pga"},
{w:"ဘၠ",s:"Bya"},
{w:"ဘြ",s:"Bra"},
{w:"ဘျ",s:"Bla"},
{w:"ဘွ",s:"Bwa"},
{w:"ဘှ",s:"Bga"},
{w:"မၠ",s:"Mya"},
{w:"မြ",s:"Mra"},
{w:"မျ",s:"Mla"},
{w:"မွ",s:"Mwa"},
{w:"မှ",s:"Mga"},
{w:"ယွ",s:"Ywa"},
{w:"လွ",s:"Lwa"},
{w:"သြ",s:"Thra"},
{w:"သျ",s:"Thla"},
{w:"သွ",s:"Thwa"},
{w:"ဟွ",s:"Hwa"}
];
const k8WrittenBank=["ကျိ", "ကျီ", "ကျဲ", "ကျ့", "ကြီ", "ကၠါ", "ကၠိ", "ကၠံ", "ကၠၢ", "ချံ", "ချ့", "ခြါ", "ခွံ", "ခၠီ", "ဆှီ", "ဆှု", "ဆှဲ", "တြီ", "ထွဲ", "ပျီ", "ပျဲ", "ပြါ", "ပြိ", "ပြု", "ပြံ", "ပၠါ", "ဖျိ", "ဖျီ", "ဖျ့", "ဖှီ", "ဖှံ", "ဖၠါ", "ဘှီ", "ဘှဲ", "ဘှ့", "ဘှၢ", "ဘၠူ", "မှဲ", "မှံ", "မၠီ"];



function splitK8Written(w){
 const vowelSymbols=vowels.map(v=>v.v).sort((a,b)=>b.length-a.length);
 for(const v of vowelSymbols){
   if(w.endsWith(v)){
     return {blend:w.slice(0,-v.length), vowel:v};
   }
 }
 return null;
}

function k8SoundFromWritten(w){
 const parts=splitK8Written(w);
 if(!parts) return '';
 const blend=blendBank.find(x=>x.w===parts.blend);
 const vowel=vowels.find(x=>x.v===parts.vowel);
 if(!blend || !vowel) return '';

 let stem=blend.s;
 if(stem.endsWith('ah')) stem=stem.slice(0,-2);
 else if(stem.endsWith('a')) stem=stem.slice(0,-1);

 const endings={
   'Ah':'ah','Ee':'ee','Uh':'uh','Eu':'eu','Oo':'oo',
   'Ay/Ae':'ay','Eh':'eh','Oe':'oe','Aw':'aw'
 };
 return stem + endings[vowel.s];
}

const k8Bank=k8WrittenBank.map(w=>({w:w,s:k8SoundFromWritten(w)})).filter(x=>x.s);

function q(skill,domain,type,instruction,prompt,choices,correct,promptClass='',choiceClass=''){
 return{skill,domain,type,instruction,prompt,choices,answer:choices.indexOf(correct),promptClass,choiceClass}
}
function makeK1(){return shuffle(consonants).slice(0,4).map(x=>{const ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);return q('K1','Alphabet Recognition','recognition','Select the matching letter.',x.l,ch,x.l,'karen-large','karen')})}
function makeK2(){return shuffle(consonants).slice(0,4).map((x,i)=>{if(i<2){const ss=[...new Set(consonants.map(z=>z.s))],ch=shuffle([x.s,...wrong(ss,x.s)]);return q('K2','Letter Sounds','letterToSound','What sound does this letter make?',x.l,ch,x.s,'karen-large','')}const ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);return q('K2','Letter Sounds','soundToLetter','Which letter makes this sound?',x.s,ch,x.l,'','karen')})}
function makeK3(){return shuffle(vowels).slice(0,4).map((x,i)=>{if(i<2){const ch=shuffle([x.s,...wrong(vowels.map(z=>z.s),x.s)]);return q('K3','Vowel Recognition','vowelToSound','What sound does this vowel make?',x.v,ch,x.s,'karen-large','')}const ch=shuffle([x.v,...wrong(vowels.map(z=>z.v),x.v)]);return q('K3','Vowel Recognition','soundToVowel','Which vowel makes this sound?',x.s,ch,x.v,'','karen')})}
function makeK4(){return shuffle(cvBank).slice(0,6).map((x,i)=>{if(i<3){const pool=[...new Set(cvBank.filter(z=>z.c.l===x.c.l).map(z=>z.s))],ch=shuffle([x.s,...wrong(pool,x.s)]);return q('K4','Alphabet + Vowel','writtenToSound','Read this combination.',x.w,ch,x.s,'karen-large','')}const pool=cvBank.filter(z=>z.c.l===x.c.l).map(z=>z.w),ch=shuffle([x.w,...wrong(pool,x.w)]);return q('K4','Alphabet + Vowel','soundToWritten','Which written combination matches this sound?',x.s,ch,x.w,'','karen')})}
function makeK5(){const out=[];tones.forEach(t=>{const ch=shuffle([t.m,...wrong(tones.map(x=>x.m),t.m)]);out.push(q('K5','Tone Recognition','identifyTone','Select the matching tone mark.',t.m,ch,t.m,'karen-large','karen'))});shuffle(tones).slice(0,3).forEach(t=>{const ch=shuffle([t.n,...wrong(tones.map(x=>x.n),t.n)]);out.push(q('K5','Tone Recognition','toneToName','What is the name of this tone?',t.m,ch,t.n,'karen-large',''))});return shuffle(out).slice(0,7)}
function makeK6(){const out=[];blends.forEach(b=>{const ch=shuffle([b.m,...wrong(blends.map(x=>x.m),b.m)]);out.push(q('K6','Blend Sound Recognition','identifyBlend','Select the matching blend symbol.',b.m,ch,b.m,'karen-large','karen'))});shuffle(blends).slice(0,3).forEach(b=>{const ch=shuffle([b.s,...wrong(blends.map(x=>x.s),b.s)]);out.push(q('K6','Blend Sound Recognition','blendToSound','What sound does this blend symbol make?',b.m,ch,b.s,'karen-large',''))});return shuffle(out).slice(0,7)}

function makeK7(){
 const out=[];
 const sample=shuffle(blendBank).slice(0,12);

 sample.slice(0,4).forEach(x=>{
   const pool=[...new Set(blendBank.map(z=>z.s))];
   const ch=shuffle([x.s,...wrong(pool,x.s)]);
   out.push(q('K7','Alphabet + Blend','readBlend','Read this alphabet + blend combination.',x.w,ch,x.s,'karen-large',''));
 });

 sample.slice(4,8).forEach(x=>{
   const pool=[...new Set(blendBank.map(z=>z.s))];
   const ch=shuffle([x.s,...wrong(pool,x.s)]);
   out.push(q('K7','Alphabet + Blend','pronunciation','Which is the correct pronunciation?',x.w,ch,x.s,'karen-large',''));
 });

 sample.slice(8,12).forEach(x=>{
   const pool=blendBank.map(z=>z.w);
   const ch=shuffle([x.w,...wrong(pool,x.w)]);
   out.push(q('K7','Alphabet + Blend','soundToWritten','Which written combination matches this sound?',x.s,ch,x.w,'','karen'));
 });

 return shuffle(out);
}


function makeK8(){
 const out=[];
 const sample=shuffle(k8Bank).slice(0,12);

 sample.slice(0,4).forEach(x=>{
   const pool=[...new Set(k8Bank.map(z=>z.s))];
   const ch=shuffle([x.s,...wrong(pool,x.s)]);
   out.push(q('K8','Alphabet + Blend + Vowel','readABV',
     'Read this alphabet + blend + vowel combination.',
     x.w,ch,x.s,'karen-large',''));
 });

 sample.slice(4,8).forEach(x=>{
   const pool=[...new Set(k8Bank.map(z=>z.s))];
   const ch=shuffle([x.s,...wrong(pool,x.s)]);
   out.push(q('K8','Alphabet + Blend + Vowel','pronunciationABV',
     'Which is the correct pronunciation?',
     x.w,ch,x.s,'karen-large',''));
 });

 sample.slice(8,12).forEach(x=>{
   const pool=k8Bank.map(z=>z.w);
   const ch=shuffle([x.w,...wrong(pool,x.w)]);
   out.push(q('K8','Alphabet + Blend + Vowel','soundToWrittenABV',
     'Which written combination matches this sound?',
     x.s,ch,x.w,'','karen'));
 });

 return shuffle(out);
}

function build(){return[...makeK1(),...makeK2(),...makeK3(),...makeK4(),...makeK5(),...makeK6(),...makeK7(),...makeK8()]}

function render(){
 const z=state.questions[state.i];state.selected=null;questionDomain.textContent=z.domain;questionNumber.textContent=state.i+1;questionTotal.textContent=state.questions.length;currentSkill.textContent=z.skill;questionInstruction.textContent=z.instruction;questionPrompt.textContent=z.prompt;questionPrompt.className='question-prompt '+z.promptClass;progressBar.style.width=`${state.i/state.questions.length*100}%`;answerChoices.innerHTML='';
 z.choices.forEach((c,i)=>{const b=document.createElement('button');b.className='choice '+z.choiceClass;b.textContent=c;b.onclick=()=>{[...answerChoices.children].forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.selected=i;nextQuestionBtn.disabled=false};answerChoices.appendChild(b)});nextQuestionBtn.disabled=true
}
function submit(){if(state.selected===null)return;const z=state.questions[state.i];state.responses.push({skill:z.skill,type:z.type,correct:state.selected===z.answer});state.i++;state.i>=state.questions.length?finish():render()}
function finish(){
 const s={};['K1','K2','K3','K4','K5','K6','K7','K8'].forEach(k=>s[k]=pct(state.responses.filter(r=>r.skill===k)));const overall=pct(state.responses);
 let level='K1';if(s.K1>=80&&s.K2>=75)level='K2';if(s.K1>=80&&s.K2>=75&&s.K3>=75)level='K3';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75)level='K4';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75&&s.K5>=75)level='K5';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75&&s.K5>=75&&s.K6>=75)level='K6';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75&&s.K5>=75&&s.K6>=75&&s.K7>=75)level='K7';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75&&s.K5>=75&&s.K6>=75&&s.K7>=75&&s.K8>=75)level='K8';
 resultStudentName.textContent=state.studentName;resultLevel.textContent=level;resultAccuracy.textContent=overall+'%';k1Score.textContent=s.K1+'%';k2Score.textContent=s.K2+'%';k3Score.textContent=s.K3+'%';k4Score.textContent=s.K4+'%';k5Score.textContent=s.K5+'%';k6Score.textContent=s.K6+'%';k7Score.textContent=s.K7+'%';k8Score.textContent=s.K8+'%';
 const k7=state.responses.filter(r=>r.skill==='K7');
 k7Breakdown.innerHTML=`<strong>Read alphabet + blend combinations:</strong> ${pct(k7.filter(r=>r.type==='readBlend'))}%<br><strong>Identify the correct pronunciation:</strong> ${pct(k7.filter(r=>r.type==='pronunciation'))}%<br><strong>Match written combination to its sound:</strong> ${pct(k7.filter(r=>r.type==='soundToWritten'))}%`;
 const k8=state.responses.filter(r=>r.skill==='K8');
 k8Breakdown.innerHTML=`<strong>Read alphabet + blend + vowel combinations:</strong> ${pct(k8.filter(r=>r.type==='readABV'))}%<br><strong>Identify the correct pronunciation:</strong> ${pct(k8.filter(r=>r.type==='pronunciationABV'))}%<br><strong>Match written combination to its sound:</strong> ${pct(k8.filter(r=>r.type==='soundToWrittenABV'))}%<br><br><strong>Current KLGA level:</strong> ${level}`;
 const result={student:state.studentName,grade:state.grade,window:state.window,k1:s.K1,k2:s.K2,k3:s.K3,k4:s.K4,k5:s.K5,k6:s.K6,k7:s.K7,k8:s.K8,overall,level,date:new Date().toLocaleDateString()};const saved=JSON.parse(localStorage.getItem('klgaResultsV7')||'[]');saved.push(result);localStorage.setItem('klgaResultsV7',JSON.stringify(saved));showView('result')
}
function renderDashboard(){const r=JSON.parse(localStorage.getItem('klgaResultsV7')||'[]');resultsTableBody.innerHTML='';r.slice().reverse().forEach(x=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(x.student)}</td><td>${x.grade}</td><td>${x.window}</td><td>${x.k1}%</td><td>${x.k2}%</td><td>${x.k3}%</td><td>${x.k4}%</td><td>${x.k5}%</td><td>${x.k6}%</td><td>${x.k7}%</td><td>${x.k8}%</td><td><strong>${x.level}</strong></td><td>${x.date}</td>`;resultsTableBody.appendChild(tr)})}
function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function exportCsv(){const r=JSON.parse(localStorage.getItem('klgaResultsV7')||'[]');const rows=[['Student','Grade','Window','K1','K2','K3','K4','K5','K6','K7','K8','Overall','Level','Date']];r.forEach(x=>rows.push([x.student,x.grade,x.window,x.k1,x.k2,x.k3,x.k4,x.k5,x.k6,x.k7,x.k8,x.overall,x.level,x.date]));const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\\n');const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='KLGA-K1-K7-results.csv';a.click();URL.revokeObjectURL(url)}

startStudentBtn.onclick=()=>showView('setup');studentModeBtn.onclick=()=>showView('setup');startTeacherBtn.onclick=()=>{renderDashboard();showView('teacher')};teacherModeBtn.onclick=()=>{renderDashboard();showView('teacher')};document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>showView('home'));returnHomeBtn.onclick=()=>{state=fresh();showView('home')};beginTestBtn.onclick=()=>{const name=studentName.value.trim(),grade=studentGrade.value,window=testWindow.value;if(!name||!grade){alert('Please enter student name and grade.');return}state=fresh();state.studentName=name;state.grade=grade;state.window=window;state.questions=build();showView('test');render()};nextQuestionBtn.onclick=submit;exportCsvBtn.onclick=exportCsv;clearResultsBtn.onclick=()=>{if(confirm('Clear all saved KLGA results?')){localStorage.removeItem('klgaResultsV7');renderDashboard()}}
