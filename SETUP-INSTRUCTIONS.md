# Navodila za nastavitev API ključev in integracije

## 🔑 Kje vnesem API podatke in ključe

### ⚠️ **VAŽNO: VARNOST PODATKOV**
- **NE vnašajte občutljivih podatkov direktno v HTML/JS datoteke!**
- Uporabite environment variables v Vercel
- V HTML se prikazujejo samo PUBLIC_* spremenljivke
- Service role ključi so dostopni samo v serverless funkcijah

### 1. Supabase konfiguracija

**V `index.html` (vrstice 940-941) - SAMO za lokalni razvoj:**
```javascript
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';
```

**Kje dobiti podatke:**
1. Pojdite na [supabase.com](https://supabase.com)
2. Odprite svoj projekt
3. V levem meniju kliknite "Settings" → "API"
4. Kopirajte:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`

### 2. Vercel Environment Variables

**V Vercel Dashboard:**
1. Pojdite na [vercel.com](https://vercel.com)
2. Odprite svoj projekt
3. Kliknite "Settings" → "Environment Variables"
4. Dodajte naslednje spremenljivke:

```
PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_SECRET_KEY = sk_test_... (ali sk_live_... za produkcijo)
STRIPE_WEBHOOK_SECRET = whsec_...
```

**Kje dobiti podatke:**

#### Supabase:
- `PUBLIC_SUPABASE_URL`: Project URL iz Supabase Settings → API
- `PUBLIC_SUPABASE_ANON_KEY`: anon public key iz Supabase Settings → API  
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key iz Supabase Settings → API

#### Stripe:
- `STRIPE_SECRET_KEY`: 
  1. Pojdite na [stripe.com](https://stripe.com)
  2. Dashboard → Developers → API keys
  3. Kopirajte "Secret key" (za test: `sk_test_...`, za produkcijo: `sk_live_...`)

- `STRIPE_WEBHOOK_SECRET`:
  1. Stripe Dashboard → Developers → Webhooks
  2. Ustvarite nov webhook endpoint: `https://your-domain.vercel.app/api/stripe-webhook`
  3. Izberite dogodke: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
  4. Kopirajte "Signing secret" (`whsec_...`)

### 3. Supabase baza podatkov

**Ustvarite tabele:**
1. V Supabase Dashboard → SQL Editor
2. Kopirajte in poženite vsebino datoteke `supabase-schema.sql`
3. Preverite, da so tabele ustvarjene v Database → Tables

**Nastavite RLS (Row Level Security):**
- RLS je že nastavljen v SQL skripti
- Preverite v Database → Tables → Security

### 4. Supabase Auth nastavitve

**V Authentication → Settings:**
1. Vklopite "Enable email confirmations"
2. Nastavite "Site URL" na vašo domeno
3. V "Redirect URLs" dodajte:
   - `https://your-domain.vercel.app`
   - `https://your-domain.vercel.app/reset-password`

**V Authentication → Templates:**
- Prilagodite email template-e za potrditev in ponastavitev gesla

### 5. Testiranje integracije

**Testni scenarij:**
1. Odprite spletno stran
2. Registrirajte se z email naslovom
3. Preverite email za potrditev
4. Prijavite se
5. Dodajte izdelek v košarico
6. Kliknite "Zaključi nakup"
7. Izpolnite obrazec za dostavo
8. Preusmerite se na Stripe checkout
9. Opravite testno plačilo

### 6. Produkcijska nastavitev

**Stripe:**
- Zamenjajte test ključe z produkcijskimi
- Nastavite produkcijski webhook endpoint

**Supabase:**
- Preverite produkcijski URL in ključe
- Nastavite produkcijski Site URL v Auth settings

**Vercel:**
- Nastavite produkcijske environment variables
- Preverite custom domeno

## 🔍 Preverjanje nastavitev

### Preverite Supabase povezavo:
```javascript
// V browser console
console.log(window.supabase);
```

### Preverite environment variables:
```javascript
// V browser console (samo PUBLIC_* spremenljivke so dostopne)
console.log(process.env.PUBLIC_SUPABASE_URL);
```

### Preverite Stripe webhook:
1. V Stripe Dashboard → Webhooks
2. Kliknite na vaš webhook
3. Preverite "Recent deliveries" za uspešne/neuspešne klice

## ❗ Pogoste napake

1. **"Invalid API key"** → Preverite, da so ključi pravilno kopirani
2. **"CORS error"** → Preverite Vercel headers v `vercel.json`
3. **"Webhook signature verification failed"** → Preverite `STRIPE_WEBHOOK_SECRET`
4. **"RLS policy violation"** → Preverite Supabase RLS nastavitve
5. **"User not found"** → Preverite Supabase Auth nastavitve

## 🔒 **Varnostni preverjanja**

### Preverite, da se občutljivi podatki ne prikazujejo v brskalniku:
1. Odprite Developer Tools (F12)
2. Pojdite v Network tab
3. Refresh stran
4. Preverite, da se v HTML/JS ne prikazujejo:
   - `sk_live_` ali `sk_test_` (Stripe ključi)
   - `service_role` ključi
   - Webhook secrets

### Preverite environment variables:
```javascript
// V browser console - samo PUBLIC_* spremenljivke so dostopne
console.log(process.env.PUBLIC_SUPABASE_URL);
console.log(process.env.PUBLIC_SUPABASE_ANON_KEY);
// Te NE smejo biti dostopne:
// console.log(process.env.STRIPE_SECRET_KEY); // undefined
// console.log(process.env.SUPABASE_SERVICE_ROLE_KEY); // undefined
```

### Za produkcijo:
- Uporabite `sk_live_` ključe za Stripe
- Nastavite produkcijske Supabase URL-je
- Preverite, da so vsi ključi nastavljeni v Vercel Environment Variables

## 📞 Podpora

Če imate težave:
1. Preverite browser console za napake
2. Preverite Vercel function logs
3. Preverite Supabase logs
4. Preverite Stripe webhook logs
