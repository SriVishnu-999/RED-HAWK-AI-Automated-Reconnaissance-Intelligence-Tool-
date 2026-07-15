import React, { useState, useEffect, useRef } from 'react';
import { Github, Mail, Lock, Sparkles, Terminal, Zap, Cpu, Brain, Code, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyBWHzzF9iiq5ZW-lau2t86xy81qb9gKCPg",
    authDomain: "ai-bug-detection.firebaseapp.com",
    projectId: "ai-bug-detection",
    storageBucket: "ai-bug-detection.firebasestorage.app",
    messagingSenderId: "176658157137",
    appId: "1:176658157137:web:52386eea11b9feaa8c3270",
    measurementId: "G-GV81YTDPXG"
};

// Initialize Firebase safely
let app;
let auth: any = null;
let db: any = null;
let provider: any = null;
let githubProvider: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  provider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();
} catch (e) {
  console.error("Firebase failed to initialize in SignUp:", e);
}

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
      ctx.fillStyle = 'rgba(3, 0, 8, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full opacity-15 pointer-events-none z-0" />;
}

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !db) {
        toast.error("Firebase auth unavailable. Please use Guest Access on Sign In page.");
        return;
    }

    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            createdAt: new Date(),
        });
    
        console.log("User stored in Firestore:", user);
        toast.success("Account created successfully! Establishing secure link...");
        navigate("/signin");
    
    } catch (error: any) {
        if (error.code === "auth/email-already-in-use") {
            toast.error("This email is already registered. Please sign in!");
        } else {
            toast.error("Signup failed: " + (error.message || "Network error."));
        }
        console.error("Signup Error:", error);
    } finally {
        setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast.error("Firebase auth unavailable. Use Guest Access on login page.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Sign-In Successful:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In failed.");
    }
  };

  const handleGithubSignIn = async () => {
    if (!auth) {
      toast.error("Firebase auth unavailable. Use Guest Access on login page.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("GitHub Sign-In Successful:", result.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("GitHub Sign-In Error:", error);
      toast.error("GitHub Sign-In failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#030008] text-[#00ff66] relative overflow-hidden font-mono selection:bg-[#00ff66] selection:text-black">
      <MatrixRain />
      
      {/* Cyber Grid backdrop overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      <div className="relative min-h-screen flex items-center justify-center p-4 z-10">
        <div className="cyber-panel p-8 w-full max-w-md border border-[#00ff66]/30 bg-black/90 shadow-[0_0_30px_rgba(0,255,102,0.15)] crt">
          
          <div className="text-center mb-8 relative border-b border-[#00ff66]/20 pb-4">
            <div className="flex justify-center mb-2">
              <Terminal className="w-12 h-12 text-[#00f0ff] animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">
              REGISTER NODE
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase">
              REDHAWK SECURITY NETWORK AUTHORIZATION
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 text-left">
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase">
                Operator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4.5 w-4.5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/80 border border-[#00ff66]/30 rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff66] focus:shadow-[0_0_10px_rgba(0,255,102,0.3)] transition-all"
                  placeholder="operator@redhawk.net"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase">
                Passkey
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4.5 w-4.5" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/80 border border-[#00ff66]/30 rounded text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff66] focus:shadow-[0_0_10px_rgba(0,255,102,0.3)] transition-all"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 cyber-btn text-xs font-bold uppercase transition-all"
            >
              {isLoading ? 'Requesting auth keys...' : 'Register Operator Node'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#00ff66]/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-2 bg-black text-gray-500 uppercase">Federated Sync</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleGoogleSignIn} type="button"
                className="flex items-center justify-center py-2 px-3 bg-black border border-[#00ff66]/20 rounded text-xs text-white hover:border-[#00ff66] hover:bg-[#00ff66]/5 transition-all"
              >
                <span className="text-[10px] uppercase font-bold text-gray-400">Google Auth</span>
              </button>
              <button onClick={handleGithubSignIn} type="button"
                className="flex items-center justify-center py-2 px-3 bg-black border border-[#00ff66]/20 rounded text-xs text-white hover:border-[#00ff66] hover:bg-[#00ff66]/5 transition-all"
              >
                <span className="text-[10px] uppercase font-bold text-gray-400">GitHub SSH</span>
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Already authorized?{' '}
            <a
              onClick={() => navigate("/signin")}
              className="text-[#00ff66] hover:underline font-bold cursor-pointer"
            >
              Access Terminal [Sign In]
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
