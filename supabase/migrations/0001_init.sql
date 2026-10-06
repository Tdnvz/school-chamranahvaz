-- ============================================================
-- Chamran Ahvaz School — Supabase schema
-- طراحی برای تحمل ۲۰۰۰ کاربر همزمان
-- اجرا: Supabase Dashboard → SQL Editor یا supabase db push
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- جدول کلاس‌ها ----------
create table if not exists public.classes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  -- پایهٔ مشخص: e1…e6 (ابتدایی), f7…f9 (متوسطهٔ اول), s10…s12 (متوسطهٔ دوم)
  grade       text not null check (grade in
                ('e1','e2','e3','e4','e5','e6','f7','f8','f9','s10','s11','s12')),
  -- شمارهٔ کلاس داخل پایه (پایهٔ اول کلاس ۲)
  class_no    int  not null default 1 check (class_no between 1 and 12),
  -- رشته فقط برای متوسطهٔ دوم (ریاضی ۱ دهم، تجربی ۲ یازدهم)
  track       text,
  gender      text not null check (gender in ('boys','girls')),
  subdomain   text not null,
  capacity    int  not null default 25 check (capacity between 1 and 100),
  teacher_id  uuid references public.teachers(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- جدول معلمین ----------
create table if not exists public.teachers (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  subject      text not null,
  title        text not null default 'معلم پایه',
  bio          text not null default '',
  image_url    text,
  subdomain    text not null,
  email        text not null,
  phone        text not null,
  availability text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (subdomain, email)
);

-- رابط معلم ← کلاس (تعریف بعدی برای حل ترتیب جدول‌ها)
alter table public.classes
  drop constraint if exists classes_teacher_id_fkey;
alter table public.classes
  add constraint classes_teacher_id_fkey
  foreign key (teacher_id) references public.teachers(id) on delete set null;

-- ---------- ایندکس‌ها (کلید اصلی پرفورمنس) ----------
create index if not exists idx_classes_subdomain        on public.classes (subdomain);
create index if not exists idx_classes_subdomain_grade  on public.classes (subdomain, grade);
create index if not exists idx_classes_subdomain_search on public.classes (subdomain, name text_pattern_ops);
create index if not exists idx_teachers_subdomain       on public.teachers (subdomain);
create index if not exists idx_teachers_subject         on public.teachers (subdomain, subject);
create index if not exists idx_teachers_name            on public.teachers (subdomain, name text_pattern_ops);

-- ---------- به‌روزرسانی خودکار updated_at ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_classes_updated on public.classes;
create trigger trg_classes_updated before update on public.classes
  for each row execute function public.set_updated_at();

drop trigger if exists trg_teachers_updated on public.teachers;
create trigger trg_teachers_updated before update on public.teachers
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
alter table public.classes enable row level security;
alter table public.teachers enable row level security;

drop policy if exists "public read classes" on public.classes;
create policy "public read classes" on public.classes
  for select using (true);

drop policy if exists "public read teachers" on public.teachers;
create policy "public read teachers" on public.teachers
  for select using (true);

-- نوشتن فقط با سرویس‌کلید (SERVICE_ROLE) — پنل مدیریت
drop policy if exists "service write classes" on public.classes;
create policy "service write classes" on public.classes
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

drop policy if exists "service write teachers" on public.teachers;
create policy "service write teachers" on public.teachers
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.classes;
alter publication supabase_realtime add table public.teachers;

-- ---------- تنظیمات مقیاس‌پذیری ----------
-- حداکثر اتصال همزمان برای پلن Pro (۲۰۰۰ کاربر همزمان):
-- Database → Settings → Connection pooling → Transaction mode (پورت 6543)
alter database postgres set idle_in_transaction_session_timeout = '30s';
alter database postgres set statement_timeout = '15s';

-- ---------- دادهٔ نمونه ----------
insert into public.teachers (name, subject, title, bio, subdomain, email, phone, availability) values
 ('علی محمدی','ریاضی','معلم پایه','معلم باسابقهٔ ریاضی مدارس چمران.','ghjs','t1@chamranahvaz.ir','09121111111','شنبه تا چهارشنبه ۸ تا ۱۴'),
 ('زهرا احمدی','ادبیات فارسی','معلم پایه','معلم ادبیات فارسی با تجربه.','dtga','t2@chamranahvaz.ir','09122222222','شنبه تا چهارشنبه ۸ تا ۱۴'),
 ('حسین کریمی','علوم تجربی','معلم پایه','معلم علوم تجربی متوسطهٔ اول.','avel','t3@chamranahvaz.ir','09123333333','شنبه تا چهارشنبه ۸ تا ۱۳'),
 ('مریم رضایی','عربی','معلم پایه','معلم عربی متوسطهٔ اول.','avvdy','t4@chamranahvaz.ir','09124444444','شنبه تا چهارشنبه ۸ تا ۱۳'),
 ('اکبر نوری','زبان انگلیسی','معلم پایه','مدرس زبان انگلیسی متوسطهٔ دوم.','otv2','t5@chamranahvaz.ir','09125555555','شنبه تا چهارشنبه ۹ تا ۱۴'),
 ('فاطمه صادقی','مطالعات اجتماعی','معلم پایه','معلم مطالعات اجتماعی متوسطهٔ دوم.','ovyi','t6@chamranahvaz.ir','09126666666','شنبه تا چهارشنبه ۹ تا ۱۴')
on conflict do nothing;

insert into public.classes (name, grade, class_no, track, gender, subdomain, capacity) values
 -- دبستان پسرانه: ۶ پایه، شماره‌های متفاوت
 ('پایهٔ اول کلاس ۱','e1',1,null,'boys','ghjs',25),
 ('پایهٔ اول کلاس ۲','e1',2,null,'boys','ghjs',25),
 ('پایهٔ دوم کلاس ۱','e2',1,null,'boys','ghjs',28),
 ('پایهٔ سوم کلاس ۱','e3',1,null,'boys','ghjs',28),
 ('پایهٔ چهارم کلاس ۱','e4',1,null,'boys','ghjs',30),
 ('پایهٔ پنجم کلاس ۱','e5',1,null,'boys','ghjs',30),
 ('پایهٔ ششم کلاس ۱','e6',1,null,'boys','ghjs',30),
 -- دبستان دخترانه (جدا از پسرانه)
 ('پایهٔ اول کلاس ۱','e1',1,null,'girls','dtga',25),
 ('پایهٔ دوم کلاس ۱','e2',1,null,'girls','dtga',25),
 ('پایهٔ سوم کلاس ۱','e3',1,null,'girls','dtga',28),
 ('پایهٔ ششم کلاس ۱','e6',1,null,'girls','dtga',30),
 -- متوسطهٔ اول پسرانه: هفتم تا نهم
 ('پایهٔ هفتم کلاس ۱','f7',1,null,'boys','avel',30),
 ('پایهٔ هشتم کلاس ۱','f8',1,null,'boys','avel',30),
 ('پایهٔ نهم کلاس ۱','f9',1,null,'boys','avel',28),
 ('پایهٔ نهم کلاس ۲','f9',2,null,'boys','avel',28),
 -- متوسطهٔ اول دخترانه
 ('پایهٔ هفتم کلاس ۱','f7',1,null,'girls','avvdy',30),
 ('پایهٔ نهم کلاس ۱','f9',1,null,'girls','avvdy',30),
 -- متوسطهٔ دوم پسرانه: پایه + رشته
 ('ریاضی ۱ — پایهٔ دهم','s10',1,'ریاضی','boys','otv2',30),
 ('تجربی ۱ — پایهٔ دهم','s10',1,'تجربی','boys','otv2',30),
 ('تجربی ۲ — پایهٔ یازدهم','s11',2,'تجربی','boys','otv2',30),
 ('ریاضی ۲ — پایهٔ دوازدهم','s12',2,'ریاضی','boys','otv2',28),
 -- متوسطهٔ دوم دخترانه
 ('ریاضی ۱ — پایهٔ دهم','s10',1,'ریاضی','girls','ovyi',30),
 ('تجربی ۱ — پایهٔ یازدهم','s11',1,'تجربی','girls','ovyi',30)
on conflict do nothing;
