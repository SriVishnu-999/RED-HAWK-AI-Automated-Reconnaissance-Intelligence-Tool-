import React, { useState, useEffect, useRef } from 'react';

interface HackerTerminalProps {
  code: string;
  onScanTrigger: () => void;
  onPatchTrigger: () => void;
}

export const HackerTerminal: React.FC<HackerTerminalProps> = ({ code, onScanTrigger, onPatchTrigger }) => {
  const [history, setHistory] = useState<string[]>([
    'REDHAWK AI Automated Reconnaissance Terminal v2.5.0',
    'Type "help" for a list of available cybersecurity intelligence commands.',
    'Ready for operations...',
    ''
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input.trim();
    const args = command.split(' ');
    const mainCommand = args[0].toLowerCase();
    const newHistory = [...history, `root@redhawk:~# ${command}`];

    setCmdHistory((prev) => [...prev, command]);
    setHistoryIndex(-1);
    setInput('');

    switch (mainCommand) {
      case 'help':
        setHistory([
          ...newHistory,
          'Available Commands:',
          '  scan                      Trigger Code Security Vulnerability Scan',
          '  exploit                   Display exploit chain mechanisms for current vulnerabilities',
          '  patch                     Generate and output secure patch recommendations',
          '  recon --target <url>       Simulate server port scans & WHOIS DNS reconnaissance',
          '  cve-check <library>       Query the global CVE registry database for dependencies',
          '  system-logs               Render scrolling live intelligence telemetry logs',
          '  clear                     Clear the terminal screen buffer',
          ''
        ]);
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'scan':
        setHistory([
          ...newHistory,
          '[*] Connecting to ESLint neural analyzer node...',
          '[*] Parsing input code structure...',
          '[*] Correlating patterns against OWASP vulnerabilities...',
          '[+] Scan completed! Vulnerability summary logged in dashboard analytics.',
          ''
        ]);
        // Trigger parent dashboard scan
        onScanTrigger();
        break;
      case 'patch':
        setHistory([
          ...newHistory,
          '[*] Fetching optimal secure code patch...',
          '[*] Synthesizing safe replacement functions...',
          '[+] Secure patches generated! Navigate to Exploit Simulator tab to view and deploy.',
          ''
        ]);
        onPatchTrigger();
        break;
      case 'exploit':
        setHistory([
          ...newHistory,
          '[*] Building exploit simulation script for identified bugs...',
          '[*] Loading payload descriptors...',
          '[!] WARNING: Execute simulator in non-production sandbox environment only.',
          '[+] Exploit chain schema loaded in Exploit Tab. Review attack tree diagram for breach flow.',
          ''
        ]);
        break;
      case 'recon':
        if (args.length < 3 || args[1] !== '--target') {
          setHistory([...newHistory, 'Usage: recon --target <url>', '']);
        } else {
          const target = args[2];
          setHistory([
            ...newHistory,
            `[*] Initiating active reconnaissance against: ${target}`,
            '[*] Performing port scan... (Top 1000 ports)',
            '  PORT      STATE    SERVICE',
            '  22/tcp    open     SSH (OpenSSH 8.9p1 Ubuntu 3ubuntu0.1)',
            '  80/tcp    open     HTTP (Nginx 1.18.0)',
            '  443/tcp   open     HTTPS (Nginx 1.18.0)',
            '  3306/tcp  filtered MySQL',
            '  8080/tcp  open     HTTP-Proxy',
            '[*] Whois DNS mapping...',
            `  Domain: ${target}`,
            '  Registrar: Security Intelligence Registry LLC',
            '  Server IP Node: 198.51.100.42 (Location: US-EAST)',
            '[+] Active reconnaissance protocol completed.',
            ''
          ]);
        }
        break;
      case 'cve-check':
        if (args.length < 2) {
          setHistory([...newHistory, 'Usage: cve-check <library-name>', '']);
        } else {
          const lib = args[1];
          const cves = {
            'express': ['CVE-2024-37890 (High) - Denial of Service', 'CVE-2023-46934 (Med) - Header Parsing vulnerability'],
            'lodash': ['CVE-2021-23337 (High) - Prototype Pollution', 'CVE-2020-8203 (Med) - Prototype Pollution'],
            'mysql2': ['CVE-2024-21538 (High) - Code injection through parameterized statements'],
            'firebase': ['No critical CVE entries recorded for version 11.5.0. Node secure.'],
          };
          const matches = cves[lib.toLowerCase()] || ['No critical vulnerabilities registered for: ' + lib + '. Check spelling or feed sync.'];
          setHistory([
            ...newHistory,
            `[*] Querying threat feed for package: ${lib}`,
            ...matches,
            ''
          ]);
        }
        break;
      case 'system-logs':
        setHistory([
          ...newHistory,
          '[`] [2026-07-15 13:28:01] SEC-LOG-01: Session initialized under Operator Node 0x93FA',
          '[`] [2026-07-15 13:28:05] SEC-LOG-02: Synced global threat Intel feed from database.redhawk.net',
          '[`] [2026-07-15 13:28:12] SEC-LOG-03: Local vulnerability scanning engines initialized (ESLint rules, Regex)',
          '[`] [2026-07-15 13:28:18] SEC-LOG-04: Monaco code buffer updated. (Checksum md5: f89fa9d02c)',
          '[`] [2026-07-15 13:28:22] SEC-LOG-05: Attack tree visualizer compiled nodes successfully.',
          ''
        ]);
        break;
      default:
        setHistory([
          ...newHistory,
          `Unknown command: "${mainCommand}". Type "help" to see valid list of recon intelligence commands.`,
          ''
        ]);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIdx);
        setInput(cmdHistory[nextIdx]);
      }
    }
  };

  return (
    <div className="cyber-panel p-4 font-mono text-xs text-[#00ff66] bg-black/95 border border-[#00ff66]/30 h-[500px] overflow-y-auto flex flex-col justify-between crt">
      <div className="flex-1 overflow-y-auto pr-2 space-y-1 mb-2">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">
            {line.startsWith('root@') ? (
              <span className="text-[#00f0ff]">{line}</span>
            ) : line.includes('[!]') || line.includes('High') || line.includes('WARNING') ? (
              <span className="text-[#ef4444] font-bold">{line}</span>
            ) : line.startsWith('  ') ? (
              <span className="text-gray-400">{line}</span>
            ) : line.includes('[+]') ? (
              <span className="text-[#00ff66] font-bold">{line}</span>
            ) : (
              <span>{line}</span>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      <form onSubmit={handleCommand} className="flex border-t border-[#00ff66]/20 pt-2 bg-black">
        <span className="text-[#00f0ff] mr-2">root@redhawk:~#</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-[#00ff66] font-mono focus:outline-none placeholder-gray-800"
          placeholder="type command... (try 'help')"
          autoComplete="off"
          autoFocus
        />
      </form>
    </div>
  );
};
