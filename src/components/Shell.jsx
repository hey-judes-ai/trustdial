import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { icon: '⬡', label: 'Home', active: false },
  { icon: '◈', label: 'Clients', active: true },
  { icon: '▤', label: 'Models', active: false },
  { icon: '◎', label: 'Research', active: false },
  { icon: '⚙', label: 'Settings', active: false },
];

export default function Shell({ children, currentStep, stepLabels }) {
  return (
    <div className="flex h-screen bg-shell-darkest overflow-hidden">
      {/* Sidebar */}
      <div className="w-[52px] flex flex-col items-center py-4 border-r border-shell-mid/40 bg-shell-darker shrink-0">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
          <span className="text-accent text-sm font-bold">M</span>
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-colors ${
                item.active
                  ? 'bg-shell-mid text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-shell-mid/40'
              }`}
              title={item.label}
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-shell-mid flex items-center justify-center text-[11px] text-text-secondary font-medium">
          JW
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="h-11 flex items-center px-4 border-b border-shell-mid/40 bg-shell-darker shrink-0">
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span>Clients</span>
            <span className="text-shell-light">/</span>
            <span className="text-text-secondary">James Devoe Finley</span>
            <span className="text-shell-light">/</span>
            <span className="text-text-primary">Client Review</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] text-text-tertiary font-mono">
              Wealth Management Plugin v2.1
            </span>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
