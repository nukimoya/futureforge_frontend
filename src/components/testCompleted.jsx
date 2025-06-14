import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function SubmissionScreen({ isSubmitted }) {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Animate progress bar
  useEffect(() => {
    if (!isSubmitted) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  // Navigate only when progress is 100
  useEffect(() => {
    if (progress >= 100) {
      navigate('/dashboard');
    }
  }, [progress, navigate]);

  if (!isSubmitted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="text-center mb-6">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Test Submitted Successfully!</h2>
        <p className="text-gray-600">Thank you for completing the aptitude test.</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-gray-500">Redirecting to your dashboard...</p>
    </div>
  );
}

export default SubmissionScreen;
