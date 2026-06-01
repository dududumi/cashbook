'use client'
import { Entry, Cat, CAT_LABEL, CAT_COLOR } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'

function fmt(n: number) {
  return '₩' + Math.round(n).toLocaleString('ko-KR')
}

export default function SummaryTab({
  entries,
  monthEntries,
  year,
  month,
}: {
  entries: Entry[]
  monthEntries: Entry[]
  year: number
  month: number
}) {
  const income = monthEntries.filter(e => e.cat === 'income').reduce((s, e) => s + e.amount, 0)
  const expense = monthEntries.filter(e => e.cat !== 'income' && e.cat !== 'invest').reduce((s, e) => s + e.amount, 0)
  const invest = monthEntries.filter(e => e.cat === 'invest').reduce((s, e) => s + e.amount, 0)
  const net = income - expense - invest

  // Category breakdown for pie
  const subcatMap: Record<string, number> = {}
  monthEntries.filter(e => e.cat !== 'income').forEach(e => {
    const k = e.subcat || CAT_LABEL[e.cat]
    subcatMap[k] = (subcatMap[k] || 0) + e.amount
  })
  const pieData = Object.entries(subcatMap).map(([name, value]) => ({ name, value }))
  const palette = ['#185FA5','#D85A30','#534AB7','#1D9E75','#BA7517','#A32D2D','#3B6D11','#993C1D']

  // 6-month trend
  const trendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(year, month - 5 + i, 1)
    const y = d.getFullYear(), m = d.getMonth()
    const me = entries.filter(e => { const dt = new Date(e.date); return dt.getFullYear() === y && dt.getMonth() === m })
    return {
      label: `${m + 1}월`,
      수입: me.filter(e => e.cat === 'income').reduce((s, e) => s + e.amount, 0),
      지출: me.filter(e => e.cat !== 'income').reduce((s, e) => s + e.amount, 0),
    }
  })

  return (
    <div className="space-y-3">
      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2.5">
        {[
          { label: '수입', value: income, color: '#1D9E75' },
          { label: '지출', value: expense, color: '#D85A30' },
          { label: '투자', value: invest, color: '#534AB7' },
        ].map(m => (
          <div key={m.label} className="bg-gray-50 rounded-xl p-3">
            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
            <div className="text-lg font-medium" style={{ color: m.color }}>{fmt(m.value)}</div>
          </div>
        ))}
      </div>

      {/* Net */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="text-xs text-gray-400 mb-1">이번 달 순수지</div>
        <div className="text-2xl font-medium" style={{ color: net >= 0 ? '#1D9E75' : '#D85A30' }}>
          {net >= 0 ? '+' : ''}{fmt(net)}
        </div>
      </div>

      {/* Pie */}
      {pieData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <div className="text-sm font-medium text-gray-700 mb-3">카테고리별 지출</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="40%" outerRadius={75} label={false}>
                {pieData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
              </Pie>
              <Legend layout="vertical" align="right" verticalAlign="middle" iconSize={10}
                formatter={(v: string) => <span style={{ fontSize: 11 }}>{v}</span>} />
              <Tooltip formatter={(v: number) => fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bar trend */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="text-sm font-medium text-gray-700 mb-3">월별 추이 (최근 6개월)</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={trendData} barSize={14}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 10000).toFixed(0)}만`} width={40} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Legend iconSize={10} formatter={(v: string) => <span style={{ fontSize: 11 }}>{v}</span>} />
            <Bar dataKey="수입" fill="#1D9E75" radius={[3, 3, 0, 0]} />
            <Bar dataKey="지출" fill="#D85A30" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
