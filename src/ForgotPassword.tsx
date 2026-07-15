import React, { useState } from 'react';
import { Mail, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";
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

let app;
let auth: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.error("Firebase reset config failed:", e);
}

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast.error("Firebase auth unavailable. Please use Demo Mode on Sign In.");
      return;
    }
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast.success("Decryption key recovery sent! Check inbox.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030008] text-[#00ff66] relative overflow-hidden font-mono selection:bg-[#00ff66] selection:text-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
      
      <div className="cyber-panel p-8 w-full max-w-md border border-[#00ff66]/30 bg-black/90 shadow-[0_0_30px_rgba(0,255,102,0.15)] crt z-10">
        <button
          onClick={() => navigate("/signin")}
          className="mb-6 flex items-center text-gray-500 hover:text-[#00ff66] transition-colors text-xs uppercase"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Abort Recovery [Sign In]
        </button>

        <div className="text-center mb-8 relative border-b border-[#00ff66]/20 pb-4">
          <div className="flex justify-center mb-2">
            <Shield className="w-12 h-12 text-[#ef4444] animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-widest uppercase">
            RECOVER ADDR
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase">
            Reset Private Passkey Node
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1 text-left">
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase">
                Registered Operator Email
              </label>
              <div className="relative group">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 cyber-btn-red text-xs font-bold uppercase transition-all"
            >
              {isLoading ? 'Re-routing node keys...' : 'Transmit Decryption Reset'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              We have transmitted reset instructions. Check your endpoint mailbox for decryption keys.
            </p>
            <button
              onClick={() => navigate("/signin")}
              className="w-full py-3 px-6 cyber-btn text-xs font-bold uppercase"
            >
              Back to Terminal Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
