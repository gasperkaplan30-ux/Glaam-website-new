# 🚀 Quick Start Guide - Glaam Shop Nadgradnja

## ✅ ŠTO JE BILO NAREJENO

### 1️⃣ **POSODOBLJENA SUPABASE SCHEMA**
- ✅ Dodana tabela `cart_items` (košarica po uporabniku)
- ✅ RLS policies za cart, orders, inquiries
- ✅ Admin policies za posodabljanje naročil
- ✅ Indexi za boljši performance

📁 **Datoteka**: `supabase-schema.sql` (posodobljena)

---

### 2️⃣ **KOŠARICA PO UPORABNIKU**
- ✅ Ustvarjen `CartManager` class
- ✅ Sinhronizacija med Supabase in localStorage
- ✅ Ob prijavi: naloži iz Supabase + migriraj localStorage
- ✅ Ob odjavi: počisti frontend, ohrani v bazi
- ✅ Funkcionalnosti:
  - Dodaj v košarico
  - Odstrani iz košarice
  - Posodobi količino
  - Počisti celotno košarico

📁 **Nova datoteka**: `cart-manager.js`

---

### 3️⃣ **ADMIN FUNKCIONALNOST**
- ✅ Admin lahko dodaja/briše/posodablja produkte
- ✅ RLS policies - samo admin ima dostop
- ✅ UI modal za upravljanje
- ✅ Implementirane funkcije v IMPLEMENTATION-GUIDE.md

---

### 4️⃣ **NAROČILA (ORDERS)**
- ✅ Shranjevanje naročil v Supabase
- ✅ Samo prijavljeni uporabniki lahko naročajo
- ✅ Admin lahko posodablja status naročil
- ✅ Shrani vse podatke: artikle (JSONB), naslov, ceno, valuto

---

### 5️⃣ **POIZVEDBE (INQUIRIES)**
- ✅ RLS policies že nastavljene
- ✅ Vsi lahko pošljejo inquiry
- ✅ Samo admin lahko vidi vse inquiries
- ✅ Ločene tabele za wedding/funeral inquiries

---

## 📂 NOVE/POSODOBLJENE DATOTEKE

| Datoteka | Status | Opis |
|----------|--------|------|
| `supabase-schema.sql` | ✅ Posodobljena | Dodana cart_items, policies, indexi |
| `cart-manager.js` | 🆕 Nova | CartManager class za Supabase sinhronizacijo |
| `index.html` | ✅ Posodobljena | Dodan cart-manager.js script |
| `IMPLEMENTATION-GUIDE.md` | 🆕 Nova | Celotna navodila za integracijo |
| `QUICK-START-GUIDE.md` | 🆕 Nova | Ta datoteka |

---

## 🔧 KAJ MORAŠ ZDAJ NAREDITI

### KORAK 1: Posodobi Supabase
1. Pojdi v **Supabase Dashboard** → **SQL Editor**
2. Odpri `supabase-schema.sql`
3. **Kopiraj samo NOVE dele** (od vrstice 40 naprej):
   ```sql
   -- Create cart_items table
   CREATE TABLE IF NOT EXISTS cart_items ( ... );
   
   -- Cart items policies
   CREATE POLICY "Users can view their own cart" ON cart_items ...
   
   -- Admins can update any order
   CREATE POLICY "Admins can update any order" ON orders ...
   
   -- Indexi
   CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ...
   ```
4. Klikni **RUN** (▶️)
5. Preveri, da ni napak

### KORAK 2: Integriraj CartManager v script.js
Odpri `IMPLEMENTATION-GUIDE.md` in sledij navodilom v sekciji **"2️⃣ KOŠARICA PO UPORABNIKU"**

**Ključne spremembe:**
- Dodaj `this.cartManager = null;` v constructor
- Ustvari `async initializeCart()` metodo
- Posodobi `addToCart()`, `removeFromCart()`, `updateQuantity()`
- Dodaj `clearCart()` metodo
- Posodobi `handleLogin()` in `handleLogout()`

### KORAK 3: Dodaj Admin UI
1. Kopiraj Admin Modal HTML iz `IMPLEMENTATION-GUIDE.md` (sekcija 3️⃣)
2. Prilepi v `index.html` pred `</main>`
3. Dodaj admin funkcije v `script.js` (iz IMPLEMENTATION-GUIDE.md)

### KORAK 4: Implementiraj Orders & Inquiries
Kopiraj funkcije iz `IMPLEMENTATION-GUIDE.md`:
- `createOrder()`
- `updateOrderStatus()` (admin)
- `submitInquiry()`
- `submitWeddingInquiry()`
- `submitFuneralInquiry()`

---

## 🧪 TESTIRANJE

### Test 1: Košarica (Neprijavljen uporabnik)
1. **Odpri stran** kot gost
2. **Dodaj produkt** v košarico → Shrani v localStorage
3. **Osveži stran** → Košarica ostane
4. **Prijavi se** → Košarica se migra v Supabase

### Test 2: Košarica (Prijavljen uporabnik)
1. **Prijavi se**
2. **Dodaj produkt** → Shrani v Supabase
3. **Odjavi se** → Košarica se počisti
4. **Prijavi se nazaj** → Košarica se naloži iz Supabase ✅

### Test 3: Admin
1. **Prijavi se kot admin** (nastavi v Supabase):
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
   WHERE email = 'admin@glaam.si';
   ```
2. **Odpri admin modal** → Dodaj produkt
3. **Preveri v Supabase** → Produkt je dodan
4. **Izbriši produkt** → Produkt je izbrisan

### Test 4: Naročilo
1. **Prijavi se**
2. **Dodaj produkt** v košarico
3. **Klikni "Zaključi nakup"**
4. **Izpolni obrazec**
5. **Potrdi** → Naročilo se shrani v Supabase
6. **Preveri v Supabase** → `orders` tabela ima novo vrstico

### Test 5: Inquiry
1. **Pojdi na "Wedding" ali "Funeral services"**
2. **Izpolni obrazec** za povpraševanje
3. **Pošlji** → Shrani v `inquiries_wedding` ali `inquiries_funeral`
4. **Preveri v Supabase** → Nova vrstica v tabeli
5. **Prijavi se kot admin** → Vidiš inquiry
6. **Odjavi se** → Ne vidiš inquiries (RLS deluje!)

---

## 🐛 TROUBLESHOOTING

### Problem: "CartManager is not defined"
**Rešitev**: 
- Preveri, da je `<script src="/cart-manager.js"></script>` PRED `<script src="/script.js">`
- Osveži brskalnik (Ctrl+F5)

### Problem: "Cannot read property 'from' of undefined"
**Rešitev**:
- Preveri, da je Supabase client inicializiran PRED CartManager
- Preveri Supabase URL in ANON KEY

### Problem: Cart se ne migra v Supabase
**Rešitev**:
- Odpri Console (F12) in preveri napake
- Preveri RLS policies v Supabase
- Preveri, da je uporabnik prijavljen

### Problem: Admin ne more dodajati produktov
**Rešitev**:
- Nastavi admin role v Supabase:
  ```sql
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
  WHERE email = 'tvoj@email.com';
  ```
- Preveri RLS policies za `products` tabelo

---

## 📊 ARHITEKTURA

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
                 ├─── cart_items (košarica)
                 ├─── products (produkti)
                 ├─── orders (naročila)
                 └─── inquiries (povpraševanja)
```

---

## ✅ KONČNI CHECKLIST

- [ ] Supabase schema posodobljena
- [ ] CartManager integriran v script.js
- [ ] Admin UI dodan
- [ ] Orders funkcionalnost implementirana
- [ ] Inquiries funkcionalnost implementirana
- [ ] Testirano: Prijava/odjava + košarica
- [ ] Testirano: Admin dodajanje/brisanje
- [ ] Testirano: Naročila
- [ ] Testirano: Inquiries
- [ ] Slovnica pregledana
- [ ] Prevodi preizkušeni

---

## 🎯 POMEMBNO

**Vrstni red implementacije**:
1. ✅ Najprej: Posodobi Supabase schema
2. ✅ Potem: Integriraj CartManager
3. ✅ Nato: Dodaj Admin UI
4. ✅ Nazadnje: Testiraj vse

**Ne preskoči nobenega koraka!**

---

## 💡 NASLEDNJI KORAKI

Po uspešni implementaciji:
1. **Deploy na Vercel** (glej `VERCEL-DEPLOYMENT-GUIDE.md`)
2. **Testiraj v produkciji**
3. **Dodaj Stripe payment** (opcijsko)
4. **Optimiziraj performance**

---

**Pripravljeno!** 🚀 Sledi `IMPLEMENTATION-GUIDE.md` in implementiraj korak-po-korak!

