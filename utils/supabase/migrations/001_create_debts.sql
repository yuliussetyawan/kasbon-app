-- 001_create_debts.sql
-- Tabel utang piutang untuk aplikasi Kasbon

-- Enum type untuk tipe utang
CREATE TYPE debt_type AS ENUM ('owed_to_me', 'i_owe');

-- Tabel utang piutang
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type debt_type NOT NULL,
  counterpart_name TEXT NOT NULL CHECK (char_length(counterpart_name) <= 100),
  amount BIGINT NOT NULL CHECK (amount > 0),
  note TEXT CHECK (char_length(note) <= 200),
  due_date DATE,
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk query cepat berdasarkan user
CREATE INDEX idx_debts_user_id ON debts(user_id);
CREATE INDEX idx_debts_user_id_type ON debts(user_id, type);
CREATE INDEX idx_debts_user_id_settled ON debts(user_id, settled_at);

-- Enable Row Level Security
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya bisa baca data miliknya
CREATE POLICY "Users can view own debts"
  ON debts FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: User hanya bisa insert data miliknya
CREATE POLICY "Users can insert own debts"
  ON debts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa update data miliknya
CREATE POLICY "Users can update own debts"
  ON debts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya bisa hapus data miliknya
CREATE POLICY "Users can delete own debts"
  ON debts FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger function: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: pasang di tabel debts
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
