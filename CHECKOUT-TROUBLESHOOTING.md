# Checkout Troubleshooting Guide

## Problem: Napaka 500 "Failed to create order"

### Možni vzroki:

1. **Supabase tabela `orders` ne obstaja**
2. **Napačni Supabase ključi**
3. **Napačni Stripe ključi**
4. **RLS (Row Level Security) pravilniki blokirajo dostop**

### Rešitev:

#### 1. Preverite Supabase tabelo

Pojdite v **Supabase Dashboard** → **SQL Editor** in zaženite:

```sql
-- Preverite, ali tabela orders obstaja
SELECT * FROM information_schema.tables WHERE table_name = 'orders';
```

Če tabela ne obstaja, jo ustvarite z:

```sql
-- Ustvarite tabelo orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_session_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    amount_total DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Omogočite RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Ustvarite pravilnike
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);
```

#### 2. Preverite Supabase ključe

V **Supabase Dashboard** → **Settings** → **API**:

- **Project URL**: `https://your-project.supabase.co`
- **service_role key**: Začne se z `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### 3. Preverite Stripe ključe

V **Stripe Dashboard** → **Developers** → **API keys**:

- **Secret Key**: `sk_test_...` (za test) ali `sk_live_...` (za produkcijo)
- **Publishable Key**: `pk_test_...` (za test) ali `pk_live_...` (za produkcijo)

#### 4. Preverite Vercel Environment Variables

V **Vercel Dashboard** → **Settings** → **Environment Variables**:

```
STRIPE_SECRET_KEY=sk_test_...
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 5. Testirajte konfiguracijo

Po deploymentu obiščite:
- `https://your-domain.vercel.app/api/test-config` - preveri konfiguracijo
- `https://your-domain.vercel.app/api/test-supabase` - preveri Supabase tabelo

#### 6. Debug način

V browser console preverite:
```javascript
// Preverite košarico
console.log('Cart:', window.glaam.cart);

// Preverite uporabnika
console.log('User:', await window.supabaseClient.auth.getUser());
```

### Pogoste napake:

1. **"relation 'orders' does not exist"** → Tabela ne obstaja
2. **"permission denied for table orders"** → RLS pravilniki blokirajo dostop
3. **"invalid input syntax for type uuid"** → Napačen format user_id
4. **"Stripe configuration missing"** → Stripe ključi niso nastavljeni

### Naslednji koraki:

1. Ustvarite Supabase tabelo z zgornjim SQL
2. Preverite environment variables v Vercel
3. Redeploy aplikacijo
4. Testirajte checkout ponovno

Če problem še vedno obstaja, preverite Vercel Function logi za podrobnejše napake.
