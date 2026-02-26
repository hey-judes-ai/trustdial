import { useState } from 'react';
import { motion } from 'framer-motion';
import recsData from '../data/recommendations.json';

const FILTERS = ['All', 'Agent', 'Human', 'Checkpoints'];

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export default function AuditTrail({ onNext }) {
  const [filter, setFilter] = useState('All');
  const log = recsData.auditLog;

  const agentCount = log.filter((e) => e.actor === 'agent').length;
  const humanCount = log.filter((e) => e.actor === 'human').length;
  const checkpointCount = log.filter((e) => e.isCheckpoint).length;

  const filtered = log.filter((entry) => {
    if (filter === 'All') return true;
    if (filter === 'Agent') return entry.actor === 'agent';
    if (filter === 'Human') return entry.actor === 'human';
    if (filter === 'Checkpoints') return entry.isCheckpoint;
    return true;
  });

  return (
    <div className="max-w-[640px] mx-auto py-10 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="font-serif text-2xl text-text-primary mb-2">Audit Trail</h2>
        <p className="text-sm text-text-tertiary">
          Complete log of every action Claude took and every human decision.
        </p>
      </motion.div>

      {/* Stats + Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-6"
      >
        <span className="text-xs text-text-tertiary">
          {log.length} events | {agentCount} agent | {humanCount} human
        </span>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                filter === f
                  ? 'bg-shell-mid text-text-primary'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-shell-mid/40'
              }`}
            >
              {f}
              {f === 'Checkpoints' && ` (${checkpointCount})`}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-shell-mid/60" />

        <div className="space-y-1">
          {filtered.map((entry, i) => {
            const isAgent = entry.actor === 'agent';
            const isHuman = entry.actor === 'human';
            const isSystem = entry.actor === 'system';

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.04 }}
                className={`relative flex gap-3 p-3 rounded-lg transition-colors ${
                  entry.isCheckpoint
                    ? 'bg-status-amber/5 border border-status-amber/20'
                    : isHuman
                      ? 'bg-[#2d1f04]/30'
                      : 'hover:bg-shell-darker/50'
                }`}
              >
                {/* Icon */}
                <div
                  className={`relative z-10 w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs shrink-0 ${
                    isAgent
                      ? 'bg-[#1e293b] text-status-blue'
                      : isHuman
                        ? 'bg-[#2d1f04] text-status-amber'
                        : 'bg-status-amber/20 text-status-amber'
                  }`}
                >
                  {isAgent ? '⚡' : isHuman ? '👤' : '⚑'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-sm font-medium text-text-primary">
                      {entry.action}
                    </span>
                    <span className="text-[10px] text-text-tertiary font-mono">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {entry.details}
                  </p>
                </div>

                {/* Actor badge */}
                <span
                  className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded self-start shrink-0 ${
                    isAgent
                      ? 'text-status-blue/70'
                      : isHuman
                        ? 'text-status-amber/70'
                        : 'text-status-amber/70'
                  }`}
                >
                  {entry.actor}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-end mt-8"
      >
        <button
          onClick={onNext}
          className="bg-accent hover:bg-accent/85 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-opacity"
        >
          View Trust Configuration →
        </button>
      </motion.div>
    </div>
  );
}
