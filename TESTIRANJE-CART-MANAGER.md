# 🧪 Testiranje Cart Manager Integracije

## ✅ KAJ JE BILO NAREJENO
- ✅ Supabase tabela `cart_items` ustvarjena
- ✅ RLS policies nastavljene
- ✅ Indexi ustvarjeni
- ✅ Trigger za `updated_at` nastavljen
- ✅ CartManager integriran v `script.js`

## 🧪 KORAKI ZA TESTIRANJE

### TEST 1: Neprijavljen uporabnik (localStorage)

1. **Odpri spletno stran** v brskalniku
2. **Odpri Developer Console** (F12)
3. **Ne prijavljaj se** - ostani kot gost
4. **Dodaj produkt** v košarico (klikni "Dodaj v košarico")
5. **Preveri Console** - naj bi videl:
   ```
   Product X dodan v košarico!
   Product X (qty: 1) added to cart locally.
   ```
6. **Osveži stran** (F5) → Produkt bi moral ostati v košarici ✅

---

### TEST 2: Prijava in migracija v Supabase

1. **Prijavi se** z obstoječim računom (če imaš produkt v košarici iz TEST 1)
2. **Preveri Console** - naj bi videl:
   ```
   CartManager initialized successfully
   Migrating localStorage cart to Supabase...
   Migration complete. localStorage cleared.
   ```
3. **Preveri v Supabase:**
   - Pojdi v **Supabase Dashboard** → **Table Editor** → **cart_items**
   - Produkt bi moral biti shranjen z tvojim `user_id` ✅
4. **Preveri localStorage** (Console → Application → Local Storage):
   - `glaam_cart` bi moral biti prazen (migriran v Supabase) ✅

---

### TEST 3: Dodajanje produktov kot prijavljen uporabnik

1. **Prijavi se** (če še nisi)
2. **Dodaj nov produkt** v košarico
3. **Preveri Console:**
   ```
   Product X (qty: 1) added to cart via CartManager
   ```
4. **Preveri v Supabase:**
   - **Table Editor** → **cart_items**
   - Produkt bi moral biti shranjen ✅
5. **Posodobi količino** (klikni + ali -)
6. **Preveri v Supabase** → `quantity` bi moral biti posodobljen ✅

---

### TEST 4: Odstranjevanje iz košarice

1. **Odstrani produkt** iz košarice (klikni ×)
2. **Preveri Console:**
   ```
   Product X removed from cart via CartManager
   ```
3. **Preveri v Supabase:**
   - Produkt bi moral biti izbrisan iz `cart_items` tabele ✅

---

### TEST 5: Odjava in ponovna prijava

1. **Odjavi se**
2. **Preveri košarico** → Košarica bi morala biti prazna na frontendu ✅
3. **Preveri v Supabase** → Podatki ostanejo v bazi (ne brišejo se) ✅
4. **Prijavi se ponovno** z istim računom
5. **Preveri košarico** → Produkti bi se morali ponovno naložiti iz Supabase ✅
6. **Preveri Console:**
   ```
   Cart loaded from Supabase: [...]
   ```

---

### TEST 6: Več produktov hkrati

1. **Dodaj 3 različne produkte** v košarico
2. **Preveri v Supabase:**
   - **Table Editor** → **cart_items**
   - Vse 3 produkte bi moral videti z tvojim `user_id` ✅
3. **Posodobi količino** za vsak produkt
4. **Preveri v Supabase** → Vse količine bi morale biti posodobljene ✅

---

## 🐛 TROUBLESHOOTING

### Problem: "CartManager is not defined"
**Rešitev:**
- Preveri Console za napake
- Preveri, da je `cart-manager.js` vključen v `index.html` PRED `script.js`
- Osveži brskalnik (Ctrl+F5)

### Problem: "Cannot read property 'from' of undefined"
**Rešitev:**
- Preveri, da je Supabase client inicializiran
- Preveri Supabase URL in ANON KEY v `index.html`
- Preveri Console za napake pri inicializaciji

### Problem: Košarica se ne shrani v Supabase
**Rešitev:**
1. Preveri Console za napake (F12)
2. Preveri, da je uporabnik prijavljen
3. Preveri RLS policies v Supabase → **Authentication** → **Policies**
4. Preveri, da je `cart_items` tabela ustvarjena

### Problem: "Users can view their own cart" policy error
**Rešitev:**
- Preveri, da so vse RLS policies ustvarjene
- Preveri, da je RLS omogočen na `cart_items` tabeli

### Problem: Produkti se ne naložijo iz Supabase
**Rešitev:**
- Preveri Console → "Cart loaded from Supabase"
- Preveri, da so produkti v `cart_items` tabeli
- Preveri, da `product_id` ustreza produktom v `script.js`

---

## ✅ CHECKLIST

- [ ] Test 1: Neprijavljen uporabnik → localStorage ✅
- [ ] Test 2: Prijava → migracija v Supabase ✅
- [ ] Test 3: Dodajanje kot prijavljen uporabnik ✅
- [ ] Test 4: Odstranjevanje iz košarice ✅
- [ ] Test 5: Odjava in ponovna prijava ✅
- [ ] Test 6: Več produktov hkrati ✅

---

## 🎯 NASLEDNJI KORAKI (po uspešnem testiranju)

1. **Deploy na Vercel** (če še ni)
2. **Testiraj v produkciji**
3. **Dodaj produkcijske slike**
4. **Optimiziraj performance**
5. **Dodaj Admin panel** (opcijsko)

