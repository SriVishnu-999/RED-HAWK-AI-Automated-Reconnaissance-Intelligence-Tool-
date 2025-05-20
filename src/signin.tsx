import React, { useState } from 'react';
import { Github, Mail, Lock, Sparkles, Terminal, Zap, Cpu, Brain, Code } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { 
    getAuth, 
    GoogleAuthProvider, 
    GithubAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword 
} from "firebase/auth";
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
const app = initializeApp(firebaseConfig);  

const auth = getAuth(app);  
const db = getFirestore(app); 

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google Sign-In Successful:", result.user);
            navigate("/dashboard");
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    
    const handleGithubSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, githubProvider);
            console.log("GitHub Sign-In Successful:", result.user);
            navigate("/dashboard");
        } catch (error) {
            console.error("GitHub Sign-In Error:", error);
        }
    };


  

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
    
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          
          const userDoc = await getDoc(doc(db, "users", user.uid));
  
          if (userDoc.exists()) {
              console.log("User Data:", userDoc.data()); 
              navigate("/dashboard");
          } else {
              console.error("User data not found in Firestore.");
              toast.error("User not found. Please sign up first!");
          }
      } catch (error: any) {
          if (error.code === "auth/user-not-found") {
              toast.error("No account found with this email. Please register!");
          } else if (error.code === "auth/wrong-password") {
              toast.error("Incorrect password. Try again!");
          } else {
              toast.error("Sign-in failed. Please try again!");
          }
          console.error("Sign-in Error:", error);
      }
  }
    
  

  return (
    <div className="min-h-screen bg-gradient-to-br relative overflow-hidden">
      
      <div className="absolute -top-48 -left-48 w-96 h-96 animate-blob mix-blend-soft-light opacity-60"></div>
      <div className="absolute top-0 -right-48 w-96 h-96 animate-blob animation-delay-2000 mix-blend-soft-light opacity-60"></div>
      <div className="absolute -bottom-48 left-48 w-96 h-96 animate-blob animation-delay-4000 mix-blend-soft-light opacity-60"></div>

  
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <Terminal className="w-12 h-12 text-purple-500/30 animate-float" />
        </div>
        <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <Sparkles className="w-10 h-10 text-cyan-500/30 animate-float animation-delay-2000" />
        </div>
        <div className="absolute top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
          <Zap className="w-8 h-8 text-pink-500/30 animate-float animation-delay-4000" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 transform translate-x-1/2 translate-y-1/2">
          <Brain className="w-14 h-14 text-purple-500/20 animate-float animation-delay-3000" />
        </div>
        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <Code className="w-10 h-10 text-blue-500/20 animate-float animation-delay-5000" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 transform -translate-x-1/2 translate-y-1/2">
          <Cpu className="w-12 h-12 text-green-500/20 animate-float animation-delay-1000" />
        </div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="backdrop-blur-lg bg-black/30 p-8 rounded-2xl w-full max-w-md hover:shadow-glow transition-all duration-500 border border-white/10 shadow-xl">
          <div className="text-center mb-8 relative">
            <h1 className="text-5xl font-bold text-gradient mb-3 animate-gradient tracking-tight">Welcome Back</h1>
            <p className="text-gray-300 text-lg font-light tracking-wide">Continue Your Journey</p>
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/5 rounded-full blur-xl animate-pulse-subtle"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-pink-500/5 rounded-full blur-xl animate-pulse-subtle animation-delay-2000"></div>
          </div>

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
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <span 
  onClick={() => navigate("/forgotpassword")} 
  className="text-sm text-purple-400 hover:text-purple-300 hover-link cursor-pointer"
>
  Forgot password?
</span>

              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-hover:text-purple-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-300 hover:border-purple-500/50"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>

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
                {isLoading ? 'Signing In...' : 'Sign In'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a0b2e] text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={handleGoogleSignIn} type="button"
                className="hover-button flex items-center justify-center py-3 px-4 bg-black/50 border border-gray-700 rounded-lg hover:bg-black/60 group transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <Mail className="w-5 h-5 text-white mr-2 group-hover:text-purple-400 transition-colors" />
                <span className="text-white">Google</span>
              </button>
              <button onClick={handleGithubSignIn}
                className="hover-button flex items-center justify-center py-3 px-4 bg-black/50 border border-gray-700 rounded-lg hover:bg-black/60 group transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <Github className="w-5 h-5 text-white mr-2 group-hover:text-purple-400 transition-colors" />
                <span className="text-white">GitHub</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a
              onClick={() => navigate("/signup")}
              className="hover-link text-purple-400 hover:text-purple-300 font-medium cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;