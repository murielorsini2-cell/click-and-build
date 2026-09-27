let score = parseInt(localStorage.getItem("clickScore"),10)||0;
let xp = parseInt(localStorage.getItem("clickXP"),10);
if (!Number.isFinite(xp)) xp = score; // migration douce des anciennes sauvegardes
let boost = parseInt(localStorage.getItem("clickBoost"),10)||1;
let upgradeCost = parseInt(localStorage.getItem("upgradeCost"),10)||50;
let specialReward = parseInt(localStorage.getItem("specialReward"),10)||0;
let top5 = JSON.parse(localStorage.getItem("top5")||"[]");
let clicksThisSecond=0, cpsSamples=[], cps=0;
let elapsedSeconds=parseInt(localStorage.getItem("elapsedSeconds"),10)||0, timerInterval=null;

const $=id=>document.getElementById(id);
const scoreEl=$("score"), snd=$("clicksnd"), cpsLive=$("cpsLive"), powerEl=$("power"), levelEl=$("level");
const progressText=$("progressText"), progressFill=$("progressFill"), levelMessage=$("levelMessage"), rewardEl=$("reward");
const upgradeBtn=$("upgradeBtn"), recordBtn=$("recordBtn"), themeBtn=$("themeBtn"), boostBtn=$("boostBtn");
let lastLevel=Math.floor(xp/100)+1;

function save(){localStorage.setItem("clickScore",score);localStorage.setItem("clickXP",xp);localStorage.setItem("elapsedSeconds",elapsedSeconds)}
function render(){
 const level=Math.floor(xp/100)+1, progress=xp%100, next=Math.floor(level/10)*10+10;
 scoreEl.innerText=score;
 levelEl.innerText=`⭐ Niveau : ${level}`;
 progressText.innerText=`Progression : ${progress}% — encore ${100-progress} XP`;
 progressFill.style.width=`${progress}%`;
 rewardEl.innerText=`🎁 Prochaine récompense spéciale : niveau ${next}`;
 powerEl.innerText=`Puissance : +${boost} par clic`;
 upgradeBtn.innerText=`⚡ +1 par clic — ${upgradeCost} points`;
}
function formatTime(){const m=String(Math.floor(elapsedSeconds/60)).padStart(2,"0"),s=String(elapsedSeconds%60).padStart(2,"0");$("timer").innerText=`Temps : ${m}:${s}`}
function startTimer(){if(timerInterval)return;timerInterval=setInterval(()=>{elapsedSeconds++;formatTime();localStorage.setItem("elapsedSeconds",elapsedSeconds)},1000)}
function celebrate(count=120){if(typeof confetti==="function")confetti({particleCount:count,spread:80,origin:{y:.6}})}

render();formatTime();
const savedTheme=localStorage.getItem("theme");
if(savedTheme==="light")document.body.classList.add("light");
themeBtn.textContent=document.body.classList.contains("light")?"🌞 Thème clair":"🌙 Thème sombre";

$("btn").onclick=()=>{
 score+=boost; xp+=boost; clicksThisSecond++;
 const currentLevel=Math.floor(xp/100)+1;
 if(currentLevel>lastLevel){
   lastLevel=currentLevel; score+=25;
   levelMessage.innerText=`🎉 Bravo ! Niveau ${currentLevel} atteint ! Bonus : +25 points !`;
   if(currentLevel%10===0 && currentLevel>specialReward){
     specialReward=currentLevel; score+=100; localStorage.setItem("specialReward",specialReward);
     levelMessage.innerText=`🎁 Récompense spéciale ! Niveau ${currentLevel} : +100 points !`;
   }
   celebrate(); setTimeout(()=>levelMessage.innerText="",3000);
 }
 save();render();startTimer();
 const effect=$("clickEffect");effect.innerText=`+${boost}`;setTimeout(()=>effect.innerText="",400);
 if(snd){snd.currentTime=0;snd.play().catch(()=>{});}
 scoreEl.classList.add("pop");setTimeout(()=>scoreEl.classList.remove("pop"),200);
};

upgradeBtn.onclick=()=>{
 if(score<upgradeCost){alert(`Il te manque ${upgradeCost-score} points !`);return;}
 score-=upgradeCost;boost++;upgradeCost=Math.floor(upgradeCost*1.5);
 localStorage.setItem("clickBoost",boost);localStorage.setItem("upgradeCost",upgradeCost);save();render();
};

boostBtn.disabled=true;
boostBtn.textContent="Boost x2 — bientôt disponible";
boostBtn.title="Paiement désactivé tant que le système sécurisé n'est pas connecté.";

function displayTop(){const medals=["🥇","🥈","🥉","4.","5."];const list=top5.map((s,i)=>`${medals[i]} ${s} points`).join("<br>");$("topList").innerHTML=list||"Aucun record"}
function saveTop(value){
 if(!top5.includes(value))top5.push(value);
 top5.sort((a,b)=>b-a);top5=top5.slice(0,5);localStorage.setItem("top5",JSON.stringify(top5));displayTop();celebrate(100);
}
displayTop();
recordBtn.onclick=()=>{saveTop(score);alert(top5.includes(score)?`🏆 Record : ${score} points.`:"Record enregistré.")};

$("shareBtn").onclick=()=>{const text=`J'ai atteint ${score} pts et ${xp} XP sur Click & Build ! Viens me battre :`;const url=`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.href)}`;window.open(url,"_blank","width=600,height=400")};

themeBtn.onclick=()=>{document.body.classList.toggle("light");const light=document.body.classList.contains("light");localStorage.setItem("theme",light?"light":"dark");themeBtn.textContent=light?"🌞 Thème clair":"🌙 Thème sombre"};

setInterval(()=>{cpsSamples.push(clicksThisSecond);if(cpsSamples.length>3)cpsSamples.shift();clicksThisSecond=0;cps=Math.round((cpsSamples.reduce((a,b)=>a+b,0)/cpsSamples.length)*10)/10;if(cpsLive)cpsLive.innerText="CPS : "+cps},1000);


// CHOIX LOCAL / EN LIGNE
const localModeBtn=$("localModeBtn"), onlineModeBtn=$("onlineModeBtn"), modeStatus=$("modeStatus"), modeMessage=$("modeMessage");
let playMode=localStorage.getItem("playMode")||"local";
function renderMode(){
  const local=playMode==="local";
  modeStatus.textContent=local?"Mode : local":"Mode : en ligne";
  localModeBtn.classList.toggle("mode-active",local);
  onlineModeBtn.classList.toggle("mode-active",!local);
  modeMessage.textContent=local?"Progression sauvegardée sur cet appareil.":"Mode en ligne sélectionné — connexion .io bientôt disponible.";
}
localModeBtn.onclick=()=>{playMode="local";localStorage.setItem("playMode",playMode);renderMode()};
onlineModeBtn.onclick=()=>{playMode="online";localStorage.setItem("playMode",playMode);renderMode()};
renderMode();
