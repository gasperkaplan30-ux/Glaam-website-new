-- 🔍 PREVERI STRUKTURO OBSTOJEČE TABELE cart_items
-- Zaženi to v Supabase SQL Editor, da vidiš trenutno strukturo

-- Preveri strukturo tabele
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'cart_items'
ORDER BY ordinal_position;

-- Preveri constraints
SELECT 
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'cart_items';

-- Preveri indexe
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'cart_items';

