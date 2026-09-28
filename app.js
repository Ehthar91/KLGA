const views = {
  home: document.getElementById('homeView'),
  setup: document.getElementById('studentSetupView'),
  test: document.getElementById('testView'),
  result: document.getElementById('resultView'),
  teacher: document.getElementById('teacherView')
};

const questions = [
  {id:1, level:1, domain:'Alphabet & Sounds', prompt:'Which choice is a Karen letter?', choices:['A','က','7','@'], answer:1},
  {id:2, level:1, domain:'Alphabet & Sounds', prompt:'Choose the Karen character.', choices:['B','တ','4','#'], answer:1},
  {id:3, level:2, domain:'Alphabet & Sounds', prompt:'Which item is written in Karen script?', choices:['Hello','မ','School','12'], answer:1},
  {id:4, level:2, domain:'Vocabulary', prompt:'Which answer means “white” from your Karen color vocabulary?', choices:['အသူ','အဝါ','အဘီ','အဂီၤ'], answer:1},
  {id:5, level:3, domain:'Vocabulary', prompt:'Which answer means “black”?', choices:['အသူ','အဝါ','အလါ','အဃး'], answer:0},
  {id:6, level:3, domain:'Vocabulary', prompt:'Which answer means “fish”?', choices:['တၢ်ညၣ်','ညၣ်','ဆီညၣ်','ထိးညၣ်'], answer:1},
  {id:7, level:4, domain:'Blending / Decoding', prompt:'Which item is a complete Karen word or phrase?', choices:['abc','123','လီၢ်မံ','xyz'], answer:2},
  {id:8, level:4, domain:'Vocabulary', prompt:'What does “လီၢ်မံ” mean?', choices:['Bed','Blanket','Pillow','Curtain'], answer:0},
  {id:9, level:4, domain:'Vocabulary', prompt:'What does “ယၢ်လုး” mean?', choices:['Mirror','Blanket','Fan','Clock'], answer:1},
  {id:10, level:5, domain:'Vocabulary', prompt:'What does “ခိၣ်သခၢၣ်” mean?', choices:['Pillow','Bed','Dresser','Hanger'], answer:0},
  {id:11, level:5, domain:'Sentence Structure', prompt:'Which English order matches the Karen sentence pattern used in class?', choices:[
    'Subject + Number + Verb + Object',
    'Subject + Verb Phrase + Object + Number + Amount Unit + Ending',
    'Object + Subject + Ending',
    'Number + Object + Subject'
  ], answer:1},
  {id:12, level:5, domain:'Sentence Structure', prompt:'In “ယအဲၣ်ဒိးပှ့ၤယၢ်လုးဃုဘ့ၣ်န့ၣ်လီၤ”, which part is the object?', choices:['ယ','အဲၣ်ဒိးပှ့ၤ','ယၢ်လုး','ဃု'], answer:2},
  {id:13, level:6, domain:'Sentence Structure', prompt:'Which part functions as the verb phrase in the class example?', choices:['ယ','အဲၣ်ဒိးပှ့ၤ','ယၢ်လုး','ဘ့ၣ်'], answer:1},
  {id:14, level:6, domain:'Reading Comprehension', prompt:'Read: “ယမၤလိတၢ်လၢဖုသၣ်ဖၠူၣ်ကၠိ”. What type of task is this question testing?', choices:['Reading comprehension','Math','Science','Typing speed'], answer:0},
  {id:15, level:6, domain:'Reading Comprehension', prompt:'Read: “အဝဲအိၣ်လၢဝ့ၢ်မၠီမၠး”. Which skill is needed most to answer a meaning question about this sentence?', choices:['Reading understanding','Keyboard speed','Drawing','Counting'], answer:0},
  {id:16, level:7, domain:'Reading Comprehension', prompt:'Read: “နီၢ်ဘၠူလၣ်လဲၤဆူဖၠါပူၤ”. Which response best shows comprehension?', choices:[
    'Identifying where the person went',
    'Naming a color',
    'Typing random letters',
    'Counting syllables only'
  ], answer:0},
  {id:17, level:7, domain:'Advanced Application', prompt:'Which task best measures independent Karen language application?', choices:[
    'Copying a word exactly',
    'Choosing the best translation from context',
    'Typing the alphabet repeatedly',
    'Matching identical symbols'
  ], answer:1},
  {id:18, level:8, domain:'Advanced Application', prompt:'Which task requires the highest language reasoning?', choices:[
    'Recognize one letter',
    'Match one memorized word',
    'Infer sentence meaning from context',
    'Copy a sentence'
  ], answer:2},
  {id:19, level:8, domain:'Reading Comprehension', prompt:'A student reads a short passage and answers “why” and “what happened first” questions. Which level of reading is being measured?', choices:[
    'Letter recognition',
    'Simple copying',
    'Passage comprehension',
    'Keyboard familiarity'
  ], answer:2},
  {id:20, level:9, domain:'Advanced Application', prompt:'Which item should carry the most weight in a K9 benchmark?', choices:[
    'Single-letter recognition',
    'Basic color matching',
    'Independent comprehension and language application',
    'Copying a known word'
  ], answer:2}
];

let state = {
  studentName:'',
  grade:'',
  window:'',
  currentLevel:5,
  asked:[],
  correct:0,
  responses:[],
  currentQuestion:null,
  selected:null,
  targetCount:15,
  streakCorrect:0,
  streakWrong:0
};

function showView(name){
  Object.values(views).forEach(v => v.classList.add('hidden'));
  views[name].classList.remove('hidden');
}

function resetState(){
  state = {
    studentName:'',
    grade:'',
    window:'',
    currentLevel:5,
    asked:[],
    correct:0,
    responses:[],
    currentQuestion:null,
    selected:null,
    targetCount:15,
    streakCorrect:0,
    streakWrong:0
  };
}

function questionCandidates(){
  let candidates = questions.filter(q => !state.asked.includes(q.id) && q.level === state.currentLevel);
  if (!candidates.length) {
    candidates = questions.filter(q => !state.asked.includes(q.id));
    candidates.sort((a,b) => Math.abs(a.level-state.currentLevel) - Math.abs(b.level-state.currentLevel));
  }
  return candidates;
}

function nextAdaptiveQuestion(){
  const candidates = questionCandidates();
  if (!candidates.length || state.asked.length >= state.targetCount) {
    finishTest();
    return;
  }
  const q = candidates[Math.floor(Math.random() * Math.min(candidates.length, 3))];
  state.currentQuestion = q;
  state.selected = null;
  state.asked.push(q.id);
  renderQuestion();
}

function renderQuestion(){
  const q = state.currentQuestion;
  document.getElementById('questionDomain').textContent = q.domain;
  document.getElementById('questionNumber').textContent = state.asked.length;
  document.getElementById('questionTotal').textContent = state.targetCount;
  document.getElementById('currentDifficulty').textContent = 'K' + q.level;
  document.getElementById('questionPrompt').textContent = q.prompt;
  document.getElementById('progressBar').style.width = `${(state.asked.length-1)/state.targetCount*100}%`;

  const wrap = document.getElementById('answerChoices');
  wrap.innerHTML = '';
  q.choices.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = choice;
    btn.addEventListener('click', () => {
      [...wrap.children].forEach(c => c.classList.remove('selected'));
      btn.classList.add('selected');
      state.selected = i;
      document.getElementById('nextQuestionBtn').disabled = false;
    });
    wrap.appendChild(btn);
  });
  document.getElementById('nextQuestionBtn').disabled = true;
}

function submitCurrent(){
  if (state.selected === null) return;
  const q = state.currentQuestion;
  const isCorrect = state.selected === q.answer;
  if (isCorrect) {
    state.correct++;
    state.streakCorrect++;
    state.streakWrong = 0;
  } else {
    state.streakWrong++;
    state.streakCorrect = 0;
  }

  state.responses.push({
    id:q.id, level:q.level, domain:q.domain, correct:isCorrect
  });

  // Adaptive rule:
  // 2 correct in a row -> move up one level.
  // 2 incorrect in a row -> move down one level.
  // Otherwise stay at current level.
  if (state.streakCorrect >= 2) {
    state.currentLevel = Math.min(9, state.currentLevel + 1);
    state.streakCorrect = 0;
  } else if (state.streakWrong >= 2) {
    state.currentLevel = Math.max(1, state.currentLevel - 1);
    state.streakWrong = 0;
  }

  nextAdaptiveQuestion();
}

function calculateLevel(){
  if (!state.responses.length) return 1;
  // Weighted ability estimate:
  // correct answers contribute question level;
  // incorrect answers contribute slightly below question level.
  const total = state.responses.reduce((sum, r) => sum + (r.correct ? r.level : Math.max(1, r.level - 1.5)), 0);
  const avg = total / state.responses.length;
  return Math.max(1, Math.min(9, Math.round(avg)));
}

function calculateBenchmarkScore(level, accuracy){
  // Simple MVP 100–250 score scale.
  // Later this can be replaced with IRT/Rasch calibration.
  return Math.round(95 + level * 15 + (accuracy - 50) * 0.45);
}

function finishTest(){
  const accuracy = state.responses.length ? (state.correct / state.responses.length * 100) : 0;
  const level = calculateLevel();
  const score = calculateBenchmarkScore(level, accuracy);

  document.getElementById('resultStudentName').textContent = state.studentName;
  document.getElementById('resultLevel').textContent = 'K' + level;
  document.getElementById('resultScore').textContent = score;
  document.getElementById('resultAccuracy').textContent = Math.round(accuracy) + '%';
  document.getElementById('resultQuestionCount').textContent = state.responses.length;

  const domainWrap = document.getElementById('domainResults');
  domainWrap.innerHTML = '';
  const domains = [...new Set(state.responses.map(r => r.domain))];
  domains.forEach(domain => {
    const rows = state.responses.filter(r => r.domain === domain);
    const pct = Math.round(rows.filter(r => r.correct).length / rows.length * 100);
    const row = document.createElement('div');
    row.className = 'domain-row';
    row.innerHTML = `
      <strong>${domain}</strong>
      <div class="domain-track"><div class="domain-fill" style="width:${pct}%"></div></div>
      <span>${pct}%</span>`;
    domainWrap.appendChild(row);
  });

  const result = {
    student: state.studentName,
    grade: state.grade,
    window: state.window,
    score,
    level: 'K' + level,
    accuracy: Math.round(accuracy),
    date: new Date().toLocaleDateString(),
    domains: Object.fromEntries(domains.map(domain => {
      const rows = state.responses.filter(r => r.domain === domain);
      const pct = Math.round(rows.filter(r => r.correct).length / rows.length * 100);
      return [domain, pct];
    }))
  };

  const saved = JSON.parse(localStorage.getItem('karenBenchmarkResults') || '[]');
  saved.push(result);
  localStorage.setItem('karenBenchmarkResults', JSON.stringify(saved));

  document.getElementById('progressBar').style.width = '100%';
  showView('result');
}

function renderDashboard(){
  const results = JSON.parse(localStorage.getItem('karenBenchmarkResults') || '[]');
  document.getElementById('dashCount').textContent = results.length;
  if (results.length) {
    const avgScore = Math.round(results.reduce((s,r)=>s+r.score,0)/results.length);
    const avgLevelNum = Math.round(results.reduce((s,r)=>s+Number(r.level.replace('K','')),0)/results.length);
    document.getElementById('dashAverage').textContent = avgScore;
    document.getElementById('dashLevel').textContent = 'K' + avgLevelNum;
  } else {
    document.getElementById('dashAverage').textContent = '—';
    document.getElementById('dashLevel').textContent = '—';
  }

  const tbody = document.getElementById('resultsTableBody');
  tbody.innerHTML = '';
  results.slice().reverse().forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(r.student)}</td>
      <td>${r.grade}</td>
      <td>${r.window}</td>
      <td>${r.score}</td>
      <td><strong>${r.level}</strong></td>
      <td>${r.accuracy}%</td>
      <td>${r.date}</td>`;
    tbody.appendChild(tr);
  });
}

function escapeHtml(s=''){
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function exportCsv(){
  const results = JSON.parse(localStorage.getItem('karenBenchmarkResults') || '[]');
  const rows = [['Student','Grade','Window','Score','Level','Accuracy','Date']];
  results.forEach(r => rows.push([r.student,r.grade,r.window,r.score,r.level,r.accuracy,r.date]));
  const csv = rows.map(row => row.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'karen-benchmark-results.csv';
  a.click();
  URL.revokeObjectURL(url);
}

document.getElementById('startStudentBtn').onclick = () => showView('setup');
document.getElementById('studentModeBtn').onclick = () => showView('setup');
document.getElementById('startTeacherBtn').onclick = () => { renderDashboard(); showView('teacher'); };
document.getElementById('teacherModeBtn').onclick = () => { renderDashboard(); showView('teacher'); };
document.querySelectorAll('[data-home]').forEach(b => b.onclick = () => showView('home'));
document.getElementById('returnHomeBtn').onclick = () => { resetState(); showView('home'); };

document.getElementById('beginTestBtn').onclick = () => {
  const name = document.getElementById('studentName').value.trim();
  const grade = document.getElementById('studentGrade').value;
  const window = document.getElementById('testWindow').value;
  if (!name || !grade) {
    alert('Please enter student name and grade.');
    return;
  }
  resetState();
  state.studentName = name;
  state.grade = grade;
  state.window = window;
  showView('test');
  nextAdaptiveQuestion();
};

document.getElementById('nextQuestionBtn').onclick = submitCurrent;
document.getElementById('exportCsvBtn').onclick = exportCsv;
document.getElementById('clearResultsBtn').onclick = () => {
  if (confirm('Clear all saved benchmark results in this browser?')) {
    localStorage.removeItem('karenBenchmarkResults');
    renderDashboard();
  }
};
