import { motion } from 'framer-motion';

const STEPS = [
  { label: 'Command', autonomy: null },
  { label: 'Data Gathering', autonomy: 'autonomous', color: 'bg-status-green' },
  { label: 'Analysis', autonomy: 'auto-notify', color: 'bg-status-blue' },
  { label: 'Recommendations', autonomy: 'draft-review', color: 'bg-status-amber' },
  { label: 'Audit Trail', autonomy: null },
  { label: 'Trust Dial', autonomy: null },
];

const AUTONOMY_LABELS = {
  autonomous: 'Autonomous',
  'auto-notify': 'Auto + Notify',
  'draft-review': 'Draft & Review',
  'human-required': 'Human Required',
};

const AUTONOMY_COLORS = {
  autonomous: 'text-status-green',
  'auto-notify': 'text-status-blue',
  'draft-review': 'text-status-amber',
  'human-required': 'text-status-red',
};

export default function StepNav({ currentStep, onStepClick }) {
  return (
    <div className="flex items-center gap-1 px-4 py-2 border-b border-shell-mid/40 bg-shell-darker overflow-x-auto">
      {STEPS.map((step, i) => {
        const isActive = i === currentStep;
        const isPast = i < currentStep;

        return (
          <button
            key={i}
            onClick={() => onStepClick(i)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-shell-mid text-text-primary'
                : isPast
                  ? 'text-text-secondary hover:bg-shell-mid/40 cursor-pointer'
                  : 'text-text-tertiary hover:bg-shell-mid/40 cursor-pointer'
            }`}
          >
            {/* Step number */}
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                isActive
                  ? 'bg-accent text-white'
                  : isPast
                    ? 'bg-status-green/20 text-status-green'
                    : 'bg-shell-mid text-text-tertiary'
              }`}
            >
              {isPast ? '✓' : i}
            </span>

            <span>{step.label}</span>

            {/* Autonomy badge */}
            {step.autonomy && isActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-[10px] font-semibold ${AUTONOMY_COLORS[step.autonomy]}`}
              >
                {AUTONOMY_LABELS[step.autonomy]}
              </motion.span>
            )}
          </button>
        );
      })}
    </div>
  );
}
