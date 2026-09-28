const consonants=[
{l:'က',s:'Ka'},{l:'ခ',s:'Ka'},{l:'ဂ',s:'Ga'},{l:'ဃ',s:'Kha'},{l:'င',s:'Ngah'},{l:'စ',s:'Sa'},{l:'ဆ',s:'Cha'},{l:'ရှ',s:'Sha'},{l:'ည',s:'Nya'},{l:'တ',s:'Ta'},{l:'ထ',s:'Ta'},{l:'ဒ',s:'Da'},{l:'န',s:'Na'},{l:'ပ',s:'Pa'},{l:'ဖ',s:'Pa'},{l:'ဘ',s:'Ba'},{l:'မ',s:'Ma'},{l:'ယ',s:'Ya'},{l:'ရ',s:'Ra'},{l:'လ',s:'La'},{l:'ဝ',s:'Wa'},{l:'သ',s:'Tha'},{l:'ဟ',s:'Ha'},{l:'အ',s:'Ah'},{l:'ဧ',s:'Ahh'}
];
const vowels=[{v:'ါ',s:'Ah'},{v:'ံ',s:'Ee'},{v:'ၢ',s:'Uh'},{v:'ု',s:'Eu'},{v:'ူ',s:'Oo'},{v:'့',s:'Ay/Ae'},{v:'ဲ',s:'Eh'},{v:'ိ',s:'Oe'},{v:'ီ',s:'Aw'}];
const blends=[{m:'ၠ',s:'Ya'},{m:'ြ',s:'Ra'},{m:'ျ',s:'La'},{m:'ွ',s:'Wa'},{m:'ှ',s:'Ga'}];
const tones=[{m:'ၢ်',n:'Uh Thee'},{m:'ာ်',n:'Ah Thee'},{m:'ၣ်',n:'Ha Thee'},{m:'း',n:'Pluh See'},{m:'ၤ',n:'Kay Poe'}];

const views={home:homeView,setup:studentSetupView,test:testView,result:resultView,teacher:teacherView};let state={};
function fresh(){return{studentName:'',grade:'',window:'',questions:[],i:0,selected:null,responses:[]}}state=fresh();
function showView(n){Object.values(views).forEach(v=>v.classList.add('hidden'));views[n].classList.remove('hidden')}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pct(rows){return rows.length?Math.round(rows.filter(r=>r.correct).length/rows.length*100):0}
function wrong(arr,ans,n=3){return shuffle(arr.filter(x=>x!==ans)).slice(0,n)}

function combine(c,v){
 let stem=c.s;
 if(stem.endsWith('ah'))stem=stem.slice(0,-2); else if(stem.endsWith('a'))stem=stem.slice(0,-1); else if(stem.endsWith('h')&&stem.length>2)stem=stem.slice(0,-1);
 if(c.l==='အ')return{'Ah':'Ah','Ee':'Ee','Uh':'Uh','Eu':'Eu','Oo':'Oo','Ay/Ae':'Ay','Eh':'Eh','Oe':'Oe','Aw':'Aw'}[v.s];
 if(c.l==='ဧ')return{'Ah':'Ahh','Ee':'Eeh','Uh':'Uhh','Eu':'Euh','Oo':'Ooh','Ay/Ae':'Ayy','Eh':'Ehh','Oe':'Oeh','Aw':'Aww'}[v.s];
 return {'Ah':stem+'ah','Ee':stem+'ee','Uh':stem+'uh','Eu':stem+'eu','Oo':stem+'oo','Ay/Ae':stem+'ay','Eh':stem+'eh','Oe':stem+'oe','Aw':stem+'aw'}[v.s];
}
const combos=[];consonants.forEach(c=>vowels.forEach(v=>combos.push({w:c.l+v.v,s:combine(c,v),c,v})));

function q(skill,domain,type,instruction,prompt,choices,correct,promptClass='',choiceClass=''){
 return{skill,domain,type,instruction,prompt,choices,answer:choices.indexOf(correct),promptClass,choiceClass}
}
function makeK1(){return shuffle(consonants).slice(0,4).map(x=>{const ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);return q('K1','Alphabet Recognition','recognition','Select the matching letter.',x.l,ch,x.l,'karen-large','karen')})}
function makeK2(){return shuffle(consonants).slice(0,4).map((x,i)=>{if(i<2){const ss=[...new Set(consonants.map(z=>z.s))],ch=shuffle([x.s,...wrong(ss,x.s)]);return q('K2','Letter Sounds','letterToSound','What sound does this letter make?',x.l,ch,x.s,'karen-large','')}const ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);return q('K2','Letter Sounds','soundToLetter','Which letter makes this sound?',x.s,ch,x.l,'','karen')})}
function makeK3(){return shuffle(vowels).slice(0,4).map((x,i)=>{if(i<2){const ch=shuffle([x.s,...wrong(vowels.map(z=>z.s),x.s)]);return q('K3','Vowel Recognition','vowelToSound','What sound does this vowel make?',x.v,ch,x.s,'karen-large','')}const ch=shuffle([x.v,...wrong(vowels.map(z=>z.v),x.v)]);return q('K3','Vowel Recognition','soundToVowel','Which vowel makes this sound?',x.s,ch,x.v,'','karen')})}
function makeK4(){return shuffle(combos).slice(0,6).map((x,i)=>{if(i<3){const pool=[...new Set(combos.filter(z=>z.c.l===x.c.l).map(z=>z.s))],ch=shuffle([x.s,...wrong(pool,x.s)]);return q('K4','Alphabet + Vowel','writtenToSound','Read this combination.',x.w,ch,x.s,'karen-large','')}const pool=combos.filter(z=>z.c.l===x.c.l).map(z=>z.w),ch=shuffle([x.w,...wrong(pool,x.w)]);return q('K4','Alphabet + Vowel','soundToWritten','Which written combination matches this sound?',x.s,ch,x.w,'','karen')})}

function makeK5(){
 const out=[];
 blends.forEach(b=>{
   const symbolChoices=shuffle([b.m,...wrong(blends.map(x=>x.m),b.m)]);
   out.push(q('K5','Blend Sound Recognition','identifyBlend','Select the blend symbol that matches the symbol shown.',b.m,symbolChoices,b.m,'karen-large','karen'));
 });
 shuffle(blends).slice(0,5).forEach((b,i)=>{
   if(i<3){
     const sounds=blends.map(x=>x.s),ch=shuffle([b.s,...wrong(sounds,b.s)]);
     out.push(q('K5','Blend Sound Recognition','blendToSound','What sound does this blend symbol make?',b.m,ch,b.s,'karen-large',''));
   }else{
     const ch=shuffle([b.m,...wrong(blends.map(x=>x.m),b.m)]);
     out.push(q('K5','Blend Sound Recognition','soundToBlend','Which blend symbol makes this sound?',b.s,ch,b.m,'','karen'));
   }
 });
 return shuffle(out).slice(0,8);
}

function makeK6(){
 const out=[];
 tones.forEach(t=>{
   const symbolChoices=shuffle([t.m,...wrong(tones.map(x=>x.m),t.m)]);
   out.push(q('K6','Tone Recognition','identifyTone','Select the tone mark that matches the tone shown.',t.m,symbolChoices,t.m,'karen-large','karen'));
 });
 shuffle(tones).forEach((t,i)=>{
   if(i<3){
     const names=tones.map(x=>x.n),ch=shuffle([t.n,...wrong(names,t.n)]);
     out.push(q('K6','Tone Recognition','toneToName','What is the name of this tone?',t.m,ch,t.n,'karen-large',''));
   }else{
     const ch=shuffle([t.m,...wrong(tones.map(x=>x.m),t.m)]);
     out.push(q('K6','Tone Recognition','nameToTone','Which tone mark is called "'+t.n+'"?',t.n,ch,t.m,'','karen'));
   }
 });
 return shuffle(out).slice(0,8);
}

function build(){return[...makeK1(),...makeK2(),...makeK3(),...makeK4(),...makeK5(),...makeK6()]}

function render(){
 const z=state.questions[state.i];state.selected=null;questionDomain.textContent=z.domain;questionNumber.textContent=state.i+1;questionTotal.textContent=state.questions.length;currentSkill.textContent=z.skill;questionInstruction.textContent=z.instruction;questionPrompt.textContent=z.prompt;questionPrompt.className='question-prompt '+z.promptClass;progressBar.style.width=`${state.i/state.questions.length*100}%`;answerChoices.innerHTML='';
 z.choices.forEach((c,i)=>{const b=document.createElement('button');b.className='choice '+z.choiceClass;b.textContent=c;b.onclick=()=>{[...answerChoices.children].forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.selected=i;nextQuestionBtn.disabled=false};answerChoices.appendChild(b)});nextQuestionBtn.disabled=true
}
function submit(){if(state.selected===null)return;const z=state.questions[state.i];state.responses.push({skill:z.skill,type:z.type,correct:state.selected===z.answer});state.i++;state.i>=state.questions.length?finish():render()}
function finish(){
 const s={};['K1','K2','K3','K4','K5','K6'].forEach(k=>s[k]=pct(state.responses.filter(r=>r.skill===k)));const overall=pct(state.responses);
 let level='K1';if(s.K1>=80&&s.K2>=75)level='K2';if(s.K1>=80&&s.K2>=75&&s.K3>=75)level='K3';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75)level='K4';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75&&s.K5>=75)level='K5';if(s.K1>=80&&s.K2>=75&&s.K3>=75&&s.K4>=75&&s.K5>=75&&s.K6>=75)level='K6';
 resultStudentName.textContent=state.studentName;resultLevel.textContent=level;resultAccuracy.textContent=overall+'%';k1Score.textContent=s.K1+'%';k2Score.textContent=s.K2+'%';k3Score.textContent=s.K3+'%';k4Score.textContent=s.K4+'%';k5Score.textContent=s.K5+'%';k6Score.textContent=s.K6+'%';
 const k5=state.responses.filter(r=>r.skill==='K5'),k6=state.responses.filter(r=>r.skill==='K6');
 k5Breakdown.innerHTML=`<strong>Identify blend symbols:</strong> ${pct(k5.filter(r=>r.type==='identifyBlend'))}%<br><strong>Match blend symbol to sound:</strong> ${pct(k5.filter(r=>r.type==='blendToSound'))}%<br><strong>Match sound to blend symbol:</strong> ${pct(k5.filter(r=>r.type==='soundToBlend'))}%`;
 k6Breakdown.innerHTML=`<strong>Identify tone marks:</strong> ${pct(k6.filter(r=>r.type==='identifyTone'))}%<br><strong>Match tone mark to its name:</strong> ${pct(k6.filter(r=>r.type==='toneToName'))}%<br><strong>Match tone name to the correct mark:</strong> ${pct(k6.filter(r=>r.type==='nameToTone'))}%`;
 const result={student:state.studentName,grade:state.grade,window:state.window,k1:s.K1,k2:s.K2,k3:s.K3,k4:s.K4,k5:s.K5,k6:s.K6,overall,level,date:new Date().toLocaleDateString()};const saved=JSON.parse(localStorage.getItem('klgaResultsV6')||'[]');saved.push(result);localStorage.setItem('klgaResultsV6',JSON.stringify(saved));showView('result')
}
function renderDashboard(){const r=JSON.parse(localStorage.getItem('klgaResultsV6')||'[]');resultsTableBody.innerHTML='';r.slice().reverse().forEach(x=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(x.student)}</td><td>${x.grade}</td><td>${x.window}</td><td>${x.k1}%</td><td>${x.k2}%</td><td>${x.k3}%</td><td>${x.k4}%</td><td>${x.k5}%</td><td>${x.k6}%</td><td><strong>${x.level}</strong></td><td>${x.date}</td>`;resultsTableBody.appendChild(tr)})}
function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function exportCsv(){const r=JSON.parse(localStorage.getItem('klgaResultsV6')||'[]');const rows=[['Student','Grade','Window','K1','K2','K3','K4','K5','K6','Overall','Level','Date']];r.forEach(x=>rows.push([x.student,x.grade,x.window,x.k1,x.k2,x.k3,x.k4,x.k5,x.k6,x.overall,x.level,x.date]));const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\\n');const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='KLGA-K1-K6-results.csv';a.click();URL.revokeObjectURL(url)}

startStudentBtn.onclick=()=>showView('setup');studentModeBtn.onclick=()=>showView('setup');startTeacherBtn.onclick=()=>{renderDashboard();showView('teacher')};teacherModeBtn.onclick=()=>{renderDashboard();showView('teacher')};document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>showView('home'));returnHomeBtn.onclick=()=>{state=fresh();showView('home')};beginTestBtn.onclick=()=>{const name=studentName.value.trim(),grade=studentGrade.value,window=testWindow.value;if(!name||!grade){alert('Please enter student name and grade.');return}state=fresh();state.studentName=name;state.grade=grade;state.window=window;state.questions=build();showView('test');render()};nextQuestionBtn.onclick=submit;exportCsvBtn.onclick=exportCsv;clearResultsBtn.onclick=()=>{if(confirm('Clear all saved KLGA results?')){localStorage.removeItem('klgaResultsV6');renderDashboard()}}
