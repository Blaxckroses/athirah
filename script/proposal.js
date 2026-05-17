// ============================================================
//  PROPOSAL HANDLER
//  Saves answer + IP to GitHub Gist & sends WhatsApp via wa.me
// ============================================================

// ---- CONFIG — UPDATE THESE ----
const GITHUB_TOKEN  = "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";   // Fine-grained token, Gists scope
const GIST_ID       = "3357a20cfc3164489ee8b3a1a32d49e0";         // Create a gist first, paste ID here
const WA_NUMBER     = "60176407713";                        // WhatsApp number (no +)
// --------------------------------

async function getIP() {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    const d = await r.json();
    return d.ip || "unknown";
  } catch { return "unknown"; }
}

async function saveToGist(answer, ip) {
  const timestamp = new Date().toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });
  const entry = { answer, ip, timestamp };

  // Read existing gist content first
  let existing = [];
  try {
    const readRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });
    const gistData = await readRes.json();
    const files = gistData.files;
    const firstFile = Object.values(files)[0];
    if (firstFile && firstFile.content) {
      existing = JSON.parse(firstFile.content);
    }
  } catch (e) { existing = []; }

  existing.push(entry);

  // Write back
  try {
    await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        files: {
          "jawapan_fearaa.json": {
            content: JSON.stringify(existing, null, 2)
          }
        }
      })
    });
    console.log("✅ Saved to GitHub Gist");
  } catch (e) {
    console.error("❌ Failed to save to GitHub:", e);
  }
}

function buildWAMessage(answer, ip, timestamp) {
  const labels = {
    accept: "💍 ACCEPT — Dia kata YES!",
    time:   "⏳ TAKE TIME — Dia minta masa",
    reject: "💔 REJECT — Dia kata tidak"
  };
  return encodeURIComponent(
    `🌹 Jawapan Proposal Fearaa\n\n` +
    `Jawapan: ${labels[answer] || answer}\n` +
    `Masa: ${timestamp}\n` +
    `IP: ${ip}\n\n` +
    `— Dihantar secara automatik dari proposal page 💌`
  );
}

async function handleAnswer(answer) {
  // Disable buttons to prevent double-click
  document.querySelectorAll(".proposal-buttons button").forEach(b => b.disabled = true);

  const ip = await getIP();
  const timestamp = new Date().toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });

  // Save to GitHub
  await saveToGist(answer, ip, timestamp);

  // Show animation overlay
  const overlayMap = {
    accept: "acceptOverlay",
    time:   "timeOverlay",
    reject: "rejectOverlay"
  };
  const overlay = document.getElementById(overlayMap[answer]);
  if (overlay) {
    overlay.classList.add("active");
    triggerAnimation(answer);
  }

  // Open WhatsApp after short delay (so user sees animation first)
  setTimeout(() => {
    const msg = buildWAMessage(answer, ip, timestamp);
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
  }, 2000);
}

function closeOverlay(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("active");
  // Re-enable buttons
  document.querySelectorAll(".proposal-buttons button").forEach(b => b.disabled = false);
}

// ---- Per-answer animations ----
function triggerAnimation(answer) {
  if (answer === "accept") {
    spawnHearts();
    spawnFireworks();
  } else if (answer === "time") {
    spawnStars();
  } else if (answer === "reject") {
    spawnRain();
  }
}

function spawnHearts() {
  const container = document.getElementById("heartsRain");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const h = document.createElement("div");
    h.className = "heart-particle";
    h.textContent = ["💕","💍","✨","💖","🌸"][Math.floor(Math.random()*5)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.animationDelay = Math.random() * 3 + "s";
    h.style.animationDuration = (2 + Math.random() * 3) + "s";
    h.style.fontSize = (1 + Math.random() * 2) + "rem";
    container.appendChild(h);
  }
}

function spawnFireworks() {
  const container = document.getElementById("fireworksContainer");
  if (!container) return;
  container.innerHTML = "";
  const colors = ["#ff69b4","#ffb347","#87ceeb","#98fb98","#dda0dd","#f0e68c"];
  for (let i = 0; i < 60; i++) {
    const p = document.createElement("div");
    p.className = "firework-particle";
    p.style.left = (20 + Math.random() * 60) + "%";
    p.style.top  = (10 + Math.random() * 60) + "%";
    p.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(p);
  }
}

function spawnStars() {
  const container = document.getElementById("starsFloat");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 30; i++) {
    const s = document.createElement("div");
    s.className = "star-particle";
    s.textContent = ["⭐","🌙","✨","💫","🌟"][Math.floor(Math.random()*5)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDelay = Math.random() * 4 + "s";
    s.style.animationDuration = (3 + Math.random() * 4) + "s";
    container.appendChild(s);
  }
}

function spawnRain() {
  const container = document.getElementById("rainDrops");
  if (!container) return;
  container.innerHTML = "";
  for (let i = 0; i < 50; i++) {
    const d = document.createElement("div");
    d.className = "rain-particle";
    d.style.left = Math.random() * 100 + "vw";
    d.style.animationDelay = Math.random() * 2 + "s";
    d.style.animationDuration = (0.8 + Math.random() * 1) + "s";
    container.appendChild(d);
  }
}
