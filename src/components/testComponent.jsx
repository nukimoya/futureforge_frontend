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
  const { dispatch } = useContext(AuthContext);


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
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuestion?.id] || [];
  

  const username = "Alex Johnson";
  const email = "alex.johnson@email.com";
  const role = "Professional";

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const sessionRes = await api.post('/api/start-session');
        const sessionId = sessionRes.data.sessionId;
        setSessionId(sessionId);
  

        const response = await api.post('/api/test-questions');
        if (!response.data || !Array.isArray(response.data.questions)) {
          throw new Error('Invalid question format');
        }
  
        setQuestions(response.data.questions);
      } catch (err) {
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
    };
  
    fetchQuestions();
  }, [api]);

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

  const isCurrentQuestionAnswered =useCallback( () => {
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

  const handleSubmit = useCallback( async () => {
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
  }, [answers, api, isCurrentQuestionAnswered, questions, sessionId, submitting]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Updated Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-1">
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">Aptitude Test</h1>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Question Counter */}
          <div className="text-center text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestionIndex + 1}. {currentQuestion.question_text}
            </h2>
            
            {currentQuestion.type === 'multiple' && (
              <p className="text-sm text-blue-600 mb-4">
                <i>Select all that apply</i>
              </p>
            )}
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <div 
                key={idx}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentAnswers.includes(idx)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAnswerChange(currentQuestion.id, idx, currentQuestion.type === 'multiple')}
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type={currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'}
                    name={`question-${currentQuestion.id}`}
                    checked={currentAnswers.includes(idx)}
                    onChange={() => handleAnswerChange(currentQuestion.id, idx, currentQuestion.type === 'multiple')}
                    className="mr-3"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              </div>
            ))}
          </div>

          {/* Validation Error */}
          {showValidationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                <AlertCircle className="inline h-4 w-4 mr-1" />
                Please select at least one option before proceeding.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          <div className="flex space-x-4">
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    submitting ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {submitting ? 'Submitting...' : 'Submit Test'}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentQuestionIndex
                  ? 'bg-blue-600'
                  : answers[questions[index].id] && answers[questions[index].id].length > 0
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
              title={`Question ${index + 1}${answers[questions[index].id] && answers[questions[index].id].length > 0 ? ' (Answered)' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestComponent;


