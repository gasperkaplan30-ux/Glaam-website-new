# 🚀 Vercel + Supabase - Vodnik za Deployment

## 📋 Kazalo
1. [Supabase Setup](#1-supabase-setup)
2. [Vercel Setup](#2-vercel-setup)
3. [Povezava Vercel ↔ Supabase](#3-povezava-vercel--supabase)
4. [Deployment](#4-deployment)
5. [Preverjanje Povezave](#5-preverjanje-povezave)

---

## 1️⃣ Supabase Setup

### Korak 1.1: Ustvari Supabase Projekt
1. Pojdi na [https://supabase.com](https://supabase.com)
2. Klikni **"Start your project"** ali **"New Project"**
3. Izpolni podatke:
   - **Project name**: `glaam-shop` (ali tvoje ime)
   - **Database Password**: Zapomni si geslo! (Potrebuješ ga za migracijo)
   - **Region**: Izberi najbližjo regijo (npr. `eu-central-1` za Evropo)
4. Klikni **"Create new project"**
5. Počakaj 1-2 minuti, da se projekt vzpostavi

### Korak 1.2: Pridobi API Ključe
1. V Supabase projektu klikni na **⚙️ Settings** (v levem meniju)
2. Klikni na **API**
3. Kopiraj naslednje ključe:
   - **Project URL**: `https://qwrnjvlthgorzpslycuy.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (že imaš)
   - **service_role key** (secret): `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (že imaš)

### Korak 1.3: Ustvari Database Schema
1. V Supabase projektu klikni **🗄️ SQL Editor** (v levem meniju)
2. Klikni **+ New query**
3. Kopiraj celotno vsebino iz datoteke `supabase-schema.sql`
4. Prilepi v SQL editor
5. Klikni **RUN** (▶️)
6. Preveri, da so tabele ustvarjene:
   - `products`
   - `funeral_products`
   - `wedding_packages`
   - `orders`
   - `order_items`

---

## 2️⃣ Vercel Setup

### Korak 2.1: Ustvari Vercel Račun
1. Pojdi na [https://vercel.com](https://vercel.com)
2. Klikni **"Sign Up"**
3. Izberi **"Continue with GitHub"** (priporočeno)
4. Avtoriziraj Vercel dostop do GitHub računa

### Korak 2.2: Poveži GitHub Repozitorij
1. Na tvoj GitHub račun:
   - Ustvari nov repozitorij: **"glaam-shop"**
   - Naložiti (push) vse datoteke iz trenutnega projekta
   
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Glaam Shop"
   git remote add origin https://github.com/TVOJ_USERNAME/glaam-shop.git
   git branch -M main
   git push -u origin main
   ```

2. Na Vercel:
   - Klikni **"Add New..."** → **"Project"**
   - Izberi svoj GitHub repozitorij **"glaam-shop"**
   - Klikni **"Import"**

### Korak 2.3: Konfiguracija Projekta
V Vercel project settings:

#### Build & Development Settings:
- **Framework Preset**: `Other` (ali `None`)
- **Build Command**: Pusti prazno
- **Output Directory**: Pusti prazno (projekta je že statičen HTML)
- **Install Command**: Pusti prazno

#### Root Directory:
- Pusti kot **"."** (root direktorij)

---

## 3️⃣ Povezava Vercel ↔ Supabase

### Korak 3.1: Dodaj Environment Variables v Vercel
1. V Vercel projektu klikni **⚙️ Settings**
2. Klikni **Environment Variables** (v levem meniju)
3. Dodaj naslednje spremenljivke:

| Ime Spremenljivke | Vrednost | Environment |
|-------------------|----------|-------------|
| `VITE_SUPABASE_URL` | `https://qwrnjvlthgorzpslycuy.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cm5qdmx0aGdvcnpwc2x5Y3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTQzMjIsImV4cCI6MjA3MjkzMDMyMn0.Bs3VNpuQmzNmP2q4HpbVci27bT0OBxtf9e_2pTGvkjM` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cm5qdmx0aGdvcnpwc2x5Y3V5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM1NDMyMiwiZXhwIjoyMDcyOTMwMzIyfQ.8tUGh-DkDoVIPIKZhNzXxgFyQY5wM5Id_iZv5n84fhg` | Production, Preview, Development |

4. Klikni **"Save"** za vsako spremenljivko

⚠️ **POMEMBNO**: 
- `VITE_SUPABASE_URL` in `VITE_SUPABASE_ANON_KEY` morata biti dostopna v browserju (zato prefix `VITE_`)
- `SUPABASE_SERVICE_ROLE_KEY` je TAJNA vrednost in se uporablja samo v serverless funkcijah

### Korak 3.2: Posodobi Supabase Client
V datoteki `script.js` je že implementirana inicializacija Supabase:

```javascript
initializeSupabase() {
    if (window.supabaseClient) {
        supabase = window.supabaseClient;
    } else {
        console.warn('No Supabase client found');
    }
}
```

V `index.html` dodaj Supabase inicializacijo **pred** `<script src="/script.js"></script>`:

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
    // Initialize Supabase
    const SUPABASE_URL = 'https://qwrnjvlthgorzpslycuy.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cm5qdmx0aGdvcnpwc2x5Y3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTQzMjIsImV4cCI6MjA3MjkzMDMyMn0.Bs3VNpuQmzNmP2q4HpbVci27bT0OBxtf9e_2pTGvkjM';
    
    window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase initialized:', window.supabaseClient);
</script>
```

---

## 4️⃣ Deployment

### Korak 4.1: Deploy Projekt
1. **Način 1: Avtomatski deploy (priporočeno)**
   - Ko pushaš spremembe v GitHub, Vercel avtomatsko deploya:
   ```bash
   git add .
   git commit -m "Added Supabase connection"
   git push origin main
   ```

2. **Način 2: Ročni deploy**
   - V Vercel dashboard klikni **"Deployments"**
   - Klikni **"Redeploy"** → **"Deploy"**

### Korak 4.2: Počakaj na Build
- Deployment običajno traja 30-60 sekund
- Preveri **"Deployment Logs"** za morebitne napake
- Ko je status **"Ready"**, je deploy uspešen ✅

### Korak 4.3: Pridobi Deployment URL
- URL bo nekaj takega: `https://glaam-shop.vercel.app`
- Ali custom domain (če si ga dodal)

---

## 5️⃣ Preverjanje Povezave

### Test 1: Supabase Connection
1. Odpri deployment URL v brskalniku
2. Odpri **Developer Console** (F12)
3. Preveri console log:
   ```
   Supabase client initialized: {...}
   Supabase auth available: true
   Supabase getUser available: true
   ```

### Test 2: User Authentication
1. Klikni **"Prijava"** (Login)
2. Registriraj nov račun:
   - Email: `test@glaam.si`
   - Geslo: `Test1234`
3. Preveri email za potrditev
4. Klikni na potrditveno povezavo
5. Prijavi se

### Test 3: Database Read
1. Pojdi v Supabase Dashboard → **Table Editor**
2. Klikni na tabelo `auth.users`
3. Preveri, da je nov uporabnik ustvarjen ✅

### Test 4: Produkti (če so shranjeni v Supabase)
1. V app-u klikni na "Šopki"
2. Preveri, da se produkti prikazujejo
3. Dodaj produkt v košarico

---

## 🛠️ Troubleshooting

### Problem: "Supabase client not found"
**Rešitev**: 
- Preveri, da je Supabase script v `index.html` PRED `script.js`
- Preveri, da sta `SUPABASE_URL` in `SUPABASE_ANON_KEY` pravilna

### Problem: CORS napaka
**Rešitev**:
1. V Supabase klikni **Authentication** → **URL Configuration**
2. Dodaj svoj Vercel URL v **"Site URL"**:
   ```
   https://glaam-shop.vercel.app
   ```
3. Dodaj v **"Redirect URLs"**:
   ```
   https://glaam-shop.vercel.app/
   https://glaam-shop.vercel.app/**
   ```

### Problem: Environment variables niso na voljo
**Rešitev**:
- V Vercel Settings → Environment Variables
- Preveri, da so vse spremenljivke označene za **"Production"**, **"Preview"**, in **"Development"**
- **Redeploy** projekt

---

## ✅ Zaključek

Ko so vsi koraki opravljeni, imaš:
- ✅ Delujočo spletno stran na Vercel
- ✅ Povezavo s Supabase bazo
- ✅ User authentication
- ✅ Avtomatski deployment pri vsaki spremembi

🎉 **Čestitke! Tvoja spletna stran je zdaj live!**

---

**Naslednji korak**: Implementacija Admin funkcionalnosti za dodajanje artiklov brez kode

