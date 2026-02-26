import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Shell from './components/Shell';
import StepNav from './components/StepNav';
import CommandInput from './components/CommandInput';
import DataGathering from './components/DataGathering';
import PortfolioAnalysis from './components/PortfolioAnalysis';
import Recommendations from './components/Recommendations';
import AuditTrail from './components/AuditTrail';
import TrustDial from './components/TrustDial';
import './App.css';

const STEP_COMPONENTS = [
  CommandInput,
  DataGathering,
  PortfolioAnalysis,
  Recommendations,
  AuditTrail,
  TrustDial,
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNext = () => {
    setCurrentStep((s) => Math.min(s + 1, STEP_COMPONENTS.length - 1));
  };

  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <Shell currentStep={currentStep}>
      {currentStep > 0 && (
        <StepNav currentStep={currentStep} onStepClick={setCurrentStep} />
      )}
      <AnimatePresence mode="wait">
        <StepComponent key={currentStep} onRun={goToNext} onNext={goToNext} />
      </AnimatePresence>
    </Shell>
  );
}
