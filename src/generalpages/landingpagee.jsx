import React, { useState, useEffect, useRef } from 'react';
import { Brain, Target, BookOpen, Star, ArrowRight, Sparkles, Users, Shield, Zap, Rocket, Globe } from 'lucide-react';
import { NavLink } from "react-router";

import Navbar from '../components/navbar';
import GlowingButton from '../components/GlowingButton';


export default function FutureForge() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const AnimatedBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      
      {/* Animated Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="url(#gridGradient)" strokeWidth="1"/>
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              values="0 0; 60 60; 0 0"
              dur="20s"
              repeatCount="indefinite"
            />
          </pattern>
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea"/>
            <stop offset="100%" stopColor="#764ba2"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
    </div>
  );

  const FloatingIcons = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[Brain, Target, BookOpen, Sparkles, Zap, Rocket, Globe].map((Icon, index) => (
        <div
          key={index}
          className="absolute animate-bounce opacity-20"
          style={{
            left: `${10 + (index * 12)}%`,
            top: `${20 + (index * 8)}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + (index * 0.5)}s`
          }}
        >
          <Icon className="w-8 h-8 text-purple-500" />
        </div>
      ))}
    </div>
  );

  const ParticleField = () => (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );

  const AnimatedLogo = () => (
    <div className="flex items-center group">
      <div className="relative">
        <Sparkles className="h-8 w-8 text-purple-600 mr-2 group-hover:animate-spin transition-all duration-500" />
        <div className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        FutureForge
      </span>
    </div>
  );


  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "FutureForge helped me discover UX design was perfect for my analytical mind and creative interests. The career path recommendations were spot-on!",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez", 
      role: "Recent Graduate",
      content: "I was torn between marketing and data science. The AI assessment showed me how to combine both interests in growth marketing. Now I love my job!",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      role: "Career Changer", 
      content: "After 3 years in accounting, I found my passion for environmental consulting through FutureForge. The transition roadmap made it all possible.",
      rating: 5,
      avatar: "EJ"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedBackground />
        <FloatingIcons />
        <ParticleField />
        
        {/* Interactive mouse follower */}
        <div 
          className="fixed w-96 h-96 pointer-events-none z-10 opacity-10"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: 'radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%)',
            transition: 'all 0.1s ease-out'
          }}
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Animated badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 backdrop-blur mb-8 group hover:scale-105 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
                <span className="text-white/90 text-sm font-medium">AI-Powered Career Discovery</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight">
                Forge Your Future with{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
                    AI
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 blur-2xl opacity-20 animate-pulse"></div>
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
                Take our revolutionary aptitude test and unlock instant career recommendations tailored to your unique personality, interests, and hidden potential.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                
                  <GlowingButton primary to='/signup'>
                   Get Started – It's Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </GlowingButton>
                
                <GlowingButton>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Demo
                </GlowingButton>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                {[
                  { number: "50K+", label: "Students Helped" },
                  { number: "95%", label: "Accuracy Rate" },
                  { number: "200+", label: "Career Paths" }
                ].map((stat, index) => (
                  <div key={index} className="text-center group">
                    <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Scrolling indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-ping"></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover your ideal career path in three revolutionary steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Take an Aptitude Test",
                description: "Complete our comprehensive 15-minute assessment covering personality, interests, and cognitive strengths using advanced AI analysis.",
                icon: <Brain className="h-12 w-12 text-white" />,
                color: "from-blue-500 via-blue-600 to-purple-600",
                delay: "0s"
              },
              {
                step: "02", 
                title: "Get Your Career Match",
                description: "Our AI analyzes your results against 10,000+ career profiles and provides personalized recommendations with detailed compatibility scores.",
                icon: <Target className="h-12 w-12 text-white" />,
                color: "from-purple-500 via-purple-600 to-indigo-600",
                delay: "0.2s"
              },
              {
                step: "03",
                title: "Explore Learning Paths", 
                description: "Access detailed roadmaps, skill requirements, salary insights, and curated learning resources to accelerate your career journey.",
                icon: <BookOpen className="h-12 w-12 text-white" />,
                color: "from-indigo-500 via-indigo-600 to-blue-600",
                delay: "0.4s"
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className="relative group"
                style={{animationDelay: step.delay}}
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105">
                  {/* Glowing orb */}
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500`}>
                    {step.icon}
                    <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  </div>
                  
                  <div className="text-sm font-bold text-blue-400 mb-3 tracking-wider">STEP {step.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-6">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed text-lg">{step.description}</p>
                </div>
                
                {/* Connecting lines */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <svg width="48" height="2" className="text-white/20">
                      <line x1="0" y1="1" x2="48" y2="1" stroke="currentColor" strokeWidth="2" strokeDasharray="4,4">
                        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite"/>
                      </line>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FutureForge */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Why Choose FutureForge?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Revolutionary AI technology meets decades of career psychology research
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Smart AI Matching",
                description: "Powered by advanced language models that understand the nuances of personality, skills, and career compatibility at a deeper level than ever before.",
                icon: <Sparkles className="h-16 w-16 text-purple-400" />,
                gradient: "from-purple-500/20 to-blue-500/20",
                iconBg: "from-purple-500 to-purple-600"
              },
              {
                title: "Science-Based Approach", 
                description: "Built on validated psychological frameworks and real-world career mapping data from thousands of successful professionals across every industry.",
                icon: <Users className="h-16 w-16 text-blue-400" />,
                gradient: "from-blue-500/20 to-indigo-500/20", 
                iconBg: "from-blue-500 to-blue-600"
              },
              {
                title: "Privacy-First & Free",
                description: "Your data stays completely secure and private. Get instant, comprehensive results without any cost, commitment, or hidden fees required.",
                icon: <Shield className="h-16 w-16 text-indigo-400" />,
                gradient: "from-indigo-500/20 to-purple-500/20",
                iconBg: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group relative">
                <div className={`relative w-32 h-32 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  {feature.icon}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-purple-300 transition-colors duration-300">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/6 w-80 h-80 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/5 right-1/3 w-56 h-56 bg-gradient-to-r from-cyan-500/12 to-blue-500/12 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4.5s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              See how FutureForge has transformed careers and unlocked potential for thousands
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                    {testimonial.avatar}
                  </div>
                  
                  {/* Stars */}
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-5 w-5 text-yellow-400 fill-current group-hover:animate-pulse" 
                        style={{animationDelay: `${i * 0.1}s`}}
                      />
                    ))}
                  </div>
                  
                  <p className="text-white/80 mb-8 leading-relaxed text-lg">"{testimonial.content}"</p>
                  
                  <div className="border-t border-white/10 pt-6">
                    <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                    <div className="text-white/60">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/8 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/8 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/6 right-1/4 w-60 h-60 bg-gradient-to-r from-violet-400/18 to-purple-400/18 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-1/6 left-1/4 w-68 h-68 bg-gradient-to-r from-blue-300/16 to-indigo-400/16 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/30 to-transparent"></div>
        <ParticleField />
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-8">
            Start Your Journey Today
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students and professionals who've discovered their ideal career path and unlocked their true potential with FutureForge.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <GlowingButton primary className="bg-white text-blue-600 hover:bg-white/90 shadow-2xl" to='/signup'>
              Get Started – It's Free
              <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </GlowingButton>
            {/* <GlowingButton className="border-2 border-white/30 hover:border-white/50">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </GlowingButton> */}
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Takes less than 15 minutes
            </div>
            <div className="flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Instant results
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative text-white py-16 mt-0 overflow-hidden">
      {/* Gradient transition to black */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
      

      {/* Subtle orbs fading to black */}
      {/* <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-purple-600/8 to-blue-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-gradient-to-r from-blue-600/6 to-indigo-600/6 rounded-full blur-3xl"></div>
      </div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-100" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  FutureForge
                </span>
              </div>
            </div>
            <p className="text-white/70 mt-6 mb-8 max-w-md leading-relaxed">
              Empowering the next generation to discover and pursue their ideal careers through revolutionary AI-powered insights and personalized guidance.
            </p>
            <div className="flex space-x-4">
              {/* Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.59-2.46.7a4.25 4.25 0 001.86-2.34 8.45 8.45 0 01-2.7 1.03 4.22 4.22 0 00-7.2 3.85A12 12 0 013 4.8a4.23 4.23 0 001.3 5.64 4.21 4.21 0 01-1.91-.53v.05a4.22 4.22 0 003.39 4.13 4.23 4.23 0 01-1.9.07 4.23 4.23 0 003.95 2.93A8.5 8.5 0 012 19.55a12 12 0 006.29 1.84c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.36-.01-.53A8.3 8.3 0 0022.46 6z" />
                </svg>
              </a>

              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-3.16 19.48c.5.09.68-.22.68-.48v-1.72c-2.78.6-3.37-1.34-3.37-1.34a2.65 2.65 0 00-1.1-1.45c-.9-.62.07-.6.07-.6a2.1 2.1 0 011.53 1.03 2.15 2.15 0 002.94.84 2.14 2.14 0 01.64-1.35c-2.22-.25-4.56-1.11-4.56-4.95a3.88 3.88 0 011.03-2.68 3.6 3.6 0 01.1-2.64s.84-.27 2.75 1.02a9.4 9.4 0 015 0c1.9-1.3 2.75-1.02 2.75-1.02a3.6 3.6 0 01.1 2.64 3.88 3.88 0 011.03 2.68c0 3.85-2.34 4.7-4.57 4.95a2.4 2.4 0 01.68 1.86v2.75c0 .26.18.57.69.48A10 10 0 0012 2z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 5 2.12 5 3.5zM.5 8h4V24h-4V8zm7.5 0h3.5v2.2h.05a3.84 3.84 0 013.45-1.9c3.7 0 4.4 2.44 4.4 5.6V24h-4V14.5c0-2.25-.04-5.14-3.13-5.14-3.13 0-3.62 2.45-3.62 4.98V24h-4V8z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-white/70">
              <li><NavLink to="/" className="hover:text-white transition">Home</NavLink></li>
              <li><NavLink to="/about" className="hover:text-white transition">About</NavLink></li>
              <li><NavLink to="/signup" className="hover:text-white transition">Get Started</NavLink></li>
              <li><NavLink to="/contact" className="hover:text-white transition">Contact</NavLink></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-white/70 mb-4">Get the latest on features and updates.</p>
            <form className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 placeholder-white/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transition text-white font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-16 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} FutureForge. All rights reserved.
        </div>
      </div>
    </footer>
    </div>
)
}