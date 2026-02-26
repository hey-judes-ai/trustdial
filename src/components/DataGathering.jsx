import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DATA_STEPS = [
  {
    label: 'Accessing portfolio holdings across 8 accounts...',
    detail: 'Northwestern Mutual custodian',
    duration: 400,
  },
  {
    label: 'Fetching market prices for 18 securities...',
    detail: 'Real-time pricing feed',
    duration: 500,
  },
  {
    label: 'Loading Meridian Moderate Growth 2048 model targets...',
    detail: 'Last updated Jan 15, 2026',
    duration: 350,
  },
  {
    label: 'Running drift analysis and risk metrics...',
    detail: '9 asset classes, 3 critical drifts detected',
    duration: 450,
  },
];

export default function DataGathering({ onNext }) {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    let timeout;
    const runSequence = (index) => {
      if (index >= DATA_STEPS.length) {
        setTimeout(() => setAllDone(true), 300);
        return;
      }
      setActiveStep(index);
      timeout = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, index]);
        runSequence(index + 1);
      }, DATA_STEPS[index].duration + 300);
    };
    const start = setTimeout(() => runSequence(0), 400);
    return () => {
      clearTimeout(start);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="w-full max-w-[560px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-serif text-2xl text-text-primary">
              Data Gathering
            </h2>
            <span className="text-[10px] font-semibold text-status-green bg-status-green/10 px-2 py-0.5 rounded-full">
              Autonomous
            </span>
          </div>
          <p className="text-sm text-text-tertiary">
            Claude is independently collecting and analyzing portfolio data.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-3">
          {DATA_STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i);
            const isActive = activeStep === i && !isCompleted;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-status-green/5 border-status-green/20'
                    : isActive
                      ? 'bg-shell-darker border-shell-mid'
                      : 'bg-transparent border-transparent'
                }`}
              >
                {/* Status indicator */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-status-green/20 flex items-center justify-center"
                    >
                      <span className="text-status-green text-xs">✓</span>
                    </motion.div>
                  ) : isActive ? (
                    <div className="w-5 h-5 rounded-full border-2 border-status-blue border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-shell-mid/50" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-medium transition-colors ${
                      isCompleted
                        ? 'text-text-primary'
                        : isActive
                          ? 'text-text-primary'
                          : 'text-text-tertiary'
                    }`}
                  >
                    {step.label}
                  </div>
                  {(isActive || isCompleted) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-text-tertiary mt-1"
                    >
                      {step.detail}
                    </motion.div>
                  )}
                </div>

                {/* Timing */}
                {isCompleted && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] text-text-tertiary font-mono shrink-0"
                  >
                    {(step.duration / 1000).toFixed(1)}s
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Continue button */}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex items-center justify-between"
          >
            <span className="text-xs text-text-tertiary">
              All data sources accessed successfully
            </span>
            <button
              onClick={onNext}
              className="bg-accent hover:bg-accent/85 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-opacity"
            >
              View Analysis →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
