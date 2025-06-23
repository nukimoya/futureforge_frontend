import { useState, useCallback, useEffect, useContext } from "react";
import { LogIn, Eye, EyeOff, Check, X, CheckCircle, AlertCircle } from "lucide-react";
import { useAxios } from "../config/api";
import { AuthContext } from "../context/authContext";


const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
      type === 'success' ? 'bg-green-500 text-white' : 
      type === 'error' ? 'bg-red-500 text-white' : 
      'bg-blue-500 text-white'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : 
         type === 'error' ? <X className="w-5 h-5 mr-2" /> : 
         <AlertCircle className="w-5 h-5 mr-2" />}
        {message}
      </div>
    </div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('login'); // 'login', 'verify', 'dashboard'
  const [verificationCode, setVerificationCode] = useState('');
  const [toast, setToast] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes (600 seconds)

  const api = useAxios();
  const { dispatch } = useContext(AuthContext);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'email':
        if (!value) return "Email is required";
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Enter a valid email address";
        return "";
      
      case 'password':
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
      
      default:
        return "";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = useCallback(async () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
  
      try {
        console.log("🔐 Attempting login with:", formData);
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });
  
        console.log("✅ Login response:", response.data);
  
        // ✅ FIXED HERE
        localStorage.setItem("user", JSON.stringify(response.data));
        dispatch({ type: "LOGIN", payload: response.data });
  
        if (response.data.requiresVerification) {
          showToast("Account verification required. Please check your email.", "info");
          setTimeout(() => setCurrentStep('verify'), 1000);
        } else {
          showToast("Login successful! Welcome back.", "success");
          setTimeout(() => setCurrentStep('dashboard'), 1000);
        }
  
      } catch (error) {
        console.error("❌ Login error:", error);
        if (error.response?.data?.message) {
          showToast(error.response.data.message, "error");
        } else {
          showToast("Login failed. Please try again.", "error");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, validateField, api, dispatch]);
  

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      showToast("Please enter a valid 6-digit verification code.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: formData.email,
        code: verificationCode
      };

      console.log("📤 Sending verification payload:", payload);

      const response = await api.post('/auth/confirm-code', payload);

      console.log("✅ Verification success:", response.data);

      showToast("Email verified successfully! Redirecting to dashboard...", "success");
      setTimeout(() => setCurrentStep('dashboard'), 1000);
    } catch (error) {
      console.error("❌ Verification error:", error);
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("Verification failed. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  
  useEffect(() => {
    if (!codeSent) return;
  
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCodeSent(false); // Allow "Send Code" to appear again
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [codeSent]);

  const handleSendCode = async () => {
    try {
      showToast("Sending code...", "info");
      await api.post('/auth/resend-code', { email: formData.email });
      showToast("Verification code sent!", "success");
      setCodeSent(true);
      setCountdown(60); // reset to 10 minutes
    } catch (error) {
      console.error("❌ Resend code error:", error);
      showToast("Failed to send code. Try again.", "error");
    }
  };

  const handleForgotPassword = () => {
    showToast("Password reset link sent to your email!", "info");
  };

  const isFormValid = formData.email && formData.password && !errors.email && !errors.password;


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && currentStep === 'login' && isFormValid && !isSubmitting) {
        handleSubmit();
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, isFormValid, isSubmitting, handleSubmit]);

  // Verification Step (for unverified accounts)
  if (currentStep === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-white relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Account</h1>
                <p className="text-gray-600">Verification for {formData.email}</p>
              </div>

              <div className="space-y-6">
                {!codeSent ? (
                  <button
                    onClick={handleSendCode}
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
                  >
                    {isSubmitting ? "Sending..." : "Send Code"}
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="w-full px-4 py-4 text-center text-2xl font-mono rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none bg-gray-50 focus:bg-white transition-all duration-300"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />

                    <div className="text-center text-sm text-gray-500">
                      Code expires in {Math.floor(countdown / 60)
                        .toString()
                        .padStart(2, "0")}:
                      {(countdown % 60).toString().padStart(2, "0")}
                    </div>

                    <button
                      onClick={handleVerification}
                      disabled={verificationCode.length !== 6 || isSubmitting}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
                        verificationCode.length === 6 && !isSubmitting
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Verifying...
                        </div>
                      ) : (
                        "Verify Account"
                      )}
                    </button>
                  </>
                )}

                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleSendCode}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                      disabled={codeSent}
                    >
                      Resend Code
                    </button>
                  </p>
                  <p className="text-sm text-gray-600">
                    <button
                      onClick={() => setCurrentStep("login")}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Back to Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Redirect Step
  if (currentStep === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome Back!</h2>
              <p className="text-gray-600 mb-6">You've successfully logged into FutureForge.</p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Login Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-purple-300 transform rotate-45 opacity-60"></div>
        <div className="absolute bottom-1/4 right-10 w-6 h-6 bg-blue-300 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-purple-400 rounded-full opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-blue-400 transform rotate-45 opacity-60"></div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">Sign in to your FutureForge account</p>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : formData.email && !errors.email
                      ? "border-green-300 focus:border-green-500 bg-green-50"
                      : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <X className="w-4 h-4 mr-1" /> {errors.email}
                  </p>
                )}
                {formData.email && !errors.email && formData.email.includes('@') && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Valid email address
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 bg-red-50"
                        : formData.password && !errors.password
                        ? "border-green-300 focus:border-green-500 bg-green-50"
                        : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <X className="w-4 h-4 mr-1" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`group w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  isFormValid && !isSubmitting
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg"
                    : "bg-gray-400 cursor-not-allowed"
                } focus:outline-none focus:ring-4 focus:ring-purple-300`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
                    <LogIn className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                  Sign up here
                </a>
              </p>
            </div>

            {/* Demo Account Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">Demo Accounts:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Regular:</strong> demo@futureforge.com / password123</p>
                <p><strong>Unverified:</strong> unverified@futureforge.com / password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;