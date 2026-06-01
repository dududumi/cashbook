-- 가계부 항목 테이블
create table public.entries (
  id          bigserial primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  date        date not null,
  amount      numeric(12, 0) not null,
  cat         text not null check (cat in ('income','fixed','variable','invest')),
  subcat      text,
  name        text not null,
  memo        text,
  value_aligned boolean default false,
  created_at  timestamptz default now()
);

-- 모든 인증된 사용자가 전체 항목을 읽고 쓸 수 있음 (부부 공유)
alter table public.entries enable row level security;

create policy "authenticated users can read all entries"
  on public.entries for select
  to authenticated
  using (true);

create policy "authenticated users can insert"
  on public.entries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "authenticated users can update all entries"
  on public.entries for update
  to authenticated
  using (true);

create policy "authenticated users can delete all entries"
  on public.entries for delete
  to authenticated
  using (true);

-- 인덱스
create index entries_date_idx on public.entries (date desc);
create index entries_cat_idx on public.entries (cat);
