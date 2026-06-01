'use client'
import { useState } from 'react'
import { Entry, Cat, CAT_LABEL, CAT_EMOJI, CAT_COLOR, SUBCATS } from '@/lib/types'

function fmt(n: number) { return '₩' + Math.round(n).toLocaleString('ko-KR') }

const BADGE: Record<Cat, string> = {
  income: 'bg-emerald-50 text-emerald-800',
  fixed: 'bg-blue-50 text-blue-800',
  variable: 'bg-orange-50 text-orange-800',
  invest: 'bg-purple-50 text-purple-800',
}

export default function ListTab({
  entries,
  monthEntries,
  onUpdate,
  onDelete,
  userId,
}: {
  entries: Entry[]
  monthEntries: Entry[]
  onUpdate: (id: number, updates: Partial<Entry>) => Promise<boolean>
  onDelete: (id: number) => Promise<boolean>
  userId: string
}) {
  const [period, setPeriod] = useState<'month' | 'all'>('month')
  const [catFilter, setCatFilter] = useState<Cat | ''>('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState<Partial<Entry>>({})
  const [saving, setSaving] = useState(false)

  const base = period === 'month' ? monthEntries : entries
  const items = catFilter ? base.filter(e => e.cat === catFilter) : base

  function openEdit(e: Entry) {
    setEditId(e.id)
    setEditForm({ date: e.date, amount: e.amount, cat: e.cat, subcat: e.subcat, name: e.name, memo: e.memo, value_aligned: e.value_aligned })
  }

  async function saveEdit() {
    if (!editId) return
    setSaving(true)
    await onUpdate(editId, editForm)
    setSaving(false)
    setEditId(null)
  }

  function exportCSV() {
    const header = '날짜,내용,대분류,소분류,금액,메모,가치관부합\n'
    const rows = items.map(e =>
      `${e.date},${e.name},${CAT_LABEL[e.cat]},${e.subcat || ''},${e.amount},${e.memo || ''},${e.value_aligned ? 'Y' : 'N'}`
    ).join('\n')
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `가계부.csv`
    a.click()
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <select value={period} onChange={e => setPeriod(e.target.value as any)} className="w-auto py-1.5 px-2.5 text-xs">
          <option value="month">이번 달</option>
          <option value="all">전체 기간</option>
        </select>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value as any)} className="w-auto py-1.5 px-2.5 text-xs">
          <option value="">전체</option>
          <option value="income">💚 수입</option>
          <option value="fixed">🔵 고정비</option>
          <option value="variable">🟠 변동비</option>
          <option value="invest">🟣 투자</option>
        </select>
        <button onClick={exportCSV} className="ml-auto text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
          CSV 내보내기
        </button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">내역이 없습니다</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
          {items.map(e => (
            <div key={e.id} className="flex items-center gap-3 px-4 py-3">
              <div className="text-xs text-gray-400 w-12 shrink-0">{e.date.slice(5)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {e.name}
                  {e.value_aligned && <span className="ml-1 text-xs text-emerald-500">✓</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${BADGE[e.cat]}`}>
                    {CAT_EMOJI[e.cat]} {CAT_LABEL[e.cat]}
                  </span>
                  {e.subcat && <span className="text-xs text-gray-400">{e.subcat}</span>}
                  {e.memo && <span className="text-xs text-gray-400 truncate">{e.memo}</span>}
                  {e.user_id === userId
                    ? <span className="text-xs text-gray-300">나</span>
                    : <span className="text-xs text-indigo-400">아내</span>
                  }
                </div>
              </div>
              <div className="text-sm font-medium shrink-0" style={{ color: e.cat === 'income' ? '#1D9E75' : e.cat === 'invest' ? '#534AB7' : '#D85A30' }}>
                {e.cat === 'income' ? '+' : ''}{fmt(e.amount)}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(e)} className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-1.5 py-1 hover:bg-gray-50">수정</button>
                <button onClick={() => { if (confirm('삭제하시겠습니까?')) onDelete(e.id) }} className="text-xs text-red-400 hover:text-red-600 border border-red-100 rounded px-1.5 py-1 hover:bg-red-50">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            <h3 className="text-base font-medium mb-4">항목 수정</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">날짜</label>
                <input type="date" value={editForm.date || ''} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">금액</label>
                <input type="number" value={editForm.amount || ''} onChange={e => setEditForm(f => ({ ...f, amount: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">대분류</label>
                <select value={editForm.cat || ''} onChange={e => setEditForm(f => ({ ...f, cat: e.target.value as Cat, subcat: '' }))}>
                  <option value="income">💚 수입</option>
                  <option value="fixed">🔵 고정비</option>
                  <option value="variable">🟠 변동비</option>
                  <option value="invest">🟣 투자</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">소분류</label>
                <select value={editForm.subcat || ''} onChange={e => setEditForm(f => ({ ...f, subcat: e.target.value }))}>
                  <option value="">선택</option>
                  {editForm.cat && SUBCATS[editForm.cat].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">내용</label>
              <input type="text" value={editForm.name || ''} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="mb-3">
              <label className="block text-xs text-gray-500 mb-1">메모</label>
              <textarea value={editForm.memo || ''} onChange={e => setEditForm(f => ({ ...f, memo: e.target.value }))} rows={2} className="resize-none" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer mb-5">
              <input type="checkbox" checked={editForm.value_aligned || false} onChange={e => setEditForm(f => ({ ...f, value_aligned: e.target.checked }))} className="w-auto" />
              ✓ 내 가치관에 부합하는 소비였다
            </label>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={saveEdit} disabled={saving} className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
