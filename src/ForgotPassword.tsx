import React, { useState } from 'react';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyBWHzzF9iiq5ZW-lau2t86xy81qb9gKCPg",
    authDomain: "ai-bug-detection.firebaseapp.com",
    projectId: "ai-bug-detection",
    storageBucket: "ai-bug-detection.firebasestorage.app",
    messagingSenderId: "176658157137",
    appId: "1:176658157137:web:52386eea11b9feaa8c3270",
    measurementId: "G-GV81YTDPXG"
  }
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden">
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="backdrop-blur-lg bg-black/30 p-8 rounded-2xl w-full max-w-md hover:shadow-glow transition-all duration-500 border border-white/10 shadow-xl">
          <button
            onClick={() => navigate("/signin")}
            className="mb-6 flex items-center text-gray-400 hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Sign In
          </button>

          <div className="text-center mb-8 relative">
            <div className="mb-6 relative">
              <Sparkles className="w-20 h-20 mx-auto text-gradient animate-float" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-3 animate-gradient tracking-tight">Reset Password</h1>
            <p className="text-gray-300 text-lg font-light tracking-wide">
              {isSent ? "Check your email for reset instructions" : "Enter your email to reset your password"}
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-purple-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-500/50"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="hover-button w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </span>
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                We've sent you an email with instructions to reset your password. Please check your inbox.
              </p>
              <button
                onClick={() => navigate("/signin")}
                className="hover-button py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium relative overflow-hidden group transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span className="relative z-10">Return to Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
