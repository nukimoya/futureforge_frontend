import { useState, useCallback, useEffect } from "react";
import { ArrowRight, Eye, EyeOff, Check, X, CheckCircle } from "lucide-react";
import { useAxios } from '../config/api'

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center">
        {type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <X className="w-5 h-5 mr-2" />}
        {message}
      </div>
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('signup'); // 'signup', 'verify', 'login'
  const [verificationCode, setVerificationCode] = useState('');
  const [toast, setToast] = useState(null);
  const api = useAxios();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const validateField = useCallback((name, value, allData = formData) => {
    switch (name) {
      case 'name':
        if (!value) return "Name is required";
        if (value.length < 3) return "Name must be at least 3 characters";
        return "";
      
      case 'email':
        if (!value) return "Email is required";
        if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Enter a valid email address";
        return "";
      
      case 'password':
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) return "Password must contain uppercase, lowercase, and number";
        return "";
      
      case 'confirmPassword':
        if (!value) return "Please confirm your password";
        if (value !== allData.password) return "Passwords do not match";
        return "";
      
      default:
        return "";
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value, { ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Also validate confirm password when password changes
    if (name === 'password' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword, { ...formData, [name]: value });
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleSubmit = async () => {
    console.log("🔍 handleSubmit triggered with formData:", formData);
  
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key], formData);
      if (error) {
        newErrors[key] = error;
        console.log(`❗ Validation error on "${key}":`, error);
      }
    });
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      console.log("✅ Validation passed. Submitting signup data...");
  
      try {
        const response = await api.post("/auth/signup", {
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });
  
        console.log("🎉 Signup API success response:", response.data);
        showToast(
          "Account created! Check your email for a confirmation code.",
          "success"
        );
  
        // Proceed to verification step
        setTimeout(() => setCurrentStep("verify"), 1000);
      } catch (error) {
        console.error("❌ Signup API error:", error);
  
        if (error.response?.data?.message) {
          showToast(error.response.data.message, "error");
        } else {
          showToast("Signup failed. Please try again later.", "error");
        }
      } finally {
        setIsSubmitting(false);
        // console.log("📭 Submission complete, isSubmitting reset.");
      }
    } else {
      // console.warn("⚠️ Validation failed. Errors:", newErrors);
    }
  };
  
  

  const handleVerification = async () => {
    // console.log("🔐 handleVerification triggered with code:", verificationCode);
  
    if (verificationCode.length !== 6) {
      console.warn("❗ Invalid code length:", verificationCode.length);
      showToast("Please enter a valid 6-digit code.", "error");
      return;
    }
  
    setIsSubmitting(true);
    // console.log("📤 Sending verification request...");
  
    try {
      const payload = {
        email: formData.email,
        code: verificationCode,
      };
  
      // console.log("📦 Verification payload:", payload);
  
      const response = await api.post('/auth/confirm-code', payload);
  
      // console.log("✅ Verification successful. Server response:", response.data);
  
      showToast("Email verified successfully!", "success");
      setTimeout(() => setCurrentStep('login'), 1000);
    } catch (error) {
      console.error("❌ Verification error:", error);
  
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("Verification failed. Please try again.", "error");
      }
    } finally {
      setIsSubmitting(false);
      // console.log("🔄 handleVerification complete, isSubmitting reset.");
    }
  };
  
  
  const handleResendCode = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/auth/resend-code', { email: formData.email });
      showToast("A new verification code has been sent.", "success");
    } catch (error) {
      showToast("Could not resend code. Please try again later.", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const isFormValid = Object.keys(formData).every(key => formData[key] && !errors[key]);

  // Verification Step
  if (currentStep === 'verify') {
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
          <div className="max-w-md w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Email</h1>
                <p className="text-gray-600">Enter the 6-digit code sent to {formData.email}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-4 text-center text-2xl font-mono rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none bg-gray-50 focus:bg-white transition-all duration-300"
                    placeholder="000000"
                    maxLength={6}
                  />
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
                    'Verify Email'
                  )}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button className="text-purple-600 hover:text-purple-700 font-medium"
                  onClick={handleResendCode}>
                    Resend Code
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login Redirect Step
  if (currentStep === 'login') {
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Verified!</h2>
              <p className="text-gray-600 mb-6">Your FutureForge account has been successfully created and verified.</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Continue to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Signup Form
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
                Join FutureForge
              </h1>
              <p className="text-gray-600">Create your account to get started</p>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 bg-red-50"
                      : formData.name && !errors.name
                      ? "border-green-300 focus:border-green-500 bg-green-50"
                      : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <X className="w-4 h-4 mr-1" /> {errors.name}
                  </p>
                )}
                {formData.name && !errors.name && formData.name.length >= 3 && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Valid name
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
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
                  Password *
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
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength
                              ? level <= 2
                                ? "bg-red-400"
                                : level <= 3
                                ? "bg-yellow-400"
                                : "bg-green-400"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength <= 2 ? "text-red-600" : passwordStrength <= 3 ? "text-yellow-600" : "text-green-600"
                    }`}>
                      {passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong"} password
                    </p>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <X className="w-4 h-4 mr-1" /> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 bg-red-50"
                        : formData.confirmPassword && !errors.confirmPassword && formData.confirmPassword === formData.password
                        ? "border-green-300 focus:border-green-500 bg-green-50"
                        : "border-gray-200 focus:border-purple-500 bg-gray-50 focus:bg-white"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <X className="w-4 h-4 mr-1" /> {errors.confirmPassword}
                  </p>
                )}
                {formData.confirmPassword && !errors.confirmPassword && formData.confirmPassword === formData.password && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <Check className="w-4 h-4 mr-1" /> Passwords match
                  </p>
                )}
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
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;