import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import recsData from '../data/recommendations.json';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

function TradeCard({ trade, onModify, isModified }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editShares, setEditShares] = useState(trade.shares);
  const [editReason, setEditReason] = useState('Client preference — reduce trim size');
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  const isSell = trade.action === 'SELL';
  const computedValue = editShares * trade.price;

  const handleUpdate = () => {
    onModify(trade.id, editShares, computedValue, editReason);
    setIsExpanded(false);
  };

  return (
    <motion.div
      variants={fadeUp}
      layout
      className={`border rounded-xl overflow-hidden transition-all ${
        approved
          ? 'border-status-green/30 bg-status-green/5'
          : rejected
            ? 'border-status-red/30 bg-status-red/5 opacity-50'
            : isModified
              ? 'border-status-amber/30 bg-status-amber/5'
              : 'border-shell-mid/60 bg-shell-darker'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* Action badge */}
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                isSell
                  ? 'bg-status-red/15 text-status-red'
                  : 'bg-status-green/15 text-status-green'
              }`}
            >
              {trade.action}
            </span>
            <span className="text-[10px] text-text-tertiary font-mono">{trade.id}</span>
            {trade.requiresSeniorApproval && (
              <span className="text-[10px] text-status-amber flex items-center gap-1">
                🔒 Requires senior approval
              </span>
            )}
          </div>
          {isModified && (
            <span className="text-[10px] font-semibold text-status-amber bg-status-amber/10 px-2 py-0.5 rounded-full">
              Modified
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-base font-semibold text-text-primary">{trade.ticker}</span>
          <span className="text-sm text-text-secondary">{trade.name}</span>
        </div>
        <div className="text-xs text-text-tertiary mb-3">{trade.account}</div>

        <div className="flex items-center gap-4 text-sm mb-3">
          <span className="text-text-secondary">
            {isModified && trade.modifiable ? editShares : trade.shares} shares × ${trade.price.toFixed(2)}
          </span>
          <span className="text-text-primary font-semibold">
            = ${(isModified && trade.modifiable ? computedValue : trade.value).toLocaleString()}
          </span>
        </div>

        {/* Tax impact */}
        <div className="text-xs text-text-tertiary mb-3">
          Tax impact:{' '}
          {trade.taxImpact !== null ? (
            <span className={trade.taxImpact < 0 ? 'text-status-green' : 'text-status-red'}>
              {trade.taxImpact < 0 ? '-' : '+'}${Math.abs(trade.taxImpact).toLocaleString()}
            </span>
          ) : (
            <span className="text-text-tertiary">{trade.taxNote}</span>
          )}
        </div>

        {/* Reasoning */}
        <div className="text-xs text-text-secondary leading-relaxed mb-4 pl-3 border-l-2 border-shell-mid">
          {trade.reasoning}
        </div>

        {/* Actions */}
        {!approved && !rejected && !isExpanded && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setApproved(true)}
              className="text-xs font-medium text-status-green bg-status-green/10 hover:bg-status-green/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✓ Approve
            </button>
            {trade.modifiable && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs font-medium text-status-amber bg-status-amber/10 hover:bg-status-amber/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                ✏ Modify
              </button>
            )}
            <button
              onClick={() => setRejected(true)}
              className="text-xs font-medium text-status-red bg-status-red/10 hover:bg-status-red/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              ✕ Reject
            </button>
          </div>
        )}

        {approved && (
          <div className="text-xs text-status-green font-medium">✓ Approved</div>
        )}
        {rejected && (
          <div className="text-xs text-status-red font-medium">✕ Rejected</div>
        )}
      </div>

      {/* Modify panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-shell-mid/60 bg-shell-dark overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div>
                <label className="text-xs text-text-tertiary block mb-1">Shares</label>
                <input
                  type="number"
                  value={editShares}
                  onChange={(e) => setEditShares(Number(e.target.value))}
                  className="w-32 bg-shell-darkest border border-shell-mid rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none focus:border-status-amber"
                />
                <span className="text-xs text-text-tertiary ml-3">
                  = ${computedValue.toLocaleString()}
                </span>
              </div>
              <div>
                <label className="text-xs text-text-tertiary block mb-1">Reason for modification</label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full bg-shell-darkest border border-shell-mid rounded-lg px-3 py-1.5 text-sm text-text-primary outline-none focus:border-status-amber"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleUpdate}
                  className="text-xs font-semibold text-white bg-status-amber hover:bg-status-amber/85 px-4 py-1.5 rounded-lg transition-opacity"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-xs text-text-tertiary hover:text-text-secondary px-3 py-1.5"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Recommendations({ onNext }) {
  const [modifications, setModifications] = useState({});
  const [showAcknowledge, setShowAcknowledge] = useState(false);

  const handleModify = (tradeId, shares, value, reason) => {
    setModifications((prev) => ({ ...prev, [tradeId]: { shares, value, reason } }));
    setShowAcknowledge(true);
    setTimeout(() => setShowAcknowledge(false), 3000);
  };

  const phase1Trades = recsData.trades.filter((t) => t.phase === 1);
  const phase2Trades = recsData.trades.filter((t) => t.phase === 2);

  const adjustedTaxImpact = useMemo(() => {
    let total = recsData.summary.estimatedTaxImpact;
    if (modifications.R4) {
      // R4 original was -5416 tax impact for 85 shares, adjust proportionally
      const originalShares = 85;
      const newShares = modifications.R4.shares;
      const ratio = newShares / originalShares;
      total = total + (-5416 * (1 - ratio));
    }
    return Math.round(total);
  }, [modifications]);

  return (
    <div className="max-w-[720px] mx-auto py-10 px-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-6">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
          <h2 className="font-serif text-2xl text-text-primary">Rebalancing Recommendations</h2>
          <span className="text-[10px] font-semibold text-status-amber bg-status-amber/10 px-2 py-0.5 rounded-full">
            Draft & Review
          </span>
        </motion.div>
        <motion.p variants={fadeUp} className="text-sm text-text-tertiary">
          Claude drafted recommendations. Advisor must approve before execution.
        </motion.p>
      </motion.div>

      {/* Summary banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-shell-darker border border-shell-mid/60 rounded-xl p-4 mb-6"
      >
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-text-tertiary text-xs">Total Trades</span>
            <div className="text-text-primary font-semibold">{recsData.summary.totalTrades} across {recsData.summary.phases} phases</div>
          </div>
          <div>
            <span className="text-text-tertiary text-xs">Est. Tax Impact</span>
            <div className="text-text-primary font-semibold">${adjustedTaxImpact.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-text-tertiary text-xs">Senior Approval Required</span>
            <div className="text-status-amber font-semibold">{recsData.summary.tradesRequiringSeniorApproval} trades ({recsData.summary.seniorApprover})</div>
          </div>
        </div>
      </motion.div>

      {/* Acknowledge banner */}
      <AnimatePresence>
        {showAcknowledge && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="bg-status-blue/10 border border-status-blue/20 rounded-xl p-3 flex items-center gap-3">
              <span className="text-sm">🤖</span>
              <span className="text-xs text-status-blue">
                Claude acknowledged the modification and recalculated portfolio impact.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 1 */}
      <div className="mb-8">
        <h3 className="text-xs text-text-tertiary uppercase tracking-wide font-semibold mb-4">
          Phase 1 — Immediate ({phase1Trades.length} trades)
        </h3>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
          {phase1Trades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onModify={handleModify}
              isModified={!!modifications[trade.id]}
            />
          ))}
        </motion.div>
      </div>

      {/* Phase 2 */}
      <div className="mb-8">
        <h3 className="text-xs text-text-tertiary uppercase tracking-wide font-semibold mb-4">
          Phase 2 — Follow-up ({phase2Trades.length} trades)
        </h3>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
          {phase2Trades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onModify={handleModify}
              isModified={!!modifications[trade.id]}
            />
          ))}
        </motion.div>
      </div>

      {/* Footer actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-between border-t border-shell-mid/40 pt-6"
      >
        <button className="text-xs text-text-tertiary hover:text-text-secondary transition-colors cursor-default opacity-50">
          Export to Trade Blotter
        </button>
        <div className="flex items-center gap-3">
          <button className="text-xs text-text-secondary border border-shell-mid hover:border-shell-light px-4 py-2 rounded-lg transition-colors">
            Submit for Senior Review ({recsData.summary.tradesRequiringSeniorApproval} trades)
          </button>
          <button
            onClick={onNext}
            className="bg-accent hover:bg-accent/85 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-opacity"
          >
            View Audit Trail →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
