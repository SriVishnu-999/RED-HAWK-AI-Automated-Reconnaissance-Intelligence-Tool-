import React, { useState } from 'react';
import { Bug, CheckCircle, Network, Code, Zap, Shield, Puzzle as PuzzlePiece, BarChart3, Search, Star, Building2, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function App() {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "AI Bug Analyzer saved me hours of debugging. It's like having a genius coder on my team!",
      name: "John D.",
      role: "Senior Developer",
      company: "Tech Giants Inc."
    },
    {
      text: "The real-time insights have dramatically improved our team's productivity. A must-have tool!",
      name: "Sarah L.",
      role: "Lead Engineer",
      company: "Innovation Labs"
    },
    {
      text: "Integration was seamless, and the AI suggestions are incredibly accurate. Game changer!",
      name: "Michael R.",
      role: "CTO",
      company: "StartupX"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      features: ["Basic AI Analysis", "5 Projects", "Community Support", "Basic Reporting"],
      icon: User
    },
    {
      name: "Pro",
      price: "29",
      features: ["Advanced AI Analysis", "Unlimited Projects", "Priority Support", "Advanced Analytics"],
      icon: Star,
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom Solutions", "Dedicated Support", "SLA Guarantee", "Custom Integration"],
      icon: Building2
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      
      <div className="relative">
        <div className="container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-5xl mx-auto text-center">
          
            <div className="relative w-32 h-32 mx-auto mb-12 group hover-icon">
              <div className="absolute inset-0 animate-spin-slow group-hover:animate-spin-fast transition-all duration-300">
                <Bug className="w-32 h-32 text-purple-400 drop-shadow-glow" />
              </div>
              <CheckCircle className="absolute inset-0 w-32 h-32 text-green-400 opacity-0 animate-fade-in drop-shadow-glow" />
            </div>

          
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 text-transparent bg-clip-text animate-gradient">
              Unleash the Power of AI to Debug Smarter, Faster, and Better
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              AI Bug Analyzer identifies, categorizes, and resolves code issues in seconds, 
              empowering developers to build flawless software effortlessly.
            </p>

            
            <button 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => navigate("/signup")}
              className="hover-button group relative px-8 py-4 text-xl font-bold rounded-full 
                bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 
                transform hover:scale-105 transition-all duration-300
                shadow-lg hover:shadow-xl hover:shadow-purple-500/25">
              <span className="relative z-10 flex items-center gap-2">
                Try for Free
                <Zap className={`w-5 h-5 transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`} />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>

      
      <section className="relative py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Why Choose AI Bug Analyzer?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: Search, 
                title: "AI-Powered Debugging",
                desc: "Automatically detect and resolve issues in your code with cutting-edge AI algorithms"
              },
              { 
                icon: BarChart3, 
                title: "Real-Time Insights",
                desc: "Get instant feedback and actionable suggestions to optimize your code"
              },
              { 
                icon: PuzzlePiece, 
                title: "Seamless Integration",
                desc: "Works with all major IDEs and development tools for a hassle-free experience"
              }
            ].map(({ icon: Icon, title, desc }, index) => (
              <div key={index} 
                className="feature-card group bg-white/5 backdrop-blur-lg p-8 rounded-2xl 
                  border border-white/10">
                <div className="relative w-16 h-16 mb-6 feature-icon">
                  <Icon className="w-16 h-16 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Debugging Made Simple
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: 1, title: "Upload your code", desc: "Simply connect your repository or upload your code" },
              { step: 2, title: "AI scans for bugs", desc: "Our AI engine analyzes your code in seconds" },
              { step: 3, title: "Get detailed reports", desc: "Receive comprehensive analysis and solutions" },
              { step: 4, title: "Implement fixes", desc: "Apply suggested fixes with a single click" }
            ].map(({ step, title, desc }) => (
              <div key={step} className="hover-card relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/40 backdrop-blur-lg p-6 rounded-lg">
                  <div className="text-4xl font-bold text-purple-400 mb-4">0{step}</div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="relative py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Loved by Developers Worldwide
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-black/40 backdrop-blur-lg p-8 rounded-lg">
                  <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-purple-400">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
            Affordable Plans for Every Developer
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div key={index} className={`pricing-card relative group ${plan.popular ? 'transform scale-105' : ''}`}>
                  <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${plan.popular ? 'opacity-75' : ''}`} />
                  <div className="relative bg-black/40 backdrop-blur-lg p-8 rounded-lg">
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <Icon className="w-12 h-12 text-purple-400 mb-6 hover-icon" />
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                      </span>
                      {typeof plan.price === 'number' && <span className="text-gray-400">/month</span>}
                    </div>
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => navigate("/signup")} className="hover-button w-full py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-bold">
                      Get Started
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      
      <footer className="relative py-12 bg-black/40 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">AI Bug Analyzer</h3>
              <p className="text-gray-400">Empowering developers with AI-powered debugging solutions.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover-link text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-gray-400">© 2025 AI Bug Analyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;