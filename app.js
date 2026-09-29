
/* ---------------------------
   FIREBASE BRIDGE
   Uses window.KLGAFirebase when firebase-app.js is configured.
   Falls back to localStorage when Firebase is unavailable.
---------------------------- */

async function fbReady(){
  return !!(window.KLGAFirebase && window.KLGAFirebase.ready);
}

async function cloudLoadRoster(){
  if(await fbReady()) return await window.KLGAFirebase.getRoster();
  return loadRoster();
}

async function cloudSaveStudent(student){
  if(await fbReady()) return await window.KLGAFirebase.saveStudent(student);
  const roster=loadRoster();
  const i=roster.findIndex(s=>s.key===student.key);
  if(i>=0) roster[i]=student; else roster.push(student);
  saveRoster(roster);
}

async function cloudDeleteStudent(key){
  if(await fbReady()) return await window.KLGAFirebase.deleteStudent(key);
  saveRoster(loadRoster().filter(s=>s.key!==key));
}

async function cloudLoadSessions(){
  if(await fbReady()) return await window.KLGAFirebase.getSessions();
  return loadSessions();
}

async function cloudSaveSession(session){
  if(await fbReady()) return await window.KLGAFirebase.saveSession(session);
  const sessions=loadSessions();
  const i=sessions.findIndex(s=>s.key===session.key);
  if(i>=0) sessions[i]=session; else sessions.push(session);
  saveSessions(sessions);
}

async function cloudDeleteSession(key){
  if(await fbReady()) return await window.KLGAFirebase.deleteSession(key);
  saveSessions(loadSessions().filter(s=>s.key!==key));
}

async function cloudSaveResult(result){
  if(await fbReady()) return await window.KLGAFirebase.saveResult(result);
  const saved=JSON.parse(localStorage.getItem('klgaFiveLevelResults')||'[]');
  saved.push(result);
  localStorage.setItem('klgaFiveLevelResults',JSON.stringify(saved));
}

async function cloudJoinSession(name,password){
  if(await fbReady()) return await window.KLGAFirebase.findActiveSession(name,password);
  const sessions=loadSessions();
  return sessions.find(s=>s.status==='Active' && s.name===name && s.password===password) || null;
}

async function cloudSetStudentJoin(sessionKey,studentKey,status){
  if(await fbReady()) return await window.KLGAFirebase.setStudentStatus(sessionKey,studentKey,status);
  return true;
}


const consonants=[
{l:'က',s:'Ka'},{l:'ခ',s:'Ka'},{l:'ဂ',s:'Ga'},{l:'ဃ',s:'Kha'},{l:'င',s:'Ngah'},{l:'စ',s:'Sa'},{l:'ဆ',s:'Cha'},{l:'ရှ',s:'Sha'},{l:'ည',s:'Nya'},{l:'တ',s:'Ta'},{l:'ထ',s:'Ta'},{l:'ဒ',s:'Da'},{l:'န',s:'Na'},{l:'ပ',s:'Pa'},{l:'ဖ',s:'Pa'},{l:'ဘ',s:'Ba'},{l:'မ',s:'Ma'},{l:'ယ',s:'Ya'},{l:'ရ',s:'Ra'},{l:'လ',s:'La'},{l:'ဝ',s:'Wa'},{l:'သ',s:'Tha'},{l:'ဟ',s:'Ha'},{l:'အ',s:'Ah'},{l:'ဧ',s:'Ahh'}
];
const vowels=[{v:'ါ',s:'Ah'},{v:'ံ',s:'Ee'},{v:'ၢ',s:'Uh'},{v:'ု',s:'Eu'},{v:'ူ',s:'Oo'},{v:'့',s:'Ay/Ae'},{v:'ဲ',s:'Eh'},{v:'ိ',s:'Oe'},{v:'ီ',s:'Aw'}];
const blends=[{m:'ၠ',s:'Ya',suffix:'y'},{m:'ြ',s:'Ra',suffix:'r'},{m:'ျ',s:'La',suffix:'l'},{m:'ွ',s:'Wa',suffix:'w'},{m:'ှ',s:'Ga',suffix:'g'}];
const tones=[{m:'ၢ်',n:'Uh Thee'},{m:'ာ်',n:'Ah Thee'},{m:'ၣ်',n:'Ha Thee'},{m:'း',n:'Pluh See'},{m:'ၤ',n:'Kay Poe'}];

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
const k9Bank=[{"phrase": "ယမၤလိတၢ်လၢဖုသၣ်ဖၠူၣ်ကၠိ", "sound": "Yer Ma Loe Ta Luh Peu Tha Pyoo Joe"}, {"phrase": "ယကၠိခိၣ်မ့ၢ်သရၣ်ကၠိစဲး", "sound": "Yer Joe Koe May Ther Ra Joe Seh"}, {"phrase": "အဝဲအိၣ်လၢဝ့ၢ်မၠီမၠး", "sound": "Ah Weh Oe Luh Way Mya Mya"}, {"phrase": "အပါမံၤလၢစီၤဖါကၠါ", "sound": "Ah Pah Mee Luh Saw Pah Jah"}, {"phrase": "ဖါတံၢ်ဆါနၤပၠါလၢဖၠါပူၤ", "sound": "Pah Tee Chah Na Pyah Luh Pyah Poo"}, {"phrase": "မီၣ်လမၠဲၣ်အိၣ်ဘူးဒီးဘလူကၠိ", "sound": "Maw Ler Myeh Oe Boo Daw Ber Loo Joe"}, {"phrase": "ပတ့အီၣ်ကိၣ်ဒီးဘုကၠူၣ်ကမူၣ်", "sound": "Per Tay Aw Koe Daw Beu Joo Ker Moo"}, {"phrase": "နီၢ်ဘၠူလၣ်လဲၤဆူဖၠါပူၤ", "sound": "Naw Byoo Lah Leh Choo Pyah Poo"}, {"phrase": "ဘီကီးမ့ၢ်ကၠီၣ်တဲၣ်ဝ့ၢ်ခိၣ်", "sound": "Baw Kaw May Jaw Teh Way Koe"}, {"phrase": "ယကထီၣ်ဖၠၣ်စိမိၤကၠိ", "sound": "Yer Ker Taw Pya Soe Moe Joe"}, {"phrase": "မၠ့းကၠံနါမ့ၢ်ကခၠ့ၣ်ဝ့ၢ်ခိၣ်", "sound": "Myay Jee Nah May Ker Chay Way Koe"}, {"phrase": "ကခၠ့ၣ်ကသံၣ်သွံၣ်န့ၣ်အမံၤဒိၣ်", "sound": "Ker Chay Ker Thee Thwee Nay Ah Mee Doe"}, {"phrase": "အပၠီးမ့ၢ်ဝဲခၠီကလုာ်တဂၤလီၤ", "sound": "Ah Pyaw May Weh Chaw Ker Leu Ter Ga Law"}, {"phrase": "ထိၣ်ကၠၢဖိစီၢ်လီၤလၢသ့ၣ်ခံ", "sound": "Toe Juh Poe Saw Law Luh Thay Kee"}, {"phrase": "ကၠၢမနံၣ်ဖိန့ၣ်ပကိးလၢကၠၢမဲလီၤ", "sound": "Juh Mer Nee Poe Nay Per Koe Luh Juh Meh Law"}, {"phrase": "ဘးအူကၠံအပၢ်မ့ၢ်ဖုသၣ်မၠးကၠံလီၤ", "sound": "Ba Oo Jee Ah Pa May Peu Tha Mya Jee Law"}, {"phrase": "တြီယၤတဂ့ၤ", "sound": "Traw Ya Ter Gay"}, {"phrase": "ယတမၤကြီတၢ်ဘၣ်", "sound": "Yer Ter Ma Kraw Ta Ba"}, {"phrase": "ယကြၢးမၤတၢ်ဂ့ၤလီၤ", "sound": "Yer Kruh Ma Ta Gay Law"}, {"phrase": "တလိၣ်ပတြၢၤယၤဘၣ်", "sound": "Ter Loe Per Truh Ya Ba"}, {"phrase": "ကးဘၢဃာ်ဆီအပဲတြီ", "sound": "Ka Buh Kha Chaw Ah Peh Traw"}, {"phrase": "လံာ်ကြီကြာ်ကထံၣ်ဘၣ်အီၤ", "sound": "Lee Kraw Kra Ker Tee Ba Aw"}, {"phrase": "တၢ်နၢသြီၣ်နၢမူဘၣ်ယၤ", "sound": "Ta Nuh Thraw Nuh Moo Ba Ya"}, {"phrase": "အဖီအိၣ်ပြံကဒံပြီးကဒီးပြး", "sound": "Ah Paw Oe Pree Ker Dee Praw Ker Daw Pra"}, {"phrase": "ပြုကလၤဟဲက့ၤဟဲက့ၤ", "sound": "Preu Ker La Heh Kay Heh Kay"}, {"phrase": "တဘၣ်အိၣ်ပြံပြါတဂ့ၤ", "sound": "Ter Ba Oe Pree Prah Ter Gay"}, {"phrase": "ထုးခြါထီၣ်နသးတစဲး", "sound": "Teu Khrah Taw Ner Tha Ter Seh"}, {"phrase": "ဟးအူပြိကလံၤဘၣ်ဒး", "sound": "Ha Oo Proe Ker Lee Ba Da"}, {"phrase": "နီၢ်ပြံလၣ်မံသါသီၣ်ခြီးခြီး", "sound": "Naw Pree La Mee Thah Thaw Khraw Khraw"}, {"phrase": "ထိၣ်သတြီၤနသးဒီးအီၤ", "sound": "Toe Ther Traw Ner Tha Daw Aw"}, {"phrase": "မုၢ်ဆဲးလီၤကပြုၢ်ကပြီၤ", "sound": "Meu Cheh Law Ker Preu Ker Praw"}, {"phrase": "ယအိၣ်လၢတၢ်ကြဲၢ်သဝီ", "sound": "Yer Oe Luh Ta Kreh Ther Waw"}, {"phrase": "ကျီပျီထီၣ်ကျဲတက့ၢ်", "sound": "Klaw Plaw Taw Kleh Ter Kay"}, {"phrase": "ပျီၤယုၢ်သၣ်ချံကဘၣ်နၤ", "sound": "Plaw Yeu Tha Khlee Ker Ba Na"}, {"phrase": "ကဟးဖျိးဘၣ်ဖုးကျဲ", "sound": "Ker Ha Ploe Ba Peu Kleh"}, {"phrase": "ခးတပျာ်ချံၣ်ပျၢ်သၢထံၣ်", "sound": "Ka Ter Pla Khlee Pla Thuh Tee"}, {"phrase": "ထီပျီာ်ဖီကဖျီအသး", "sound": "Taw Plaw Paw Ker Plaw Ah Tha"}, {"phrase": "ပျဲအကျဲယံၤယံၤတစဲး", "sound": "Pleh Ah Kleh Yee Yee Ter Seh"}, {"phrase": "ဟးပူၤဖျဲးနသးချ့ချ့", "sound": "Ha Poo Pleh Ner Tha Khlay Khlay"}, {"phrase": "အပျ့ၤတဘ့ၣ်စၢ်ဘျဲးဘျီး", "sound": "Ah Play Ter Bay Sa Bleh Blaw"}, {"phrase": "ဟးဖျ့ဖျိလၢကျဲပူၤဘၣ်ဒး", "sound": "Ha Play Ploe Luh Kleh Poo Ba Da"}, {"phrase": "ဝၣ်ဒ့ကဖျ့ဘၣ်ဖုးနမဲာ်ချံ", "sound": "Wa Day Ker Play Ba Peu Ner Meh Khlee"}, {"phrase": "ပျဲဂဲၤဖိသၣ်လၢပျဲၢ်စီၢ်ခိၣ်တဂ့ၤ", "sound": "Pleh Geh Poe Tha Luh Pleh Saw Koe Ter Gay"}, {"phrase": "ပျဲဟးအီၤဆူပျီပူၤတက့ၢ်", "sound": "Pleh Ha Aw Choo Plaw Poo Ter Kay"}, {"phrase": "ပျ့ၣ်ကျိပူၤညၣ်ပျာ်အိၣ်အါမး", "sound": "Play Kloe Poo Nya Pla Oe Ah Ma"}, {"phrase": "ချိၣ်ဟးတချ့အါအါဘၣ်", "sound": "Khloe Ha Ter Khlay Ah Ah Ba"}, {"phrase": "ယသးပျံၤမဲာ်တဲာ်ချဲးအါ", "sound": "Yer Tha Plee Meh Teh Khleh Ah"}, {"phrase": "ကျ့ထီၣ်ဃဲာ်ပကကျီဝၣ်", "sound": "Klay Taw Kheh Per Ker Klaw Wa"}, {"phrase": "ကွၢ်ဃုနကွါတက့ၢ်", "sound": "Kwa Kheu Ner Kwah Ter Kay"}, {"phrase": "ညၣ်ကွီမဲၢ်အိၣ်လၢကွံပူၤ", "sound": "Nya Kwaw Meh Oe Luh Kwee Poo"}, {"phrase": "ကွဲးကွံးကွးဟံၣ်ဒူၣ်တဂ့ၤ", "sound": "Kweh Kwee Kwa Hee Doo Ter Gay"}, {"phrase": "ကွံာ်ကွဲၢ်လဲၢ်ဘီလၢလၢၢ်တဂ့ၤ", "sound": "Kwee Kweh Leh Baw Luh Luh Ter Gay"}, {"phrase": "ကွၢ်သကွ့ၤတၢ်လၢနဃၢၤ", "sound": "Kwa Ther Kway Ta Luh Ner Khuh"}, {"phrase": "ကွဲးဟ့ၣ်ယုၢ်စံၣ်ညီၣ်ကွီၢ်အလံာ်", "sound": "Kweh Hay Yeu See Nyaw Kwaw Ah Lee"}, {"phrase": "လဲၤဟးကွၢ်ကီကွဲၢ်ကဘီလ့", "sound": "Leh Ha Kwa Kaw Kweh Ker Baw Lay"}, {"phrase": "ကွံာ်လီၤလၢၢ်ဆူကွံပူၤ", "sound": "Kwee Law Luh Choo Kwee Poo"}, {"phrase": "ခွဲပျီဟံၣ်ပူၤဒီးနီၣ်ခွဲ", "sound": "Khweh Plaw Hee Poo Daw Naw Khweh"}, {"phrase": "ကွၢ်ထွဲနဒ့မုၣ်ဂ့ၤဂ့ၤ", "sound": "Kwa Tweh Ner Day Meu Gay Gay"}, {"phrase": "ခွဲးခွးတၢ်ကပီာ်နၢၤနၢၤ", "sound": "Khweh Khwa Ta Ker Paw Nuh Nuh"}, {"phrase": "ခွံၣ်ယဲၤဖုဖျိးဝဲဒၣ်ယံၤမး", "sound": "Khwee Yeh Peu Ploe Weh Da Yee Ma"}, {"phrase": "စီၤဖါခွဲၣ်ဟးအခီၣ်ခွ့ခွီ", "sound": "Saw Pah Khweh Ha Ah Kaw Khway Khwaw"}, {"phrase": "ယတခွါလဲၤသးဝံၣ်ခွါယၢၢ်", "sound": "Yer Ter Khwah Leh Tha Wee Khwah Yuh"}, {"phrase": "ခွံခိၣ်ခွံနၢ်ဝံၤအီၣ်တကွံသၣ်", "sound": "Khwee Koe Khwee Na Wee Aw Ter Kwee Tha"}, {"phrase": "ယဒ့ဖိကွဲးကွ့ကွီယမဲာ်", "sound": "Yer Day Poe Kweh Kway Kwaw Yer Meh"}, {"phrase": "ပှိၢ်စှီၤဘှဲမ့ၢ်ကညီတကလုာ်ဃီ", "sound": "Pgoe Sgaw Bgeh May Ker Nyaw Ter Ker Leu Khaw"}, {"phrase": "ဟးကဘှၢဒ်သိးချိၣ်တဂ့ၤ", "sound": "Ha Ker Bguh Da Thoe Khloe Ter Gay"}, {"phrase": "နီၢ်သးဖှံဘှီထီၣ်အထၣ်", "sound": "Naw Tha Pgee Bgaw Taw Ah Ta"}, {"phrase": "ခွံထီၣ်ခိၣ်ကဆှဲကဆှီ", "sound": "Khwee Taw Koe Ker Chgeh Ker Chgaw"}, {"phrase": "ခ့ဘှ့အ့ၣ်ဖှီတၢ်ဖိညီၤ", "sound": "Kay Bgay Ay Pgaw Ta Poe Nyaw"}, {"phrase": "ဖှံလီၤန့ၢ်ထိၣ်ဖှံးဖိဆၣ်", "sound": "Pgee Law Nay Toe Pgee Poe Cha"}, {"phrase": "ဖှဲးသ့ၣ်ဖးဆှီအဟၢဖၢ", "sound": "Pgeh Thay Pa Chgaw Ah Huh Puh"}, {"phrase": "ကဆ့ၣ်နီၤအီၣ်မ့ၤဘှၢဘှၢ", "sound": "Ker Chay Naw Aw May Bguh Bguh"}, {"phrase": "မၤသီၣ်စှၢၢ်စှံးတဂ့ၤ", "sound": "Ma Thaw Sguh Sgee Ter Gay"}, {"phrase": "ဖါတံၢ်လဲၤပှ့ၤတကီၤဆံၣ်သၣ်", "sound": "Pah Tee Leh Pgay Ter Kaw Chee Tha"}, {"phrase": "ဆှဲးဆှုလီၤတဲာ်တၢၢ်နၢမှဲဒၢ", "sound": "Chgeh Chgeu Law Teh Tuh Nuh Mgeh Duh"}, {"phrase": "ဖုသးပှၢ်ကွၢ်ထွဲအလံၤ", "sound": "Peu Tha Pga Kwa Tweh Ah Lee"}, {"phrase": "ကမၢနဘှီတၢ်တမံၤ", "sound": "Ker Muh Ner Bgaw Ta Ter Mee"}, {"phrase": "ဘှီနဲသပှၢ်ပှၢ်တက့ၢ်", "sound": "Bgaw Neh Ther Pga Pga Ter Kay"}, {"phrase": "တၢ်ဘှံးသးကသါဘှၢဘှၢ", "sound": "Ta Bgee Tha Ker Thah Bguh Bguh"}, {"phrase": "နံၤကမှံပှဲၤဒီးသးဖှံ", "sound": "Nee Ker Mgee Pgeh Daw Tha Pgee"}];



function q(skill,domain,type,instruction,prompt,choices,correct,promptClass='',choiceClass=''){
 return{skill,domain,type,instruction,prompt,choices,answer:choices.indexOf(correct),promptClass,choiceClass}
}

/* ---------------------------
   QUESTION GENERATORS
   Each function returns a pool. The adaptive engine samples
   only the items it needs for the current level.
---------------------------- */

function makeK1Pool(){
 return shuffle(consonants).map(x=>{
   const ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);
   return q('K1','Alphabet Recognition','recognition','Select the matching letter.',x.l,ch,x.l,'karen-large','karen');
 });
}

function makeK2Pool(){
 const out=[];
 consonants.forEach(x=>{
   const ss=[...new Set(consonants.map(z=>z.s))];
   let ch=shuffle([x.s,...wrong(ss,x.s)]);
   out.push(q('K2','Letter Sounds','letterToSound','What sound does this letter make?',x.l,ch,x.s,'karen-large',''));
   ch=shuffle([x.l,...wrong(consonants.map(z=>z.l),x.l)]);
   out.push(q('K2','Letter Sounds','soundToLetter','Which letter makes this sound?',x.s,ch,x.l,'','karen'));
 });
 return shuffle(out);
}

function makeK3Pool(){
 const out=[];
 vowels.forEach(x=>{
   let ch=shuffle([x.s,...wrong(vowels.map(z=>z.s),x.s)]);
   out.push(q('K3','Vowel Recognition','vowelToSound','What sound does this vowel make?',x.v,ch,x.s,'karen-large',''));
   ch=shuffle([x.v,...wrong(vowels.map(z=>z.v),x.v)]);
   out.push(q('K3','Vowel Recognition','soundToVowel','Which vowel makes this sound?',x.s,ch,x.v,'','karen'));
 });
 return shuffle(out);
}

function makeK4Pool(){
 const out=[];
 cvBank.forEach(x=>{
   const soundPool=[...new Set(cvBank.filter(z=>z.c.l===x.c.l).map(z=>z.s))];
   let ch=shuffle([x.s,...wrong(soundPool,x.s)]);
   out.push(q('K4','Alphabet + Vowel','writtenToSound','Read this combination.',x.w,ch,x.s,'karen-large',''));
   const writtenPool=cvBank.filter(z=>z.c.l===x.c.l).map(z=>z.w);
   ch=shuffle([x.w,...wrong(writtenPool,x.w)]);
   out.push(q('K4','Alphabet + Vowel','soundToWritten','Which written combination matches this sound?',x.s,ch,x.w,'','karen'));
 });
 return shuffle(out);
}

function makeK5Pool(){
 const out=[];
 tones.forEach(t=>{
   let ch=shuffle([t.m,...wrong(tones.map(x=>x.m),t.m)]);
   out.push(q('K5','Tone Recognition','identifyTone','Select the matching tone mark.',t.m,ch,t.m,'karen-large','karen'));
   ch=shuffle([t.n,...wrong(tones.map(x=>x.n),t.n)]);
   out.push(q('K5','Tone Recognition','toneToName','What is the name of this tone?',t.m,ch,t.n,'karen-large',''));
   ch=shuffle([t.m,...wrong(tones.map(x=>x.m),t.m)]);
   out.push(q('K5','Tone Recognition','nameToTone','Which tone mark is called "'+t.n+'"?',t.n,ch,t.m,'','karen'));
 });
 return shuffle(out);
}

function makeK6Pool(){
 const out=[];
 blends.forEach(b=>{
   let ch=shuffle([b.m,...wrong(blends.map(x=>x.m),b.m)]);
   out.push(q('K6','Blend Sound Recognition','identifyBlend','Select the matching blend symbol.',b.m,ch,b.m,'karen-large','karen'));
   ch=shuffle([b.s,...wrong(blends.map(x=>x.s),b.s)]);
   out.push(q('K6','Blend Sound Recognition','blendToSound','What sound does this blend symbol make?',b.m,ch,b.s,'karen-large',''));
   ch=shuffle([b.m,...wrong(blends.map(x=>x.m),b.m)]);
   out.push(q('K6','Blend Sound Recognition','soundToBlend','Which blend symbol makes this sound?',b.s,ch,b.m,'','karen'));
 });
 return shuffle(out);
}

function makeK7Pool(){
 const out=[];
 blendBank.forEach(x=>{
   const soundPool=[...new Set(blendBank.map(z=>z.s))];
   let ch=shuffle([x.s,...wrong(soundPool,x.s)]);
   out.push(q('K7','Alphabet + Blend','readBlend','Read this alphabet + blend combination.',x.w,ch,x.s,'karen-large',''));
   ch=shuffle([x.s,...wrong(soundPool,x.s)]);
   out.push(q('K7','Alphabet + Blend','pronunciation','Which is the correct pronunciation?',x.w,ch,x.s,'karen-large',''));
   const writtenPool=blendBank.map(z=>z.w);
   ch=shuffle([x.w,...wrong(writtenPool,x.w)]);
   out.push(q('K7','Alphabet + Blend','soundToWritten','Which written combination matches this sound?',x.s,ch,x.w,'','karen'));
 });
 return shuffle(out);
}

function makeK8Pool(){
 const out=[];
 k8Bank.forEach(x=>{
   const soundPool=[...new Set(k8Bank.map(z=>z.s))];
   let ch=shuffle([x.s,...wrong(soundPool,x.s)]);
   out.push(q('K8','Alphabet + Blend + Vowel','readABV','Read this alphabet + blend + vowel combination.',x.w,ch,x.s,'karen-large',''));
   ch=shuffle([x.s,...wrong(soundPool,x.s)]);
   out.push(q('K8','Alphabet + Blend + Vowel','pronunciationABV','Which is the correct pronunciation?',x.w,ch,x.s,'karen-large',''));
   const writtenPool=k8Bank.map(z=>z.w);
   ch=shuffle([x.w,...wrong(writtenPool,x.w)]);
   out.push(q('K8','Alphabet + Blend + Vowel','soundToWrittenABV','Which written combination matches this sound?',x.s,ch,x.w,'','karen'));
 });
 return shuffle(out);
}

function poolForLevel(level){
 return ({
   1:makeK1Pool,2:makeK2Pool,3:makeK3Pool,4:makeK4Pool,
   5:makeK5Pool,6:makeK6Pool,7:makeK7Pool,8:makeK8Pool,9:makeK9Pool
 })[level]();
}



const validSoundGroups = {
  // Common alphabet/base sound families used in the current reading guide
  alphabet: [
    'Ker','Kher','Ger','Nger','Ser','Cher','Sher','Nyer',
    'Ter','Der','Ner','Per','Ber','Mer','Yer','Rer','Ler','Wer','Ther','Her','Ah'
  ],

  // Valid vowel-based syllable endings from the teacher-defined vowel system
  vowelEndings: [
    'ah','ee','uh','eu','oo','ay','eh','oe','aw'
  ],

  // Valid blend onsets currently used in the KLGA banks / reading guide
  blendOnsets: [
    'Ja','Cha','Kra','Kla','Kwa','Khra','Khla','Khwa',
    'Chga','Tra','Twa','Tga','Dra','Dwa',
    'Pya','Pra','Pla','Pwa','Pga',
    'Bya','Bra','Bla','Bwa','Bga',
    'Mya','Mra','Mla','Mwa','Mga',
    'Ywa','Lwa','Thra','Thla','Thwa','Hwa'
  ]
};

function replaceOneValidComponent(sound, mode){
 const tokens=sound.split(' ');
 if(!tokens.length) return sound;

 const order=shuffle(tokens.map((_,i)=>i));

 for(const idx of order){
   const token=tokens[idx];

   // 1) Change a bare alphabet sound to another real alphabet sound.
   if(mode==='alphabet' || mode==='any'){
     if(validSoundGroups.alphabet.includes(token)){
       const options=validSoundGroups.alphabet.filter(x=>x!==token);
       if(options.length){
         const out=[...tokens];
         out[idx]=shuffle(options)[0];
         return out.join(' ');
       }
     }
   }

   // 2) Change only the vowel ending while keeping the onset.
   if(mode==='vowel' || mode==='any'){
     const lower=token.toLowerCase();
     for(const ending of [...validSoundGroups.vowelEndings].sort((a,b)=>b.length-a.length)){
       if(lower.endsWith(ending) && token.length>ending.length){
         const onset=token.slice(0,token.length-ending.length);
         const options=validSoundGroups.vowelEndings.filter(v=>v!==ending);
         if(options.length){
           const newEnding=shuffle(options)[0];
           const out=[...tokens];
           out[idx]=onset+newEnding;
           return out.join(' ');
         }
       }
     }
   }

   // 3) Swap a known blend syllable/onset with another valid blend sound.
   if(mode==='blend' || mode==='any'){
     for(const blend of validSoundGroups.blendOnsets){
       if(token.startsWith(blend)){
         const rest=token.slice(blend.length);
         const options=validSoundGroups.blendOnsets.filter(x=>x!==blend);
         if(options.length){
           const out=[...tokens];
           out[idx]=shuffle(options)[0]+rest;
           return out.join(' ');
         }
       }
     }
   }
 }

 return sound;
}

function makeCloseDistractors(correct){
 const choices=new Set([correct]);

 // First close distractor: valid vowel change when possible.
 let d1=replaceOneValidComponent(correct,'vowel');
 if(d1===correct) d1=replaceOneValidComponent(correct,'any');
 choices.add(d1);

 // Second close distractor: valid alphabet/blend change when possible.
 let d2=replaceOneValidComponent(correct,'blend');
 if(d2===correct || choices.has(d2)) d2=replaceOneValidComponent(correct,'alphabet');
 if(d2===correct || choices.has(d2)) d2=replaceOneValidComponent(correct,'any');
 choices.add(d2);

 // Third distractor: another real reading sound of similar length.
 const tokenCount=correct.split(' ').length;
 const candidates=k9Bank
   .map(x=>x.sound)
   .filter(s=>s!==correct && !choices.has(s) && Math.abs(s.split(' ').length-tokenCount)<=1);

 if(candidates.length) choices.add(shuffle(candidates)[0]);

 // Safety fallback: keep generating only from valid component swaps.
 let guard=0;
 while(choices.size<4 && guard<30){
   const d=replaceOneValidComponent(correct,'any');
   if(d!==correct) choices.add(d);
   guard++;
 }

 // Final fallback from real K9 answers only.
 if(choices.size<4){
   const realChoices=shuffle(k9Bank.map(x=>x.sound).filter(s=>s!==correct && !choices.has(s)));
   for(const s of realChoices){
     choices.add(s);
     if(choices.size>=4) break;
   }
 }

 return shuffle([...choices]).slice(0,4);
}


function makeK9Pool(){
 return shuffle(k9Bank).map(x=>{
   const ch=makeCloseDistractors(x.sound);
   return q(
     'K9',
     'Phrase Reading',
     'phraseToSound',
     'Choose the reading sound that matches this phrase.',
     x.phrase,
     ch,
     x.sound,
     'karen-large',
     ''
   );
 });
}


/* ---------------------------
   5-LEVEL ADAPTIVE ENGINE
   Internal skill banks remain K1-K9 for diagnostics.
---------------------------- */

const LEVELS = {
  1: {
    name:'Foundations',
    skills:[1,2,3],
    description:'Alphabet Recognition, Letter Sounds, Vowel Recognition'
  },
  2: {
    name:'Sound Building',
    skills:[4,5,6],
    description:'Alphabet + Vowel, Tone Recognition, Blend Sound Recognition'
  },
  3: {
    name:'Blend Reading',
    skills:[7],
    description:'Alphabet + Blend'
  },
  4: {
    name:'Advanced Sound Building',
    skills:[8],
    description:'Alphabet + Blend + Vowel'
  },
  5: {
    name:'Phrase Reading',
    skills:[9],
    description:'Reading Phrases'
  }
};

const SKILL_NAMES = {
  1:'Alphabet Recognition',
  2:'Letter Sounds',
  3:'Vowel Recognition',
  4:'Alphabet + Vowel',
  5:'Tone Recognition',
  6:'Blend Sound Recognition',
  7:'Alphabet + Blend',
  8:'Alphabet + Blend + Vowel',
  9:'Phrase Reading'
};

const views={
  home:homeView,
  join:joinSessionView,
  setup:studentSetupView,
  test:testView,
  result:resultView,
  teacher:teacherView
};

let state={};

function fresh(){
  return {
    studentName:'',
    grade:'',
    window:'',
    mode:'adaptive',
    currentLevel:2,
    individualLevel:null,
    currentBatch:[],
    currentIndex:0,
    selected:null,
    responses:[],
    levelResults:{},
    skillResults:{},
    path:[],
    highestPassed:0,
    lowestFailed:6,
    totalQuestions:0
  };
}
state=fresh();

function showView(n){
  Object.values(views).forEach(v=>v.classList.add('hidden'));
  views[n].classList.remove('hidden');
}

function pct(rows){
  return rows.length ? Math.round(rows.filter(r=>r.correct).length/rows.length*100) : 0;
}

function questionsForSkill(skill){
  return poolForLevel(skill);
}

// Balanced sampling for grouped levels.
// Level 1 and 2 default to 9 questions: 3 from each internal skill.
// Levels 3-5 default to 8.
function defaultCountForLevel(level){
  return LEVELS[level].skills.length>1 ? 9 : 8;
}

function buildLevelPool(level){
  const skills=LEVELS[level].skills;
  let all=[];
  skills.forEach(skill=>{
    questionsForSkill(skill).forEach(item=>{
      all.push({...item, internalSkill:skill, visibleLevel:level});
    });
  });
  return shuffle(all);
}

function balancedSample(level, countChoice){
  const skills=LEVELS[level].skills;
  const pools={};
  skills.forEach(skill=>{
    pools[skill]=shuffle(questionsForSkill(skill)).map(item=>({
      ...item,
      internalSkill:skill,
      visibleLevel:level
    }));
  });

  if(countChoice==='all'){
    let all=[];
    skills.forEach(skill=>all.push(...pools[skill]));
    return shuffle(all);
  }

  let count = Number(countChoice) || defaultCountForLevel(level);

  if(skills.length===1){
    return pools[skills[0]].slice(0,Math.min(count,pools[skills[0]].length));
  }

  // Balance across the grouped skills as evenly as possible.
  let result=[];
  let cursor=0;
  let guard=0;
  while(result.length<count && guard<1000){
    const skill=skills[cursor % skills.length];
    if(pools[skill].length){
      result.push(pools[skill].shift());
    }
    cursor++;
    guard++;
    if(skills.every(s=>pools[s].length===0)) break;
  }
  return shuffle(result);
}

function beginLevel(level){
  state.currentLevel=level;
  state.currentBatch=balancedSample(level, defaultCountForLevel(level));
  state.currentIndex=0;
  state.selected=null;
  state.path.push('Level '+level);
  render();
}

function beginIndividual(level,countChoice){
  state.mode='individual';
  state.individualLevel=level;
  state.currentLevel=level;
  state.currentBatch=balancedSample(level,countChoice);
  state.currentIndex=0;
  state.selected=null;
  state.path=['Level '+level];
  render();
}

function render(){
  const z=state.currentBatch[state.currentIndex];
  state.selected=null;

  questionDomain.textContent='Level '+state.currentLevel+' — '+LEVELS[state.currentLevel].name;
  questionNumber.textContent=state.totalQuestions+1;
  questionTotal.textContent=state.mode==='individual'
    ? state.currentBatch.length
    : 'Adaptive';
  currentSkill.textContent=SKILL_NAMES[z.internalSkill] || z.skill;
  questionInstruction.textContent=z.instruction;
  questionPrompt.textContent=z.prompt;
  questionPrompt.className='question-prompt '+z.promptClass;

  const estimated = state.mode==='individual'
    ? Math.round((state.currentIndex/state.currentBatch.length)*100)
    : Math.min(95,Math.round((state.totalQuestions/30)*100));
  progressBar.style.width=estimated+'%';

  answerChoices.innerHTML='';
  z.choices.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='choice '+z.choiceClass;
    b.textContent=c;
    b.onclick=()=>{
      [...answerChoices.children].forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      state.selected=i;
      nextQuestionBtn.disabled=false;
    };
    answerChoices.appendChild(b);
  });
  nextQuestionBtn.disabled=true;
}

function submit(){
  if(state.selected===null) return;

  const z=state.currentBatch[state.currentIndex];
  const correct=state.selected===z.answer;

  state.responses.push({
    visibleLevel:state.currentLevel,
    internalSkill:z.internalSkill,
    skill:z.skill,
    type:z.type,
    correct
  });

  state.totalQuestions++;
  state.currentIndex++;

  if(state.currentIndex>=state.currentBatch.length){
    if(state.mode==='individual'){
      finishIndividual();
    }else{
      evaluateLevel();
    }
  }else{
    render();
  }
}

function calculateDiagnostics(level){
  const levelRows=state.responses.filter(r=>r.visibleLevel===level);
  state.levelResults[level]=pct(levelRows);

  LEVELS[level].skills.forEach(skill=>{
    const rows=state.responses.filter(r=>r.internalSkill===skill);
    if(rows.length) state.skillResults[skill]=pct(rows);
  });
}

function evaluateLevel(){
  const level=state.currentLevel;
  calculateDiagnostics(level);
  const score=state.levelResults[level];

  if(score>=75){
    state.highestPassed=Math.max(state.highestPassed,level);

    if(level===5){
      finishAdaptive(5);
      return;
    }

    const next=level+1;
    if(next>=state.lowestFailed){
      finishAdaptive(level);
      return;
    }
    beginLevel(next);
  }else{
    state.lowestFailed=Math.min(state.lowestFailed,level);

    if(level===1){
      finishAdaptive(0);
      return;
    }

    const prev=level-1;
    if(prev<=state.highestPassed){
      finishAdaptive(state.highestPassed);
      return;
    }
    beginLevel(prev);
  }
}

function diagnosticHtml(){
  let out='';
  for(let level=1;level<=5;level++){
    const testedSkills=LEVELS[level].skills.filter(s=>state.skillResults[s]!==undefined);
    if(!testedSkills.length) continue;

    out += `<div class="diag-level"><strong>Level ${level} — ${LEVELS[level].name}</strong>`;
    testedSkills.forEach(skill=>{
      out += `<div class="diag-row"><span>${SKILL_NAMES[skill]}</span><strong>${state.skillResults[skill]}%</strong></div>`;
    });
    out += `</div>`;
  }
  return out || '<span>No diagnostic subskill scores available.</span>';
}

function setResultTiles(){
  const els=[null,level1Score,level2Score,level3Score,level4Score,level5Score];
  for(let level=1;level<=5;level++){
    els[level].textContent = state.levelResults[level]===undefined
      ? '—'
      : state.levelResults[level]+'%';
  }
}

function finishAdaptive(level){
  progressBar.style.width='100%';
  const displayLevel=level<=0?'Below Level 1':'Level '+level;

  resultStudentName.textContent=state.studentName;
  resultLevel.textContent=displayLevel;
  resultAccuracy.textContent=pct(state.responses)+'%';
  setResultTiles();

  adaptiveSummary.innerHTML=
    `<strong>Adaptive path:</strong> ${state.path.join(' → ')}<br>`+
    `<strong>Questions answered:</strong> ${state.totalQuestions}<br>`+
    `<strong>Placement:</strong> ${displayLevel}`;

  diagnosticSummary.innerHTML=diagnosticHtml();

  const result={
    student:state.studentName,
    grade:state.grade,
    window:state.window,
    mode:'Adaptive Test',
    resultLabel:displayLevel,
    placement:displayLevel,
    overall:pct(state.responses),
    questions:state.totalQuestions,
    path:state.path.join(' → '),
    level1:state.levelResults[1]??'',
    level2:state.levelResults[2]??'',
    level3:state.levelResults[3]??'',
    level4:state.levelResults[4]??'',
    level5:state.levelResults[5]??'',
    skill1:state.skillResults[1]??'',
    skill2:state.skillResults[2]??'',
    skill3:state.skillResults[3]??'',
    skill4:state.skillResults[4]??'',
    skill5:state.skillResults[5]??'',
    skill6:state.skillResults[6]??'',
    skill7:state.skillResults[7]??'',
    skill8:state.skillResults[8]??'',
    skill9:state.skillResults[9]??'',
    date:new Date().toLocaleDateString()
  };

  const saved=JSON.parse(localStorage.getItem('klgaFiveLevelResults')||'[]');
  saved.push(result);
  localStorage.setItem('klgaFiveLevelResults',JSON.stringify(saved));
  cloudSaveResult(result).catch(()=>{});
  showView('result');
}

function finishIndividual(){
  const level=state.individualLevel;
  calculateDiagnostics(level);
  const score=state.levelResults[level];
  const rows=state.responses.filter(r=>r.visibleLevel===level);

  resultStudentName.textContent=state.studentName;
  resultLevel.textContent='Level '+level;
  resultAccuracy.textContent=score+'%';
  setResultTiles();

  adaptiveSummary.innerHTML=
    `<strong>Individual level test:</strong> Level ${level} — ${LEVELS[level].name}<br>`+
    `<strong>Questions answered:</strong> ${rows.length}<br>`+
    `<strong>Score:</strong> ${score}% (${rows.filter(r=>r.correct).length}/${rows.length})<br>`+
    `<strong>Mastery benchmark:</strong> ${score>=75?'Met (75% or higher)':'Not yet met'}`;

  diagnosticSummary.innerHTML=diagnosticHtml();

  const result={
    student:state.studentName,
    grade:state.grade,
    window:state.window,
    mode:'Individual Level Test',
    resultLabel:score>=75?'Met Benchmark':'Below Benchmark',
    placement:'Level '+level,
    overall:score,
    questions:rows.length,
    path:'Level '+level,
    level1:level===1?score:'',
    level2:level===2?score:'',
    level3:level===3?score:'',
    level4:level===4?score:'',
    level5:level===5?score:'',
    skill1:state.skillResults[1]??'',
    skill2:state.skillResults[2]??'',
    skill3:state.skillResults[3]??'',
    skill4:state.skillResults[4]??'',
    skill5:state.skillResults[5]??'',
    skill6:state.skillResults[6]??'',
    skill7:state.skillResults[7]??'',
    skill8:state.skillResults[8]??'',
    skill9:state.skillResults[9]??'',
    date:new Date().toLocaleDateString()
  };

  const saved=JSON.parse(localStorage.getItem('klgaFiveLevelResults')||'[]');
  saved.push(result);
  localStorage.setItem('klgaFiveLevelResults',JSON.stringify(saved));
  cloudSaveResult(result).catch(()=>{});
  showView('result');
}



/* ---------------------------
   TESTING SESSIONS
---------------------------- */
let editingSessionKey=null;

function loadSessions(){
  return JSON.parse(localStorage.getItem('klgaTestingSessions')||'[]');
}
function saveSessions(sessions){
  localStorage.setItem('klgaTestingSessions',JSON.stringify(sessions));
}
function randomCode(length=6){
  const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out='';
  for(let i=0;i<length;i++) out+=chars[Math.floor(Math.random()*chars.length)];
  return out;
}
function generateSessionName(){ return 'KLGA-'+randomCode(4); }
function generateSessionPassword(){ return randomCode(6); }

function renderSessionStudentChecklist(selectedKeys=[]){
  const roster=loadRoster();
  sessionStudentChecklist.innerHTML='';
  if(!roster.length){
    sessionStudentChecklist.innerHTML='<div class="empty-row">Add students to the roster first.</div>';
    return;
  }
  roster.slice().sort((a,b)=>a.name.localeCompare(b.name)).forEach(student=>{
    const label=document.createElement('label');
    label.className='student-check-item';
    label.innerHTML=
      `<input type="checkbox" value="${student.key}" ${selectedKeys.includes(student.key)?'checked':''}>`+
      `<span><strong>${esc(student.name)}</strong><small>ID ${esc(student.studentId)} • Grade ${esc(student.grade)}</small></span>`;
    sessionStudentChecklist.appendChild(label);
  });
}
function selectedSessionStudentKeys(){
  return [...sessionStudentChecklist.querySelectorAll('input[type="checkbox"]:checked')].map(x=>x.value);
}
function openSessionForm(session=null){
  sessionFormWrap.classList.remove('hidden');
  sessionFormError.classList.add('hidden');
  sessionFormError.textContent='';
  if(session){
    editingSessionKey=session.key;
    sessionName.value=session.name;
    sessionPassword.value=session.password;
    sessionTestType.value=session.testType;
    sessionLevel.value=session.level||'1';
    sessionLevelWrap.classList.toggle('hidden',session.testType!=='individual');
    renderSessionStudentChecklist(session.studentKeys||[]);
    saveSessionBtn.textContent='Update Session';
  }else{
    editingSessionKey=null;
    sessionName.value=generateSessionName();
    sessionPassword.value=generateSessionPassword();
    sessionTestType.value='adaptive';
    sessionLevel.value='1';
    sessionLevelWrap.classList.add('hidden');
    renderSessionStudentChecklist([]);
    saveSessionBtn.textContent='Save Session';
  }
}
function closeSessionForm(){
  sessionFormWrap.classList.add('hidden');
  editingSessionKey=null;
}
function persistSession(){
  const name=sessionName.value.trim();
  const password=sessionPassword.value.trim();
  const testType=sessionTestType.value;
  const level=testType==='individual'?Number(sessionLevel.value):null;
  const studentKeys=selectedSessionStudentKeys();

  if(!name || !password){
    sessionFormError.textContent='Please enter a session name and password.';
    sessionFormError.classList.remove('hidden');
    return;
  }
  if(!studentKeys.length){
    sessionFormError.textContent='Select at least one student.';
    sessionFormError.classList.remove('hidden');
    return;
  }

  const sessions=loadSessions();
  const duplicate=sessions.find(s=>s.name.toLowerCase()===name.toLowerCase() && s.key!==editingSessionKey);
  if(duplicate){
    sessionFormError.textContent='That session name is already being used.';
    sessionFormError.classList.remove('hidden');
    return;
  }

  if(editingSessionKey){
    const idx=sessions.findIndex(s=>s.key===editingSessionKey);
    if(idx>=0) sessions[idx]={...sessions[idx],name,password,testType,level,studentKeys};
  }else{
    sessions.push({
      key:'ses_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
      name,password,testType,level,studentKeys,status:'Draft',
      createdAt:new Date().toLocaleString()
    });
  }
  saveSessions(sessions);
  closeSessionForm();
  renderSessions();
}
function editSession(key){
  const session=loadSessions().find(s=>s.key===key);
  if(session) openSessionForm(session);
}
function setSessionStatus(key,status){
  const sessions=loadSessions();
  const idx=sessions.findIndex(s=>s.key===key);
  if(idx<0) return;
  sessions[idx].status=status;
  sessions[idx].updatedAt=new Date().toLocaleString();
  saveSessions(sessions);
  renderSessions();
}
function deleteSession(key){
  const sessions=loadSessions();
  const session=sessions.find(s=>s.key===key);
  if(!session) return;
  if(confirm(`Delete session ${session.name}?`)){
    saveSessions(sessions.filter(s=>s.key!==key));
    renderSessions();
  }
}
function renderSessions(){
  const sessions=loadSessions();
  const roster=loadRoster();
  sessionTableBody.innerHTML='';
  if(!sessions.length){
    const tr=document.createElement('tr');
    tr.innerHTML='<td colspan="6" class="empty-row">No testing sessions created yet.</td>';
    sessionTableBody.appendChild(tr);
    return;
  }
  sessions.slice().reverse().forEach(s=>{
    const studentNames=(s.studentKeys||[]).map(k=>roster.find(r=>r.key===k)?.name).filter(Boolean);
    const testLabel=s.testType==='adaptive'?'Adaptive':`Level ${s.level}`;
    const tr=document.createElement('tr');
    tr.innerHTML=
      `<td><strong>${esc(s.name)}</strong></td>`+
      `<td><span class="session-password">${esc(s.password)}</span></td>`+
      `<td>${testLabel}</td>`+
      `<td>${studentNames.length}</td>`+
      `<td><span class="status-pill status-${String(s.status).toLowerCase()}">${esc(s.status)}</span></td>`+
      `<td class="row-actions">`+
      `<button class="btn mini secondary" data-session-edit="${s.key}">Edit</button>`+
      (s.status!=='Active'
        ? `<button class="btn mini primary" data-session-start="${s.key}">Start</button>`
        : `<button class="btn mini ghost" data-session-end="${s.key}">End</button>`)+
      `<button class="btn mini danger" data-session-delete="${s.key}">Delete</button>`+
      `</td>`;
    sessionTableBody.appendChild(tr);
  });

  document.querySelectorAll('[data-session-edit]').forEach(btn=>btn.onclick=()=>editSession(btn.dataset.sessionEdit));
  document.querySelectorAll('[data-session-start]').forEach(btn=>btn.onclick=()=>setSessionStatus(btn.dataset.sessionStart,'Active'));
  document.querySelectorAll('[data-session-end]').forEach(btn=>btn.onclick=()=>setSessionStatus(btn.dataset.sessionEnd,'Ended'));
  document.querySelectorAll('[data-session-delete]').forEach(btn=>btn.onclick=()=>deleteSession(btn.dataset.sessionDelete));
}

/* ---------------------------
   STUDENT ROSTER
---------------------------- */

let editingStudentKey=null;

function loadRoster(){
  return JSON.parse(localStorage.getItem('klgaStudentRoster')||'[]');
}

function saveRoster(roster){
  localStorage.setItem('klgaStudentRoster',JSON.stringify(roster));
}

function renderRoster(){
  const roster=loadRoster();
  rosterTableBody.innerHTML='';

  if(!roster.length){
    const tr=document.createElement('tr');
    tr.innerHTML='<td colspan="4" class="empty-row">No students added yet.</td>';
    rosterTableBody.appendChild(tr);
    return;
  }

  roster
    .slice()
    .sort((a,b)=>a.name.localeCompare(b.name))
    .forEach(student=>{
      const tr=document.createElement('tr');
      tr.innerHTML=
        `<td>${esc(student.studentId)}</td>`+
        `<td>${esc(student.name)}</td>`+
        `<td>${esc(student.grade)}</td>`+
        `<td class="row-actions">`+
          `<button class="btn mini secondary" data-edit-student="${student.key}">Edit</button>`+
          `<button class="btn mini danger" data-delete-student="${student.key}">Delete</button>`+
        `</td>`;
      rosterTableBody.appendChild(tr);
    });

  document.querySelectorAll('[data-edit-student]').forEach(btn=>{
    btn.onclick=()=>editStudent(btn.dataset.editStudent);
  });

  document.querySelectorAll('[data-delete-student]').forEach(btn=>{
    btn.onclick=()=>deleteStudent(btn.dataset.deleteStudent);
  });
}


function getNextAutoStudentId(){
  const roster=loadRoster();

  // Find numeric IDs and continue from the highest.
  const nums=roster
    .map(s=>String(s.studentId||'').trim())
    .filter(id=>/^\d+$/.test(id))
    .map(Number);

  const next = nums.length ? Math.max(...nums)+1 : 1001;
  return String(next);
}

function applyStudentIdMode(mode){
  if(mode==='auto'){
    rosterStudentId.readOnly=true;
    rosterStudentId.placeholder='Auto-generated';
    if(!editingStudentKey){
      rosterStudentId.value=getNextAutoStudentId();
    }
  }else{
    rosterStudentId.readOnly=false;
    rosterStudentId.placeholder='Enter student ID';
    if(!editingStudentKey){
      rosterStudentId.value='';
    }
  }
}

function openStudentForm(student=null){
  studentFormWrap.classList.remove('hidden');
  studentFormError.classList.add('hidden');
  studentFormError.textContent='';

  if(student){
    editingStudentKey=student.key;
    rosterStudentId.value=student.studentId;
    rosterStudentName.value=student.name;
    rosterStudentGrade.value=student.grade;

    // Existing IDs remain editable through Manual mode.
    studentIdMode.value='manual';
    applyStudentIdMode('manual');

    saveStudentBtn.textContent='Update Student';
  }else{
    editingStudentKey=null;
    rosterStudentName.value='';
    rosterStudentGrade.value='';

    studentIdMode.value='auto';
    applyStudentIdMode('auto');

    saveStudentBtn.textContent='Save Student';
  }
}

function closeStudentForm(){
  studentFormWrap.classList.add('hidden');
  editingStudentKey=null;
}

function editStudent(key){
  const roster=loadRoster();
  const student=roster.find(s=>s.key===key);
  if(student) openStudentForm(student);
}

function deleteStudent(key){
  const roster=loadRoster();
  const student=roster.find(s=>s.key===key);
  if(!student) return;

  if(confirm(`Delete ${student.name} from the roster?`)){
    saveRoster(roster.filter(s=>s.key!==key));
    renderRoster();
  }
}

function persistStudent(){
  if(studentIdMode.value==='auto' && !editingStudentKey){
    rosterStudentId.value=getNextAutoStudentId();
  }

  const studentId=rosterStudentId.value.trim();
  const name=rosterStudentName.value.trim();
  const grade=rosterStudentGrade.value;

  if(!studentId || !name || !grade){
    studentFormError.textContent='Please enter Student ID, Student Name, and Grade.';
    studentFormError.classList.remove('hidden');
    return;
  }

  const roster=loadRoster();

  const duplicate=roster.find(
    s=>s.studentId.toLowerCase()===studentId.toLowerCase() && s.key!==editingStudentKey
  );

  if(duplicate){
    studentFormError.textContent='That Student ID is already in the roster.';
    studentFormError.classList.remove('hidden');
    return;
  }

  if(editingStudentKey){
    const idx=roster.findIndex(s=>s.key===editingStudentKey);
    if(idx>=0){
      roster[idx]={
        ...roster[idx],
        studentId,
        name,
        grade
      };
    }
  }else{
    roster.push({
      key:'stu_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
      studentId,
      name,
      grade
    });
  }

  saveRoster(roster);
  closeStudentForm();
  renderRoster();
}


function renderDashboard(){
  const r=JSON.parse(localStorage.getItem('klgaFiveLevelResults')||'[]');
  resultsTableBody.innerHTML='';

  r.slice().reverse().forEach(x=>{
    const tr=document.createElement('tr');
    tr.innerHTML=
      `<td>${esc(x.student)}</td>`+
      `<td>${x.grade}</td>`+
      `<td>${x.window}</td>`+
      `<td>${x.mode}</td>`+
      `<td>${x.questions}</td>`+
      `<td>${x.path}</td>`+
      `<td><strong>${x.resultLabel}</strong></td>`+
      `<td>${x.overall}%</td>`+
      `<td>${x.date}</td>`;
    resultsTableBody.appendChild(tr);
  });
}

function esc(s=''){
  return String(s).replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function exportCsv(){
  const r=JSON.parse(localStorage.getItem('klgaFiveLevelResults')||'[]');

  const rows=[[
    'Student','Grade','Window','Mode','Result','Overall','Questions','Path',
    'Level 1','Level 2','Level 3','Level 4','Level 5',
    'Alphabet Recognition','Letter Sounds','Vowel Recognition',
    'Alphabet + Vowel','Tone Recognition','Blend Sound Recognition',
    'Alphabet + Blend','Alphabet + Blend + Vowel','Phrase Reading','Date'
  ]];

  r.forEach(x=>rows.push([
    x.student,x.grade,x.window,x.mode,x.resultLabel,x.overall,x.questions,x.path,
    x.level1,x.level2,x.level3,x.level4,x.level5,
    x.skill1,x.skill2,x.skill3,x.skill4,x.skill5,x.skill6,x.skill7,x.skill8,x.skill9,
    x.date
  ]));

  const csv=rows.map(row=>
    row.map(v=>`"${String(v??'').replaceAll('"','""')}"`).join(',')
  ).join('\n');

  const blob=new Blob([csv],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='KLGA-5-Level-Results.csv';
  a.click();
  URL.revokeObjectURL(url);
}

startStudentBtn.onclick=()=>showView('join');
studentModeBtn.onclick=()=>showView('join');
startTeacherBtn.onclick=()=>{renderSessions();renderRoster();renderDashboard();showView('teacher')};
teacherModeBtn.onclick=()=>{renderSessions();renderRoster();renderDashboard();showView('teacher')};

document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>showView('home'));

returnHomeBtn.onclick=()=>{
  state=fresh();
  showView('home');
};

testMode.onchange=()=>{
  const isIndividual=testMode.value==='individual';
  individualLevelWrap.classList.toggle('hidden',!isIndividual);
  questionCountWrap.classList.toggle('hidden',!isIndividual);
};

beginTestBtn.onclick=()=>{
  const name=studentName.value.trim();
  const grade=studentGrade.value;
  const window=testWindow.value;
  const mode=testMode.value;

  if(!name||!grade){
    alert('Please enter student name and grade.');
    return;
  }

  state=fresh();
  state.studentName=name;
  state.grade=grade;
  state.window=window;
  state.mode=mode;

  showView('test');

  if(mode==='individual'){
    beginIndividual(Number(individualLevel.value),questionCount.value);
  }else{
    beginLevel(2);
  }
};



createSessionBtn.onclick=()=>openSessionForm();
cancelSessionBtn.onclick=closeSessionForm;
saveSessionBtn.onclick=persistSession;
generateSessionNameBtn.onclick=()=>sessionName.value=generateSessionName();
generatePasswordBtn.onclick=()=>sessionPassword.value=generateSessionPassword();
sessionTestType.onchange=()=>sessionLevelWrap.classList.toggle('hidden',sessionTestType.value!=='individual');
selectAllSessionStudentsBtn.onclick=()=>sessionStudentChecklist.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=true);
clearSessionStudentsBtn.onclick=()=>sessionStudentChecklist.querySelectorAll('input[type="checkbox"]').forEach(x=>x.checked=false);

studentIdMode.onchange=()=>applyStudentIdMode(studentIdMode.value);
addStudentBtn.onclick=()=>openStudentForm();
saveStudentBtn.onclick=persistStudent;
cancelStudentBtn.onclick=closeStudentForm;


let joinedSession=null;
let joinedStudent=null;

joinSessionBtn.onclick=async()=>{
  joinSessionError.classList.add('hidden');
  const name=joinSessionName.value.trim();
  const password=joinSessionPassword.value.trim();

  if(!name || !password){
    joinSessionError.textContent='Enter the session name and password.';
    joinSessionError.classList.remove('hidden');
    return;
  }

  const session=await cloudJoinSession(name,password);
  if(!session){
    joinSessionError.textContent='Active session not found or password is incorrect.';
    joinSessionError.classList.remove('hidden');
    return;
  }

  joinedSession=session;

  const roster=await cloudLoadRoster();
  const allowed=(session.studentKeys||[])
    .map(key=>roster.find(s=>s.key===key))
    .filter(Boolean)
    .sort((a,b)=>a.name.localeCompare(b.name));

  joinStudentSelect.innerHTML='';
  allowed.forEach(student=>{
    const opt=document.createElement('option');
    opt.value=student.key;
    opt.textContent=`${student.name} — Grade ${student.grade}`;
    joinStudentSelect.appendChild(opt);
  });

  if(!allowed.length){
    joinSessionError.textContent='No students are assigned to this session.';
    joinSessionError.classList.remove('hidden');
    return;
  }

  joinStudentWrap.classList.remove('hidden');
  confirmStudentJoinBtn.classList.remove('hidden');
  joinSessionBtn.classList.add('hidden');
};

confirmStudentJoinBtn.onclick=async()=>{
  const roster=await cloudLoadRoster();
  const student=roster.find(s=>s.key===joinStudentSelect.value);
  if(!student || !joinedSession) return;

  joinedStudent=student;
  await cloudSetStudentJoin(joinedSession.key,student.key,'waiting');

  waitingApprovalWrap.classList.remove('hidden');
  confirmStudentJoinBtn.classList.add('hidden');

  // Local prototype proceeds after a short delay.
  // With Firebase configured, teacher-side approval can later replace this.
  setTimeout(()=>{
    studentName.value=student.name;
    studentGrade.value=student.grade;
    testWindow.value='Fall';

    if(joinedSession.testType==='individual'){
      testMode.value='individual';
      individualLevelWrap.classList.remove('hidden');
      questionCountWrap.classList.remove('hidden');
      individualLevel.value=String(joinedSession.level||1);
    }else{
      testMode.value='adaptive';
      individualLevelWrap.classList.add('hidden');
      questionCountWrap.classList.add('hidden');
    }

    showView('setup');
  },700);
};


nextQuestionBtn.onclick=submit;
exportCsvBtn.onclick=exportCsv;

clearResultsBtn.onclick=()=>{
  if(confirm('Clear all saved KLGA results?')){
    localStorage.removeItem('klgaFiveLevelResults');
    renderDashboard();
  }
};
