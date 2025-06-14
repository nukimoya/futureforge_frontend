import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAxios } from '../config/api';
import SubmissionScreen from './testCompleted';

const TestComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showValidationError, setShowValidationError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const api = useAxios();

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
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, [api, sessionId]);

  const handleAnswerChange = (questionId, optionIndex, isMultiple = false) => {
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
  };

  const isCurrentQuestionAnswered = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswers = answers[currentQuestion?.id];
    return currentAnswers && currentAnswers.length > 0;
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      setShowValidationError(true);
      return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowValidationError(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowValidationError(false);
    }
  };

  const handleSubmit = async () => {
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

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswers = answers[currentQuestion.id] || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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


