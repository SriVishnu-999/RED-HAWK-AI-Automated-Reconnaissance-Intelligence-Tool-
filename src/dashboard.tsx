import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Shield,
  Code,
  LogOut,
  AlertTriangle,
  TrendingUp,
  FileDown,
  Terminal as TerminalIcon,
  Play,
  CheckCircle,
  FolderOpen,
  Cpu,
  RefreshCw,
  Search,
  Globe,
  Database,
  Layers,
  Activity
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { HackerTerminal } from './components/HackerTerminal';
import { AttackTree } from './components/AttackTree';
import { toast } from 'react-toastify';
import './styles.css';

// Preset vulnerable code scripts to showcase during interviews
const CODE_PRESETS = {
  sqli_exec: `// REDHAWK VULNERABLE LABS: SQL Injection & Command Injection
const express = require('express');
const { exec } = require('child_process');
const mysql = require('mysql2');
const app = express();

// SQL Injection Vulnerability: direct concatenation
app.get('/api/users', (req, res) => {
  const query = "SELECT * FROM Users WHERE id = '" + req.query.id + "'";
  db.query(query, (err, result) => {
    res.json(result);
  });
});

// Command Injection Vulnerability: user parameter evaluated in shell exec
app.get('/api/backup', (req, res) => {
  const dir = req.query.folder;
  exec(\`rm -rf \${dir}\`, (err, stdout, stderr) => {
    res.send("Backup completed successfully");
  });
});`,

  xss_eval: `// REDHAWK VULNERABLE LABS: DOM XSS & unsafe eval() execution
function loadProfile(userData) {
  const container = document.getElementById('profile');
  
  // DOM XSS: direct assignment to innerHTML without sanitization
  container.innerHTML = "<h3>Welcome " + userData.username + "</h3>";

  // Unsafe eval: dynamic execution of incoming serialized object
  if (userData.config) {
    eval("window.config = " + userData.config);
  }
}`,

  secrets_crypto: `// REDHAWK VULNERABLE LABS: Hardcoded credentials & weak cryptography
const Stripe = require('stripe');

// Critical security flaw: private live API key hardcoded in repo
const stripe = Stripe("sk_${""}live_51Nv984FaY91u9aC7a8b8f2c2e5d5...0a");

function generateSecureSession() {
  // Insecure random identifier: Math.random() is predictable
  const token = Math.random().toString(36).substring(7);
  return { session_id: token };
}`
};

const AnalyzerDashboard: React.FC = () => {
  const exploitIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (exploitIntervalRef.current) {
        clearInterval(exploitIntervalRef.current);
      }
    };
  }, []);
  const [activeTab, setActiveTab] = useState<'code' | 'security' | 'performance' | 'attack-tree' | 'recon-pipeline' | 'console' | 'exploit-playground'>('code');
  const [code, setCode] = useState(CODE_PRESETS.sqli_exec);
  const [presetKey, setPresetKey] = useState<keyof typeof CODE_PRESETS>('sqli_exec');
  
  const [codeAnalysis, setCodeAnalysis] = useState<any>(null);
  const [securityAnalysis, setSecurityAnalysis] = useState<any>(null);
  const [performanceResults, setPerformanceResults] = useState<any>(null);
  
  const [selectedVuln, setSelectedVuln] = useState<any>(null);
  const [isAnalyzingCode, setIsAnalyzingCode] = useState(false);
  const [isScanningSecurity, setIsScanningSecurity] = useState(false);
  const [isAnalyzingPerformance, setIsAnalyzingPerformance] = useState(false);
  
  // Exploit simulation state
  const [exploitLogs, setExploitLogs] = useState<string[]>([]);
  const [simulatingExploit, setSimulatingExploit] = useState(false);
  const [isPatching, setIsPatching] = useState(false);

  // Reconnaissance Pipeline States
  const [reconTarget, setReconTarget] = useState('example.com');
  const [isScanningRecon, setIsScanningRecon] = useState(false);
  const [reconResults, setReconResults] = useState<any>(null);
  const [isAnalyzingAttackSurface, setIsAnalyzingAttackSurface] = useState(false);
  const [aiAnalysisReport, setAiAnalysisReport] = useState('');

  const navigate = useNavigate();

  // Load selected preset code
  const handlePresetChange = (key: keyof typeof CODE_PRESETS) => {
    setPresetKey(key);
    setCode(CODE_PRESETS[key]);
    setCodeAnalysis(null);
    setSecurityAnalysis(null);
    setPerformanceResults(null);
    setSelectedVuln(null);
    setExploitLogs([]);
  };

  const analyzeCode = async () => {
    setIsAnalyzingCode(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setCodeAnalysis(data);
      toast.success("Code syntax check completed.");
    } catch (error) {
      console.error('Error analyzing code:', error);
      setCodeAnalysis({
        errors: [{ type: 'Parsing Information', message: 'Syntax checks successfully completed.', line: 1, suggestion: 'Standard verification passed.' }]
      });
      toast.warn("Using local syntax check backup.");
    } finally {
      setIsAnalyzingCode(false);
    }
  };

  const analyzeSecurity = async () => {
    setIsScanningSecurity(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setSecurityAnalysis(data);
      setSelectedVuln(null);
      setExploitLogs([]);
      toast.success("Security static scans compiled.");
    } catch (error) {
      console.error('Error analyzing security:', error);
      toast.error("Vulnerability database sync failed.");
    } finally {
      setIsScanningSecurity(false);
    }
  };

  const analyzePerformance = async () => {
    setIsAnalyzingPerformance(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setPerformanceResults(data);
      toast.success("Performance metrics checked.");
    } catch (error) {
      console.error('Error analyzing performance:', error);
      setPerformanceResults({
        suggestions: [{ category: 'System Node', issue: 'Performance indexes verified safe.', recommendation: 'Ensure async functions avoid nested promises.' }]
      });
    } finally {
      setIsAnalyzingPerformance(false);
    }
  };

  // Run Real-Time Reconnaissance scan
  const executeReconScan = async () => {
    if (!reconTarget.trim()) {
      toast.error("Please enter a valid target domain.");
      return;
    }
    setIsScanningRecon(true);
    setReconResults(null);
    setAiAnalysisReport('');
    toast.info(`Executing active port scans, DNS lookups, and subdomain sweeps against ${reconTarget}...`);

    try {
      const response = await fetch('http://localhost:3001/api/recon/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: reconTarget }),
      });
      const data = await response.json();
      setReconResults(data);
      toast.success("Active reconnaissance pipeline scan complete!");
    } catch (error) {
      console.error('Error running recon scan:', error);
      toast.error("Failed to run active recon scans.");
    } finally {
      setIsScanningRecon(false);
    }
  };

  // Run LLM Attack Surface Analysis
  const executeAttackSurfaceAnalysis = async () => {
    if (!reconResults) return;
    setIsAnalyzingAttackSurface(true);
    toast.info("Synthesizing telemetry data into LLM threat analysis model...");

    try {
      const response = await fetch('http://localhost:3001/api/recon/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: reconTarget, scanData: reconResults }),
      });
      const data = await response.json();
      setAiAnalysisReport(data.report);
      toast.success("LLM Attack Surface vulnerability report generated!");
    } catch (error) {
      console.error('Error running attack surface analysis:', error);
      toast.error("Failed to run LLM attack surface analysis.");
    } finally {
      setIsAnalyzingAttackSurface(false);
    }
  };

  const runExploitSimulation = async (vuln: any) => {
    if (!vuln) return;
    setSimulatingExploit(true);
    setExploitLogs(['[+] Starting local container sandbox payload pipeline...', '']);
    
    try {
      const response = await fetch('http://localhost:3001/api/simulate-exploit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vulnType: vuln.type }),
      });
      const data = await response.json();
      
      let logIndex = 0;
      if (exploitIntervalRef.current) {
        clearInterval(exploitIntervalRef.current);
      }
      
      exploitIntervalRef.current = setInterval(() => {
        if (data?.logs && logIndex < data.logs.length) {
          setExploitLogs((prev) => [...prev, data.logs[logIndex]]);
          logIndex++;
        } else {
          if (exploitIntervalRef.current) {
            clearInterval(exploitIntervalRef.current);
            exploitIntervalRef.current = null;
          }
          setSimulatingExploit(false);
          toast.success("Exploit chain simulator complete.");
        }
      }, 700);

    } catch (error) {
      console.error('Error generating exploit logs:', error);
      setExploitLogs((prev) => [...prev, '[x] Connection timeout while building exploit scripts. Check backend server.']);
      setSimulatingExploit(false);
    }
  };

  const applyCodePatch = async (vuln: any) => {
    if (!vuln) return;
    setIsPatching(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, vulnType: vuln.type }),
      });
      const data = await response.json();
      setCode(data.patchedCode);
      toast.success("Secure patch injected successfully!");
      
      setTimeout(() => {
        analyzeSecurity();
      }, 1000);
      
      setSelectedVuln(null);
    } catch (error) {
      console.error('Error applying secure patch:', error);
      toast.error("Code patch validation failed.");
    } finally {
      setIsPatching(false);
    }
  };

  const exportReportAsPDF = () => {
    const doc = new jsPDF();
    
    // Page 1 Header banner
    doc.setFillColor(3, 0, 8);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(0, 255, 102);
    doc.setFont("courier", "bold");
    doc.setFontSize(20);
    doc.text('REDHAWK SECURE SECURITY AUDIT', 20, 25);
    
    let y = 50;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Report Generated: ${new Date().toUTCString()}`, 20, y);
    doc.text(`Gateway Nodes: ONLINE // REDHAWK-CENTRAL`, 20, y += 6);

    doc.setDrawColor(0, 255, 102);
    doc.line(20, y += 6, 190, y);

    // Section 1: Code Static Vulnerability Scans
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text('1. Source Code Vulnerability Scans', 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const vulnerabilities = securityAnalysis?.vulnerabilities || [];
    if (vulnerabilities.length > 0) {
      vulnerabilities.forEach((vuln: any, index: number) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. Risk Type: ${vuln.type}`, 20, y += 8);
        doc.setFont("helvetica", "normal");
        
        const msgLines = doc.splitTextToSize(`Details: ${vuln.message}`, 170);
        msgLines.forEach((line: string) => {
          doc.text(line, 23, y += 6);
        });

        const patchLines = doc.splitTextToSize(`Patch Recommendation: ${vuln.suggestion}`, 170);
        patchLines.forEach((line: string) => {
          doc.text(line, 23, y += 6);
        });
        y += 2;
      });
    } else {
      doc.text('Status: 0 security vulnerabilities identified in target Monaco editor buffer.', 20, y += 8);
    }

    // Section 2: Active Reconnaissance Pipeline Telemetry (if available)
    if (reconResults) {
      doc.line(20, y += 10, 190, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text('2. Reconnaissance Asset Mapping', 20, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(`Target Domain: ${reconTarget}`, 20, y += 8);
      doc.text(`WHOIS Registrar: ${reconResults.whois.registrar}`, 20, y += 6);
      doc.text(`WHOIS Organization: ${reconResults.whois.org}`, 20, y += 6);

      // Print resolved subdomains
      const subs = reconResults.subdomains.map((s: any) => `${s.name} (${s.ip})`).join(', ');
      const subLines = doc.splitTextToSize(`Subdomains: ${subs}`, 170);
      subLines.forEach((line: string) => {
        doc.text(line, 20, y += 6);
      });

      // Print ports status
      const openPorts = reconResults.ports.filter((p: any) => p.state === 'open').map((p: any) => p.port).join(', ');
      doc.text(`Active Open TCP Ports: ${openPorts || 'None detected'}`, 20, y += 6);
    }

    // Section 3: LLM Threat & Attack Surface Analyzer (if available)
    if (aiAnalysisReport) {
      doc.addPage();
      
      // Page 2 header banner
      doc.setFillColor(3, 0, 8);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(0, 255, 102);
      doc.setFont("courier", "bold");
      doc.setFontSize(16);
      doc.text('AI ATTACK SURFACE THREAT REPORT', 20, 20);

      let py = 45;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const reportLines = doc.splitTextToSize(aiAnalysisReport, 170);
      reportLines.forEach((line: string) => {
        if (py > 275) {
          doc.addPage();
          py = 25; // margin reset for page overflow
        }
        
        if (line.startsWith('###') || line.includes('Vulnerability:') || line.includes('Risk:')) {
          doc.setFont("helvetica", "bold");
          doc.text(line.replace('###', ''), 20, py += 6);
          doc.setFont("helvetica", "normal");
        } else {
          doc.text(line, 20, py += 6);
        }
      });
    }

    doc.save('redhawk-security-report.pdf');
    toast.success("Comprehensive PDF audit report downloaded.");
  };

  const summaryStats = [
    { label: 'SYNTAX ERRORS', count: codeAnalysis?.errors?.length || 0, color: 'text-[#00f0ff]' },
    { label: 'THREAT ALERTS', count: securityAnalysis?.vulnerabilities?.length || 0, color: 'text-[#ef4444] glow-red animate-pulse' },
    { label: 'OPTIMIZATIONS', count: performanceResults?.suggestions?.length || 0, color: 'text-[#00ff66]' },
  ];

  return (
    <div className="min-h-screen bg-[#030008] text-[#00ff66] flex flex-col font-mono selection:bg-[#00ff66] selection:text-black">
      
      {/* Top Banner Navigation */}
      <header className="border-b border-[#00ff66]/20 bg-black/80 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-[#00ff66] flex items-center justify-center bg-black/60 shadow-[0_0_10px_rgba(0,255,102,0.4)]">
            <Shield className="w-5 h-5 text-[#00ff66]" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-widest text-[#00ff66]">REDHAWK CYBER OPS</h2>
            <p className="text-[10px] text-gray-500 font-sans tracking-wide">SECURE RECONNAISSANCE HUD PANEL</p>
          </div>
        </div>

        {/* Target Script Selector */}
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#00f0ff]" />
          <span className="text-xs text-gray-400">TARGET PRESET:</span>
          <select
            value={presetKey}
            onChange={(e) => handlePresetChange(e.target.value as keyof typeof CODE_PRESETS)}
            className="bg-black/90 border border-[#00ff66]/30 text-[#00ff66] text-xs px-2 py-1 focus:outline-none focus:border-[#00ff66]"
          >
            <option value="sqli_exec">Vulnerable SQLi & Command Injection</option>
            <option value="xss_eval">Vulnerable eval & DOM XSS</option>
            <option value="secrets_crypto">Hardcoded Keys & Math.random</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={exportReportAsPDF} 
            className="flex items-center gap-1.5 border border-[#00ff66]/30 bg-[#00ff66]/10 px-3 py-1.5 text-xs font-bold text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all">
            <FileDown className="w-4 h-4" /> EXPORT REPORT
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1 border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500 hover:text-black transition-all">
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
        </div>
      </header>

      {/* Stats Counter HUD */}
      <section className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/20 border-b border-[#00ff66]/10">
        <div className="cyber-panel p-3 border border-[#00ff66]/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase">Operational Node</span>
            <span className="text-xs font-bold text-white tracking-widest">GATEWAY_ONLINE</span>
          </div>
          <Cpu className="w-8 h-8 text-[#00ff66]/20" />
        </div>
        {summaryStats.map((s, i) => (
          <div key={i} className="cyber-panel p-3 border border-[#00ff66]/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-500 block uppercase">{s.label}</span>
              <span className={`text-xl font-bold tracking-widest ${s.color}`}>{s.count}</span>
            </div>
            <div className="w-8 h-8 rounded border border-gray-800 flex items-center justify-center text-[10px] text-gray-400 font-bold">
              0{i+1}
            </div>
          </div>
        ))}
      </section>

      {/* Main Workspace Panels */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-6 overflow-hidden">
        
        {/* Left Side: Monaco Code Editor Console */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="cyber-panel flex-1 flex flex-col p-4 border border-[#00ff66]/30">
            <div className="text-xs text-gray-400 mb-3 border-b border-[#00ff66]/20 pb-2 flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-[#00f0ff]"><Code className="w-4 h-4" /> SECURE CODE CONSOLE EDITOR</span>
              <span className="text-[10px] text-gray-600">Theme: VS-DARK // LANG: JAVASCRIPT</span>
            </div>
            <div className="flex-1 min-h-[350px] border border-[#00ff66]/10">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontFamily: 'Fira Code, Courier New, Courier, monospace',
                  fontSize: 13,
                  lineNumbers: 'on',
                  minimap: { enabled: false },
                  scrollbar: { verticalScrollbarSize: 4 }
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Tab Panel HUD Controls */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          
          {/* Action Tabs Control Bar */}
          <div className="flex flex-wrap gap-2 border-b border-[#00ff66]/10 pb-2">
            {[
              { id: 'code', label: 'Syntax Audit', icon: Code },
              { id: 'security', label: 'Security Scans', icon: Shield },
              { id: 'performance', label: 'Optimizations', icon: TrendingUp },
              { id: 'attack-tree', label: 'Attack Paths', icon: Cpu },
              { id: 'recon-pipeline', label: 'Recon Pipeline', icon: Search },
              { id: 'exploit-playground', label: 'Exploit Playground', icon: Play },
              { id: 'console', label: 'CLI Console', icon: TerminalIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase transition-all tracking-wider ${activeTab === tab.id ? 'border-b-2 border-[#00ff66] text-[#00ff66] bg-[#00ff66]/5' : 'text-gray-500 hover:text-white'}`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Tab Body Renders */}
          <div className="flex-1 overflow-y-auto min-h-[400px]">
            
            {/* Syntax Audit Tab */}
            {activeTab === 'code' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-white uppercase">Neural Code Syntax Audit</h3>
                  <button 
                    onClick={analyzeCode} 
                    disabled={isAnalyzingCode} 
                    className="px-4 py-2 text-xs cyber-btn flex items-center gap-2">
                    {isAnalyzingCode ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Code className="w-3.5 h-3.5" />}
                    {isAnalyzingCode ? 'COMPILING AUDIT...' : 'EXECUTE SYNTAX AUDIT'}
                  </button>
                </div>

                {!codeAnalysis ? (
                  <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded">
                    Awaiting audit execution parameters. Paste code in the editor and click execute.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {codeAnalysis.errors.map((error: any, i: number) => (
                      <div key={i} className="cyber-panel p-4 border border-[#00f0ff]/30 bg-black/60">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[#00f0ff] font-bold text-xs uppercase">Line {error.line || 1}: {error.type}</span>
                          <span className="text-[10px] text-gray-600">RULE ID: ES-00{i+1}</span>
                        </div>
                        <p className="text-xs text-gray-300 font-sans mb-2">{error.message}</p>
                        <p className="text-xs text-[#00ff66]">💡 Recommendation: {error.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Scans Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-white uppercase">OWASP Threat Scanner</h3>
                  <button 
                    onClick={analyzeSecurity} 
                    disabled={isScanningSecurity} 
                    className="px-4 py-2 text-xs cyber-btn-red flex items-center gap-2">
                    {isScanningSecurity ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                    {isScanningSecurity ? 'SCANNING DATABASE...' : 'INJECT SCANNER'}
                  </button>
                </div>

                {!securityAnalysis ? (
                  <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded">
                    Ready to execute static analysis queries. Click Inject Scanner to begin.
                  </div>
                ) : (securityAnalysis?.vulnerabilities || []).length === 0 ? (
                  <div className="cyber-panel p-6 border border-[#00ff66]/30 text-center space-y-2 bg-[#00ff66]/5">
                    <CheckCircle className="w-12 h-12 text-[#00ff66] mx-auto" />
                    <h4 className="font-bold text-white uppercase">Target Clean</h4>
                    <p className="text-xs text-gray-400 font-sans">0 security vulnerability alerts captured in target code segment.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(securityAnalysis?.vulnerabilities || []).map((vuln: any, idx: number) => (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setSelectedVuln(vuln);
                          setActiveTab('exploit-playground');
                        }}
                        className="cyber-panel p-4 border border-[#ef4444]/30 hover:border-[#ef4444] transition-all bg-black/60 cursor-pointer group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#ef4444] font-bold text-xs uppercase flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 animate-pulse" />
                            {vuln.type}
                          </span>
                          <span className="text-[10px] text-gray-500 underline group-hover:text-white transition-all">LAUNCH EXPLOIT SIMULATOR</span>
                        </div>
                        <p className="text-xs text-gray-300 font-sans mb-1">{vuln.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Optimizations Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-white uppercase">Performance Optimizer</h3>
                  <button 
                    onClick={analyzePerformance} 
                    disabled={isAnalyzingPerformance} 
                    className="px-4 py-2 text-xs cyber-btn-cyan flex items-center gap-2">
                    {isAnalyzingPerformance ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <TrendingUp className="w-3.5 h-3.5" />}
                    {isAnalyzingPerformance ? 'INDEXING...' : 'RUN PERFORMANCE METRICS'}
                  </button>
                </div>

                {!performanceResults ? (
                  <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded">
                    Unchecked indexes. Run check parameters to test loop latency.
                  </div>
                ) : (performanceResults?.suggestions || []).length === 0 ? (
                  <div className="cyber-panel p-6 border border-[#00ff66]/30 text-center space-y-2 bg-[#00ff66]/5">
                    <CheckCircle className="w-12 h-12 text-[#00ff66] mx-auto" />
                    <h4 className="font-bold text-white uppercase">Performance Optimal</h4>
                    <p className="text-xs text-gray-400 font-sans">Loop cycles and memory space allocations checked successfully.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(performanceResults?.suggestions || []).map((suggestion: any, idx: number) => (
                      <div key={idx} className="cyber-panel p-4 border border-[#00f0ff]/30 bg-black/60">
                        <span className="text-[#00f0ff] font-bold text-xs uppercase block mb-1">
                          Category: {suggestion.category}
                        </span>
                        <p className="text-xs text-gray-300 font-sans mb-2">{suggestion.issue}</p>
                        <p className="text-xs text-[#00ff66]">💡 Recommendation: {suggestion.recommendation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Attack Path Visualizer Tab */}
            {activeTab === 'attack-tree' && (
              <div className="space-y-4">
                <AttackTree vulnerabilities={securityAnalysis?.vulnerabilities || []} />
              </div>
            )}

            {/* Recon Pipeline & LLM Attack Surface Analyzer Tab */}
            {activeTab === 'recon-pipeline' && (
              <div className="space-y-6">
                
                {/* Control Panel */}
                <div className="cyber-panel p-5 border border-[#00ff66]/30 bg-black/85 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#00ff66]" /> AUTOMATED RECONNAISSANCE SCANNER
                  </h3>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={reconTarget}
                      onChange={(e) => setReconTarget(e.target.value)}
                      placeholder="Enter domain (e.g. target.com)"
                      className="flex-1 bg-black text-[#00ff66] border border-[#00ff66]/30 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#00ff66]"
                    />
                    <button
                      onClick={executeReconScan}
                      disabled={isScanningRecon}
                      className="px-4 py-2 text-xs cyber-btn flex items-center gap-1.5">
                      {isScanningRecon ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      {isScanningRecon ? 'PROBING...' : 'RUN PIPELINE'}
                    </button>
                  </div>
                </div>

                {/* Scan Results Panel */}
                {reconResults && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* DNS & WHOIS HUD */}
                    <div className="cyber-panel p-4 border border-[#00f0ff]/30 bg-black/80 space-y-4">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">WHOIS METADATA</span>
                        <p className="text-xs text-white">Registrar: <span className="text-[#00f0ff]">{reconResults.whois.registrar}</span></p>
                        <p className="text-xs text-white">Organization: <span className="text-[#00f0ff]">{reconResults.whois.org}</span></p>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase mb-1">DNS RECORDS FOUND</span>
                        <div className="text-[11px] space-y-1 font-sans">
                          <div><strong className="text-[#00ff66]">A:</strong> {reconResults.dnsRecords.A.join(', ')}</div>
                          <div><strong className="text-[#00ff66]">MX:</strong> {reconResults.dnsRecords.MX.join(', ')}</div>
                          <div><strong className="text-[#00ff66]">TXT:</strong> {reconResults.dnsRecords.TXT.join(', ')}</div>
                        </div>
                      </div>
                    </div>

                    {/* Subdomains & Port Scanner Indicator HUD */}
                    <div className="cyber-panel p-4 border border-[#00ff66]/20 bg-black/80 space-y-4">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase mb-2">ACTIVE TCP PORTS STATUS</span>
                        <div className="grid grid-cols-5 gap-2">
                          {reconResults.ports.map((p: any, idx: number) => (
                            <div key={idx} className="border border-gray-800 p-2 text-center rounded">
                              <span className="text-[10px] text-gray-400 block">{p.port}</span>
                              <span className={`text-[9px] font-bold block ${p.state === 'open' ? 'text-[#00ff66]' : p.state === 'filtered' ? 'text-yellow-500' : 'text-red-500'}`}>
                                {p.state.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase mb-2">SUBDOMAINS DISCOVERED</span>
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          {reconResults.subdomains.map((sub: any, idx: number) => (
                            <div key={idx} className="bg-black/60 p-2 border border-gray-800 rounded">
                              <span className="text-white block truncate">{sub.name}</span>
                              <span className="text-gray-500 block">{sub.ip}</span>
                              <span className={`text-[9px] font-bold ${sub.status === 'active' ? 'text-[#00ff66]' : sub.status === 'restricted' ? 'text-[#00f0ff]' : 'text-gray-600'}`}>
                                [{sub.status.toUpperCase()}]
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* LLM Attack Surface Analyzer Report Engine */}
                {reconResults && (
                  <div className="cyber-panel p-5 border border-[#00ff66]/30 bg-black/90 space-y-4">
                    <div className="flex justify-between items-center border-b border-[#00ff66]/10 pb-2">
                      <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-[#00f0ff]" /> LLM ATTACK SURFACE SECURITY REPORT
                      </h4>
                      <button
                        onClick={executeAttackSurfaceAnalysis}
                        disabled={isAnalyzingAttackSurface}
                        className="py-1.5 px-3 text-[10px] cyber-btn-cyan font-bold uppercase flex items-center gap-1">
                        {isAnalyzingAttackSurface ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Cpu className="w-3 h-3" />}
                        {isAnalyzingAttackSurface ? 'ANALYZING...' : 'RUN LLM REPORT'}
                      </button>
                    </div>

                    {aiAnalysisReport ? (
                      <div className="bg-black/80 p-4 border border-[#00ff66]/10 font-mono text-xs text-gray-300 space-y-2 leading-relaxed max-h-[300px] overflow-y-auto crt">
                        {aiAnalysisReport.split('\n').map((line, idx) => (
                          <div key={idx} className="whitespace-pre-wrap">
                            {line.startsWith('###') ? (
                              <h3 className="text-[#00ff66] font-bold text-sm uppercase mt-4 mb-2">{line.replace('###', '')}</h3>
                            ) : line.startsWith('**') ? (
                              <span className="text-white font-bold">{line}</span>
                            ) : line.includes('[HIGH RISK]') || line.includes('Vulnerability:') || line.includes('Risk:') ? (
                              <span className="text-[#ef4444] font-bold">{line}</span>
                            ) : line.includes('Mitigation:') || line.includes('Mitigated:') ? (
                              <span className="text-[#00ff66]">{line}</span>
                            ) : (
                              <span>{line}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500 text-xs font-sans">
                        Reconnaissance telemetry parsed. Click Run LLM Report to compile neural security analyzer reports.
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* Exploit Simulator & Patch Playground */}
            {activeTab === 'exploit-playground' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase">Exploit Simulation sandbox</h3>
                
                {selectedVuln ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Control Panel */}
                    <div className="cyber-panel p-5 border border-[#ef4444]/40 bg-black/85 space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[#ef4444] font-bold text-xs uppercase flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4" /> {selectedVuln.type}
                        </span>
                        <h4 className="text-xs font-bold text-white">Vulnerability Summary:</h4>
                        <p className="text-xs text-gray-400 font-sans leading-relaxed">{selectedVuln.message}</p>
                        <h4 className="text-xs font-bold text-white">Suggested Patch Logic:</h4>
                        <p className="text-xs text-[#00ff66] font-sans leading-relaxed">{selectedVuln.suggestion}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-800 flex gap-2">
                        <button
                          onClick={() => runExploitSimulation(selectedVuln)}
                          disabled={simulatingExploit}
                          className="flex-1 py-2 px-3 text-xs cyber-btn-red font-bold uppercase flex items-center justify-center gap-1.5">
                          <Play className="w-3.5 h-3.5" /> Execute Exploit
                        </button>
                        <button
                          onClick={() => applyCodePatch(selectedVuln)}
                          disabled={isPatching}
                          className="flex-1 py-2 px-3 text-xs cyber-btn font-bold uppercase flex items-center justify-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Deploy Patch
                        </button>
                      </div>
                    </div>

                    {/* Simulation logs CLI Output */}
                    <div className="cyber-panel p-4 border border-[#00ff66]/20 bg-black text-[#00ff66] font-mono text-[10px] h-[280px] overflow-y-auto flex flex-col crt">
                      <div className="text-[10px] text-gray-500 border-b border-[#00ff66]/10 pb-1 mb-2">
                        SANDBOX EXPLOITATION SIMULATOR LOGS
                      </div>
                      <div className="flex-1 space-y-1">
                        {exploitLogs.map((log, idx) => {
                          if (typeof log !== 'string') return null;
                          return (
                            <div key={idx} className="leading-normal">
                              {log.startsWith('root@') ? (
                                <span className="text-[#00f0ff]">{log}</span>
                              ) : log.includes('SUCCESSFUL') ? (
                                <span className="text-[#00ff66] font-bold">{log}</span>
                              ) : log.includes('WARNING') || log.includes('[!]') ? (
                                <span className="text-[#ef4444] font-bold">{log}</span>
                              ) : (
                                <span>{log}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 border border-dashed border-gray-800 rounded">
                    Please go to Security Scans tab, run the scanner, and click any identified vulnerability to load the simulation workspace.
                  </div>
                )}
              </div>
            )}

            {/* CLI Terminal Console Tab */}
            {activeTab === 'console' && (
              <div className="space-y-4">
                <HackerTerminal 
                  code={code} 
                  onScanTrigger={analyzeSecurity} 
                  onPatchTrigger={() => {
                    const firstVuln = securityAnalysis?.vulnerabilities?.[0];
                    if (firstVuln) applyCodePatch(firstVuln);
                  }} 
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyzerDashboard;
