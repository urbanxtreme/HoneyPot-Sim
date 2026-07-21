// =========================================
// RL Honeypot Simulator
// =========================================

// Buttons
const executeBtn = document.getElementById("executeBtn");
const resetBtn = document.getElementById("resetBtn");

// Dropdown
const attackSelect = document.getElementById("attackSelect");

// Cards
const protocol = document.getElementById("protocol");
const functionCode = document.getElementById("functionCode");
const sourceIP = document.getElementById("sourceIP");

const mitreStage = document.getElementById("mitreStage");

const thinking = document.getElementById("thinking");
const actionResult = document.getElementById("actionResult");

const reward = document.getElementById("reward");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const intelList = document.getElementById("intelList");

const log = document.getElementById("log");

// Summary
const totalReward = document.getElementById("totalReward");
const attackDepth = document.getElementById("attackDepth");
const threatCount = document.getElementById("threatCount");
const decisionCount = document.getElementById("decisionCount");

// =========================================
// Simulator Variables
// =========================================

let rewardTotal = 0;
let depth = 0;
let decisions = 0;

let collectedThreats = [];

// =========================================
// RL Policy
// (Simple version for seminar)
// =========================================

const attacks = {
  scan: {
    protocol: "Modbus",

    function: "Discovery Scan",

    tactic: "Reconnaissance",

    action: "Delay Response",

    reward: 5,

    intel: "Reconnaissance Data",

    progress: 20,
  },

  read: {
    protocol: "Modbus",

    function: "Read Holding Register",

    tactic: "Discovery",

    action: "Allow & Monitor",

    reward: 7,

    intel: "Register Information",

    progress: 40,
  },

  write: {
    protocol: "Modbus",

    function: "Write Register",

    tactic: "Collection",

    action: "Inject Fake Register Data",

    reward: 10,

    intel: "Modified Register Attempt",

    progress: 60,
  },

  upload: {
    protocol: "S7Comm",

    function: "Upload Logic",

    tactic: "Execution",

    action: "Deploy Fake PLC Logic",

    reward: 12,

    intel: "Malware Upload Behaviour",

    progress: 80,
  },

  stop: {
    protocol: "Modbus",

    function: "Stop PLC",

    tactic: "Impact",

    action: "Block Connection",

    reward: 15,

    intel: "Critical Attack Attempt",

    progress: 100,
  },
};

// =========================================
// Random IP Generator
// =========================================

function randomIP() {
  return `192.168.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`;
}

// =========================================
// Add Log (Enhanced for terminal style)
// =========================================

function addLog(text) {
  const time = new Date().toLocaleTimeString();

  const line = document.createElement("span");
  line.className = "log-line";
  line.innerHTML = `[${time}] ${text}`;
  log.appendChild(line);

  log.scrollTop = log.scrollHeight;
}

// =========================================
// NEW UI ENHANCEMENT REFERENCES
// =========================================

// Architecture diagram blocks
const archBlocks = [
  document.getElementById("archAttacker"),
  document.getElementById("archPacket"),
  document.getElementById("archMitre"),
  document.getElementById("archRL"),
  document.getElementById("archHoneypot"),
  document.getElementById("archThreatIntel"),
];

// Packet dot
const packetDot = document.getElementById("packetDot");

// Radar spinner
const radarSpinner = document.getElementById("radarSpinner");

// RL phases
const rlPhases = document.getElementById("rlPhases");
const phaseItems = rlPhases ? rlPhases.querySelectorAll(".phase-item") : [];

// MITRE timeline steps
const mitreSteps = document.querySelectorAll(".mitre-step");
const mitreLines = document.querySelectorAll(".mitre-timeline .mitre-line");

// Progress percent overlay
const progressPercent = document.getElementById("progressPercent");

// Extra packet fields
const destIP = document.getElementById("destIP");
const packetSize = document.getElementById("packetSize");
const packetStatus = document.getElementById("packetStatus");

// Modal
const completionModal = document.getElementById("completionModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalReward = document.getElementById("modalReward");
const modalThreats = document.getElementById("modalThreats");
const modalDepth = document.getElementById("modalDepth");
const modalDecisions = document.getElementById("modalDecisions");

// MITRE tactic order (for timeline highlighting)
const tacticOrder = [
  "Reconnaissance",
  "Discovery",
  "Collection",
  "Execution",
  "Impact",
];

// Track completed tactics for timeline persistence
let completedTactics = new Set();

// =========================================
// ARCHITECTURE DIAGRAM ANIMATION
// =========================================

function highlightArchBlock(index, isActive) {
  if (archBlocks[index]) {
    archBlocks[index].classList.remove("active", "completed");
    if (isActive) {
      archBlocks[index].classList.add("active");
    }
  }
}

function completeArchBlock(index) {
  if (archBlocks[index]) {
    archBlocks[index].classList.remove("active");
    archBlocks[index].classList.add("completed");
  }
}

function animateArchitecture() {
  // Sequentially highlight blocks
  const delays = [0, 300, 600, 900, 1400, 1900];

  archBlocks.forEach((block, i) => {
    if (!block) return;
    // Highlight as active
    setTimeout(() => {
      // Clear previous active
      archBlocks.forEach((b) => {
        if (b) b.classList.remove("active");
      });
      highlightArchBlock(i, true);
    }, delays[i]);

    // Mark as completed after active
    if (i < archBlocks.length - 1) {
      setTimeout(
        () => {
          completeArchBlock(i);
        },
        delays[i + 1],
      );
    }
  });

  // Final block completed after full animation
  setTimeout(
    () => {
      completeArchBlock(archBlocks.length - 1);
    },
    delays[delays.length - 1] + 500,
  );
}

function resetArchitecture() {
  archBlocks.forEach((block) => {
    if (block) {
      block.classList.remove("active", "completed");
    }
  });
}

// =========================================
// PACKET DOT ANIMATION
// =========================================

function triggerPacketAnimation() {
  if (!packetDot) return;
  packetDot.classList.remove("animate");
  // Force reflow to restart animation
  void packetDot.offsetWidth;
  packetDot.classList.add("animate");
}

function resetPacketAnimation() {
  if (packetDot) {
    packetDot.classList.remove("animate");
  }
}

// =========================================
// RL THINKING PHASES ANIMATION
// =========================================

function animateRLPhases() {
  if (!rlPhases) return;

  // Activate radar spinner
  if (radarSpinner) radarSpinner.classList.add("active");

  // Reset phases
  phaseItems.forEach((p) =>
    p.classList.remove("active-phase", "completed-phase"),
  );

  const phaseDelays = [0, 500, 1000, 1700];

  phaseItems.forEach((item, i) => {
    setTimeout(() => {
      // Mark previous phases as completed
      for (let j = 0; j < i; j++) {
        phaseItems[j].classList.remove("active-phase");
        phaseItems[j].classList.add("completed-phase");
      }
      item.classList.add("active-phase");
    }, phaseDelays[i]);
  });

  // After RL decision
  setTimeout(() => {
    phaseItems.forEach((p) => {
      p.classList.remove("active-phase");
      p.classList.add("completed-phase");
    });
    if (radarSpinner) radarSpinner.classList.remove("active");
  }, 2000);
}

function resetRLPhases() {
  if (radarSpinner) radarSpinner.classList.remove("active");
  phaseItems.forEach((p) =>
    p.classList.remove("active-phase", "completed-phase"),
  );
}

// =========================================
// MITRE TIMELINE ANIMATION
// =========================================

function updateMitreTimeline(tactic) {
  const tacticIndex = tacticOrder.indexOf(tactic);
  if (tacticIndex === -1) return;

  // Add tactic and all before it to completed
  for (let i = 0; i <= tacticIndex; i++) {
    completedTactics.add(tacticOrder[i]);
  }

  mitreSteps.forEach((step) => {
    const stepTactic = step.getAttribute("data-tactic");
    step.classList.remove("active", "completed");

    if (stepTactic === tactic) {
      step.classList.add("active");
    } else if (completedTactics.has(stepTactic)) {
      step.classList.add("completed");
    }
  });

  // Highlight connecting lines
  mitreLines.forEach((line, i) => {
    line.classList.remove("completed");
    if (i < tacticIndex) {
      line.classList.add("completed");
    }
  });
}

function resetMitreTimeline() {
  completedTactics.clear();
  mitreSteps.forEach((step) => step.classList.remove("active", "completed"));
  mitreLines.forEach((line) => line.classList.remove("completed"));
}

// =========================================
// REWARD FLASH ANIMATION
// =========================================

function flashReward() {
  reward.classList.remove("flash");
  void reward.offsetWidth;
  reward.classList.add("flash");
}

// =========================================
// KPI UPDATE ANIMATION
// =========================================

function animateKPI() {
  document.querySelectorAll(".kpi-card").forEach((card) => {
    card.classList.remove("updated");
    void card.offsetWidth;
    card.classList.add("updated");
  });
}

// =========================================
// PACKET STATUS UPDATE
// =========================================

function updatePacketExtras(data) {
  if (packetSize) {
    const sizes = {
      scan: "64 B",
      read: "128 B",
      write: "256 B",
      upload: "512 B",
      stop: "48 B",
    };
    const selected = attackSelect.value;
    packetSize.textContent = sizes[selected] || "-";
  }
  if (packetStatus) {
    packetStatus.textContent = "Captured";
    packetStatus.className = "packet-status-badge captured";
  }
}

function resetPacketExtras() {
  if (packetSize) packetSize.textContent = "-";
  if (packetStatus) {
    packetStatus.textContent = "Idle";
    packetStatus.className = "packet-status-badge idle";
  }
  if (destIP) destIP.textContent = "10.0.0.1 (PLC)";
}

// =========================================
// BADGE ACTIVE STATE
// =========================================

function activateBadge() {
  if (mitreStage) mitreStage.classList.add("active-badge");
}

function deactivateBadge() {
  if (mitreStage) mitreStage.classList.remove("active-badge");
}

// =========================================
// INTEL CARD CREATION (Enhanced)
// =========================================

function createIntelCard(data) {
  const time = new Date().toLocaleTimeString();
  const card = document.createElement("div");
  card.className = "intel-item";
  card.innerHTML = `
    <div class="intel-item-header">
      <span class="intel-item-type"><i class="fa-solid fa-circle-check"></i> ${data.intel}</span>
      <span class="intel-item-time">${time}</span>
    </div>
    <div class="intel-item-details">
      <div class="intel-detail"><strong>Tactic:</strong> ${data.tactic}</div>
      <div class="intel-detail"><strong>Response:</strong> ${data.action}</div>
    </div>
  `;
  return card;
}

// =========================================
// COMPLETION MODAL
// =========================================

function showCompletionModal() {
  if (!completionModal) return;

  if (modalReward) modalReward.textContent = rewardTotal;
  if (modalThreats) modalThreats.textContent = collectedThreats.length;
  if (modalDepth) modalDepth.textContent = depth + "%";
  if (modalDecisions) modalDecisions.textContent = decisions;

  completionModal.classList.add("show");
}

function hideCompletionModal() {
  if (completionModal) completionModal.classList.remove("show");
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", () => {
    hideCompletionModal();
    // Trigger the existing reset logic
    resetBtn.click();
  });
}

// =========================================
// BUTTON RIPPLE EFFECT
// =========================================

function addRipple(e) {
  const button = e.currentTarget;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = e.clientX - rect.left - size / 2 + "px";
  ripple.style.top = e.clientY - rect.top - size / 2 + "px";
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// Attach ripple to buttons
document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", addRipple);
});

// =========================================
// Execute Simulation (Enhanced)
// =========================================

// Track execution state to prevent rapid-fire stacking
let isExecuting = false;

executeBtn.addEventListener("click", () => {
  const selected = attackSelect.value;

  if (selected === "") {
    // Show a subtle warning instead of raw alert for empty selection
    attackSelect.style.borderColor = "#ef4444";
    attackSelect.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.2)";
    setTimeout(() => {
      attackSelect.style.borderColor = "";
      attackSelect.style.boxShadow = "";
    }, 1500);
    return;
  }

  // Prevent double-click stacking during animation
  if (isExecuting) return;
  isExecuting = true;
  executeBtn.style.opacity = "0.6";
  executeBtn.style.pointerEvents = "none";

  const data = attacks[selected];

  // Packet Details
  protocol.innerHTML = data.protocol;
  functionCode.innerHTML = data.function;
  sourceIP.innerHTML = randomIP();

  // MITRE
  mitreStage.innerHTML = data.tactic;

  // RL Thinking
  thinking.innerHTML = "RL Agent analysing attacker behaviour...";
  actionResult.innerHTML = "-";

  // ===== NEW UI ENHANCEMENTS =====

  // Architecture animation
  animateArchitecture();

  // Packet dot animation
  triggerPacketAnimation();

  // RL phases animation
  animateRLPhases();

  // MITRE timeline
  updateMitreTimeline(data.tactic);

  // Badge activate
  activateBadge();

  // Packet extras
  updatePacketExtras(data);

  // Simulate RL delay (2s for RL thinking animation)
  setTimeout(() => {
    thinking.innerHTML = "Decision Completed";
    actionResult.innerHTML = data.action;

    // Reward
    reward.innerHTML = "+" + data.reward;
    rewardTotal += data.reward;

    // Reward flash
    flashReward();

    // Progress
    progressBar.style.width = data.progress + "%";
    progressText.innerHTML = data.progress + "% Attack Depth";

    // Progress percent overlay
    if (progressPercent) progressPercent.textContent = data.progress + "%";

    // Intelligence
    if (!collectedThreats.includes(data.intel)) {
      collectedThreats.push(data.intel);

      // Remove empty state
      const emptyState = intelList.querySelector(".intel-empty");
      if (emptyState) emptyState.remove();

      // Create enhanced intel card instead of plain li
      const intelCard = createIntelCard(data);
      intelList.appendChild(intelCard);
    }

    // Statistics
    depth = data.progress;
    decisions++;

    totalReward.innerHTML = rewardTotal;
    attackDepth.innerHTML = depth + "%";
    threatCount.innerHTML = collectedThreats.length;
    decisionCount.innerHTML = decisions;

    // KPI animation
    animateKPI();

    // Packet status update for block actions
    if (data.action === "Block Connection" && packetStatus) {
      packetStatus.textContent = "Blocked";
      packetStatus.className = "packet-status-badge blocked";
    }

    // Log
    addLog("Incoming " + data.protocol + " packet detected.");
    addLog("Mapped to MITRE tactic : " + data.tactic);
    addLog("RL selected action : " + data.action);
    addLog("Reward received : +" + data.reward);
    addLog("Threat intelligence collected.");

    // Final Message — show modal instead of alert
    if (depth === 100) {
      setTimeout(() => {
        showCompletionModal();
      }, 500);
    }

    // Re-enable execute button
    isExecuting = false;
    executeBtn.style.opacity = "";
    executeBtn.style.pointerEvents = "";
  }, 2000);
});

// =========================================
// Reset (Enhanced)
// =========================================

resetBtn.addEventListener("click", () => {
  attackSelect.value = "";

  protocol.innerHTML = "-";
  functionCode.innerHTML = "-";
  sourceIP.innerHTML = "-";

  mitreStage.innerHTML = "Waiting...";

  thinking.innerHTML = "Waiting for attack...";
  actionResult.innerHTML = "-";

  reward.innerHTML = "0";

  progressBar.style.width = "0%";
  progressText.innerHTML = "Awaiting attack initiation...";

  // Reset intel list with empty state
  intelList.innerHTML = `
    <div class="intel-empty">
      <i class="fa-solid fa-satellite-dish"></i>
      <span>No intelligence collected.</span>
    </div>
  `;

  log.innerHTML =
    '<span class="log-line">[System] Initialised — Awaiting attack simulation...</span>';

  rewardTotal = 0;
  depth = 0;
  decisions = 0;
  collectedThreats = [];

  totalReward.innerHTML = "0";
  attackDepth.innerHTML = "0";
  threatCount.innerHTML = "0";
  decisionCount.innerHTML = "0";

  // ===== RESET NEW UI ELEMENTS =====
  resetArchitecture();
  resetPacketAnimation();
  resetRLPhases();
  resetMitreTimeline();
  resetPacketExtras();
  deactivateBadge();
  hideCompletionModal();

  // Re-enable execute button in case reset is clicked mid-animation
  isExecuting = false;
  executeBtn.style.opacity = "";
  executeBtn.style.pointerEvents = "";

  // Progress percent overlay
  if (progressPercent) progressPercent.textContent = "0%";
});
