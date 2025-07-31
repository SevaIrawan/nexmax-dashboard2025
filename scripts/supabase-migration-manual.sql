-- =====================================================
-- NEXMAX DASHBOARD MIGRATION SCRIPT
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'executive', 'operator', 'user')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Deposit Daily Table
CREATE TABLE IF NOT EXISTS deposit_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Withdraw Daily Table
CREATE TABLE IF NOT EXISTS withdraw_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Exchange Rate Table
CREATE TABLE IF NOT EXISTS exchange_rate (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  currency VARCHAR(3) NOT NULL,
  rate DECIMAL(10,4) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Headcount Department Table
CREATE TABLE IF NOT EXISTS headcountdep (
  id SERIAL PRIMARY KEY,
  department VARCHAR(50) NOT NULL,
  headcount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL,
  year INTEGER NOT NULL,
  month VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Member Report Daily Table
CREATE TABLE IF NOT EXISTS member_report_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  total_members INTEGER NOT NULL,
  active_members INTEGER NOT NULL,
  new_members INTEGER NOT NULL,
  churned_members INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Member Report Monthly Table
CREATE TABLE IF NOT EXISTS member_report_monthly (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  total_members INTEGER NOT NULL,
  active_members INTEGER NOT NULL,
  new_members INTEGER NOT NULL,
  churned_members INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create New Depositor Daily Table
CREATE TABLE IF NOT EXISTS new_depositor_daily (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  new_depositors INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_deposit_daily_date ON deposit_daily(date);
CREATE INDEX IF NOT EXISTS idx_withdraw_daily_date ON withdraw_daily(date);
CREATE INDEX IF NOT EXISTS idx_exchange_rate_date ON exchange_rate(date);
CREATE INDEX IF NOT EXISTS idx_member_report_daily_date ON member_report_daily(date);
CREATE INDEX IF NOT EXISTS idx_member_report_monthly_year_month ON member_report_monthly(year, month);
CREATE INDEX IF NOT EXISTS idx_new_depositor_daily_date ON new_depositor_daily(date);
CREATE INDEX IF NOT EXISTS idx_headcountdep_year_month ON headcountdep(year, month);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposit_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdraw_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rate ENABLE ROW LEVEL SECURITY;
ALTER TABLE headcountdep ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_report_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_report_monthly ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_depositor_daily ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

CREATE POLICY "Allow authenticated read" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON deposit_daily FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON withdraw_daily FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON exchange_rate FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON headcountdep FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON member_report_daily FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON member_report_monthly FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated read" ON new_depositor_daily FOR SELECT TO authenticated USING (true);

-- =====================================================
-- INSERT DEFAULT ADMIN USER
-- =====================================================

INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$12$hashed_password_here', 'admin')
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'deposit_daily', 'withdraw_daily', 'exchange_rate', 'headcountdep', 'member_report_daily', 'member_report_monthly', 'new_depositor_daily')
ORDER BY table_name;

-- Check if indexes were created
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'deposit_daily', 'withdraw_daily', 'exchange_rate', 'headcountdep', 'member_report_daily', 'member_report_monthly', 'new_depositor_daily')
ORDER BY tablename, indexname; 