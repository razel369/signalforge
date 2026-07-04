create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  paddle_customer_id text,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  paddle_subscription_id text unique,
  paddle_price_id text not null,
  status text not null,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_status_idx on subscriptions(status);

create table if not exists magic_links (
  email text not null,
  token text primary key,
  expires_at timestamptz not null,
  consumed boolean default false
);

create index if not exists magic_links_email_idx on magic_links(email);
create index if not exists magic_links_expires_at_idx on magic_links(expires_at);