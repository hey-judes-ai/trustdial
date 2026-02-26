import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import clientData from '../data/client.json';
import holdingsData from '../data/holdings.json';

const ALLOCATION_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b',
];

const ALLOCATION_LABELS = {
  usLargeCap: 'US Large Cap',
  intlDeveloped: "Int'l Developed",
  emergingMarkets: 'Emerging Markets',
  fixedIncome: 'Fixed Income',
  realEstate: 'Real Estate',
  alternatives: 'Alternatives',
  cash: 'Cash',
};

const pieData = Object.entries(holdingsData.allocation.current).map(
  ([key, val], i) => ({
    name: ALLOCATION_LABELS[key],
    value: val.pct,
    fill: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length],
  })
);

const driftData = holdingsData.drift.map((d) => ({
  name: d.assetClass,
  drift: d.drift,
  fill: d.drift > 0 ? '#ef4444' : d.status === 'critical' ? '#ef4444' : '#f59e0b',
}));

const FINDINGS = [
  'Portfolio is significantly overweight US large cap equities (+16.89% drift), driven by RSU vesting and tech appreciation.',
  'Fixed income allocation at 5.15% vs 28% target — critical underweight heading into rising rate environment.',
  'Tax-loss harvesting scan: 3 positions with unrealized losses, all in tax-advantaged accounts. No actionable opportunities.',
  `Portfolio beta: ${clientData.portfolioSummary.portfolioBeta} current → ${clientData.portfolioSummary.projectedBeta} projected post-rebalance.`,
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function PortfolioAnalysis({ onNext }) {
  const { client, ips, portfolioSummary } = clientData;

  return (
    <div className="max-w-[720px] mx-auto py-10 px-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={stagger} className="mb-8">
        <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
          <h2 className="font-serif text-2xl text-text-primary">Portfolio Analysis</h2>
          <span className="text-[10px] font-semibold text-status-blue bg-status-blue/10 px-2 py-0.5 rounded-full">
            Auto + Notify
          </span>
        </motion.div>
        <motion.p variants={fadeUp} className="text-sm text-text-tertiary">
          Claude analyzed the portfolio and notified the advisor of results.
        </motion.p>
      </motion.div>

      {/* Section A: IPS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-warm-white rounded-xl p-6 mb-6 border border-[#e8e6e1]"
      >
        <h3 className="font-serif text-lg text-[#1a1a1a] mb-4">
          Investment Policy Statement
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#888] text-xs uppercase tracking-wide font-semibold">Client</span>
            <p className="text-[#1a1a1a] mt-1">
              {client.primary.name} ({client.primary.age}) & {client.spouse.name} ({client.spouse.age})
            </p>
          </div>
          <div>
            <span className="text-[#888] text-xs uppercase tracking-wide font-semibold">Model</span>
            <p className="text-[#1a1a1a] mt-1">{ips.model}</p>
          </div>
          <div>
            <span className="text-[#888] text-xs uppercase tracking-wide font-semibold">Target Allocation</span>
            <p className="text-[#1a1a1a] mt-1">
              {ips.targetAllocation.equities}% Equities / {ips.targetAllocation.fixedIncome}% Fixed Income / {ips.targetAllocation.cash}% Cash
            </p>
          </div>
          <div>
            <span className="text-[#888] text-xs uppercase tracking-wide font-semibold">Risk Tolerance</span>
            <p className="text-[#1a1a1a] mt-1">{ips.riskTolerance}</p>
          </div>
          <div>
            <span className="text-[#888] text-xs uppercase tracking-wide font-semibold">Tax Sensitivity</span>
            <p className="text-[#1a1a1a] mt-1">{ips.taxSensitivity}</p>
          </div>
          <div>
            <span className="text-[#888] text-xs uppercase tracking-wide font-semibold">Next Review</span>
            <p className="text-[#1a1a1a] mt-1">{ips.nextReview}</p>
          </div>
          <div className="col-span-2">
            <span className="text-[#888] text-xs uppercase tracking-wide font-semibold">Constraints</span>
            <ul className="text-[#1a1a1a] mt-1 space-y-1">
              {ips.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">•</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Section B: Allocation + Drift */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-6"
      >
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total Value', value: `$${portfolioSummary.totalValue.toLocaleString()}` },
            { label: 'YTD Return', value: `+${portfolioSummary.ytdReturn}%` },
            { label: 'Accounts', value: portfolioSummary.totalAccounts },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-shell-darker border border-shell-mid/60 rounded-xl p-4 text-center"
            >
              <div className="text-xs text-text-tertiary mb-1">{stat.label}</div>
              <div className="text-xl font-semibold text-text-primary">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Donut chart */}
          <div className="bg-shell-darker border border-shell-mid/60 rounded-xl p-4">
            <h4 className="text-xs text-text-tertiary uppercase tracking-wide font-semibold mb-3">
              Current Allocation
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#111',
                    border: '1px solid #2d2d2d',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e5e5e5',
                  }}
                  formatter={(value) => `${value.toFixed(1)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
              {pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: d.fill }}
                  />
                  {d.name}
                </div>
              ))}
            </div>
          </div>

          {/* Drift chart */}
          <div className="bg-shell-darker border border-shell-mid/60 rounded-xl p-4">
            <h4 className="text-xs text-text-tertiary uppercase tracking-wide font-semibold mb-3">
              Drift from Target
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={driftData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis
                  type="number"
                  tick={{ fill: '#555', fontSize: 10 }}
                  domain={[-25, 20]}
                  tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#888', fontSize: 10 }}
                  width={80}
                />
                <ReferenceLine x={0} stroke="#2d2d2d" />
                <Tooltip
                  contentStyle={{
                    background: '#111',
                    border: '1px solid #2d2d2d',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e5e5e5',
                  }}
                  formatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`}
                />
                <Bar dataKey="drift" radius={[4, 4, 4, 4]}>
                  {driftData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.drift > 0 ? '#ef4444' : Math.abs(entry.drift) > 10 ? '#ef4444' : '#f59e0b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Section C: Key Findings */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-shell-darker border border-shell-mid/60 rounded-xl p-5 mb-8"
      >
        <h4 className="text-xs text-text-tertiary uppercase tracking-wide font-semibold mb-4">
          Key Findings
        </h4>
        <div className="space-y-3">
          {FINDINGS.map((finding, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed"
            >
              <span className="text-status-blue mt-1 shrink-0 text-xs">◆</span>
              {finding}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex justify-end"
      >
        <button
          onClick={onNext}
          className="bg-accent hover:bg-accent/85 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-opacity"
        >
          View Recommendations →
        </button>
      </motion.div>
    </div>
  );
}
