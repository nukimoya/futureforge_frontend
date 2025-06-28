import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle,Sparkles,  LogOut,  User, Bell, Settings } from 'lucide-react';
import { useAxios } from '../config/api';
import { toast } from 'react-toastify';
import SubmissionScreen from './testCompleted';
import { AuthContext } from '../context/authContext';

const TestComponent = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const [questions, setQuestions] = useState([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuestion?.id] || [];
  

  const username = user?.data?.user?.username;
  const email = user?.data?.user?.email;
  const role = user?.data?.user?.role;
  
  const fetchQuestions = useCallback(async () => {
    if (sessionStarted) return;

    try {

      setSessionStarted(true);
      const sessionRes = await api.post('/api/start-session');
      const sessionId = sessionRes.data.sessionId;
      setSessionId(sessionId);
  
      const response = await api.post('/api/test-questions');
      if (!response.data || !Array.isArray(response.data.questions)) {
        throw new Error('Invalid question format');
      }
  
      setQuestions(response.data.questions);
    } catch (err) {
      setSessionStarted(false);
      console.error('❌ Failed to start test or fetch questions:', err);
      setError(err.response?.data?.message || err.message || 'Unknown error');
      toast.error(`Failed to Fetch Questions`, {
        position: 'top-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored'
      });
    } finally {
      setLoading(false);
    }
  }, [api, sessionStarted]);
  
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions, api]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAnswerChange = useCallback( (questionId, optionIndex, isMultiple = false) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(optionIndex)
          ? currentAnswers.filter(idx => idx !== optionIndex)
          : [...currentAnswers, optionIndex];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [optionIndex] };
      }
    });
    setShowValidationError(false);
  }, []);

  const isCurrentQuestionAnswered = useCallback( () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswers = answers[currentQuestion?.id];
    return currentAnswers && currentAnswers.length > 0;
  }, [answers, currentQuestionIndex, questions]);

  const handleNext = useCallback(() => {
    if (!isCurrentQuestionAnswered()) {
      setShowValidationError(true);
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowValidationError(false);
    }
  }, [currentQuestionIndex, isCurrentQuestionAnswered, questions.length]);

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowValidationError(false);
    }
  };


  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
  
    if (!isCurrentQuestionAnswered()) {
      setShowValidationError(true);
      setSubmitting(false);
      return;
    }
  
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id] || answers[q.id].length === 0);
    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      setSubmitting(false);
      return;
    }
  
    // Prepare payload
    const payload = {
        sessionId,
        responses: questions.map(q => {
            const questionText = q.question_text;
            let answerText;
          
            if (q.type === 'multiple') {
              answerText = (answers[q.id] || []).map(i => q.options[i]).join(', ');
            } else {
              const selected = answers[q.id];
              answerText = selected && selected[0] !== undefined ? q.options[selected[0]] : '';
            }
          
            return {
              question: questionText || '[Missing Question]',
              answer: answerText || '[No Answer Selected]'
            };
        })
    };
  
    try {
      const response = await api.post('/api/submit-test', payload);
      console.log('✅ Test submitted successfully:', response.data);
      setIsSubmitted(true);
    } catch (err) {
      console.error('❌ Failed to submit test:', err);
      alert(err.response?.data?.error || 'Failed to submit test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [api, isCurrentQuestionAnswered, answers, questions, sessionId, submitting]); // Removed api and isCurrentQuestionAnswered
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do nothing if modal or input field is focused
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
  
      const numberPressed = parseInt(e.key);
      if (numberPressed >= 1 && numberPressed <= 4) {
        const index = numberPressed - 1;
        if (currentQuestion?.options?.[index]) {
          handleAnswerChange(currentQuestion.id, index, currentQuestion.type === 'multiple');
        }
      } else if (e.key === 'Enter') {
        if (currentQuestionIndex < questions.length - 1) {
          handleNext();
        } else {
          handleSubmit();
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentQuestionIndex, questions, answers, handleAnswerChange, handleNext, handleSubmit]);
  
  const handleLogout = () => {
    try {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("user");
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };
  const getProgressPercentage = () => {
    const answeredCount = questions.filter(q => answers[q.id] && answers[q.id].length > 0).length;
    return (answeredCount / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <SubmissionScreen isSubmitted = {isSubmitted}/>
    );
  }


  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No questions available.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Updated Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-lg shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-6 py-2">
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
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-slate-900/10 border border-white/40 p-8 mb-4 mt-4">
          <div className="text-center mb-6">
            {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">?</span>
            </div> */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-2">
              Aptitude Test
            </h1>
            <p className="text-slate-600">Discover your potential with our comprehensive assessment</p>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm font-medium text-slate-700 mb-3">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Progress
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="relative w-full bg-slate-200/80 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${getProgressPercentage()}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
              <div 
                className="absolute top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full blur-sm opacity-40 transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Question Counter */}
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 rounded-full px-4 py-2 shadow-sm">
              <span className="text-slate-700 font-medium">
                Question <span className="font-bold text-blue-600">{currentQuestionIndex + 1}</span> of <span className="font-bold text-purple-600">{questions.length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-slate-900/10 border border-white/40 p-8 mb-4">
          <div className="mb-8">
            <div className="flex items-start space-x-3 mb-6">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-white">{currentQuestionIndex + 1}</span>
              </div>
              <h2 className="text-xl font-semibold text-slate-800 leading-relaxed">
                {currentQuestion.question_text}
              </h2>
            </div>
            
            {currentQuestion.type === 'multiple' && (
              <div className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <p className="text-sm font-medium text-blue-700">
                  Select all that apply
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <div 
                key={idx}
                className={`group relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                  currentAnswers.includes(idx)
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg shadow-blue-500/20'
                    : 'border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white/80'
                }`}
                onClick={() => handleAnswerChange(currentQuestion.id, idx, currentQuestion.type === 'multiple')}
              >
                <label className="flex items-center cursor-pointer">
                  <div className="relative mr-4">
                    <input
                      type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                      name={`question-${currentQuestion.id}`}
                      checked={currentAnswers.includes(idx)}
                      onChange={() => handleAnswerChange(currentQuestion.id, idx, currentQuestion.type === 'multiple')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      currentAnswers.includes(idx)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {currentAnswers.includes(idx) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <span className={`text-slate-700 font-medium leading-relaxed transition-colors duration-200 ${
                    currentAnswers.includes(idx) ? 'text-slate-800' : 'group-hover:text-slate-800'
                  }`}>
                    {option}
                  </span>
                </label>
                
                {/* Selection indicator */}
                {currentAnswers.includes(idx) && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Validation Error */}
          {showValidationError && (
            <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-red-700 font-medium">
                  Please select at least one option before proceeding.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-422">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform ${
              currentQuestionIndex === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white border border-slate-200 hover:shadow-lg hover:scale-105 shadow-sm'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          <div className="flex space-x-4">
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex items-center px-10 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    submitting 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 cursor-not-allowed text-white' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-xl'
                  }`}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Question Navigation Dots */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/40">
            <div className="flex space-x-3">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`relative w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                    index === currentQuestionIndex
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                      : answers[questions[index].id] && answers[questions[index].id].length > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Question ${index + 1}${answers[questions[index].id] && answers[questions[index].id].length > 0 ? ' (Answered)' : ''}`}
                >
                  {index === currentQuestionIndex && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-75"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx='true'>{`
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
};

export default TestComponent;


