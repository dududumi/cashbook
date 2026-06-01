'use client'
import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { Entry, Cat, CAT_LABEL, CAT_EMOJI, CAT_COLOR, SUBCATS } from '@/lib/types'
import SummaryTab from './SummaryTab'
import RecordTab from './RecordTab'
import ListTab from './ListTab'
import CalendarTab from './CalendarTab'

type Tab = 'summary' | 'record' | 'list' | 'calendar'

export default function CashbookApp({ user }: { user: User }) {
  const supabase = createClient()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('summary')
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth()) // 0-indexed

  const fetchEntries = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('entries')
      .select('*')
      .order('date', { ascending: false })
    if (data) setEntries(data as Entry[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  async function addEntry(entry: Omit<Entry, 'id' | 'user_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('entries')
      .insert({ ...entry, user_id: user.id })
      .select()
      .single()
    if (!error && data) setEntries(prev => [data as Entry, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
    return !error
  }

  async function updateEntry(id: number, updates: Partial<Entry>) {
    const { error } = await supabase.from('entries').update(updates).eq('id', id)
    if (!error) setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
    return !error
  }

  async function deleteEntry(id: number) {
    const { error } = await supabase.from('entries').delete().eq('id', id)
    if (!error) setEntries(prev => prev.filter(e => e.id !== id))
    return !error
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const monthEntries = entries.filter(e => {
    const d = new Date(e.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  function changeMonth(delta: number) {
    let m = month + delta
    let y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0) { m = 11; y-- }
    setMonth(m)
    setYear(y)
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'summary', label: '월별 분석' },
    { id: 'record', label: '기록' },
    { id: 'list', label: '내역' },
    { id: 'calendar', label: '캘린더' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-xl font-medium text-gray-900">나만의 가계부</h1>
          <p className="text-sm text-gray-400 mt-0.5">가치관과 돈의 흐름을 기록합니다</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{user.email}</span>
          <button
            onClick={signOut}
            className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          ‹
        </button>
        <span className="text-base font-medium">{year}년 {month + 1}월</span>
        <button onClick={() => changeMonth(1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
          ›
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-5 gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? 'border-gray-800 text-gray-900 font-medium'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">불러오는 중...</div>
      ) : (
        <>
          {tab === 'summary' && <SummaryTab entries={entries} monthEntries={monthEntries} year={year} month={month} />}
          {tab === 'record' && <RecordTab onAdd={addEntry} userId={user.id} />}
          {tab === 'list' && <ListTab entries={entries} monthEntries={monthEntries} onUpdate={updateEntry} onDelete={deleteEntry} userId={user.id} />}
          {tab === 'calendar' && <CalendarTab monthEntries={monthEntries} year={year} month={month} />}
        </>
      )}
    </div>
  )
}
