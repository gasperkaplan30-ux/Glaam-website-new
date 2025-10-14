# 🎯 STRIPE INTEGRACIJA - Kompletna Navodila

## 📋 Pregled

Vaš projekt je **že pripravljen** za Stripe! Potrebujete samo nastaviti ključe in webhook.

---

## KORAK 1: Ustvarite Stripe račun

### 1.1 Registracija
1. Pojdite na: **https://dashboard.stripe.com/register**
2. Vnesite:
   - Email naslov
   - Polno ime
   - Država: **Slovenia**
   - Geslo
3. Kliknite **"Create account"**

### 1.2 Aktivirajte račun
1. Preverite email in potrdite račun
2. Prijavite se na: **https://dashboard.stripe.com/**

---

## KORAK 2: Pridobite API ključe

### 2.1 Test Mode ključi (za testiranje)
1. V Stripe Dashboard pojdite na: **Developers → API keys**
2. Preverite, da je **"Test mode"** vklopljen (toggle zgoraj desno)
3. Kopirajte ključe:
   
   **Publishable key** (začne se s `pk_test_...`)
   ```
   pk_test_51...
   ```
   ❌ **TA KLJUČ NI POTREBEN** - že je v vašem kodu kot javni ključ
   
   **Secret key** (začne se s `sk_test_...`)
   ```
   sk_test_51...
   ```
   ✅ **TA KLJUČ POTREBUJETE** za Vercel

### 2.2 Shranite ključe
- Kopirajte `sk_test_...` ključ v beležnico
- **NIKOLI ne delite tega ključa javno!**

---

## KORAK 3: Nastavite Stripe Webhook

### 3.1 Ustvarite Webhook
1. V Stripe Dashboard pojdite na: **Developers → Webhooks**
2. Kliknite **"Add endpoint"**
3. Vnesite podatke:

   **Endpoint URL:**
   ```
   https://glaam-six.vercel.app/api/stripe-webhook
   ```

   **Description:** (opcijsko)
   ```
   Glaam Order Webhook
   ```

   **Events to send:**
   - Kliknite **"Select events"**
   - Poiščite in označite:
     - ✅ `checkout.session.completed`
     - ✅ `payment_intent.succeeded`
     - ✅ `payment_intent.payment_failed`
   
4. Kliknite **"Add endpoint"**

### 3.2 Pridobite Webhook Secret
1. Po ustvarjanju webhook-a kliknite nanj
2. V sekciji **"Signing secret"** kliknite **"Reveal"**
3. Kopirajte ključ (začne se z `whsec_...`)
   ```
   whsec_...
   ```
4. Shranite v beležnico

---

## KORAK 4: Dodajte ključe v Vercel

### 4.1 Pojdite na Vercel Dashboard
1. Odprite: **https://vercel.com/**
2. Prijavite se
3. Kliknite na projekt **"glaam"** ali **"glaam-six"**

### 4.2 Dodajte Environment Variables
1. Kliknite **Settings** (zgoraj)
2. Kliknite **Environment Variables** (levo)
3. Dodajte naslednje spremenljivke:

#### Spremenljivka 1: STRIPE_SECRET_KEY
- **Key:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_51...` (vaš Secret key iz koraka 2.1)
- **Environment:** Označite **Production**, **Preview**, **Development**
- Kliknite **"Save"**

#### Spremenljivka 2: STRIPE_WEBHOOK_SECRET
- **Key:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_...` (vaš Webhook secret iz koraka 3.2)
- **Environment:** Označite **Production**, **Preview**, **Development**
- Kliknite **"Save"**

### 4.3 Preverite obstoječe spremenljivke
Prepričajte se, da imate tudi:
- ✅ `PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

---

## KORAK 5: Redeploy aplikacije

### 5.1 Redeploy na Vercel
1. V Vercel Dashboard (projekt glaam)
2. Pojdite na **Deployments** tab
3. Kliknite na **"..."** (tri pike) pri zadnjem deploymentu
4. Kliknite **"Redeploy"**
5. Počakajte ~1-2 minuti

**ALI** če imate Git povezavo:
1. Naredite katerokoli spremembo v kodi (npr. dodajte komentar)
2. Commitajte in pushajte na GitHub
3. Vercel bo avtomatsko redeployal

---

## KORAK 6: Testirajte plačilo

### 6.1 Test kartica
Stripe ponuja testne kartice za testiranje:

**Uspešno plačilo:**
```
Številka kartice: 4242 4242 4242 4242
Datum poteka: 12/34 (katerikoli datum v prihodnosti)
CVC: 123 (katerikoli 3 števke)
Poštna številka: 1000 (katerakoli)
```

**Neuspešno plačilo:**
```
Številka kartice: 4000 0000 0000 0002
Datum poteka: 12/34
CVC: 123
```

### 6.2 Testni nakup
1. Pojdite na: **https://glaam-six.vercel.app/**
2. Dodajte izdelek v košarico
3. Kliknite **"Zaključi nakup"**
4. Izpolnite obrazec z testnimi podatki
5. Kliknite **"Plačaj"**
6. Vnesite testno kartico (4242 4242 4242 4242)
7. Kliknite **"Pay"**

### 6.3 Preverite rezultat
- ✅ Če vse deluje: preusmeritev na **success.html**
- ✅ V Stripe Dashboard: **Payments** → vidite testno plačilo
- ✅ V Supabase: **orders** tabela → novo naročilo s statusom "paid"

---

## KORAK 7: Monitoring in Debugging

### 7.1 Stripe Dashboard
- **Payments:** Vsa plačila
- **Customers:** Podatki o kupcih
- **Webhooks:** Logi webhook klicev
- **Logs:** API klici in napake

### 7.2 Vercel Dashboard
- **Functions:** Logi API funkcij
- **Deployments:** Zgodovina deploymentov
- **Analytics:** Promet in performance

### 7.3 Supabase Dashboard
- **Table Editor:** Pregled naročil
- **SQL Editor:** Poizvedbe
- **Logs:** API klici

---

## ⚠️ POMEMBNO: Prehod v Production Mode

Ko boste pripravljeni za pravo spletno trgovino:

### 1. Aktivirajte Stripe račun
- Stripe Dashboard → **Activate account**
- Izpolnite poslovne podatke
- Dodajte bančni račun za izplačila

### 2. Pridobite Production ključe
- Stripe Dashboard → **Developers → API keys**
- Izklopite **"Test mode"**
- Kopirajte **Production** ključe (`sk_live_...`)

### 3. Posodobite Vercel Environment Variables
- Zamenjajte `STRIPE_SECRET_KEY` s production ključem
- Ustvarite nov webhook za production URL
- Posodobite `STRIPE_WEBHOOK_SECRET`

### 4. Testirajte z PRAVO kartico
- Uporabite svojo kartico
- Preverite, da plačilo deluje
- Preverite, da se naročilo shrani

---

## 🆘 Troubleshooting

### Problem 1: "Stripe configuration missing"
**Rešitev:**
- Preverite, da ste dodali `STRIPE_SECRET_KEY` v Vercel
- Redeployajte aplikacijo

### Problem 2: "Webhook signature verification failed"
**Rešitev:**
- Preverite, da je `STRIPE_WEBHOOK_SECRET` pravilen
- Preverite, da je webhook URL: `https://glaam-six.vercel.app/api/stripe-webhook`

### Problem 3: "Order not found"
**Rešitev:**
- Preverite Supabase connection
- Preverite, da tabela `orders` obstaja
- Preverite RLS pravilnike

### Problem 4: Plačilo uspešno, ampak status ostane "pending"
**Rešitev:**
- Preverite webhook v Stripe Dashboard → Webhooks → Logs
- Preverite, da so eventi pravilno nastavljeni
- Preverite Vercel function logs

---

## 📞 Pomoč

### Stripe Support
- Dokumentacija: https://stripe.com/docs
- Support: https://support.stripe.com/

### Vercel Support
- Dokumentacija: https://vercel.com/docs
- Support: https://vercel.com/support

### Supabase Support
- Dokumentacija: https://supabase.com/docs
- Support: https://supabase.com/support

---

## ✅ Checklist

Pred začetkom testiranja preverite:

- [ ] Stripe račun ustvarjen
- [ ] `STRIPE_SECRET_KEY` dodan v Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` dodan v Vercel
- [ ] Webhook ustvarjen v Stripe Dashboard
- [ ] Aplikacija redeployana na Vercel
- [ ] Testno plačilo uspešno
- [ ] Naročilo shranjeno v Supabase
- [ ] Webhook deluje (status → "paid")

---

**Srečno s testiranjem! 🎉**

