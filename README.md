# RL Honeypot Simulator — Presentation Guide

This document provides a step-by-step guide on how to present and demonstrate the **RL Honeypot Simulator SOC Dashboard**. It explains exactly what actions to take in the UI and what features to highlight to your audience during the presentation.

---

## 1. Introduction and Overview
When you first open the dashboard, take a moment to introduce the UI to your audience.

**What to point out:**
- **The Concept:** This is a simulated Security Operations Center (SOC) dashboard that demonstrates how a Reinforcement Learning (RL) agent dynamically responds to industrial control system (ICS) cyberattacks in real-time.
- **Top Section (System Architecture):** Explain the data flow. The attack comes from the **Attacker**, gets captured by **Packet Capture**, mapped to a tactic by the **MITRE Mapper**, analyzed by the **RL Agent**, routed to the **Honeypot**, and finally logged into **Threat Intel**.
- **MITRE ATT&CK Timeline:** Point out the timeline just below the architecture. This tracks the progression of an attacker's campaign from initial Reconnaissance to final Impact.

---

## 2. Simulating the Attack Progression

The simulator is designed to be demonstrated progressively. An attacker typically doesn't jump straight to shutting down a system; they perform reconnaissance first. You should demonstrate the attacks in order to show the RL agent adapting as the attack deepens.

### Step 1: Reconnaissance (Scan PLC)
1. In the **Attack Simulation** control panel, click the dropdown menu (`Select Attacker Action`).
2. Select **"Scan PLC"**.
3. Click the **"Execute Attack"** button.

**What to highlight while the animation plays (2 seconds):**
- Watch the **Packet Dot** travel through the System Architecture pipeline.
- See the **RL Agent Decision** card (bottom left) show the "radar" thinking animation as the agent evaluates the environment.
- Notice the **MITRE ATT&CK Timeline** lights up the "Recon" stage.

**What to explain after the decision:**
- The RL agent detected a reconnaissance scan. Instead of blocking it (which tips off the attacker), it chose **"Delay Response"**.
- This subtle response earns a small **Reward** (+5).
- A new **Threat Intelligence** card has been generated.
- The **Attack Progress** bar is now at 20%.

### Step 2: Discovery (Read Register)
1. From the dropdown, select **"Read Register"**.
2. Click **"Execute Attack"**.

**What to highlight:**
- The **Incoming Packet** card updates dynamically (e.g., Function changes to "Read Holding Register").
- The MITRE timeline progresses to **"Discovery"**.
- The RL agent decides to **"Allow & Monitor"**. Explain to the audience that the honeypot is feeding the attacker harmless data to learn more about their tools.

### Step 3: Collection (Write Register)
1. From the dropdown, select **"Write Register"**.
2. Click **"Execute Attack"**.

**What to highlight:**
- The attacker is now trying to alter data (Collection).
- The RL agent takes a more active defense: **"Inject Fake Register Data"**. 
- The **Live Event Feed** (Terminal at the bottom) is logging every stage of this interaction with timestamps.
- The **Reward** counter flashes green as the agent earns more points (+10) for successfully deceiving the attacker.

### Step 4: Execution (Upload Malware)
1. From the dropdown, select **"Upload Malware"**.
2. Click **"Execute Attack"**.

**What to highlight:**
- The attack is becoming critical. The protocol changes to `S7Comm` and the packet size increases.
- The RL Agent makes an advanced decision: **"Deploy Fake PLC Logic"**. It traps the malware in an isolated honeypot environment.
- Point out the **Simulation Statistics** (KPI cards). They visually "bump" when updating, showing we've collected 4 threats and reached 80% attack depth.

### Step 5: Impact (Stop PLC)
1. From the dropdown, select **"Stop PLC"**.
2. Click **"Execute Attack"**.

**What to highlight:**
- This is the final, critical strike. The attacker attempts to shut down the industrial system.
- The RL Agent immediately decides to **"Block Connection"**. In the Incoming Packet card, the status changes to a red **"Blocked"** badge.
- The MITRE timeline completes the final **"Impact"** stage.
- The progress bar hits **100%**.

---

## 3. The Completion Summary
Immediately after the final attack reaches 100%, the **Simulation Complete Modal** will automatically appear on the screen.

**What to explain:**
- Summarize the results shown on the modal: 
  - The RL Agent successfully mitigated a full kill-chain attack.
  - Read out the total Reward points earned by the agent.
  - Highlight the number of unique Threat Intelligence signatures collected safely inside the honeypot without risking the real ICS network.
- Click **"Start New Simulation"** on the modal. This demonstrates that the system gracefully resets all values, clears the timeline, and readies the dashboard for the next attack scenario.

---

## Presentation Tips for Maximum Impact
- **Pacing:** Don't rush clicking the dropdowns. After you click "Execute Attack," pause talking for a second so the audience naturally watches the glowing packet travel across the architecture diagram and the RL radar spinner. 
- **Terminal Log:** If someone asks for technical details, point them to the green terminal feed at the bottom, which looks like real system logs.
- **Narrative:** Frame the demonstration as a story. The attacker starts outside the fence (scanning) and slowly breaks in (reading/writing) until they try to sabotage the plant (stop PLC). The RL agent is the protagonist, getting smarter and earning higher rewards at each step.
