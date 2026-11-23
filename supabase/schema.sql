-- ============================================================
-- Melfry Rent Car - Esquema de base de datos (Supabase / PostgreSQL)
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- VEHÍCULOS (flota)
-- ------------------------------------------------------------
create table if not exists public.vehicles (
  id           uuid primary key default gen_random_uuid(),
  brand        text not null,
  model        text not null,
  year         int,
  category     text not null default 'Sedán',
  transmission text default 'Automática',
  fuel         text default 'Gasolina',
  seats        int default 5,
  plate        text,
  daily_rate   numeric(12,2) not null default 0,
  weekly_rate  numeric(12,2),
  deposit      numeric(12,2) default 0,
  status       text not null default 'disponible', -- disponible | rentado | mantenimiento
  image_url    text,
  specs        text[] default '{}',
  featured     boolean default false,
  created_at   timestamptz default now()
);

-- ------------------------------------------------------------
-- CLIENTES
-- ------------------------------------------------------------
create table if not exists public.customers (
  id             uuid primary key default gen_random_uuid(),
  full_name      text not null,
  document_id    text,          -- cédula
  phone          text,
  email          text,
  address        text,
  license_number text,
  license_expiry date,
  notes          text,
  created_at     timestamptz default now()
);

-- ------------------------------------------------------------
-- RESERVAS / RENTAS
-- ------------------------------------------------------------
create table if not exists public.reservations (
  id              uuid primary key default gen_random_uuid(),
  vehicle_id      uuid references public.vehicles(id) on delete set null,
  customer_id     uuid references public.customers(id) on delete set null,
  start_date      date not null,
  end_date        date not null,
  days            int generated always as (greatest(end_date - start_date, 0)) stored,
  daily_rate      numeric(12,2) not null default 0,
  total           numeric(12,2) not null default 0,
  status          text not null default 'pendiente', -- pendiente | confirmada | activa | finalizada | cancelada
  pickup_location text,
  return_location text,
  notes           text,
  created_at      timestamptz default now()
);

-- ------------------------------------------------------------
-- PAGOS
-- ------------------------------------------------------------
create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.reservations(id) on delete cascade,
  amount         numeric(12,2) not null default 0,
  method         text not null default 'efectivo', -- efectivo | transferencia | tarjeta
  type           text not null default 'abono',    -- abono | total | reembolso
  reference      text,
  payment_date   date not null default current_date,
  notes          text,
  created_at     timestamptz default now()
);

-- ------------------------------------------------------------
-- ÍNDICES
-- ------------------------------------------------------------
create index if not exists idx_reservations_vehicle  on public.reservations(vehicle_id);
create index if not exists idx_reservations_customer on public.reservations(customer_id);
create index if not exists idx_reservations_status   on public.reservations(status);
create index if not exists idx_payments_reservation  on public.payments(reservation_id);

-- ------------------------------------------------------------
-- SEGURIDAD A NIVEL DE FILA (RLS)
-- Público (anon): solo lectura de la flota. Admin (authenticated): acceso total.
-- ------------------------------------------------------------
alter table public.vehicles     enable row level security;
alter table public.customers    enable row level security;
alter table public.reservations enable row level security;
alter table public.payments     enable row level security;

drop policy if exists "vehicles_public_read" on public.vehicles;
create policy "vehicles_public_read" on public.vehicles
  for select using (true);

drop policy if exists "vehicles_admin_all" on public.vehicles;
create policy "vehicles_admin_all" on public.vehicles
  for all to authenticated using (true) with check (true);

drop policy if exists "customers_admin_all" on public.customers;
create policy "customers_admin_all" on public.customers
  for all to authenticated using (true) with check (true);

drop policy if exists "reservations_admin_all" on public.reservations;
create policy "reservations_admin_all" on public.reservations
  for all to authenticated using (true) with check (true);

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all" on public.payments
  for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
-- DATOS INICIALES DE LA FLOTA (se insertan solo si la tabla está vacía)
-- ------------------------------------------------------------
do $$
begin
  if (select count(*) from public.vehicles) = 0 then
    insert into public.vehicles
      (brand, model, year, category, transmission, fuel, seats, daily_rate, weekly_rate, deposit, status, image_url, specs, featured)
    values
      ('Toyota', 'Corolla', 2022, 'Sedán', 'Automática', 'Gasolina', 5, 3500, 21000, 5000, 'disponible',
       'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
       ARRAY['Aire acondicionado', 'Bluetooth', 'Cámara de reversa', 'Excelente consumo'], true),
      ('Hyundai', 'Tucson', 2023, 'SUV', 'Automática', 'Gasolina', 5, 5200, 31000, 8000, 'disponible',
       'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
       ARRAY['7 pasajeros opcional', 'Pantalla táctil', 'Control crucero', 'Maletero amplio'], true),
      ('Kia', 'Rio', 2021, 'Compacto', 'Automática', 'Gasolina', 5, 2800, 17000, 4000, 'disponible',
       'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
       ARRAY['Sistema Eco', 'Aire digital', 'Cristales eléctricos', 'Bajo consumo'], true),
      ('Honda', 'CR-V', 2022, 'SUV', 'Automática', 'Gasolina', 5, 5500, 33000, 8000, 'disponible',
       'https://images.pexels.com/photos/6732612/pexels-photo-6732612.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
       ARRAY['Cuero', 'Techo panorámico', 'Cámara 360°', 'Sensores de parqueo'], false),
      ('Mercedes-Benz', 'C-Class', 2021, 'Sedán', 'Automática', 'Gasolina', 5, 7500, 45000, 12000, 'disponible',
       'https://images.pexels.com/photos/3894049/pexels-photo-3894049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
       ARRAY['Interior de lujo', 'Navegación GPS', 'Asientos eléctricos', 'Sonido premium'], true),
      ('Tesla', 'Model 3', 2023, 'Eléctrico', 'Automática', 'Eléctrico', 5, 9000, 54000, 15000, 'mantenimiento',
       'https://images.pexels.com/photos/1280560/pexels-photo-1280560.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
       ARRAY['Autonomía 420 km', 'Carga rápida', 'Autopilot', 'Cero emisiones'], false);
  end if;
end $$;
