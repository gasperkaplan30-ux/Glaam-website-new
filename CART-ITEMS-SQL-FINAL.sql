-- ✅ FINALNA SQL KODA ZA cart_items TABELO
-- To je optimizirana verzija, ki deluje z BIGINT product_id

-- 1. Ustvari cart_items tabelo (če še ni)
CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL, -- BIGINT za integer ID-je iz script.js
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id) -- Prepreči dvojne vnose
);

-- 2. Omogoči Row Level Security (RLS)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies - Uporabniki vidijo samo svojo košarico
-- Najprej izbriši stare policies (če obstajajo), nato ustvari nove
DROP POLICY IF EXISTS "Users can view their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can insert into their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can update their own cart" ON cart_items;
DROP POLICY IF EXISTS "Users can delete from their own cart" ON cart_items;

-- Sedaj ustvari nove policies
CREATE POLICY "Users can view their own cart" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- 4. Indexi za hitrejše iskanje (IF NOT EXISTS že vključen)
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- 5. Trigger za avtomatično posodabljanje updated_at
CREATE OR REPLACE FUNCTION update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Najprej izbriši trigger, če obstaja
DROP TRIGGER IF EXISTS cart_items_updated_at_trigger ON cart_items;

-- Sedaj ustvari nov trigger
CREATE TRIGGER cart_items_updated_at_trigger
    BEFORE UPDATE ON cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_cart_items_updated_at();

-- ✅ KONEC - Tabela je pripravljena!

