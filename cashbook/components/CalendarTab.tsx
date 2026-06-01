'use client'
import { Entry, Cat, CAT_COLOR } from '@/lib/types'

export default function CalendarTab({
  monthEntries,
  year,
  month,
}: {
  monthEntries: Entry[]
  year: number
  month: number
}) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const dayMap: Record<string, Entry[]> = {}
  monthEntries.forEach(e => {
    if (!dayMap[e.date]) dayMap[e.date] = []
    dayMap[e.date].push(e)
  })

  const days = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {days.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="min-h-[58px]" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const items = dayMap[dateStr] || []
          const isToday = dateStr === todayStr
          const net = items.reduce((s, e) => s + (e.cat === 'income' ? e.amount : -e.amount), 0)

          return (
            <div
              key={d}
              className={`min-h-[58px] p-1.5 rounded-lg border text-xs ${
                isToday ? 'border-emerald-400 border-[1.5px]' : 'border-gray-100'
              }`}
            >
              <div className={`font-medium mb-1 ${isToday ? 'text-emerald-600' : 'text-gray-700'}`}>{d}</div>
              <div className="flex flex-wrap gap-0.5">
                {items.slice(0, 4).map((e, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: CAT_COLOR[e.cat] }} />
                ))}
              </div>
              {items.length > 0 && (
                <div className="mt-1 text-[10px]" style={{ color: net >= 0 ? '#1D9E75' : '#D85A30' }}>
                  {net >= 0 ? '+' : ''}{(Math.abs(net) / 10000).toFixed(1)}만
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
