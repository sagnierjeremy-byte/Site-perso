-- Migration 001 — schema newsletter (broadcasts + events + scheduling)
-- Appliquée le 2026-05-05 sur projet Supabase npxvttwhrlrmwafpfudy

-- broadcasts : un envoi (draft, scheduled, sent...)
create table broadcasts (
  id text primary key,
  resend_id text unique,
  name text not null,
  subject text not null,
  html text not null,
  audience_ids text[] not null default '{}',
  merge_audience_id text,
  status text not null default 'draft',
  recipient_count int,
  scheduled_at timestamptz,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint broadcasts_status_check check (status in ('draft','scheduled','sending','sent','failed'))
);

create index broadcasts_status_idx on broadcasts(status);
create index broadcasts_created_at_idx on broadcasts(created_at desc);

-- broadcast_events : events webhook Resend (open, click, bounce, unsub...)
create table broadcast_events (
  id bigserial primary key,
  broadcast_id text references broadcasts(id) on delete cascade,
  resend_email_id text,
  email text not null,
  event_type text not null,
  link_url text,
  bounce_type text,
  user_agent text,
  ip text,
  occurred_at timestamptz not null,
  raw jsonb,
  created_at timestamptz not null default now()
);

create index broadcast_events_broadcast_idx on broadcast_events(broadcast_id);
create index broadcast_events_email_idx on broadcast_events(email);
create index broadcast_events_type_idx on broadcast_events(event_type);
create index broadcast_events_occurred_idx on broadcast_events(occurred_at desc);

-- scheduled_broadcasts : envois programmés (cron picks up)
create table scheduled_broadcasts (
  id bigserial primary key,
  broadcast_id text references broadcasts(id) on delete cascade not null,
  send_at timestamptz not null,
  sent boolean not null default false,
  sent_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create index scheduled_broadcasts_pending_idx on scheduled_broadcasts(send_at) where sent = false;

-- trigger updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_broadcasts_updated_at
  before update on broadcasts
  for each row execute function update_updated_at_column();

-- RLS on (service role only, pas de policy = anon bloqué = sécurisé)
alter table broadcasts enable row level security;
alter table broadcast_events enable row level security;
alter table scheduled_broadcasts enable row level security;
