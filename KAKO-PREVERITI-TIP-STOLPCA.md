# 🔍 Kako Preveriti Tip Stolpca v Supabase

## METODA 1: Preko Table Editor (NAJLAŽJE)

### Korak 1: Odpri Table Editor
1. V **Supabase Dashboard** klikni na **"Table Editor"** v levem meniju
2. Poišči tabelo **`cart_items`** in klikni nanjo

### Korak 2: Preveri stolpce
V tabeli boš videl stolpce. Poglej stolpec **`product_id`**:

**Kako razlikovati:**
- **BIGINT** = Veliko število (npr. 1, 2, 3, 100, 1000...)
- **UUID** = Dolga črkovno-številčna kombinacija (npr. `550e8400-e29b-41d4-a716-446655440000`)

### Korak 3: Preveri tip
- Če v stolpcu `product_id` vidš **številke** (1, 2, 3...) → **BIGINT** ✅
- Če v stolpcu `product_id` vidš **dolge črke in številke** (npr. `550e8400-...`) → **UUID** ❌

---

## METODA 2: Preko SQL Editor (NATANČNO)

### Korak 1: Odpri SQL Editor
1. V **Supabase Dashboard** klikni na **"SQL Editor"**
2. Klikni **"New Query"** ali **"+"** gumb

### Korak 2: Zaženi to SQL kodo
```sql
-- Preveri tip stolpca product_id
SELECT 
    column_name as "Stolpec",
    data_type as "Tip Podatka",
    is_nullable as "Lahko je NULL"
FROM information_schema.columns
WHERE table_name = 'cart_items'
  AND column_name = 'product_id';
```

### Korak 3: Preveri rezultat
V rezultatih boš videl:
- **Stolpec**: `product_id`
- **Tip Podatka**: 
  - Če piše **`bigint`** → Pravilno! ✅
  - Če piše **`uuid`** → Napačno, moraš izbrisati tabelo ❌

---

## METODA 3: Preko Schema Visualizer (VIDNO)

### Korak 1: Odpri Database
1. V **Supabase Dashboard** klikni na **"Database"**
2. Klikni na **"Schema Visualizer"** ali **"Tables"**

### Korak 2: Poišči tabelo
1. Poišči tabelo **`cart_items`**
2. Klikni na njo
3. V pregledu stolpcev boš videl:
   - **product_id** → **bigint** ali **uuid**

---

## 📊 PRIMERJAVA:

### ✅ PRAVILNO (BIGINT):
```
product_id: 1
product_id: 2  
product_id: 101
product_id: 202
```

### ❌ NAPAKA (UUID):
```
product_id: 550e8400-e29b-41d4-a716-446655440000
product_id: 7c9e6679-7425-40de-944b-e07fc1f90ae7
```

---

## 🎯 KAJ NAREDITI:

### Če je BIGINT:
✅ **NE izbriši tabele!**
- Samo zaženi `CART-ITEMS-SQL-FINAL.sql` (doda policies in indexe)

### Če je UUID:
❌ **Izbriši tabelo:**
```sql
DROP TABLE IF EXISTS cart_items CASCADE;
```
- Nato zaženi `CART-ITEMS-SQL-FINAL.sql`

---

## 💡 HITRA PREVERITEV:

1. **Table Editor** → **cart_items**
2. Poglej enega od vnosov (če obstaja)
3. V stolpcu `product_id`:
   - **Številka** (1, 2, 3...) = BIGINT ✅
   - **Dolga črkovno-številčna kombinacija** = UUID ❌

