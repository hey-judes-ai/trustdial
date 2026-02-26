import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommandInput({ onRun }) {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [inputValue, setInputValue] = useState('/client-review Sarah Chen');
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAutocomplete(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onRun();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-[600px]">
        {/* Cowork branding */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 text-center"
        >
          <h1 className="font-serif text-[32px] text-text-primary mb-2">
            Cowork
          </h1>
          <p className="text-sm text-text-tertiary">
            What would you like to work on?
          </p>
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="bg-shell-darker border border-shell-mid rounded-xl p-4 focus-within:border-shell-light transition-colors">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-text-primary text-[15px] font-mono outline-none placeholder:text-text-tertiary"
                autoFocus
              />
              <button
                onClick={onRun}
                className="bg-accent hover:bg-accent/85 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-opacity"
              >
                Run
              </button>
            </div>
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {showAutocomplete && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 mt-2 bg-shell-darker border border-shell-mid rounded-xl overflow-hidden shadow-2xl"
              >
                <div className="p-1">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-shell-mid/50">
                    <div className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center">
                      <span className="text-accent text-xs font-bold">W</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-text-primary font-medium">
                        /client-review
                      </div>
                      <div className="text-[11px] text-text-tertiary">
                        Wealth Management Plugin — Run full portfolio review
                      </div>
                    </div>
                    <span className="text-[10px] text-text-tertiary bg-shell-mid px-2 py-0.5 rounded">
                      ↵ Enter
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-shell-mid/60">
                  <span className="text-[10px] text-text-tertiary">
                    Client matched: <span className="text-text-secondary">Sarah Chen</span> — Meridian Moderate Growth 2048
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <span className="text-[11px] text-text-tertiary">
            Press <kbd className="px-1.5 py-0.5 bg-shell-mid rounded text-text-secondary text-[10px] font-mono">Enter</kbd> or click Run to start
          </span>
        </motion.div>
      </div>
    </div>
  );
}
