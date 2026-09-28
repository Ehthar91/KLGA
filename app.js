const alphabet = [
{letter:'က',sound:'Ka (Sound Between G and K)',group:['က','ခ','ဂ','ဃ']},
{letter:'ခ',sound:'Ka',group:['က','ခ','ဂ','ဃ']},
{letter:'ဂ',sound:'Ga (Sound much Softer Than G)',group:['က','ခ','ဂ','ဃ']},
{letter:'ဃ',sound:'Kha (Sound Like K and H Mix)',group:['က','ခ','ဂ','ဃ']},
{letter:'င',sound:'Ngah (Sound Come From Nose)',group:['င','ည','န','မ']},
{letter:'စ',sound:'Sa',group:['စ','ဆ','ရှ','သ']},
{letter:'ဆ',sound:'Cha',group:['စ','ဆ','ရှ','သ']},
{letter:'ရှ',sound:'Sha',group:['စ','ဆ','ရှ','သ']},
{letter:'ည',sound:'Nya',group:['င','ည','န','ယ']},
{letter:'တ',sound:'Ta (Sound Between T and D)',group:['တ','ထ','ဒ','န']},
{letter:'ထ',sound:'Ta',group:['တ','ထ','ဒ','န']},
{letter:'ဒ',sound:'Da',group:['တ','ထ','ဒ','ဂ']},
{letter:'န',sound:'Na',group:['ည','န','မ','င']},
{letter:'ပ',sound:'Pa (Sound Between P and B)',group:['ပ','ဖ','ဘ','မ']},
{letter:'ဖ',sound:'Pa',group:['ပ','ဖ','ဘ','မ']},
{letter:'ဘ',sound:'Ba',group:['ပ','ဖ','ဘ','မ']},
{letter:'မ',sound:'Ma',group:['န','ဘ','မ','ယ']},
{letter:'ယ',sound:'Ya',group:['ယ','ရ','လ','မ']},
{letter:'ရ',sound:'Ra',group:['ယ','ရ','လ','ရှ']},
{letter:'လ',sound:'La',group:['ဝ','ယ','လ','ရ']},
{letter:'ဝ',sound:'Wa',group:['လ','သ','ဝ','ဟ']},
{letter:'သ',sound:'Tha',group:['ဟ','ဆ','သ','ရှ']},
{letter:'ဟ',sound:'Ha',group:['သ','အ','ဟ','ဝ']},
{letter:'အ',sound:'Ah',group:['ဟ','ဧ','အ','သ']},
{letter:'ဧ',sound:'Ahh..',group:['အ','ဟ','ဧ','ဂ']}
];

const views={home:homeView,setup:studentSetupView,test:testView,result:resultView,teacher:teacherView};
let state={};

function freshState(){return{studentName:'',grade:'',window:'',questionCount:10,currentIndex:0,correct:0,responses:[],selected:null,questions:[]}}
state=freshState();

function showView(name){Object.values(views).forEach(v=>v.classList.add('hidden'));views[name].classList.remove('hidden')}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

function makeChoices(item,stage){
  const all=alphabet.map(x=>x.letter).filter(x=>x!==item.letter);
  let distractors=[];
  if(stage==='K1-A'){
    const avoid=new Set(item.group);
    distractors=shuffle(all.filter(x=>!avoid.has(x))).slice(0,3);
  }else if(stage==='K1-B'){
    distractors=shuffle(item.group.filter(x=>x!==item.letter)).slice(0,3);
    if(distractors.length<3) distractors.push(...shuffle(all.filter(x=>!distractors.includes(x))).slice(0,3-distractors.length));
  }else{
    const related=shuffle(item.group.filter(x=>x!==item.letter));
    const others=shuffle(all.filter(x=>!related.includes(x)));
    distractors=[...related.slice(0,2),...others.slice(0,1)];
  }
  return shuffle([item.letter,...distractors.slice(0,3)]);
}

function buildQuestionBank(){
  return shuffle(alphabet).slice(0,state.questionCount).map((item,i)=>{
    const stage=i<4?'K1-A':i<7?'K1-B':'K1-C';
    const choices=makeChoices(item,stage);
    return{item,stage,target:item.letter,choices,answerIndex:choices.indexOf(item.letter)}
  })
}

function renderQuestion(){
  const q=state.questions[state.currentIndex];
  state.selected=null;
  questionNumber.textContent=state.currentIndex+1;
  questionTotal.textContent=state.questionCount;
  currentDifficulty.textContent=q.stage;
  questionPrompt.textContent=q.target;
  progressBar.style.width=`${state.currentIndex/state.questionCount*100}%`;
  answerChoices.innerHTML='';
  q.choices.forEach((choice,i)=>{
    const b=document.createElement('button');b.className='choice';b.textContent=choice;
    b.onclick=()=>{[...answerChoices.children].forEach(c=>c.classList.remove('selected'));b.classList.add('selected');state.selected=i;nextQuestionBtn.disabled=false};
    answerChoices.appendChild(b)
  });
  nextQuestionBtn.disabled=true
}

function submitCurrent(){
  if(state.selected===null)return;
  const q=state.questions[state.currentIndex];
  const ok=state.selected===q.answerIndex;
  if(ok)state.correct++;
  state.responses.push({target:q.target,selected:q.choices[state.selected],correct:ok,stage:q.stage});
  state.currentIndex++;
  if(state.currentIndex>=state.questionCount)finishTest();else renderQuestion()
}

function stageFromAccuracy(p){if(p>=90)return'K1-C';if(p>=75)return'K1-B';return'K1-A'}

function finishTest(){
  const accuracy=Math.round(state.correct/state.questionCount*100);
  const stage=stageFromAccuracy(accuracy);
  resultStudentName.textContent=state.studentName;
  resultScore.textContent=`${state.correct}/${state.questionCount}`;
  resultAccuracy.textContent=`${accuracy}%`;
  resultStage.textContent=stage;
  const missed=state.responses.filter(r=>!r.correct).map(r=>r.target);
  alphabetSummary.innerHTML=`<strong>Recognition Stage:</strong> ${stage}<br><strong>Letters missed:</strong> ${missed.length?missed.join(' • '):'None'}<br><br>${accuracy>=90?'Student shows strong independent recognition of the sampled Karen alphabet letters.':accuracy>=75?'Student recognizes many letters but still needs practice distinguishing some similar letters.':'Student needs additional practice with Karen alphabet recognition before moving on to letter sounds.'}`;
  const result={student:state.studentName,grade:state.grade,window:state.window,correct:state.correct,total:state.questionCount,accuracy,level:'K1',stage,missed:missed.join(' '),date:new Date().toLocaleDateString()};
  const saved=JSON.parse(localStorage.getItem('klgaAlphabetResults')||'[]');saved.push(result);localStorage.setItem('klgaAlphabetResults',JSON.stringify(saved));
  showView('result')
}

function renderDashboard(){
  const results=JSON.parse(localStorage.getItem('klgaAlphabetResults')||'[]');
  dashCount.textContent=results.length;
  dashAverage.textContent=results.length?`${Math.round(results.reduce((s,r)=>s+r.accuracy,0)/results.length)}%`:'—';
  resultsTableBody.innerHTML='';
  results.slice().reverse().forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${escapeHtml(r.student)}</td><td>${r.grade}</td><td>${r.window}</td><td>${r.correct}/${r.total}</td><td>${r.accuracy}%</td><td>${r.stage}</td><td>${r.date}</td>`;
    resultsTableBody.appendChild(tr)
  })
}

function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function exportCsv(){
  const results=JSON.parse(localStorage.getItem('klgaAlphabetResults')||'[]');
  const rows=[['Student','Grade','Window','Correct','Total','Accuracy','Level','Stage','Missed Letters','Date']];
  results.forEach(r=>rows.push([r.student,r.grade,r.window,r.correct,r.total,r.accuracy,r.level,r.stage,r.missed,r.date]));
  const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='KLGA-alphabet-recognition-results.csv';a.click();URL.revokeObjectURL(url)
}

startStudentBtn.onclick=()=>showView('setup');
studentModeBtn.onclick=()=>showView('setup');
startTeacherBtn.onclick=()=>{renderDashboard();showView('teacher')};
teacherModeBtn.onclick=()=>{renderDashboard();showView('teacher')};
document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>showView('home'));
returnHomeBtn.onclick=()=>{state=freshState();showView('home')};
beginTestBtn.onclick=()=>{
  const name=studentName.value.trim(),grade=studentGrade.value,window=testWindow.value;
  if(!name||!grade){alert('Please enter student name and grade.');return}
  state=freshState();state.studentName=name;state.grade=grade;state.window=window;state.questions=buildQuestionBank();showView('test');renderQuestion()
};
nextQuestionBtn.onclick=submitCurrent;
exportCsvBtn.onclick=exportCsv;
clearResultsBtn.onclick=()=>{if(confirm('Clear all saved KLGA alphabet results in this browser?')){localStorage.removeItem('klgaAlphabetResults');renderDashboard()}}
