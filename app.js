const consonants=[
{l:'က',s:'Ka'},{l:'ခ',s:'Ka'},{l:'ဂ',s:'Ga'},{l:'ဃ',s:'Kha'},{l:'င',s:'Ngah'},{l:'စ',s:'Sa'},{l:'ဆ',s:'Cha'},{l:'ရှ',s:'Sha'},{l:'ည',s:'Nya'},{l:'တ',s:'Ta'},{l:'ထ',s:'Ta'},{l:'ဒ',s:'Da'},{l:'န',s:'Na'},{l:'ပ',s:'Pa'},{l:'ဖ',s:'Pa'},{l:'ဘ',s:'Ba'},{l:'မ',s:'Ma'},{l:'ယ',s:'Ya'},{l:'ရ',s:'Ra'},{l:'လ',s:'La'},{l:'ဝ',s:'Wa'},{l:'သ',s:'Tha'},{l:'ဟ',s:'Ha'},{l:'အ',s:'Ah'},{l:'ဧ',s:'Ahh'}
];
const vowels=[
{v:'ါ',s:'Ah'},{v:'ံ',s:'Ee'},{v:'ၢ',s:'Uh'},{v:'ု',s:'Eu'},{v:'ူ',s:'Oo'},{v:'့',s:'Ay/Ae'},{v:'ဲ',s:'Eh'},{v:'ိ',s:'Oe'},{v:'ီ',s:'Aw'}
];

const views={home:homeView,setup:studentSetupView,test:testView,result:resultView,teacher:teacherView};let state={};
function fresh(){return{studentName:'',grade:'',window:'',questions:[],i:0,selected:null,responses:[]}}state=fresh();
function showView(n){Object.values(views).forEach(v=>v.classList.add('hidden'));views[n].classList.remove('hidden')}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function pct(rows){return rows.length?Math.round(rows.filter(r=>r.correct).length/rows.length*100):0}
function wrong(arr,ans,n=3){return shuffle(arr.filter(x=>x!==ans)).slice(0,n)}

function combine(c,v){
 let base=c.s;
 let stem=base;
 if(base.endsWith('ah')) stem=base.slice(0,-2);
 else if(base.endsWith('a')) stem=base.slice(0,-1);
 else if(base.endsWith('h') && base.length>2) stem=base.slice(0,-1);

 const special={
   'Ah': stem+'ah','Ee':stem+'ee','Uh':stem+'uh','Eu':stem+'eu',
   'Oo':stem+'oo','Ay/Ae':stem+'ay','Eh':stem+'eh','Oe':stem+'oe','Aw':stem+'aw'
 };
 if(c.l==='အ') return {'Ah':'Ah','Ee':'Ee','Uh':'Uh','Eu':'Eu','Oo':'Oo','Ay/Ae':'Ay','Eh':'Eh','Oe':'Oe','Aw':'Aw'}[v.s];
 if(c.l==='ဧ') return {'Ah':'Ahh','Ee':'Eeh','Uh':'Uhh','Eu':'Euh','Oo':'Ooh','Ay/Ae':'Ayy','Eh':'Ehh','Oe':'Oeh','Aw':'Aww'}[v.s];
 return special[v.s];
}
function comboBank(){
 const out=[];
 consonants.forEach(c=>vowels.forEach(v=>out.push({written:c.l+v.v,sound:combine(c,v),c,v})));
 return out;
}
const combos=comboBank();

function qSimple(skill,domain,type,instruction,prompt,choices,correct,promptClass='',choiceClass=''){
 return{skill,domain,type,instruction,prompt,choices,answer:choices.indexOf(correct),promptClass,choiceClass}
}
function makeK1(){return shuffle(consonants).slice(0,5).map(x=>{const ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);return qSimple('K1','Alphabet Recognition','recognition','Select the matching letter.',x.l,ch,x.l,'karen-large','karen')})}
function makeK2(){return shuffle(consonants).slice(0,6).map((x,i)=>{if(i<3){const sounds=[...new Set(consonants.map(z=>z.s))],ch=shuffle([x.s,...wrong(sounds,x.s)]);return qSimple('K2','Letter Sounds','letterToSound','What sound does this letter make?',x.l,ch,x.s,'karen-large','')}else{const ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);return qSimple('K2','Letter Sounds','soundToLetter','Which letter makes this sound?',x.s,ch,x.l,'','karen')}})}
function makeK3(){return shuffle(vowels).slice(0,6).map((x,i)=>{if(i<3){const ch=shuffle([x.s,...wrong(vowels.map(z=>z.s),x.s)]);return qSimple('K3','Vowel Recognition','vowelToSound','What sound does this vowel make?',x.v,ch,x.s,'karen-large','')}else{const ch=shuffle([x.v,...wrong(vowels.map(z=>z.v),x.v)]);return qSimple('K3','Vowel Recognition','soundToVowel','Which vowel makes this sound?',x.s,ch,x.v,'','karen')}})}

function makeK4(){
 const q=[];
 // 4 read simple CV: written -> pronunciation
 shuffle(combos).slice(0,4).forEach(x=>{
   const soundPool=[...new Set(combos.filter(z=>z.c.l===x.c.l).map(z=>z.sound))];
   const ch=shuffle([x.sound,...wrong(soundPool,x.sound)]);
   q.push(qSimple('K4','Alphabet + Vowel','readCV','Read this alphabet + vowel combination. Choose its pronunciation.',x.written,ch,x.sound,'karen-large',''));
 });
 // 4 identify correct pronunciation: same written, broader distractors
 shuffle(combos).slice(0,4).forEach(x=>{
   const pool=[...new Set(combos.map(z=>z.sound))];
   const ch=shuffle([x.sound,...wrong(pool,x.sound)]);
   q.push(qSimple('K4','Alphabet + Vowel','pronunciation','Which is the correct pronunciation?',x.written,ch,x.sound,'karen-large',''));
 });
 // 4 sound -> written combination
 shuffle(combos).slice(0,4).forEach(x=>{
   const sameC=combos.filter(z=>z.c.l===x.c.l).map(z=>z.written);
   const ch=shuffle([x.written,...wrong(sameC,x.written)]);
   q.push(qSimple('K4','Alphabet + Vowel','soundToWritten','Which written combination matches this sound?',x.sound,ch,x.written,'','karen'));
 });
 return shuffle(q)
}
function build(){return[...makeK1(),...makeK2(),...makeK3(),...makeK4()]}

function render(){
 const q=state.questions[state.i];state.selected=null;
 questionDomain.textContent=q.domain;questionNumber.textContent=state.i+1;questionTotal.textContent=state.questions.length;currentSkill.textContent=q.skill;
 questionInstruction.textContent=q.instruction;questionPrompt.textContent=q.prompt;questionPrompt.className='question-prompt '+q.promptClass;
 progressBar.style.width=`${state.i/state.questions.length*100}%`;answerChoices.innerHTML='';
 q.choices.forEach((c,i)=>{const b=document.createElement('button');b.className='choice '+q.choiceClass;b.textContent=c;b.onclick=()=>{[...answerChoices.children].forEach(x=>x.classList.remove('selected'));b.classList.add('selected');state.selected=i;nextQuestionBtn.disabled=false};answerChoices.appendChild(b)});
 nextQuestionBtn.disabled=true
}
function submit(){
 if(state.selected===null)return;const q=state.questions[state.i];
 state.responses.push({skill:q.skill,type:q.type,correct:state.selected===q.answer});state.i++;
 state.i>=state.questions.length?finish():render()
}
function finish(){
 const scores={};['K1','K2','K3','K4'].forEach(k=>scores[k]=pct(state.responses.filter(r=>r.skill===k)));
 const overall=pct(state.responses);let level='K1';
 if(scores.K1>=80&&scores.K2>=75)level='K2';
 if(scores.K1>=80&&scores.K2>=75&&scores.K3>=75)level='K3';
 if(scores.K1>=80&&scores.K2>=75&&scores.K3>=75&&scores.K4>=75)level='K4';
 resultStudentName.textContent=state.studentName;resultLevel.textContent=level;resultAccuracy.textContent=overall+'%';
 k1Score.textContent=scores.K1+'%';k2Score.textContent=scores.K2+'%';k3Score.textContent=scores.K3+'%';k4Score.textContent=scores.K4+'%';
 const k4=state.responses.filter(r=>r.skill==='K4');
 const a=pct(k4.filter(r=>r.type==='readCV')),b=pct(k4.filter(r=>r.type==='pronunciation')),c=pct(k4.filter(r=>r.type==='soundToWritten'));
 k4Breakdown.innerHTML=`<strong>Read simple consonant-vowel combinations:</strong> ${a}%<br><strong>Identify the correct pronunciation:</strong> ${b}%<br><strong>Match a written combination to its sound:</strong> ${c}%<br><br><strong>Current KLGA level:</strong> ${level}`;
 const result={student:state.studentName,grade:state.grade,window:state.window,k1:scores.K1,k2:scores.K2,k3:scores.K3,k4:scores.K4,overall,level,readCV:a,pronunciation:b,soundMatch:c,date:new Date().toLocaleDateString()};
 const saved=JSON.parse(localStorage.getItem('klgaResultsV5')||'[]');saved.push(result);localStorage.setItem('klgaResultsV5',JSON.stringify(saved));showView('result')
}
function renderDashboard(){const results=JSON.parse(localStorage.getItem('klgaResultsV5')||'[]');resultsTableBody.innerHTML='';results.slice().reverse().forEach(r=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${esc(r.student)}</td><td>${r.grade}</td><td>${r.window}</td><td>${r.k1}%</td><td>${r.k2}%</td><td>${r.k3}%</td><td>${r.k4}%</td><td><strong>${r.level}</strong></td><td>${r.date}</td>`;resultsTableBody.appendChild(tr)})}
function esc(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function exportCsv(){const r=JSON.parse(localStorage.getItem('klgaResultsV5')||'[]');const rows=[['Student','Grade','Window','K1','K2','K3','K4','Read CV','Correct Pronunciation','Written-Sound Match','Overall','Level','Date']];r.forEach(x=>rows.push([x.student,x.grade,x.window,x.k1,x.k2,x.k3,x.k4,x.readCV,x.pronunciation,x.soundMatch,x.overall,x.level,x.date]));const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\\n');const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='KLGA-K1-K4-results.csv';a.click();URL.revokeObjectURL(url)}

startStudentBtn.onclick=()=>showView('setup');studentModeBtn.onclick=()=>showView('setup');startTeacherBtn.onclick=()=>{renderDashboard();showView('teacher')};teacherModeBtn.onclick=()=>{renderDashboard();showView('teacher')};document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>showView('home'));returnHomeBtn.onclick=()=>{state=fresh();showView('home')};
beginTestBtn.onclick=()=>{const name=studentName.value.trim(),grade=studentGrade.value,window=testWindow.value;if(!name||!grade){alert('Please enter student name and grade.');return}state=fresh();state.studentName=name;state.grade=grade;state.window=window;state.questions=build();showView('test');render()};
nextQuestionBtn.onclick=submit;exportCsvBtn.onclick=exportCsv;clearResultsBtn.onclick=()=>{if(confirm('Clear all saved KLGA results?')){localStorage.removeItem('klgaResultsV5');renderDashboard()}}
