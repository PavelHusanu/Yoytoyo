export const STORAGE_KEY='lernraum.v1';
export const localDay=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function shiftDay(day,amount){const [y,m,d]=day.split('-').map(Number);return localDay(new Date(y,m-1,d+amount,12));}
export function initialState(){return {version:1,profile:{name:'',goal:50,theme:'light'},xp:0,daily:{},rewards:{},reviews:{},lessons:[],sessions:[],plans:[],customCards:[],quizBest:{},focusMinutes:0,badges:[],drafts:{}};}
export function normalize(value){return String(value).normalize('NFC').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[.,!?;:…]/g,'').replace(/\s+/g,' ').trim();}
export function answerMatches(value,answers){return answers.some(a=>normalize(a)===normalize(value));}
export function levelInfo(xp){const level=Math.floor(Math.max(0,xp)/250)+1;return {level,current:xp%250,needed:250,percent:Math.round((xp%250)/250*100)};}
export function streak(state,today=localDay()){let day=state.daily[today]?.actions?today:shiftDay(today,-1);let count=0;while(state.daily[day]?.actions){count++;day=shiftDay(day,-1);}return count;}
export function bestStreak(state){let best=0,current=0,previous=null;for(const day of Object.keys(state.daily).filter(d=>state.daily[d].actions>0).sort()){current=previous&&shiftDay(previous,1)===day?current+1:1;best=Math.max(best,current);previous=day;}return best;}
export function award(state,key,amount,day=localDay()){if(state.rewards[key])return 0;state.rewards[key]=true;state.xp+=amount;state.daily[day]??={xp:0,actions:0};state.daily[day].xp+=amount;state.daily[day].actions++;return amount;}
export function reviewCard(state,id,grade,day=localDay()){if(!['again','hard','good'].includes(grade))throw Error('Invalid grade');const prev=state.reviews[id]||{interval:0,repetitions:0};const interval=grade==='again'?0:grade==='hard'?1:Math.min(60,Math.max(2,prev.interval*2||2));state.reviews[id]={interval,repetitions:prev.repetitions+1,due:shiftDay(day,interval),last:day,difficult:grade!=='good',mastered:grade==='good'&&prev.repetitions>=1};return award(state,`card:${id}:${day}`,grade==='good'?10:5,day);}
export function completeLesson(state,id,day=localDay()){if(!state.lessons.includes(id))state.lessons.push(id);return award(state,`lesson:${id}`,20,day);}
export function completeQuiz(state,unit,correct,total,day=localDay()){if(!Number.isInteger(total)||total<1||correct<0||correct>total)throw Error('Invalid quiz result');const score=Math.round(correct/total*100);state.quizBest[unit]=Math.max(state.quizBest[unit]||0,score);state.daily[day]??={xp:0,actions:0};state.daily[day].actions++;return score;}
export function unitProgress(state,unit,allCards){const deck=allCards.filter(c=>c.unit===unit);const learned=deck.filter(c=>state.reviews[c.id]?.mastered).length;return Math.round((state.lessons.includes(unit)?20:0)+(deck.length?learned/deck.length*50:0)+(state.quizBest[unit]||0)*.3);}
export function shuffle(items,random=Math.random){const arr=[...items];for(let i=arr.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
const isObject=x=>x&&typeof x==='object'&&!Array.isArray(x);
const safeKey=k=>!['__proto__','constructor','prototype'].includes(k);
const int=(v,min,max)=>Number.isInteger(v)&&v>=min&&v<=max;
export function validateState(raw){
 if(!isObject(raw)||raw.version!==1)throw Error('This is not a compatible Lernraum backup.');
 const s=initialState();
 if(!isObject(raw.profile)||typeof raw.profile.name!=='string'||raw.profile.name.length>50||![25,50,100,150].includes(raw.profile.goal)||!['light','dark'].includes(raw.profile.theme))throw Error('Invalid profile.');
 s.profile={name:raw.profile.name,goal:raw.profile.goal,theme:raw.profile.theme};
 if(!int(raw.xp,0,10000000))throw Error('Invalid XP.');s.xp=raw.xp;
 for(const key of ['daily','rewards','reviews','quizBest'])if(!isObject(raw[key])||Object.keys(raw[key]).length>100000)throw Error('Invalid progress data.');
 const dayPattern=/^\d{4}-\d{2}-\d{2}$/;
 for(const [k,v]of Object.entries(raw.daily)){if(!dayPattern.test(k)||!isObject(v)||!int(v.xp,0,100000)||!int(v.actions,0,100000))throw Error('Invalid daily activity.');s.daily[k]={xp:v.xp,actions:v.actions};}
 for(const [k,v]of Object.entries(raw.rewards)){if(safeKey(k)&&k.length<200&&v===true)s.rewards[k]=true;}
 for(const [k,v]of Object.entries(raw.reviews)){if(!safeKey(k)||!isObject(v)||!int(v.interval,0,60)||!int(v.repetitions,0,100000)||!dayPattern.test(v.due)||!dayPattern.test(v.last))throw Error('Invalid card progress.');s.reviews[k]={interval:v.interval,repetitions:v.repetitions,due:v.due,last:v.last,difficult:!!v.difficult,mastered:!!v.mastered};}
 for(const [k,v]of Object.entries(raw.quizBest)){if(!safeKey(k)||!int(v,0,100))throw Error('Invalid score.');s.quizBest[k]=v;}
 for(const key of ['lessons','plans','sessions','customCards'])if(!Array.isArray(raw[key])||raw[key].length>10000)throw Error('Invalid saved items.');
 s.lessons=[...new Set(raw.lessons.filter(x=>typeof x==='string'&&x.length<100))];
 s.plans=raw.plans.map(p=>{if(!isObject(p)||typeof p.id!=='string'||p.id.length>100||typeof p.title!=='string'||p.title.length>120||!dayPattern.test(p.date)||!int(p.minutes,5,180)||typeof p.unit!=='string'||p.unit.length>100)throw Error('Invalid planner session.');return {id:p.id,title:p.title,date:p.date,minutes:p.minutes,unit:p.unit,done:!!p.done};});
 s.customCards=raw.customCards.map(c=>{if(!isObject(c)||!['id','unit','front','back'].every(k=>typeof c[k]==='string'&&c[k].length>0&&c[k].length<=300))throw Error('Invalid custom card.');return {id:c.id,unit:c.unit,front:c.front,back:c.back};});
 s.sessions=raw.sessions.map(x=>{if(!isObject(x)||!['review','quiz','lesson','focus'].includes(x.type)||typeof x.title!=='string'||x.title.length>150||!Number.isFinite(Date.parse(x.date))||!int(x.xp,0,100000))throw Error('Invalid activity history.');const v={type:x.type,title:x.title,date:x.date,xp:x.xp};if(int(x.score,0,100))v.score=x.score;return v;});
 s.focusMinutes=int(raw.focusMinutes,0,1000000)?raw.focusMinutes:0;
 s.badges=Array.isArray(raw.badges)?raw.badges.filter(x=>typeof x==='string'&&x.length<50).slice(0,20):[];
 if(raw.drafts!==undefined){if(!isObject(raw.drafts)||Object.keys(raw.drafts).length>1000)throw Error('Invalid writing drafts.');for(const [key,value] of Object.entries(raw.drafts)){if(!safeKey(key)||key.length>100||typeof value!=='string'||value.length>10000)throw Error('Invalid writing draft.');s.drafts[key]=value;}}
 return s;
}
export function loadState(storage){try{const raw=storage.getItem(STORAGE_KEY);return {state:raw?validateState(JSON.parse(raw)):initialState(),error:false};}catch{return {state:initialState(),error:true};}}
export function saveState(storage,state){try{storage.setItem(STORAGE_KEY,JSON.stringify(state));return true;}catch{return false;}}
export function achievements(state,today=localDay(),courseIds=[]){const reviews=Object.keys(state.reviews).length,mastered=Object.values(state.reviews).filter(r=>r.mastered).length;return [
 {title:'First steps',description:'Complete your first learning activity',icon:'sprout',unlocked:state.xp>0},
 {title:'Card collector',description:'Review 20 different flashcards',icon:'cards',unlocked:reviews>=20},
 {title:'On a roll',description:'Study on 3 consecutive days',icon:'flame',unlocked:bestStreak(state)>=3},
 {title:'Perfect practice',description:'Score 100% in a practice session',icon:'target',unlocked:state.sessions.some(s=>s.type==='quiz'&&s.score===100)},
 {title:'Word keeper',description:'Master 20 flashcards',icon:'book',unlocked:mastered>=20},
 {title:'Finding focus',description:'Complete 25 minutes of focus time',icon:'clock',unlocked:state.focusMinutes>=25},
 {title:'Rising star',description:'Reach level 5',icon:'star',unlocked:state.xp>=1000},
 {title:'Chapter explorer',description:'Complete all 15 textbook sections',icon:'compass',unlocked:courseIds.length>0&&courseIds.every(id=>state.lessons.includes(id))}].map(b=>({...b,unlocked:b.unlocked||!!state.badges?.includes(b.title)}));}
