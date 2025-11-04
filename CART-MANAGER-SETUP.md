# 🛒 Cart Manager Setup Guide - Supabase Integracija

## ✅ Kaj je bilo narejeno

CartManager je sedaj integriran v `script.js`. Košarica se sinhronizira z Supabase, ko je uporabnik prijavljen.

## 📋 KORAKI ZA NASTAVITEV

### KORAK 1: Preveri Supabase Schema

1. Odpri **Supabase Dashboard** → **SQL Editor**
2. Preveri, ali tabela `cart_items` obstaja:
   - Pojdi v **Table Editor**
   - Preveri, ali vidite tabelo `cart_items`

3. Če tabela ne obstaja, zaženi SQL iz `supabase-schema.sql`:
   ```sql
   -- Create cart_items table (košarica po uporabniku)
   CREATE TABLE IF NOT EXISTS cart_items (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
       product_id UUID REFERENCES products(id) ON DELETE CASCADE,
       quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       UNIQUE(user_id, product_id)
   );
   
   -- Enable RLS
   ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
   
   -- Cart items policies
   CREATE POLICY "Users can view their own cart" ON cart_items
       FOR SELECT USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can insert into their own cart" ON cart_items
       FOR INSERT WITH CHECK (auth.uid() = user_id);
   
   CREATE POLICY "Users can update their own cart" ON cart_items
       FOR UPDATE USING (auth.uid() = user_id);
   
   CREATE POLICY "Users can delete from their own cart" ON cart_items
       FOR DELETE USING (auth.uid() = user_id);
   
   -- Create indexes for better performance
   CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
   CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
   ```

### KORAK 2: Preveri, da so produkti v Supabase

⚠️ **POMEMBNO**: CartManager deluje z UUID produkti iz Supabase tabele `products`.

1. Preveri v **Table Editor** → **products**:
   - Ali obstajajo produkti?
   - Ali imajo vsi produkti UUID ID-je?

2. Če produkti še niso v Supabase, jih lahko:
   - Dodate ročno v Table Editor
   - Ali uporabite SQL iz `supabase-schema.sql` (vrstice 189-195)

### KORAK 3: Testiranje

#### Test 1: Neprijavljen uporabnik
1. Odpri stran kot gost
2. Dodaj produkt v košarico
3. Preveri Console (F12) → Košarica se shrani v localStorage
4. Osveži stran → Košarica ostane

#### Test 2: Prijava in migracija
1. Prijavi se z obstoječim računom
2. Preveri Console → Naj bi se izpisalo:
   ```
   CartManager initialized successfully
   Migrating localStorage cart to Supabase...
   Migration complete. localStorage cleared.
   ```
3. Preveri v Supabase → **Table Editor** → **cart_items** → Košarica bi morala biti shranjena

#### Test 3: Prijavljen uporabnik
1. Prijavi se
2. Dodaj produkt v košarico
3. Preveri Console → `added to cart via CartManager`
4. Preveri v Supabase → **cart_items** tabela → Produkt bi moral biti shranjen

#### Test 4: Odjava
1. Odjavi se
2. Košarica se počisti na frontendu
3. V Supabase ostane shranjena (za prihodnjo prijavo)

#### Test 5: Ponovna prijava
1. Prijavi se ponovno
2. Košarica se naloži iz Supabase
3. Produkti bi morali biti v košarici

## 🔧 Troubleshooting

### Problem: "CartManager is not defined"
**Rešitev:**
- Preveri, da je `<script src="cart-manager.js"></script>` v `index.html` PRED `<script src="script.js">`
- Osveži brskalnik (Ctrl+F5)

### Problem: "Cannot read property 'from' of undefined"
**Rešitev:**
- Preveri, da je Supabase client inicializiran
- Preveri Supabase URL in ANON KEY v `index.html`

### Problem: "Product not found" pri dodajanju v košarico
**Rešitev:**
- Produkti morajo biti v Supabase tabeli `products`
- Produkti morajo imeti UUID ID-je (ne integer)

### Problem: Košarica se ne migrira v Supabase
**Rešitev:**
1. Odpri Console (F12) in preveri napake
2. Preveri RLS policies v Supabase → **Authentication** → **Policies**
3. Preveri, da je uporabnik prijavljen
4. Preveri, da je `cart_items` tabela ustvarjena

### Problem: "Users can view their own cart" policy error
**Rešitev:**
- Preveri, da so vse RLS policies ustvarjene
- Preveri, da je RLS omogočen na `cart_items` tabeli

## 📊 Kako deluje

```
┌─────────────────┐
│   UPORABNIK     │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Frontend │ (index.html + script.js)
    └────┬─────┘
         │
    ┌────▼──────────┐
    │ CartManager   │ (cart-manager.js)
    └────┬──────────┘
         │
         ├─── localStorage (če ni prijavljen)
         │
         └─── Supabase (če je prijavljen)
                 │
                 └─── cart_items tabela
```

## ✅ Checklist

- [ ] Supabase `cart_items` tabela ustvarjena
- [ ] RLS policies nastavljene
- [ ] Indexi ustvarjeni
- [ ] Produkti v Supabase tabeli `products`
- [ ] Testiran: Neprijavljen uporabnik → localStorage
- [ ] Testiran: Prijava → migracija v Supabase
- [ ] Testiran: Prijavljen uporabnik → Supabase
- [ ] Testiran: Odjava → počisti frontend
- [ ] Testiran: Ponovna prijava → naloži iz Supabase

## 🎯 Naslednji koraki

Po uspešni integraciji CartManagerja:
1. Dodaj produkcijske slike
2. Optimiziraj performance
3. Dodaj Admin panel
4. Implementiraj shranjevanje naročil

