create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nickname text not null default '투자자',
  cash bigint not null default 10000000 check (cash >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stock_code text not null,
  stock_name text not null,
  quantity integer not null check (quantity > 0),
  average_price bigint not null check (average_price > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, stock_code)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stock_code text not null,
  stock_name text not null,
  type text not null check (type in ('BUY', 'SELL')),
  quantity integer not null check (quantity > 0),
  price bigint not null check (price > 0),
  total_amount bigint not null check (total_amount > 0),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.holdings enable row level security;
alter table public.transactions enable row level security;

create policy "profiles own data" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "holdings own data" on public.holdings for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "transactions own data" on public.transactions for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, nickname) values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'nickname', '투자자')) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
