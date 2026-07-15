# 🛡️ REDHAWK AI – Cyber Reconnaissance & Code Vulnerability Suite

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=24&duration=3000&pause=1000&center=true&vCenter=true&width=800&lines=Automated+Cyber+Reconnaissance;OWASP+Threat+Scanners+%26+Threat+Modeling;Exploit+Sandbox+Simulator+%26+Auto-Patch+Engine;AI+Attack+Surface+Analysis" alt="Typing SVG" />
</p>

---

## 🔥 About RedHawk AI
**RedHawk AI** is a state-of-the-art hacker-themed security command center built as an interactive dashboard. It combines active OSINT reconnaissance with local code security auditing, interactive compromise mapping, and one-click secure refactoring (auto-patching). 

Designed to showcase cybersecurity operations, it allows users to scan source code for OWASP Top 10 vulnerabilities, model exploitation paths, view simulated sandboxed exploitation payloads, run active DNS/WHOIS/Port recon, and generate AI-powered attack surface reports.

---

## 🎯 Key Features

- 🌐 **Automated Reconnaissance Pipeline:** Actively resolve DNS A/MX/TXT records, look up WHOIS registrars, query active TCP ports, and discover target subdomains.
- 🧠 **AI Attack Surface Analyzer:** Telemetry-driven analysis engine that parses scan results to identify exposed CMS instances, outdated servers, and suggest remediation priorities.
- 🛡️ **OWASP static scanner:** Instantly audit files for SQL Injection, Command Injection, DOM XSS, predictive random seeds, and exposed Stripe API keys.
- 📐 **Interactive Attack Path Flow:** Dynamically render compromise graphs linking ingress vectors to Remote Code Execution (RCE) via interactive SVG nodes.
- 🎮 **Exploit Playground Sandbox:** Simulate realistic shell sessions (e.g. `sqlmap` dumping credentials or cookie hijacking payloads) inside a CRT-styled terminal.
- ⚡ **One-Click Auto-Patch Engine:** Instantly rewrite insecure lines into safe parameterized queries or secure token bindings inside the Monaco Editor.
- 🐚 **Interactive CLI Console:** Integrated terminal supporting commands like `help`, `scan`, `exploit`, `patch`, `recon`, `cve-check`, and `system-logs` with tab-history.
- 📄 **Dynamic PDF Report Exporter:** Download beautifully structured security reports compiling active recon mappings, vulnerabilities list, and the AI Attack Surface analysis report.
- 🔑 **Quick Access Mode:** Built-in Firebase Auth bypass simulator allowing instant guest traversal into the command center interface.

---

## ⚙️ Tech Stack

- **Frontend Client:** React 18, TypeScript, Vite, Tailwind CSS, Lucide icons
- **Code Console:** Monaco Editor (VS Code core)
- **Reporting Engine:** jsPDF & jsPDF-AutoTable
- **Backend Service:** Node.js, Express, ESLint core api
- **Style System:** CSS CRT screen-line filters, custom cyberpunk glowing panels, matrix rain overlays

---

## 🚀 Installation & Local Execution

Prerequisites: Make sure you have **Node.js** installed.

### 1. Clone the repository
```bash
git clone https://github.com/SriVishnu-999/RED-HAWK-AI-Automated-Reconnaissance-Intelligence-Tool-.git
cd RED-HAWK-AI-Automated-Reconnaissance-Intelligence-Tool-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the Backend Server (Terminal 1)
```bash
node src/server.js
```
*Runs locally on `http://localhost:3001`*

### 4. Start the Client Dev Server (Terminal 2)
```bash
npm run dev
```
*Runs locally on `http://localhost:5173`*

---

## 📸 Cyber Command HUD Dashboard
- Open `http://localhost:5173` in your browser.
- Click **Login Terminal** -> **Launch Guest Simulator** to bypass Firebase login configuration.
- Select target presets (SQLi/Command Injection, eval/DOM XSS, Hardcoded Keys).
- Run audits, trace compromise paths, execute the exploit shell, and click **Deploy Patch** to watch the editor refactor the bugs in real-time!

---

> ⚠️ **Disclaimer:** This tool is designed strictly for educational, security demonstration, and defensive portfolio purposes. Always obtain authorization before scanning target servers.
