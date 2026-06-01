'use client'
import { useState } from 'react'
import { Cat, SUBCATS, CAT_EMOJI } from '@/lib/types'
import { Entry } from '@/lib/types'

type NewEntry = Omit<Entry, 'id' | 'user_id' | 'created_at'>

export default function RecordTab({
  onAdd,
  userId,
}: {
  onAdd: (entry: NewEntry) => Promise<boolean>
  userId: string
}) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [cat, setCat] = useState<Cat | ''>('')
  const [subcat, setSubcat] = useState('')
  const [name, setName] = useState('')
  const [memo, setMemo] = useState('')
  const [valueAligned, setValueAligned] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleAdd() {
    if (!date || !amount || !cat || !name.trim()) {
      alert('날짜, 금액, 대분류, 내용을 입력해주세요.')
      return
    }
    setSaving(true)
    const ok = await onAdd({ date, amount: Number(amount), cat, subcat, name: name.trim(), memo, value_aligned: valueAligned })
    setSaving(false)
    if (ok) {
      setAmount('')
      setCat('')
      setSubcat('')
      setName('')
      setMemo('')
      setValueAligned(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <h2 className="text-sm font-medium text-gray-700 mb-4">새 항목 추가</h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">날짜</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">금액 (원)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">대분류</label>
          <select value={cat} onChange={e => { setCat(e.target.value as Cat); setSubcat('') }}>
            <option value="">선택하세요</option>
            <option value="income">💚 수입</option>
            <option value="fixed">🔵 고정비</option>
            <option value="variable">🟠 변동비</option>
            <option value="invest">🟣 투자</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">소분류</label>
          <select value={subcat} onChange={e => setSubcat(e.target.value)} disabled={!cat}>
            <option value="">선택하세요</option>
            {cat && SUBCATS[cat].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">내용</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="예: 스타벅스 아메리카노" />
      </div>

      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">메모 (선택)</label>
        <textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="메모를 입력하세요" rows={2} className="resize-none" />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer mb-4">
        <input type="checkbox" checked={valueAligned} onChange={e => setValueAligned(e.target.checked)} className="w-auto" />
        ✓ 내 가치관에 부합하는 소비였다
      </label>

      <div className="flex justify-end">
        <button
          onClick={handleAdd}
          disabled={saving}
          className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : success ? '✓ 저장됨' : '+ 기록 추가'}
        </button>
      </div>
    </div>
  )
}
