import React, { useEffect, useCallback } from 'react';
import { PlayCircle, Info, Timer, ArrowRightCircle } from 'lucide-react';

const StartTestModal = ({ isOpen, onClose, onStartTest, testDuration }) => {
  const handleEscape = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleStartTest = (e) => {
    e.preventDefault();      // optional: use if needed
    e.stopPropagation();     // prevent modal close
    if (typeof onStartTest === 'function') {
      onStartTest();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 ${
        isOpen ? 'animate-fadeIn' : ''
      }`}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="startTestModal"
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 md:mx-0 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold" id="startTestModal">
            <PlayCircle size={22} /> Ready to Begin?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-3 pb-5 space-y-4">
          <div className="flex items-start gap-3 p-4 my-2 bg-blue-100 text-blue-800 rounded-md text-sm">
            <Info size={20} className="mt-1 shrink-0" />
            <div>
              <p className="mb-2 font-medium">This is your aptitude test. It's designed to assess your strengths and interests.</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>There is no going back once you begin.</li>
                <li>Your answers will shape your career suggestions.</li>
                <li>Make sure you’re in a quiet space with no distractions.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            <Timer size={20} className="mt-1 shrink-0" />
            <p className="mb-0">
              You have <strong>{testDuration} minutes</strong> to complete the test. Timing begins once you start.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleStartTest}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <span>Start Test</span>
            <ArrowRightCircle size={18} />
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx='true'>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default StartTestModal;
