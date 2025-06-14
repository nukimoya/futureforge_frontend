import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {  Sparkles,  LogOut,  User,  BarChart2,  Target, ChevronRight, Clock, CheckCircle, ArrowRight, Brain, Lightbulb,  Zap, Star, Bell, Settings } from "lucide-react";
import StartTestModal from "../../components/startTestModal";

const WelcomePage = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTestInstructions, setShowTestInstructions] = useState(false);
  const navigate = useNavigate()
  
  const username = "Alex Johnson";
  const email = "alex.johnson@email.com";
  const role = "Professional";

  const handleLogout = () => {
    console.log("Logout clicked");
  };

    const handleTakeTestClick = () => {
    setShowTestInstructions(true);
  };

    const handleCloseInstructions = () => {
    setShowTestInstructions(false);
  };

  const handleBeginTest = () => {
    setShowTestInstructions(false);
    navigate('/test');
  };

  const steps = [
    {
      icon: Brain,
      title: "Personality Assessment",
      description: "Discover your unique traits and work preferences",
      duration: "3-4 minutes"
    },
    {
      icon: Target,
      title: "Skills Evaluation",
      description: "Identify your strengths and areas for growth",
      duration: "2-3 minutes"
    },
    {
      icon: Lightbulb,
      title: "Interest Mapping",
      description: "Explore what truly motivates and excites you",
      duration: "2-3 minutes"
    }
  ];

  const benefits = [
    "Get personalized career recommendations tailored to your profile",
    "Discover learning paths that align with your goals",
    "Understand your unique strengths and how to leverage them",
    "Access AI-powered insights about your career potential"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Updated Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-100" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  FutureForge
                </span>
              </div>
            </div>
            
            <div className="relative">
              <button
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
                className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <User className="w-4 h-4 text-slate-600" />
              </button>

              {showUserMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-xl p-4"
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-slate-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{username}</h4>
                      <p className="text-sm text-slate-600">{email}</p>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-1">
                        {role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      <Bell className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">Notifications</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      <Settings className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-700">Settings</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 p-2 hover:bg-red-50 rounded-lg transition-colors text-left text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Unlock Your Career Potential</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Welcome to Your
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
              Career Journey
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover your perfect career path with our AI-powered aptitude test. In just 10 minutes, 
            get personalized insights that will transform how you think about your professional future.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleTakeTestClick}
            className="group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 flex items-center space-x-3 mx-auto"
          >
            <BarChart2 className="w-6 h-6" />
            <span>Start Your Assessment</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Assessment Steps */}
        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-3xl p-12 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to unlock your career potential</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="group relative bg-gradient-to-br from-slate-50 to-blue-50/50 hover:from-blue-50 hover:to-purple-50 border border-slate-200/60 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl cursor-pointer"
                  onClick={() => setCurrentStep(index)}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-purple-600" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                    <p className="text-slate-600 mb-4">{step.description}</p>
                    
                    <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{step.duration}</span>
                    </div>
                  </div>

                  {currentStep === index && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border-2 border-purple-300"></div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Total Time: 8-10 minutes</span>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              What You'll
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Discover</span>
            </h2>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg text-slate-600">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <Star className="w-8 h-8 text-yellow-300" />
                  <span className="text-2xl font-bold">AI-Powered Insights</span>
                </div>
                
                <p className="text-lg mb-6 text-white/90">
                  Our advanced AI analyzes thousands of data points to provide you with incredibly accurate career recommendations.
                </p>
                
                <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span>Accuracy Rate</span>
                    <span className="font-bold">94%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <div className="bg-yellow-300 h-full rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already discovered their perfect career path with FutureForge.
          </p>
          
          <button
            onClick={handleTakeTestClick}
            className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center space-x-3 mx-auto"
          >
            <span>Begin Assessment Now</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-sm text-slate-400 mt-4">
            ✨ Free • No credit card required • Results in 10 minutes
          </p>
        </div>
      </div>
      <StartTestModal
          isOpen={showTestInstructions}
          onClose={handleCloseInstructions}
          onStartTest={handleBeginTest}
          testDuration={12}
        />
    </div>
  );
};

export default WelcomePage;