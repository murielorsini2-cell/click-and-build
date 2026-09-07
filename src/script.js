let score = 0;
let boost = parseInt(localStorage.getItem("clickBoost"), 10) || 1;
let upgradeCost = parseInt(localStorage.getItem("upgradeCost"), 10) || 50;
let clicks = 0;
let cps = 0;
let specialReward = parseInt(localStorage.getItem("specialReward"), 10) || 0;

let startTime = null;
let timerInterval = null;

let top5 = JSON.parse(localStorage.getItem("top5")) || [];

const scoreEl = document.getElementById("score");
const snd = document.getElementById("clicksnd");
const cpsLive = document.getElementById("cpsLive");
const powerEl = document.getElementById("power");const levelEl = document.getElementById("level");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const levelMessage = document.getElementById("levelMessage");
const rewardEl = document.getElementById("reward");

const upgradeBtn = document.getElementById("upgradeBtn");
const recordBtn = document.getElementById("recordBtn");

const saved = localStorage.getItem("clickScore");

if (saved) {
  score = parseInt(saved, 10);
  scoreEl.innerText = score;
}
let lastLevel = Math.floor(score / 100) + 1;
let nextRewardLevel = Math.floor(lastLevel / 10) * 10 + 10;
rewardEl.innerText = `🎁 Prochaine récompense spéciale : niveau ${nextRewardLevel}`;
powerEl.innerText = `Puissance : +${boost} par clic`;
upgradeBtn.innerText = `⚡ +1 par clic — ${upgradeCost} points`;
levelEl.innerText = `⭐ Niveau : ${Math.floor(score / 100) + 1}`;
progressText.innerText = `Prochain niveau : ${score % 100}% — encore ${100 - (score % 100)} points`;
progressFill.style.width = `${score % 100}%`;

// BOUTON PRINCIPAL
document.getElementById("btn").onclick = () => {
  score += boost;
  clicks++;

  scoreEl.innerText = score;
  levelEl.innerText = `⭐ Niveau : ${Math.floor(score / 100) + 1}`;
 const currentLevel = Math.floor(score / 100) + 1;

if (currentLevel > lastLevel) {
  lastLevel = currentLevel;
 score += 25;
 scoreEl.innerText = score;
 levelEl.innerText = `⭐ Niveau : ${Math.floor(score / 100) + 1}`;
lastLevel = Math.floor(score / 100) + 1;
levelMessage.innerText = `🎉 Bravo ! Niveau ${currentLevel} atteint ! Bonus : +25 points !`;  
if (lastLevel % 10 === 0 && lastLevel > specialReward) {
  specialReward = lastLevel;
  score += 100;
 levelMessage.innerText = `🎁 Récompense spéciale ! Niveau ${specialReward} : +100 points !`; 

  localStorage.setItem("specialReward", specialReward);

  scoreEl.innerText = score;
  levelEl.innerText = `⭐ Niveau : ${Math.floor(score / 100) + 1}`;
  lastLevel = Math.floor(score / 100) + 1;
}  
nextRewardLevel = Math.floor(lastLevel / 10) * 10 + 10;
rewardEl.innerText = `🎁 Prochaine récompense spéciale : niveau ${nextRewardLevel}`;  
  if (typeof confetti === "function") {
  confetti({
    particleCount: 120,
    spread: 80,
    origin: { y: 0.6 }
  });
}

setTimeout(() => {
  levelMessage.innerText = "";
}, 3000);  
} 
 progressText.innerText = `Prochain niveau : ${score % 100}% — encore ${100 - (score % 100)} points`;
  progressFill.style.width = `${score % 100}%`;
  localStorage.setItem("clickScore", score);

  const clickEffect = document.getElementById("clickEffect");
  clickEffect.innerText = `+${boost}`;
  setTimeout(() => clickEffect.innerText = "", 400);

  snd.currentTime = 0;
  snd.play().catch(() => console.log("son bloqué"));

  scoreEl.classList.add("pop");
  setTimeout(() => scoreEl.classList.remove("pop"), 200);

  if (!startTime) {
    startTime = Date.now();

    timerInterval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTime) / 1000
      );

      const min = String(
        Math.floor(elapsed / 60)
      ).padStart(2, "0");

      const sec = String(
        elapsed % 60
      ).padStart(2, "0");

      const timerEl = document.getElementById("timer");

      if (timerEl) {
        timerEl.innerText = `Temps : ${min}:${sec}`;
      }
    }, 1000);
  }
};

// AMÉLIORATION +1 PAR CLIC
upgradeBtn.onclick = () => {
  if (score >= upgradeCost) {
    score -= upgradeCost;
    boost += 1;

    localStorage.setItem("clickBoost", boost);

    powerEl.innerText = `Puissance : +${boost} par clic`;

    upgradeCost = Math.floor(upgradeCost * 1.5);
    localStorage.setItem("upgradeCost", upgradeCost);

    scoreEl.innerText = score;
    levelEl.innerText = `⭐ Niveau : ${Math.floor(score / 100) + 1}`;    
 progressText.innerText = `Prochain niveau : ${score % 100}% — encore ${100 - (score % 100)} points`;
progressFill.style.width = `${score % 100}%`;  

    upgradeBtn.innerText =
      `⚡ +1 par clic — ${upgradeCost} points`;

    localStorage.setItem("clickScore", score);
  } else {
    alert(`Il te manque ${upgradeCost - score} points !`);
  }
};

// BOOST x2
document.getElementById("boostBtn").onclick = () => {
  window.open(
    "https://www.paypal.com/donate?hosted_button_id=ABCDEF123456",
    "_blank"
  );

  setTimeout(() => {
    if (confirm("As-tu bien payé 1 € ?")) {
      boost *= 2;

      localStorage.setItem("clickBoost", boost);

      powerEl.innerText = `Puissance : +${boost} par clic`;

      alert("Boost x2 activé !");
    }
  }, 8000);
};

// TOP 5
function saveTop(score) {
  top5.push(score);
  top5.sort((a, b) => b - a);
  top5 = top5.slice(0, 5);

  localStorage.setItem("top5", JSON.stringify(top5));
  displayTop();

  if (typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

function displayTop() {
  const medals = ["🥇", "🥈", "🥉", "4.", "5."];

  const list = top5
    .map((s, i) => `${medals[i]} ${s} points`)
    .join("<br>");

  document.getElementById("topList").innerHTML =
    list || "Aucun record";
}

displayTop();

// BOUTON ENREGISTRER MON RECORD
recordBtn.onclick = () => {
  saveTop(score);
  alert(`🏆 Record de ${score} points enregistré !`);
};

// PARTAGER LE SCORE
document.getElementById("shareBtn").onclick = () => {
  const text =
    `J'ai atteint ${score} pts sur Click & Build ! Viens me battre :`;

  const url =
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}` +
    `&url=${encodeURIComponent(window.location.href)}`;

  window.open(url, "_blank", "width=600,height=400");
};

// THÈME
const themeBtn = document.getElementById("themeBtn");

themeBtn.onclick = () => {
  document.body.classList.toggle("light");

  themeBtn.textContent =
    document.body.classList.contains("light")
      ? "🌞 Thème clair"
      : "🌙 Thème sombre";
};

// CPS
setInterval(() => {
  cps = clicks;
  clicks = 0;

  if (cpsLive) {
    cpsLive.innerText = "CPS : " + cps;
  }
}, 1000);