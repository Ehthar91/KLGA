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


function tweakSound(sound){
 const tokens=sound.split(' ');
 if(tokens.length<2) return sound;

 const substitutions={
  'May':['Meh','Myay','Mae'],
  'Way':['Weh','Waw','Wey'],
  'Koe':['Kaw','Kee','Koeh'],
  'Joe':['Jee','Jaw','Juh'],
  'Jee':['Joe','Juh','Jaw'],
  'Juh':['Jee','Joe','Jah'],
  'Poo':['Poe','Paw','Peu'],
  'Poe':['Poo','Paw','Peu'],
  'Law':['Luh','Loe','Lah'],
  'Luh':['Law','Loe','Lah'],
  'Taw':['Toe','Tee','Ter'],
  'Toe':['Taw','Tee','Ter'],
  'Kleh':['Klay','Klee','Klah'],
  'Klay':['Kleh','Klee','Klah'],
  'Pleh':['Play','Plee','Plah'],
  'Play':['Pleh','Plee','Plaw'],
  'Plaw':['Pleh','Play','Ploo'],
  'Kwa':['Kwah','Kwee','Kwaw'],
  'Kwah':['Kwa','Kweh','Kwaw'],
  'Kweh':['Kwee','Kwa','Kwaw'],
  'Kwee':['Kweh','Kwa','Kwaw'],
  'Khwee':['Khweh','Khwa','Khwaw'],
  'Pgee':['Pgeh','Pga','Pgaw'],
  'Pgeh':['Pgee','Pga','Pgaw'],
  'Bguh':['Bgaw','Bgeh','Bgee'],
  'Chgeh':['Chgaw','Chgeu','Chgee']
 };

 const idxs=shuffle(tokens.map((_,i)=>i));
 for(const idx of idxs){
   const t=tokens[idx];
   if(substitutions[t]){
     const out=[...tokens];
     out[idx]=shuffle(substitutions[t])[0];
     return out.join(' ');
   }
 }

 // Fallback: swap one syllable with a near vowel variation.
 const idx=idxs[0];
 const t=tokens[idx];
 const endings=[
   ['a','eh'],['aw','oe'],['ee','eh'],['oe','aw'],['uh','ah'],['oo','oe'],
   ['ay','eh'],['eh','ay']
 ];
 let replacement=t;
 for(const [a,b] of endings){
   if(t.toLowerCase().endsWith(a)){
     replacement=t.slice(0,t.length-a.length)+b;
     replacement=replacement[0].toUpperCase()+replacement.slice(1);
     break;
   }
 }
 if(replacement===t) replacement=t+'h';

 const out=[...tokens];
 out[idx]=replacement;
 return out.join(' ');
}

function makeCloseDistractors(correct){
 const choices=new Set([correct]);

 // Two very close distractors: one syllable changed.
 let guard=0;
 while(choices.size<3 && guard<30){
   choices.add(tweakSound(correct));
   guard++;
 }

 // Fourth choice: use another real reading sound, preferably same length.
 const tokenCount=correct.split(' ').length;
 const candidates=k9Bank
   .map(x=>x.sound)
   .filter(s=>s!==correct && Math.abs(s.split(' ').length-tokenCount)<=1);
 const far=shuffle(candidates)[0] || shuffle(k9Bank.map(x=>x.sound).filter(s=>s!==correct))[0];
 choices.add(far);

 while(choices.size<4){
   choices.add(tweakSound(correct));
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
   ADAPTIVE ENGINE
---------------------------- */

const views={home:homeView,setup:studentSetupView,test:testView,result:resultView,teacher:teacherView};

let state={};

function fresh(){
 return{
   studentName:'',
   grade:'',
   window:'',
   mode:'adaptive',
   individualLevel:null,
   currentLevel:4,
   currentBatch:[],
   currentIndex:0,
   selected:null,
   responses:[],
   levelResults:{},
   path:[],
   highestPassed:0,
   lowestFailed:10,
   totalQuestions:0,
   finished:false
 };
}
state=fresh();

function showView(n){
 Object.values(views).forEach(v=>v.classList.add('hidden'));
 views[n].classList.remove('hidden');
}

function pct(rows){
 return rows.length?Math.round(rows.filter(r=>r.correct).length/rows.length*100):0;
}

function sampleLevel(level,count=8){
 const pool=poolForLevel(level);
 return shuffle(pool).slice(0,Math.min(count,pool.length));
}

function beginLevel(level){
 state.currentLevel=level;
 const pool=poolForLevel(level);
 if(countChoice==='all'){
   state.currentBatch=shuffle(pool);
 }else{
   const count=Number(countChoice)||8;
   state.currentBatch=shuffle(pool).slice(0,Math.min(count,pool.length));
 }
 state.currentIndex=0;
 state.selected=null;
 state.path.push('K'+level);
 render();
}

function render(){
 const z=state.currentBatch[state.currentIndex];
 state.selected=null;

 questionDomain.textContent=z.domain;
 questionNumber.textContent=state.totalQuestions+1;
 questionTotal.textContent='Adaptive';
 currentSkill.textContent=z.skill;
 questionInstruction.textContent=z.instruction;
 questionPrompt.textContent=z.prompt;
 questionPrompt.className='question-prompt '+z.promptClass;

 // Progress is intentionally approximate because CAT length changes by student.
 const estimated=Math.min(95,Math.round((state.totalQuestions/24)*100));
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
 if(state.selected===null)return;

 const z=state.currentBatch[state.currentIndex];
 const correct=state.selected===z.answer;

 state.responses.push({
   skill:z.skill,
   level:state.currentLevel,
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

function evaluateLevel(){
 const level=state.currentLevel;
 const rows=state.responses.filter(r=>r.level===level);
 const score=pct(rows);
 state.levelResults[level]=score;

 // 8-item level probe:
 // 75%+ = pass, move up
 // 50% or lower = fail, move down
 // exactly 50% is fail in a mastery-oriented progression
 if(score>=75){
   state.highestPassed=Math.max(state.highestPassed,level);

   if(level===9){
     finishAdaptive(9);
     return;
   }

   // If we just passed a level below a previously failed level,
   // test the immediate next level to pinpoint placement.
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


function beginIndividual(level,countChoice){
 state.mode='individual';
 state.individualLevel=level;
 state.currentLevel=level;
 const pool=poolForLevel(level);
 if(countChoice==='all'){
   state.currentBatch=shuffle(pool);
 }else{
   const count=Number(countChoice)||8;
   state.currentBatch=shuffle(pool).slice(0,Math.min(count,pool.length));
 }
 state.currentIndex=0;
 state.selected=null;
 state.path=['K'+level];
 render();
}

function finishIndividual(){
 const level=state.individualLevel;
 const rows=state.responses.filter(r=>r.level===level);
 const score=pct(rows);
 state.levelResults[level]=score;

 const display='K'+level;
 resultStudentName.textContent=state.studentName;
 resultLevel.textContent=display;
 resultAccuracy.textContent=score+'%';

 const scoreEls=[null,k1Score,k2Score,k3Score,k4Score,k5Score,k6Score,k7Score,k8Score,k9Score];
 for(let i=1;i<=9;i++){
   scoreEls[i].textContent = i===level ? score+'%' : '—';
 }

 adaptiveSummary.innerHTML=
   `<strong>Individual test:</strong> ${display}<br>`+
   `<strong>Questions answered:</strong> ${rows.length}<br>`+
   `<strong>Score:</strong> ${score}% (${rows.filter(r=>r.correct).length}/${rows.length})<br>`+
   `<strong>Mastery benchmark:</strong> ${score>=75?'Met (75% or higher)':'Not yet met'}`;

 const result={
   student:state.studentName,
   grade:state.grade,
   window:state.window,
   mode:'Individual K Test',
   placement:display,
   resultLabel:score>=75?'Met Benchmark':'Below Benchmark',
   overall:score,
   questions:rows.length,
   path:display,
   k1:level===1?score:'',
   k2:level===2?score:'',
   k3:level===3?score:'',
   k4:level===4?score:'',
   k5:level===5?score:'',
   k6:level===6?score:'',
   k7:level===7?score:'',
   k8:level===8?score:'',
   k9:level===9?score:'',
   date:new Date().toLocaleDateString()
 };

 const saved=JSON.parse(localStorage.getItem('klgaAdaptiveResults')||'[]');
 saved.push(result);
 localStorage.setItem('klgaAdaptiveResults',JSON.stringify(saved));
 showView('result');
}

function finishAdaptive(level){
 state.finished=true;
 progressBar.style.width='100%';

 // Placement:
 // 0 means beginning K1 / below K1 mastery.
 const displayLevel=level<=0?'Pre-K1':'K'+level;

 resultStudentName.textContent=state.studentName;
 resultLevel.textContent=displayLevel;
 resultAccuracy.textContent=pct(state.responses)+'%';

 // Show tested-level scores; untested levels display em dash.
 const scoreEls=[null,k1Score,k2Score,k3Score,k4Score,k5Score,k6Score,k7Score,k8Score,k9Score];
 for(let i=1;i<=9;i++){
   scoreEls[i].textContent = state.levelResults[i]===undefined ? '—' : state.levelResults[i]+'%';
 }

 const pathText=state.path.join(' → ');
 adaptiveSummary.innerHTML=
   `<strong>Adaptive path:</strong> ${pathText}<br>`+
   `<strong>Questions answered:</strong> ${state.totalQuestions}<br>`+
   `<strong>Placement:</strong> ${displayLevel}<br><br>`+
   `The test moved up after level mastery and moved down after insufficient evidence.`;

 const result={
   student:state.studentName,
   grade:state.grade,
   window:state.window,
   mode:'Adaptive Test',
   placement:displayLevel,
   resultLabel:displayLevel,
   overall:pct(state.responses),
   questions:state.totalQuestions,
   path:pathText,
   k1:state.levelResults[1]??'',
   k2:state.levelResults[2]??'',
   k3:state.levelResults[3]??'',
   k4:state.levelResults[4]??'',
   k5:state.levelResults[5]??'',
   k6:state.levelResults[6]??'',
   k7:state.levelResults[7]??'',
   k8:state.levelResults[8]??'',
   k9:state.levelResults[9]??'',
   date:new Date().toLocaleDateString()
 };

 const saved=JSON.parse(localStorage.getItem('klgaAdaptiveResults')||'[]');
 saved.push(result);
 localStorage.setItem('klgaAdaptiveResults',JSON.stringify(saved));
 showView('result');
}

function renderDashboard(){
 const r=JSON.parse(localStorage.getItem('klgaAdaptiveResults')||'[]');
 resultsTableBody.innerHTML='';
 r.slice().reverse().forEach(x=>{
   const tr=document.createElement('tr');
   tr.innerHTML=
     `<td>${esc(x.student)}</td>`+
     `<td>${x.grade}</td>`+
     `<td>${x.window}</td>`+
     `<td>${x.mode||'Adaptive Test'}</td>`+
     `<td>${x.questions}</td>`+
     `<td>${x.path}</td>`+
     `<td><strong>${x.resultLabel||x.placement}</strong></td>`+
     `<td>${x.overall}%</td>`+
     `<td>${x.date}</td>`;
   resultsTableBody.appendChild(tr);
 });
}

function esc(s=''){
 return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function exportCsv(){
 const r=JSON.parse(localStorage.getItem('klgaAdaptiveResults')||'[]');
 const rows=[['Student','Grade','Window','Mode','Result','Overall','Questions','Path / Level','K1','K2','K3','K4','K5','K6','K7','K8','K9','Date']];
 r.forEach(x=>rows.push([
   x.student,x.grade,x.window,x.mode||'Adaptive Test',x.resultLabel||x.placement,x.overall,x.questions,x.path,
   x.k1,x.k2,x.k3,x.k4,x.k5,x.k6,x.k7,x.k8,x.k9,x.date
 ]));
 const csv=rows.map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
 const blob=new Blob([csv],{type:'text/csv'});
 const url=URL.createObjectURL(blob);
 const a=document.createElement('a');
 a.href=url;
 a.download='KLGA-Adaptive-Results.csv';
 a.click();
 URL.revokeObjectURL(url);
}

startStudentBtn.onclick=()=>showView('setup');
studentModeBtn.onclick=()=>showView('setup');
startTeacherBtn.onclick=()=>{renderDashboard();showView('teacher')};
teacherModeBtn.onclick=()=>{renderDashboard();showView('teacher')};
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
   beginLevel(4);
 }
};

nextQuestionBtn.onclick=submit;
exportCsvBtn.onclick=exportCsv;
clearResultsBtn.onclick=()=>{
 if(confirm('Clear all saved KLGA adaptive results?')){
   localStorage.removeItem('klgaAdaptiveResults');
   renderDashboard();
 }
};
