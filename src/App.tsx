import React, { useState, useEffect, useRef } from 'react';
import { Bug, CheckCircle, Network, Code, Zap, Shield, Search, Terminal, Database, Server, Cpu, Globe } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ☠☢☣⚡🤖💻📡🔐'.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize) + 1;
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 0, 8, 0.08)'; // Deep background trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Randomly tint some characters white for head effect
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#fff';
        } else {
          ctx.fillStyle = '#00ff66';
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-20 pointer-events-none z-0" />;
}

function TypewriterTerminal() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const textIndex = useRef(0);
  const charIndex = useRef(0);

  const script = [
    'root@redhawk:~# ./init_recon_engine.sh',
    '[*] Initializing RedHawk AI Reconnaissance Suite v2.5...',
    '[*] Checking system core dependencies... OK',
    '[*] Injecting neural vulnerability scan modules... OK',
    '[*] Connecting to global threat intelligence feed... CONNECTED',
    '[*] RedHawk cyber operations ready.',
    'root@redhawk:~# redhawk --scan --target=src/core.ts',
    '[+] Target loaded: core.ts (325 lines)',
    '[!] SCANNING: Category [OWASP Top 10]',
    '[!] ALERT: SQL Injection Vulnerability found in line 42!',
    '[!] ALERT: Hardcoded JWT Secret Key found in line 105!',
    '[+] Scan complete: 2 vulnerabilities identified. Recommendations loaded.',
    'root@redhawk:~# _'
  ];

  useEffect(() => {
    const typeNextChar = () => {
      if (textIndex.current >= script.length) return;

      const targetText = script[textIndex.current];
      if (charIndex.current < targetText.length) {
        setCurrentLine((prev) => prev + targetText[charIndex.current]);
        charIndex.current++;
        setTimeout(typeNextChar, Math.random() * 40 + 20);
      } else {
        // Line finished
        setLines((prev) => [...prev, targetText]);
        setCurrentLine('');
        textIndex.current++;
        charIndex.current = 0;
        setTimeout(typeNextChar, 800);
      }
    };

    const timer = setTimeout(typeNextChar, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="cyber-panel p-6 font-mono text-left text-sm max-w-2xl mx-auto h-72 overflow-y-auto crt text-[#00ff66] border border-[#00ff66]/30 bg-black/80 shadow-[0_0_20px_rgba(0,255,102,0.15)] relative">
      <div className="absolute top-2 right-4 flex gap-1">
        <span className="w-3 h-3 rounded-full bg-red-600/50"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-600/50"></span>
        <span className="w-3 h-3 rounded-full bg-green-600/50"></span>
      </div>
      <div className="text-gray-500 text-xs mb-3 border-b border-[#00ff66]/20 pb-1 flex justify-between">
        <span>REDHAWK INTEL CONSOLE</span>
        <span>STATUS: ACTIVE</span>
      </div>
      {lines.map((line, i) => (
        <div key={i} className="mb-1">
          {line.startsWith('root@') ? (
            <span className="text-[#00f0ff]">{line}</span>
          ) : line.includes('ALERT') ? (
            <span className="text-[#ef4444]">{line}</span>
          ) : (
            <span>{line}</span>
          )}
        </div>
      ))}
      {currentLine && (
        <div>
          {currentLine.startsWith('root@') ? (
            <span className="text-[#00f0ff]">{currentLine}</span>
          ) : (
            <span>{currentLine}</span>
          )}
          <span className="animate-pulse bg-[#00ff66] inline-block w-2 h-4 ml-1 align-middle"></span>
        </div>
      )}
    </div>
  );
}

function App() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Automated Reconnaissance",
      desc: "Perform static application security testing (SAST) and flag OWASP Top 10 vulnerabilities in real-time."
    },
    {
      icon: Shield,
      title: "Exploit simulation",
      desc: "Simulate exploit vectors visually to see how hackers could breach your system using identified weaknesses."
    },
    {
      icon: Code,
      title: "Instant Secure Patches",
      desc: "Automatically generate and deploy tested, robust fixes straight into your codebase with one-click patches."
    }
  ];

  const statMetrics = [
    { label: "VULNERABILITIES LOGGED", value: "438,201" },
    { label: "AVERAGE SCAN SPEED", value: "0.24 SEC" },
    { label: "THREAT INTELLIGENCE FEED", value: "SYNCED" },
    { label: "PATCH DEPLOYMENT RATE", value: "99.4%" }
  ];

  return (
    <div className="min-h-screen bg-[#030008] text-white relative overflow-hidden font-mono selection:bg-[#00ff66] selection:text-black">
      
      {/* Background Matrix Rain effect */}
      <MatrixRain />

      {/* Cyber Grid backdrop overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030008] to-[#030008] pointer-events-none z-0" />

      {/* Futuristic Nav Header */}
      <header className="relative z-10 border-b border-[#00ff66]/10 backdrop-blur-md bg-black/40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#00ff66] flex items-center justify-center bg-black/60 shadow-[0_0_10px_rgba(0,255,102,0.4)] relative">
              <Bug className="w-6 h-6 text-[#00ff66]" />
              <div className="absolute inset-0 border border-[#00f0ff] translate-x-[2px] translate-y-[2px] pointer-events-none opacity-40"></div>
            </div>
            <span className="text-xl font-bold tracking-widest text-[#00ff66] glow-terminal">REDHAWK AI</span>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => navigate("/signin")}
              className="px-5 py-2 text-sm cyber-btn-cyan">
              Login Terminal
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-16 pb-20">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 border border-[#00f0ff]/30 bg-black/60 px-4 py-1.5 rounded-full text-xs text-[#00f0ff] glow-cyan">
              <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
              SYSTEM ACTIVE: AI RECON ENGINE ONLINE
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight bg-gradient-to-r from-white via-[#00ff66] to-[#00f0ff] text-transparent bg-clip-text">
              AUTOMATED SECURITY RECONNAISSANCE & CODE INTELLIGENCE
            </h1>
            <p className="text-gray-400 font-sans text-lg max-w-3xl mx-auto leading-relaxed">
              Detect critical security flaws, simulate exploit paths, and automatically patch codes in real-time. Uncover blind spots before bad actors do.
            </p>
          </div>

          {/* Typing terminal interface inside landing page */}
          <TypewriterTerminal />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => navigate("/signup")}
              className="px-8 py-4 text-lg font-bold cyber-btn">
              INITIALIZE SCANNER
            </button>
            <button 
              onClick={() => navigate("/signin")}
              className="text-gray-400 hover:text-[#00ff66] transition-colors flex items-center gap-2 text-sm underline underline-offset-4">
              Access Demo Interface
            </button>
          </div>

          {/* Cyber metrics HUD dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-[#00ff66]/10">
            {statMetrics.map((m, i) => (
              <div key={i} className="cyber-panel p-4 text-left border border-[#00ff66]/20 bg-black/70">
                <span className="text-[10px] text-gray-500 block mb-1">{m.label}</span>
                <span className="text-xl font-bold tracking-widest text-[#00f0ff] glow-cyan">{m.value}</span>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Cyber Features Section */}
      <section className="relative z-10 py-20 bg-black/40 border-y border-[#00ff66]/10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold tracking-widest text-[#00ff66]">CORE CAPABILITIES</h2>
            <div className="w-24 h-0.5 bg-[#00ff66] mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="cyber-panel p-8 text-left group hover:border-[#00ff66] transition-colors bg-[#080510]/80">
                  <div className="w-14 h-14 border border-[#00ff66]/30 flex items-center justify-center bg-black/75 mb-6 group-hover:border-[#00ff66] group-hover:shadow-[0_0_15px_rgba(0,255,102,0.4)] transition-all">
                    <Icon className="w-8 h-8 text-[#00ff66]" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 tracking-wider text-[#00f0ff]">{f.title}</h3>
                  <p className="text-gray-400 font-sans text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Threat Modeling workflow section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold tracking-widest text-[#00ff66]">RECON PROTOCOL</h2>
            <div className="w-24 h-0.5 bg-[#00ff66] mx-auto"></div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { step: "01", icon: Code, title: "INGEST CODE", desc: "Upload code files or paste custom logic into the editor console." },
              { step: "02", icon: Search, title: "RUN ANALYSIS", desc: "Execute multi-layered vulnerability scanner targeting SQLi, XSS, and keys." },
              { step: "03", icon: Network, title: "THREAT MODEL", desc: "Map attack vectors visually to construct path compromises." },
              { step: "04", icon: CheckCircle, title: "AUTO PATCH", desc: "Deploy tested patches directly back to your source script with one-click." }
            ].map((p, i) => (
              <div key={i} className="cyber-panel p-6 text-left bg-black/60 relative group border border-[#00ff66]/10">
                <div className="absolute top-4 right-4 text-3xl font-extrabold text-[#00ff66]/10 group-hover:text-[#00ff66]/30 transition-colors">
                  {p.step}
                </div>
                <p.icon className="w-8 h-8 text-[#00f0ff] mb-6" />
                <h4 className="text-md font-bold mb-2 tracking-wider text-white">{p.title}</h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cyber Security footer */}
      <footer className="relative z-10 border-t border-[#00ff66]/10 py-12 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[#00ff66] flex items-center justify-center bg-black/60">
                <Bug className="w-5 h-5 text-[#00ff66]" />
              </div>
              <span className="text-lg font-bold tracking-widest text-[#00ff66]">REDHAWK SYSTEM</span>
            </div>
            <p className="text-xs text-gray-500 font-mono text-center md:text-right">
              © {new Date().getFullYear()} REDHAWK INTELLIGENCE PORTAL. ALL SECURED WITH REDHAWK SHIELD.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;