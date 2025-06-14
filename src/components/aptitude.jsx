// AptitudePage.jsx
import React, { useState } from 'react';
import StartTestModal from '../components/startTestModal';
import TestComponent from '../components/testComponent'; // Optional: UI for questions

const AptitudePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isTestStarted, setIsTestStarted] = useState(false);

  const handleStartTest = () => {
    setIsModalOpen(false);
    setIsTestStarted(true);
    // Optionally: start a timer or fetch test data
  };

  return (
    <div>
      <StartTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartTest={handleStartTest}
        testDuration={15}
      />

      {isTestStarted && (
        <TestComponent /> // or inline question UI
      )}
    </div>
  );
};

export default AptitudePage;
