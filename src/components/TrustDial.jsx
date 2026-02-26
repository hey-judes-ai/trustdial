import { useState } from 'react';
import { motion } from 'framer-motion';

const AUTONOMY_LEVELS = [
  {
    id: 'autonomous',
    label: 'Autonomous',
    short: 'Auto',
    color: '#22c55e',
    description: 'Claude acts independently. No human input required.',
  },
  {
    id: 'auto-notify',
    label: 'Auto + Notify',
    short: 'Notify',
    color: '#3b82f6',
    description: 'Claude acts and notifies the advisor of results.',
  },
  {
    id: 'draft-review',
    label: 'Draft & Review',
    short: 'Review',
    color: '#f59e0b',
    description: 'Claude drafts output. Advisor must approve before it takes effect.',
  },
  {
    id: 'human-required',
    label: 'Human Required',
    short: 'Human',
    color: '#ef4444',
    description: 'Claude prepares materials. Only a human can execute.',
  },
];

const TASKS = [
  { id: 'data-gathering', name: 'Data Gathering', subtitle: 'Portfolio data, market prices, account info', defaultLevel: 0 },
  { id: 'portfolio-analysis', name: 'Portfolio Analysis', subtitle: 'Drift detection, risk metrics, performance attribution', defaultLevel: 1 },
  { id: 'rebalancing', name: 'Rebalancing Recommendations', subtitle: 'Trade suggestions, tax optimization, allocation changes', defaultLevel: 2 },
  { id: 'trade-execution', name: 'Trade Execution', subtitle: 'Order preparation, trade tickets, settlement', defaultLevel: 3 },
  { id: 'client-comms', name: 'Client Communications', subtitle: 'Quarterly reviews, meeting agendas, follow-up emails', defaultLevel: 2 },
];

const COMPLIANCE_RULES = [
  { text: 'Trades exceeding $100,000 require senior advisor approval', active: true },
  { text: 'All recommendations must cite data sources', active: true },
  { text: 'Client-facing documents require advisor sign-off', active: true },
  { text: 'Respect 30-day wash sale window', active: true },
  { text: 'Flag concentrated positions >10% of portfolio', active: true },
];

function AutonomySlider({ level, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {AUTONOMY_LEVELS.map((l, i) => (
        <button
          key={l.id}
          onClick={() => onChange(i)}
          className="h-8 w-[72px] border-none cursor-pointer transition-all duration-300 flex items-center justify-center"
          style={{
            background: i <= level ? AUTONOMY_LEVELS[level].color : '#1a1a1a',
            opacity: i <= level ? (i === level ? 1 : 0.3) : 0.1,
            borderRadius:
              i === 0
                ? '6px 0 0 6px'
                : i === AUTONOMY_LEVELS.length - 1
                  ? '0 6px 6px 0'
                  : '0',
          }}
          title={l.label}
        >
          {i === level && (
            <span className="text-[10px] font-semibold text-white tracking-wide">
              {l.short}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function TaskRow({ task, level, onLevelChange, isHovered, onHover, onLeave }) {
  const currentLevel = AUTONOMY_LEVELS[level];
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex items-center justify-between px-6 py-5 border-b border-shell-mid/40 transition-colors cursor-default ${
        isHovered ? 'bg-shell-dark' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <span
            className="w-2 h-2 rounded-full shrink-0 transition-colors duration-300"
            style={{
              background: currentLevel.color,
              boxShadow: `0 0 8px ${currentLevel.color}44`,
            }}
          />
          <span className="text-[15px] font-medium text-text-primary">
            {task.name}
          </span>
        </div>
        <span className="text-xs text-text-tertiary pl-[18px]">
          {task.subtitle}
        </span>
      </div>
      <div className="shrink-0 ml-6">
        <AutonomySlider level={level} onChange={onLevelChange} />
      </div>
    </div>
  );
}

export default function TrustDial() {
  const [levels, setLevels] = useState(
    Object.fromEntries(TASKS.map((t) => [t.id, t.defaultLevel]))
  );
  const [hoveredTask, setHoveredTask] = useState(null);
  const [showRules, setShowRules] = useState(false);

  const handleLevelChange = (taskId, newLevel) => {
    setLevels((prev) => ({ ...prev, [taskId]: newLevel }));
  };

  const hoveredLevel = hoveredTask !== null ? levels[hoveredTask] : null;
  const activeDescription = hoveredLevel !== null ? AUTONOMY_LEVELS[hoveredLevel] : null;

  const totalPossible = TASKS.length * (AUTONOMY_LEVELS.length - 1);
  const totalCurrent = Object.values(levels).reduce((sum, l) => sum + l, 0);
  const autonomyScore = Math.round(((totalPossible - totalCurrent) / totalPossible) * 100);

  return (
    <div className="max-w-[640px] mx-auto py-10 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="text-xs font-semibold text-text-secondary tracking-widest uppercase">
            Meridian Advisors
          </h3>
          <span className="text-[11px] text-text-tertiary font-mono">
            Cowork / Plugin Settings
          </span>
        </div>
        <h2 className="font-serif text-[28px] text-text-primary mb-1.5">
          Autonomy Configuration
        </h2>
        <p className="text-[13px] text-text-tertiary leading-relaxed">
          Define how much independence Claude has for each type of task.
          Higher autonomy means faster execution. Lower autonomy means more human oversight.
        </p>
      </motion.div>

      {/* Autonomy Score */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 p-4 bg-shell-dark rounded-xl mb-6 border border-shell-mid/60"
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center relative"
          style={{
            background: `conic-gradient(${
              autonomyScore > 66 ? '#22c55e' : autonomyScore > 33 ? '#f59e0b' : '#ef4444'
            } ${autonomyScore * 3.6}deg, #1a1a1a ${autonomyScore * 3.6}deg)`,
          }}
        >
          <div className="w-[38px] h-[38px] rounded-full bg-shell-dark flex items-center justify-center text-lg font-bold text-text-primary">
            {autonomyScore}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-text-secondary">Agent Autonomy Score</div>
          <div className="text-xs text-text-tertiary mt-0.5">
            {autonomyScore > 66
              ? 'High autonomy — Claude handles most tasks independently'
              : autonomyScore > 33
                ? 'Balanced — Claude drafts, humans review key decisions'
                : 'Conservative — Human approval required for most actions'}
          </div>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex gap-1 mb-4 px-1">
        {AUTONOMY_LEVELS.map((l) => (
          <div key={l.id} className="flex-1 flex items-center gap-1.5 py-2">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: l.color }}
            />
            <span className="text-[11px] text-text-tertiary">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-shell-darker rounded-xl border border-shell-mid/60 overflow-hidden"
      >
        {TASKS.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            level={levels[task.id]}
            onLevelChange={(newLevel) => handleLevelChange(task.id, newLevel)}
            isHovered={hoveredTask === task.id}
            onHover={() => setHoveredTask(task.id)}
            onLeave={() => setHoveredTask(null)}
          />
        ))}
      </motion.div>

      {/* Active description */}
      <div className="h-12 flex items-center px-2 mt-2">
        {activeDescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs opacity-80"
            style={{ color: activeDescription.color }}
          >
            ↳ {activeDescription.description}
          </motion.div>
        )}
      </div>

      {/* Compliance Rules */}
      <button
        onClick={() => setShowRules(!showRules)}
        className="w-full p-3.5 bg-shell-darker border border-shell-mid/60 rounded-xl text-text-secondary text-[13px] font-medium cursor-pointer flex items-center justify-between mt-2 hover:border-shell-light transition-colors"
      >
        <span>Compliance Rules ({COMPLIANCE_RULES.length} active)</span>
        <span
          className="text-[10px] transition-transform duration-200"
          style={{ transform: showRules ? 'rotate(180deg)' : 'rotate(0)' }}
        >
          ▼
        </span>
      </button>

      {showRules && (
        <div className="p-4 bg-shell-darker border border-shell-mid/60 border-t-0 rounded-b-xl -mt-2.5">
          {COMPLIANCE_RULES.map((rule, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 py-2 ${
                i < COMPLIANCE_RULES.length - 1 ? 'border-b border-shell-mid/40' : ''
              }`}
            >
              <span
                className={`w-4 h-4 rounded shrink-0 flex items-center justify-center text-[10px] mt-0.5 ${
                  rule.active
                    ? 'bg-status-green/10 border border-status-green/30 text-status-green'
                    : 'bg-shell-mid border border-shell-light'
                }`}
              >
                {rule.active ? '✓' : ''}
              </span>
              <span className="text-xs text-text-secondary leading-relaxed">{rule.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-shell-mid/40 flex justify-between items-center">
        <span className="text-[11px] text-text-tertiary">
          Changes apply to all advisors in this organization
        </span>
        <button className="bg-accent hover:bg-accent/85 text-white px-5 py-2 rounded-lg text-[13px] font-semibold transition-opacity">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
