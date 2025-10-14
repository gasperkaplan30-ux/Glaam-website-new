# 🔐 Admin Funkcionalnost - Dodajanje in Brisanje Artiklov

## 📋 Pregled
Ta funkcionalnost omogoča adminu (lastniku spletne strani) dodajanje in brisanje produktov **brez urejanja kode**.

---

## 🛠️ Kako Deluje

### 1. Admin Dostop
- Admin se mora prijaviti z **admin email naslovom**
- Admin email: `admin@glaam.si` (ali drug email, ki ga nastaviš v Supabase)

### 2. Admin Ploščica
- Ko se admin prijavi, se prikaže **posebna ploščica "➕ Dodaj Nov Produkt"**
- Ploščica je enaka kot običajne ploščice produktov
- Vidna je samo adminu

### 3. Dodajanje Produkta
Admin klikne na ploščico "➕ Dodaj Nov Produkt" in izpolni obrazec:
- **Ime produkta** (SLO)
- **Ime produkta** (ENG)
- **Opis** (SLO)
- **Opis** (ENG)
- **Cena** (€)
- **Kategorija** (Romantic, Celebration, Seasonal, Custom, Wedding, Funeral)
- **Slika URL** (opcijsko)

### 4. Brisanje Produkta
- Na vsaki ploščici produkta se prikaže gumb **"🗑️ Izbriši"** (samo za admina)
- Admin klikne gumb → produkt je izbrisan iz baze

---

## 🔧 Tehnična Implementacija

### Korak 1: Nastavi Admin Uporabnika v Supabase

#### 1.1 Ustvari Admin Email
1. Prijavi se v Supabase Dashboard
2. Klikni **Authentication** → **Users**
3. Klikni **"Add user"** → **"Create new user"**
4. Vnesi:
   - **Email**: `admin@glaam.si`
   - **Password**: `Admin1234!` (ali tvoje varno geslo)
   - **Email Confirm**: ✅ Potrdi email avtomatsko
5. Klikni **"Create user"**

#### 1.2 Označi Uporabnika kot Admin
V Supabase SQL Editor izvedi:

```sql
-- Dodaj 'admin' vlogo uporabniku
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@glaam.si';
```

Preveri:
```sql
SELECT email, raw_app_meta_data->'role' as role
FROM auth.users
WHERE email = 'admin@glaam.si';
```

Output:
```
email            | role
-----------------|-------
admin@glaam.si   | "admin"
```

---

### Korak 2: Pripravi Database Schema

#### 2.1 Ustvari Tabelo za Produkte (če še ni)
```sql
-- Tabela za produkte
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name_sl TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description_sl TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('romantic', 'celebration', 'seasonal', 'custom', 'wedding', 'funeral')),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policies
-- Anyone can read products
CREATE POLICY "Allow public read access" ON products
    FOR SELECT
    USING (true);

-- Only admins can insert products
CREATE POLICY "Allow admin insert" ON products
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Only admins can update products
CREATE POLICY "Allow admin update" ON products
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Only admins can delete products
CREATE POLICY "Allow admin delete" ON products
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );
```

---

### Korak 3: Frontend Implementacija

#### 3.1 Preveri Admin Status v `script.js`
```javascript
async checkAdminStatus() {
    if (!window.supabaseClient) return false;
    
    const { data: { user }, error } = await window.supabaseClient.auth.getUser();
    
    if (error || !user) {
        this.isAdmin = false;
        return false;
    }
    
    // Check if user has admin role
    this.isAdmin = user.app_metadata?.role === 'admin';
    return this.isAdmin;
}
```

#### 3.2 Prikaži Admin Ploščico
```javascript
async renderAdminTile() {
    const isAdmin = await this.checkAdminStatus();
    if (!isAdmin) return '';
    
    return `
        <div class="product-card admin-add-product" onclick="glaam.openAddProductModal()">
            <div class="admin-add-icon">
                <i class="fas fa-plus-circle"></i>
            </div>
            <h3>Dodaj nov produkt</h3>
            <p>Klikni za dodajanje produkta</p>
        </div>
    `;
}
```

#### 3.3 Dodaj Produkt v Bazo
```javascript
async addProduct(productData) {
    const { data, error } = await window.supabaseClient
        .from('products')
        .insert([
            {
                name_sl: productData.name_sl,
                name_en: productData.name_en,
                description_sl: productData.description_sl,
                description_en: productData.description_en,
                price: productData.price,
                category: productData.category,
                image_url: productData.image_url,
                created_by: (await window.supabaseClient.auth.getUser()).data.user.id
            }
        ]);
    
    if (error) {
        console.error('Error adding product:', error);
        this.showNotification('Napaka pri dodajanju produkta', 'error');
        return;
    }
    
    this.showNotification('Produkt uspešno dodan!', 'success');
    this.renderProducts(); // Ponovno naloži produkte
}
```

#### 3.4 Izbriši Produkt
```javascript
async deleteProduct(productId) {
    if (!confirm('Ali ste prepričani, da želite izbrisati ta produkt?')) return;
    
    const { error } = await window.supabaseClient
        .from('products')
        .delete()
        .eq('id', productId);
    
    if (error) {
        console.error('Error deleting product:', error);
        this.showNotification('Napaka pri brisanju produkta', 'error');
        return;
    }
    
    this.showNotification('Produkt uspešno izbrisan!', 'success');
    this.renderProducts(); // Ponovno naloži produkte
}
```

---

## 🎨 UI Components

### Admin Add Product Modal (HTML)
```html
<div id="adminAddProductModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="glaam.closeAddProductModal()">&times;</span>
        <h2>➕ Dodaj Nov Produkt</h2>
        
        <form id="adminProductForm">
            <div class="form-group">
                <label>Ime produkta (SLO)</label>
                <input type="text" name="name_sl" required>
            </div>
            
            <div class="form-group">
                <label>Ime produkta (ENG)</label>
                <input type="text" name="name_en" required>
            </div>
            
            <div class="form-group">
                <label>Opis (SLO)</label>
                <textarea name="description_sl" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label>Opis (ENG)</label>
                <textarea name="description_en" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label>Cena (€)</label>
                <input type="number" name="price" step="0.01" min="0" required>
            </div>
            
            <div class="form-group">
                <label>Kategorija</label>
                <select name="category" required>
                    <option value="romantic">Romantični</option>
                    <option value="celebration">Praznični</option>
                    <option value="seasonal">Sezonski</option>
                    <option value="custom">Po meri</option>
                    <option value="wedding">Poroka</option>
                    <option value="funeral">Žalni program</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>URL slike (opcijsko)</label>
                <input type="url" name="image_url">
            </div>
            
            <button type="submit" class="btn-primary">💾 Shrani Produkt</button>
        </form>
    </div>
</div>
```

### Delete Button (na vsaki ploščici)
```javascript
// V renderProducts() funkciji dodaj:
const deleteBtn = this.isAdmin ? `
    <button class="btn-delete" onclick="glaam.deleteProduct(${product.id})">
        <i class="fas fa-trash"></i> Izbriši
    </button>
` : '';
```

---

## 🧪 Testiranje

### Test 1: Admin Prijava
1. Prijavi se kot `admin@glaam.si`
2. Preveri console: `isAdmin: true`

### Test 2: Admin Ploščica
1. Pojdi na "Šopki" sekcijo
2. Preveri, da se prikaže ploščica "➕ Dodaj Nov Produkt"

### Test 3: Dodajanje Produkta
1. Klikni na "➕ Dodaj Nov Produkt"
2. Izpolni obrazec
3. Klikni "Shrani"
4. Preveri, da se produkt prikaže v seznamu

### Test 4: Brisanje Produkta
1. Najdi produkt z gumbom "🗑️ Izbriši"
2. Klikni gumb
3. Potrdi brisanje
4. Preveri, da je produkt izbrisan

---

## ✅ Zaključek
Admin funkcionalnost omogoča **popolno upravljanje produktov brez urejanja kode**!

🎉 **Pripravljeno za produkcijo!**

