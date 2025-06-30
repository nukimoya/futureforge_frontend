import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

function SubmissionScreen({ isSubmitted }) {
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const navigate = useNavigate();

  // Animate progress bar and pulse effect
  useEffect(() => {
    if (!isSubmitted) return;

    const confettiTimeout = setTimeout(() => {
      setShowConfetti(true);
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);

    const pulseInterval = setInterval(() => {
      setPulseIntensity(prev => (prev === 1 ? 1.05 : 1));
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(pulseInterval);
      clearTimeout(confettiTimeout);
    };
  }, [isSubmitted]);

  // Navigate to recommendations once progress hits 100%
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        navigate('/recommendations');
      }, 100); // Optional delay before navigating

      return () => clearTimeout(timeout); // clean up on unmount or re-run
    }
  }, [progress, navigate]);

  if (!isSubmitted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-400 rounded-full opacity-15 animate-pulse blur-2xl animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-pink-400 rounded-full opacity-25 animate-pulse blur-lg animation-delay-2000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:50px_50px]"></div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles 
                className="text-yellow-300" 
                size={16 + Math.random() * 8}
                style={{ opacity: 0.7 + Math.random() * 0.3 }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-md w-full">
        {/* Main Card */}
        <div 
          className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 text-center transform transition-all duration-1000"
          style={{ 
            transform: `scale(${pulseIntensity})`,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-lg mb-4 transform animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-emerald-300 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Test Submitted Successfully!
          </h1>

          {/* Subtitle */}
          <p className="text-blue-100 mb-8 text-lg opacity-90">
            Thank you for completing the aptitude test.
          </p>

          {/* Enhanced Progress Bar Container */}
          <div className="mb-8">
            <div className="relative bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-white/30">
              {/* Progress Bar */}
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
              
              {/* Progress glow */}
              <div
                className="absolute top-0 h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-sm opacity-50 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* Progress text */}
            <div className="flex justify-between items-center mt-2">
              <span className="text-blue-200 text-sm font-medium">{Math.round(progress)}%</span>
              <span className="text-blue-200 text-sm">Processing...</span>
            </div>
          </div>

          {/* Status Message */}
          <div className="flex items-center justify-center space-x-2 text-blue-100">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
            </div>
            <span className="text-lg font-medium">
              Redirecting to your Personalized Recommendations
            </span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Bottom accent */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-white/60 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Preparing your customized learning path</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      <style jsx='true'>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default SubmissionScreen;