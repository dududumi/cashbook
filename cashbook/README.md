# 나만의 가계부

Next.js + Supabase 기반 부부 공유 가계부

---

## 1. Supabase 프로젝트 생성

1. https://supabase.com 에서 새 프로젝트 생성
2. **SQL Editor** → `supabase/migrations/001_init.sql` 내용 전체 실행
3. **Authentication → URL Configuration** 에서 Site URL 설정:
   - 로컬 개발: `http://localhost:3000`
   - 배포 후: `https://your-domain.vercel.app`
4. Project Settings → API 에서 아래 두 값 복사:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. 로컬 개발

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Supabase URL, ANON KEY 입력

# 개발 서버 실행
npm run dev
# → http://localhost:3000
```

---

## 3. Vercel 배포 (무료)

```bash
npm install -g vercel
vercel
```

또는 GitHub에 푸시 후 vercel.com에서 import → 환경변수 입력 → 자동 배포

환경변수 두 개를 Vercel 대시보드에도 동일하게 입력:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. 아내와 공유하기

1. 배포된 URL을 공유
2. 각자 회원가입 (이메일 인증)
3. **두 계정 모두 같은 DB를 읽고 씁니다** (RLS 정책: 인증된 유저는 전체 조회 가능)
4. 단, 수정/삭제는 본인이 입력한 항목만 가능 (user_id 기반)

---

## 5. 기능 목록

- 항목 추가 / 수정 / 삭제
- 대분류 (수입 / 고정비 / 변동비 / 투자) + 소분류
- 가치관 부합 여부 체크
- 월별 분석 (수입/지출/투자/순수지)
- 카테고리별 도넛 차트 + 6개월 추이 막대 차트
- 캘린더 뷰 (날짜별 색점 + 금액)
- CSV 내보내기
- 이메일 로그인 / 로그아웃

---

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프론트엔드 | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS + Recharts |
| 인증 | Supabase Auth |
| DB | Supabase (PostgreSQL) |
| 배포 | Vercel |
