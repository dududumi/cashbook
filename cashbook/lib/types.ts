export type Cat = 'income' | 'fixed' | 'variable' | 'invest'

export interface Entry {
  id: number
  user_id: string
  date: string        // 'YYYY-MM-DD'
  amount: number
  cat: Cat
  subcat: string
  name: string
  memo: string
  value_aligned: boolean
  created_at: string
}

export const CAT_LABEL: Record<Cat, string> = {
  income: '수입',
  fixed: '고정비',
  variable: '변동비',
  invest: '투자',
}

export const CAT_EMOJI: Record<Cat, string> = {
  income: '💚',
  fixed: '🔵',
  variable: '🟠',
  invest: '🟣',
}

export const CAT_COLOR: Record<Cat, string> = {
  income: '#1D9E75',
  fixed: '#185FA5',
  variable: '#D85A30',
  invest: '#534AB7',
}

export const SUBCATS: Record<Cat, string[]> = {
  income: ['월급', '부업', '이자', '배당', '기타수입'],
  fixed: ['월세/전세', '관리비', '보험료', '구독서비스', '통신비', '교통정기권', '대출이자', '기타고정비'],
  variable: ['식비', '카페', '쇼핑', '여가', '의료', '미용', '교통', '외식', '경조사', '기타변동비'],
  invest: ['주식', 'ETF', '펀드', '부동산', '적금', '코인', '기타투자'],
}
