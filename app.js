const alphabet = [
{letter:'က',sound:'Ka',detail:'Sound between G and K'},
{letter:'ခ',sound:'Ka',detail:'Clear K sound'},
{letter:'ဂ',sound:'Ga',detail:'Much softer than G'},
{letter:'ဃ',sound:'Kha',detail:'K and H mixed'},
{letter:'င',sound:'Ngah',detail:'Nasal sound'},
{letter:'စ',sound:'Sa',detail:''},
{letter:'ဆ',sound:'Cha',detail:''},
{letter:'ရှ',sound:'Sha',detail:''},
{letter:'ည',sound:'Nya',detail:''},
{letter:'တ',sound:'Ta',detail:'Sound between T and D'},
{letter:'ထ',sound:'Ta',detail:'Clear T sound'},
{letter:'ဒ',sound:'Da',detail:''},
{letter:'န',sound:'Na',detail:''},
{letter:'ပ',sound:'Pa',detail:'Sound between P and B'},
{letter:'ဖ',sound:'Pa',detail:'Clear P sound'},
{letter:'ဘ',sound:'Ba',detail:''},
{letter:'မ',sound:'Ma',detail:''},
{letter:'ယ',sound:'Ya',detail:''},
{letter:'ရ',sound:'Ra',detail:''},
{letter:'လ',sound:'La',detail:''},
{letter:'ဝ',sound:'Wa',detail:''},
{letter:'သ',sound:'Tha',detail:''},
{letter:'ဟ',sound:'Ha',detail:''},
{letter:'အ',sound:'Ah',detail:''},
{letter:'ဧ',sound:'Ahh..',detail:'Longer Ah sound'}
];

const beginningExamples = [
  {cue:'Ma', answer:'မ'},
  {cue:'Na', answer:'န'},
  {cue:'Ya', answer:'ယ'},
  {cue:'Ra', answer:'ရ'},
  {cue:'La', answer:'လ'},
  {cue:'Wa', answer:'ဝ'},
  {cue:'Ha', answer:'ဟ'},
  {cue:'Sha', answer:'ရှ'},
  {cue:'Cha', answer:'ဆ'},
  {cue:'Nya', answer:'ည'},
  {cue:'Ngah', answer:'င'},
  {cue:'Ba', answer:'ဘ'}
];

const views={home:homeView,setup:studentSetupView,test:testView,result:resultView,teacher:teacherView};
let state={};

function freshState(){return{
  studentName:'',grade:'',window:'',
  questions:[],currentIndex:0,selected:null,
  responses:[]
}}
state=freshState();

function showView(name){Object.values(views).forEach(v=>v.classList.add('hidden'));views[name].classList.remove('hidden')}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

function randomWrongLetters(answer,n=3){
  return shuffle(alphabet.map(x=>x.letter).filter(x=>x!==answer)).slice(0,n)
}
function randomWrongSounds(item,n=3){
  const correctLabel = soundLabel(item);
  const labels = [...new Set(alphabet.map(soundLabel).filter(x=>x!==correctLabel))];
  return shuffle(labels).slice(0,n)
}
function soundLabel(item){
  return item.detail ? `${item.sound} — ${item.detail}` : item.sound;
}

function makeK1Questions(){
  return shuffle(alphabet).slice(0,8).map(item=>{
    const choices=shuffle([item.letter,...randomWrongLetters(item.letter)]);
    return {
      skill:'K1',
      domain:'Alphabet Recognition',
      type:'recognition',
      instruction:'Select the letter that matches the letter shown.',
      prompt:item.letter,
      promptClass:'karen-large',
      choices,
      answer:choices.indexOf(item.letter),
      choiceClass:'karen'
    }
  })
}

function makeK2Questions(){
  const q=[];

  // 4 questions: letter -> sound
  shuffle(alphabet).slice(0,4).forEach(item=>{
    const correct=soundLabel(item);
    const choices=shuffle([correct,...randomWrongSounds(item)]);
    q.push({
      skill:'K2',
      domain:'Letter Sounds',
      type:'letterToSound',
      instruction:'What sound does this letter make?',
      prompt:item.letter,
      promptClass:'karen-large',
      choices,
      answer:choices.indexOf(correct),
      choiceClass:''
    });
  });

  // 4 questions: sound -> letter
  shuffle(alphabet).slice(0,4).forEach(item=>{
    const cue=soundLabel(item);
    const choices=shuffle([item.letter,...randomWrongLetters(item.letter)]);
    q.push({
      skill:'K2',
      domain:'Letter Sounds',
      type:'soundToLetter',
      instruction:'Which Karen letter makes this sound?',
      prompt:cue,
      promptClass:'',
      choices,
      answer:choices.indexOf(item.letter),
      choiceClass:'karen'
    });
  });

  // 4 questions: beginning-sound recognition
  shuffle(beginningExamples).slice(0,4).forEach(ex=>{
    const choices=shuffle([ex.answer,...randomWrongLetters(ex.answer)]);
    q.push({
      skill:'K2',
      domain:'Beginning Sounds',
      type:'beginningSound',
      instruction:'Which Karen letter matches the beginning sound shown?',
      prompt:ex.cue,
      promptClass:'',
      choices,
      answer:choices.indexOf(ex.answer),
      choiceClass:'karen'
    });
  });

  return shuffle(q);
}

function buildTest(){
  return [...makeK1Questions(),...makeK2Questions()];
}

function renderQuestion(){
  const q=state.questions[state.currentIndex];
  state.selected=null;

  questionDomain.textContent=q.domain;
  questionNumber.textContent=state.currentIndex+1;
  questionTotal.textContent=state.questions.length;
  currentSkill.textContent=q.skill;
  questionInstruction.textContent=q.instruction;
  questionPrompt.textContent=q.prompt;
  questionPrompt.className='question-prompt '+(q.promptClass||'');
  progressBar.style.width=`${state.currentIndex/state.questions.length*100}%`;

  answerChoices.innerHTML='';
  q.choices.forEach((choice,i)=>{
    const b=document.createElement('button');
    b.className='choice '+(q.choiceClass||'');
    b.textContent=choice;
    b.onclick=()=>{
      [...answerChoices.children].forEach(c=>c.classList.remove('selected'));
      b.classList.add('selected');
      state.selected=i;
      nextQuestionBtn.disabled=false;
    };
    answerChoices.appendChild(b);
  });
  nextQuestionBtn.disabled=true;
}

function submitCurrent(){
  if(state.selected===null)return;
  const q=state.questions[state.currentIndex];
  state.responses.push({
    skill:q.skill,
    domain:q.domain,
    type:q.type,
    correct:state.selected===q.answer,
    prompt:q.prompt
  });
  state.currentIndex++;
  if(state.currentIndex>=state.questions.length)finishTest();else renderQuestion();
}

function pct(rows){
  if(!rows.length)return 0;
  return Math.round(rows.filter(r=>r.correct).length/rows.length*100);
}

function finishTest(){
  const k1=state.responses.filter(r=>r.skill==='K1');
  const k2=state.responses.filter(r=>r.skill==='K2');
  const overall=pct(state.responses);
  const k1p=pct(k1), k2p=pct(k2);

  // Provisional progression rule:
  // K2 requires solid K1 plus at least 75% on letter sounds.
  let level='K1';
  if(k1p>=80 && k2p>=75) level='K2';

  resultStudentName.textContent=state.studentName;
  resultLevel.textContent=level;
  resultAccuracy.textContent=overall+'%';
  k1Score.textContent=k1p+'%';
  k2Score.textContent=k2p+'%';

  const a=pct(k2.filter(r=>r.type==='letterToSound'));
  const b=pct(k2.filter(r=>r.type==='soundToLetter'));
  const c=pct(k2.filter(r=>r.type==='beginningSound'));

  soundBreakdown.innerHTML=`
    <strong>Identify the sound of each consonant:</strong> ${a}%<br>
    <strong>Match a sound to the correct letter:</strong> ${b}%<br>
    <strong>Recognize beginning sounds:</strong> ${c}%<br><br>
    <strong>Current KLGA level:</strong> ${level}
  `;

  const result={
    student:state.studentName,grade:state.grade,window:state.window,
    k1:k1p,k2:k2p,overall,level,
    letterToSound:a,soundToLetter:b,beginningSound:c,
    date:new Date().toLocaleDateString()
  };

  const saved=JSON.parse(localStorage.getItem('klgaResultsV3')||'[]');
  saved.push(result);
  localStorage.setItem('klgaResultsV3',JSON.stringify(saved));
  showView('result');
}

function renderDashboard(){
  const results=JSON.parse(localStorage.getItem('klgaResultsV3')||'[]');
  resultsTableBody.innerHTML='';
  results.slice().reverse().forEach(r=>{
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${escapeHtml(r.student)}</td><td>${r.grade}</td><td>${r.window}</td><td>${r.k1}%</td><td>${r.k2}%</td><td><strong>${r.level}</strong></td><td>${r.date}</td>`;
    resultsTableBody.appendChild(tr);
  });
}
function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function exportCsv(){
  const results=JSON.parse(localStorage.getItem('klgaResultsV3')||'[]');
  const rows=[['Student','Grade','Window','K1 Alphabet','K2 Letter Sounds','Letter to Sound','Sound to Letter','Beginning Sounds','Overall','Level','Date']];
  results.forEach(r=>rows.push([r.student,r.grade,r.window,r.k1,r.k2,r.letterToSound,r.soundToLetter,r.beginningSound,r.overall,r.level,r.date]));
  const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\\n');
  const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='KLGA-results.csv';a.click();URL.revokeObjectURL(url);
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
  state=freshState();
  state.studentName=name;state.grade=grade;state.window=window;
  state.questions=buildTest();
  showView('test');renderQuestion();
};

nextQuestionBtn.onclick=submitCurrent;
exportCsvBtn.onclick=exportCsv;
clearResultsBtn.onclick=()=>{
  if(confirm('Clear all saved KLGA results in this browser?')){
    localStorage.removeItem('klgaResultsV3');
    renderDashboard();
  }
};
