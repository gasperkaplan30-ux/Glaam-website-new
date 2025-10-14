# Glaam Flower Shop

E-commerce spletna stran za prodajo cvetja z integracijo Supabase in Stripe.

## Funkcionalnosti

- ✅ Supabase Auth (registracija, prijava, odjava)
- ✅ Košarica z avtomatskim zapiranjem
- ✅ Stripe integracija za plačila
- ✅ Supabase baza podatkov z RLS
- ✅ Responsive dizajn
- ✅ Gladek prehod med košarico in obrazcem za dostavo

## Nastavitev

### 1. Supabase

1. Ustvarite nov projekt na [supabase.com](https://supabase.com)
2. V SQL Editorju poženite `supabase-schema.sql`
3. Vklopite Email Auth v Authentication → Settings
4. Nastavite email template-e v Authentication → Templates

### 2. Stripe

1. Ustvarite račun na [stripe.com](https://stripe.com)
2. V Dashboard → Developers → Webhooks ustvarite nov webhook:
   - Endpoint URL: `https://your-domain.vercel.app/api/stripe-webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`

### 3. Vercel

1. Ustvarite račun na [vercel.com](https://vercel.com)
2. Povežite GitHub repository
3. V Settings → Environment Variables dodajte:

```
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Lokalni razvoj

```bash
# Namestite dependencies
npm install

# Zaženite lokalni server
npm run dev
```

## API Endpoints

### POST /api/create-checkout-session
Ustvari Stripe checkout sejo za naročilo.

**Request:**
```json
{
  "orderId": "uuid",
  "items": [
    {
      "name": "Product Name",
      "price": 45.00,
      "quantity": 1
    }
  ],
  "successUrl": "https://your-domain.com/success",
  "cancelUrl": "https://your-domain.com/cancel"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### POST /api/stripe-webhook
Obdeluje Stripe webhook dogodke.

## Baza podatkov

### Tabele

#### products
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Ime izdelka
- `description` (TEXT) - Opis izdelka
- `image_url` (TEXT) - URL slike
- `price` (DECIMAL) - Cena
- `stripe_price_id` (VARCHAR) - Stripe price ID
- `active` (BOOLEAN) - Ali je izdelek aktiven
- `created_at` (TIMESTAMP) - Datum ustvarjanja

#### orders
- `id` (UUID) - Primary key
- `user_id` (UUID) - ID uporabnika
- `stripe_session_id` (VARCHAR) - Stripe session ID
- `status` (VARCHAR) - Status naročila (pending, paid, failed, cancelled)
- `first_name` (VARCHAR) - Ime
- `last_name` (VARCHAR) - Priimek
- `address` (TEXT) - Naslov
- `postal_code` (VARCHAR) - Poštna številka
- `city` (VARCHAR) - Mesto
- `country` (VARCHAR) - Država
- `phone` (VARCHAR) - Telefon
- `items` (JSONB) - Izdelki v košarici
- `amount_total` (DECIMAL) - Skupna cena
- `currency` (VARCHAR) - Valuta
- `paid_at` (TIMESTAMP) - Datum plačila
- `created_at` (TIMESTAMP) - Datum ustvarjanja

#### inquiries
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Ime
- `email` (VARCHAR) - Email
- `message` (TEXT) - Sporočilo
- `created_at` (TIMESTAMP) - Datum ustvarjanja

## Varnost

### 🔒 **Varovanje podatkov**
- Row Level Security (RLS) je omogočena na vseh tabelah
- Uporabniki vidijo samo svoja naročila
- Admini imajo polni dostop do vseh podatkov
- Stripe webhook podpisi so preverjeni

### 🚨 **VAŽNO: Environment Variables**
- **NE vnašajte občutljivih podatkov direktno v HTML/JS datoteke!**
- Uporabite Vercel Environment Variables za produkcijo
- `PUBLIC_*` spremenljivke so dostopne v brskalniku
- `SUPABASE_SERVICE_ROLE_KEY` in `STRIPE_SECRET_KEY` so dostopni samo v serverless funkcijah
- Za lokalni razvoj ustvarite `.env.local` datoteko

## Razvoj

### Struktura datotek

```
├── api/
│   ├── create-checkout-session.js
│   └── stripe-webhook.js
├── index.html
├── script.js
├── styles.css
├── package.json
├── vercel.json
└── supabase-schema.sql
```

### Dodajanje novih izdelkov

Izdelke dodajte v `script.js` v funkciji `initProducts()` ali direktno v Supabase bazo.

### Customizacija

- CSS spremembe v `styles.css`
- JavaScript logika v `script.js`
- Stripe konfiguracija v API funkcijah

## Podpora

Za vprašanja in podporo kontaktirajte razvijalca.

## Licenca

MIT License