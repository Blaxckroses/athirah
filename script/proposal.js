// ============================================================
//  PROPOSAL HANDLER
//  Saves answer + IP to GitHub Gist & sends WhatsApp via wa.me
// ============================================================

// ---- CONFIG — UPDATE THESE ----
const GITHUB_TOKEN  = "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";   // Fine-grained token, Gists scope
const GIST_ID       = "3a91fd6e45bfd75c7ea3aa6886654ede";         // Create a gist first, paste ID here
const WA_NUMBER     = "60176407713";                        // WhatsApp number (no +)
// --------------------------------

function handleAnswer(answer) {
  document.querySelectorAll(".proposal-buttons button").forEach(function(b) { b.disabled = true; });

  var timestamp = new Date().toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });
  var labels = { accept: "ACCEPT - Dia kata YES!", time: "TAKE TIME - Dia minta masa", reject: "REJECT - Dia kata tidak" };

  var msg = encodeURIComponent("Jawapan Proposal Fearaa\n\nJawapan: " + labels[answer] + "\nMasa: " + timestamp + "\n\n- Dari proposal page");
  window.open("https://wa.me/" + WA_NUMBER + "?text=" + msg, "_blank");

  var overlayMap = { accept: "acceptOverlay", time: "timeOverlay", reject: "rejectOverlay" };
  var overlay = document.getElementById(overlayMap[answer]);
  if (overlay) { overlay.classList.add("active"); triggerAnimation(answer); }

  fetch("https://api.ipify.org?format=json")
    .then(function(r) { return r.json(); })
    .then(function(d) { return d.ip || "unknown"; })
    .catch(function() { return "unknown"; })
    .then(function(ip) {
      fetch("https://api.github.com/gists/" + GIST_ID, {
        headers: { "Authorization": "token " + GITHUB_TOKEN, "Accept": "application/vnd.github.v3+json" }
      })
      .then(function(r) { return r.json(); })
      .then(function(g) {
        var list = [];
        try { list = JSON.parse(Object.values(g.files)[0].content); } catch(e) {}
        list.push({ answer: answer, ip: ip, timestamp: timestamp });
        fetch("https://api.github.com/gists/" + GIST_ID, {
          method: "PATCH",
          headers: { "Authorization": "token " + GITHUB_TOKEN, "Accept": "application/vnd.github.v3+json", "Content-Type": "application/json" },
          body: JSON.stringify({ files: { "jawapan_fearaa.json": { content: JSON.stringify(list, null, 2) } } })
        });
      });
    });
}

function closeOverlay(id) {
  var el = document.getElementById(id);
  if (el) el.classList.remove("active");
  document.querySelectorAll(".proposal-buttons button").forEach(function(b) { b.disabled = false; });
}

function triggerAnimation(answer) {
  if (answer === "accept") { spawnHearts(); spawnFireworks(); }
  else if (answer === "time") { spawnStars(); }
  else if (answer === "reject") { spawnRain(); }
}

function spawnHearts() {
  var c = document.getElementById("heartsRain"); if (!c) return; c.innerHTML = "";
  for (var i = 0; i < 40; i++) {
    var h = document.createElement("div"); h.className = "heart-particle";
    h.textContent = ["💕","💍","✨","💖","🌸"][Math.floor(Math.random()*5)];
    h.style.left = Math.random()*100+"vw"; h.style.animationDelay = Math.random()*3+"s";
    h.style.animationDuration = (2+Math.random()*3)+"s"; h.style.fontSize = (1+Math.random()*2)+"rem";
    c.appendChild(h);
  }
}

function spawnFireworks() {
  var c = document.getElementById("fireworksContainer"); if (!c) return; c.innerHTML = "";
  var colors = ["#ff69b4","#ffb347","#87ceeb","#98fb98","#dda0dd","#f0e68c"];
  for (var i = 0; i < 60; i++) {
    var p = document.createElement("div"); p.className = "firework-particle";
    p.style.left = (20+Math.random()*60)+"%"; p.style.top = (10+Math.random()*60)+"%";
    p.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDelay = Math.random()*2+"s"; c.appendChild(p);
  }
}

function spawnStars() {
  var c = document.getElementById("starsFloat"); if (!c) return; c.innerHTML = "";
  for (var i = 0; i < 30; i++) {
    var s = document.createElement("div"); s.className = "star-particle";
    s.textContent = ["⭐","🌙","✨","💫","🌟"][Math.floor(Math.random()*5)];
    s.style.left = Math.random()*100+"vw"; s.style.animationDelay = Math.random()*4+"s";
    s.style.animationDuration = (3+Math.random()*4)+"s"; c.appendChild(s);
  }
}

function spawnRain() {
  var c = document.getElementById("rainDrops"); if (!c) return; c.innerHTML = "";
  for (var i = 0; i < 50; i++) {
    var d = document.createElement("div"); d.className = "rain-particle";
    d.style.left = Math.random()*100+"vw"; d.style.animationDelay = Math.random()*2+"s";
    d.style.animationDuration = (0.8+Math.random()*1)+"s"; c.appendChild(d);
  }
}
