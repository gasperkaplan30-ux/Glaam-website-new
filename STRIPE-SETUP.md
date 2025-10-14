# Stripe in Supabase Nastavitev za Glaam

## Pregled implementacije

Implementirana je celotna integracija Stripe in Supabase za proces zaključka nakupa:

### 1. Frontend (JavaScript)
- **Validacija obrazca**: Preverjanje vseh obveznih polj (ime, naslov, email, telefon, itd.)
- **Email validacija**: Preverjanje veljavnosti email formata
- **Stripe Checkout**: Preusmeritev na Stripe plačilno stran
- **Error handling**: Prikaz napak in obvestil uporabniku

### 2. Backend API (Vercel Functions)
- **`/api/create-checkout-session`**: Ustvarjanje Stripe Checkout Session
- **`/api/stripe-webhook`**: Obdelava Stripe webhook-ov za potrditev plačil
- **`/api/get-order-details`**: Pridobivanje podrobnosti naročila

### 3. Supabase Integracija
- **Tabela `orders`**: Shranjevanje naročil z vsemi podatki
- **Status tracking**: `pending` → `paid` (preko webhook-a)
- **Row Level Security**: Varnostni pravilniki za dostop do podatkov

### 4. UX Strani
- **`success.html`**: Stran za uspešno plačilo z referenčno številko
- **`cancel.html`**: Stran za preklicano plačilo z možnostjo ponovnega poskusa

## Potrebne nastavitve

### 1. Stripe Nastavitve

#### V Stripe Dashboard:
1. **Pridobite API ključe**:
   - `STRIPE_SECRET_KEY` (sk_...)
   - `STRIPE_PUBLISHABLE_KEY` (pk_...)

2. **Nastavite Webhook**:
   - URL: `https://your-domain.vercel.app/api/stripe-webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Pridobite `STRIPE_WEBHOOK_SECRET` (whsec_...)

#### V Vercel Environment Variables:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Supabase Nastavitve

#### V Supabase Dashboard:
1. **Pridobite ključe**:
   - `PUBLIC_SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **Ustvarite tabelo**:
   ```sql
   -- Zaženite supabase-schema.sql v SQL Editor
   ```

#### V Vercel Environment Variables:
```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Vercel Deployment

1. **Deploy aplikacije**:
   ```bash
   vercel --prod
   ```

2. **Preverite API endpointi**:
   - `https://your-domain.vercel.app/api/create-checkout-session`
   - `https://your-domain.vercel.app/api/stripe-webhook`
   - `https://your-domain.vercel.app/api/get-order-details`

## Varnostni ukrepi

### ✅ Implementirano
- **Frontend nikoli ne dostopa do secret ključev**
- **Vsi secret ključi so v Vercel environment variables**
- **Supabase RLS pravilniki za varnost podatkov**
- **Stripe webhook signature verification**
- **Input validacija na frontend in backend**

### 🔒 Varnostni pravilniki
- Uporabniki vidijo samo svoja naročila
- Admin dostop za upravljanje produktov
- Anonimni uporabniki lahko naročajo (guest checkout)

## Testiranje

### 1. Test kartice (Stripe Test Mode)
```
Visa: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
```

### 2. Test scenariji
- ✅ Uspešno plačilo
- ✅ Preklicano plačilo
- ✅ Neuspešno plačilo
- ✅ Validacija obrazca
- ✅ Webhook obdelava

## Monitoring

### Stripe Dashboard
- Spremljanje plačil v realnem času
- Webhook logi za debugging
- Customer podatki

### Supabase Dashboard
- Spremljanje naročil v tabeli `orders`
- Auth uporabniki
- API logi

### Vercel Dashboard
- Function logi
- Performance metrics
- Error tracking

## Troubleshooting

### Pogoste težave

1. **"API endpoint not available"**
   - Preverite, da je aplikacija deployed na Vercel
   - Preverite environment variables

2. **"Webhook signature verification failed"**
   - Preverite `STRIPE_WEBHOOK_SECRET`
   - Preverite webhook URL v Stripe Dashboard

3. **"Order not found"**
   - Preverite Supabase connection
   - Preverite RLS pravilnike

4. **"Invalid items data"**
   - Preverite, da košarica ni prazna
   - Preverite format podatkov

### Debug način
```javascript
// V browser console
console.log('Cart:', window.glaam.cart);
console.log('User:', await window.supabaseClient.auth.getUser());
```

## Naslednji koraki

1. **Email notifikacije**: Implementacija email potrditev
2. **Admin panel**: Upravljanje naročil
3. **Analytics**: Spremljanje prodaje
4. **Inventory**: Upravljanje zalog
5. **Multi-currency**: Podpora za različne valute
