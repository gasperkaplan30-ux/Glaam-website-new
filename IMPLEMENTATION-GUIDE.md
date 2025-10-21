# 🚀 Implementacijski Vodnik - Glaam Shop

## 📋 Pregled Implementacije

Celotna implementacija vključuje:
1. ✅ **Košarica po uporabniku** (Supabase + localStorage)
2. ✅ **Admin funkcionalnost** (Dodajanje/brisanje produktov)
3. ✅ **Naročila** (Shranjevanje v Supabase)
4. ✅ **Poizvedbe** (Inquiry forms z RLS)
5. ✅ **Posodobljena Supabase schema**

---

## 1️⃣ POSODOBLJENA SUPABASE SCHEMA

### Izvedi v Supabase SQL Editor:

```sql
-- ✅ 1. Dodaj cart_items tabelo
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ✅ 2. Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- ✅ 3. Cart items policies
CREATE POLICY "Users can view their own cart" ON cart_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart" ON cart_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart" ON cart_items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart" ON cart_items
    FOR DELETE USING (auth.uid() = user_id);

-- ✅ 4. Admin lahko posodobi naročila
CREATE POLICY "Admins can update any order" ON orders
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- ✅ 5. Indexi za performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
```

---

## 2️⃣ KOŠARICA PO UPORABNIKU

### ✅ Implementirano v `cart-manager.js`

**Funkcionalnosti:**
- ✅ Sinhronizacija med Supabase in localStorage
- ✅ Ob prijavi: naloži iz Supabase + migriraj localStorage
- ✅ Ob odjavi: počisti frontend, ohrani bazo
- ✅ Dodajanje/brisanje/posodabljanje količine
- ✅ "Počisti košarico" funkcionalnost

### Integracija v `script.js`:

```javascript
// V konstruktorju:
constructor() {
    // ... existing code ...
    
    // Initialize Cart Manager
    this.cartManager = null;
    
    // Load cart - move AFTER Supabase init
    // this.loadCartFromStorage(); // ❌ Odstrani to
}

// Nova metoda po Supabase init:
async initializeCart() {
    if (window.CartManager && window.supabaseClient) {
        this.cartManager = new CartManager(window.supabaseClient);
        await this.cartManager.initialize();
        this.updateCartDisplay();
    }
}

// Kliči v init() ali po checkLoginStatus():
async init() {
    this.setupEventListeners();
    this.initAnimations();
    // ...
    await this.initializeCart(); // ← Dodaj
}

// Posodobi addToCart():
async addToCart(productId, quantity = 1) {
    if (!this.cartManager) {
        console.error('Cart manager not initialized');
        return;
    }
    
    const product = this.products.find(p => p.id === productId);
    if (!product) {
        console.error('Product not found');
        return;
    }
    
    try {
        await this.cartManager.addToCart(productId, quantity, {
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image
        });
        
        this.updateCartDisplay();
        this.showNotification(`${product.name} dodan v košarico!`, 'success');
    } catch (error) {
        console.error('Error adding to cart:', error);
        this.showNotification('Napaka pri dodajanju v košarico', 'error');
    }
}

// Posodobi removeFromCart():
async removeFromCart(productId) {
    if (!this.cartManager) return;
    
    try {
        await this.cartManager.removeFromCart(productId);
        this.updateCartDisplay();
        this.showNotification('Artikel odstranjen iz košarice', 'success');
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

// Nova metoda za prikaz košarice:
updateCartDisplay() {
    if (!this.cartManager) return;
    
    const cart = this.cartManager.getCart();
    const cartCount = document.getElementById('cartCount');
    const cartContent = document.getElementById('cartContent');
    
    if (cartCount) {
        cartCount.textContent = this.cartManager.getItemCount();
    }
    
    if (cartContent) {
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Vaša košarica je prazna</p>
                </div>
            `;
        } else {
            cartContent.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image || '/images/placeholder.png'}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}€</p>
                        <div class="quantity-controls">
                            <button onclick="glaam.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="glaam.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="glaam.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            
            cartContent.innerHTML += `
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Skupaj:</strong>
                        <span>${this.cartManager.getTotal().toFixed(2)}€</span>
                    </div>
                    <button class="btn-clear" onclick="glaam.clearCart()">Počisti košarico</button>
                    <button class="btn-checkout" onclick="glaam.checkout()">Zaključi nakup</button>
                </div>
            `;
        }
    }
}

// Nova metoda za posodobitev količine:
async updateQuantity(productId, newQuantity) {
    if (!this.cartManager) return;
    
    try {
        await this.cartManager.updateQuantity(productId, newQuantity);
        this.updateCartDisplay();
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

// Nova metoda za čiščenje košarice:
async clearCart() {
    if (!this.cartManager) return;
    
    if (!confirm('Ali ste prepričani, da želite izbrisati vse iz košarice?')) {
        return;
    }
    
    try {
        await this.cartManager.clearCart();
        this.updateCartDisplay();
        this.showNotification('Košarica izpraznjena', 'success');
    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}

// Posodobi login/logout:
async handleLogin(user) {
    if (this.cartManager) {
        await this.cartManager.onUserLogin(user);
        this.updateCartDisplay();
    }
}

async handleLogout() {
    if (this.cartManager) {
        await this.cartManager.onUserLogout();
        this.updateCartDisplay();
    }
}
```

---

## 3️⃣ ADMIN FUNKCIONALNOST

### Nova tabela products ima že RLS policies!

### Admin UI - Dodaj v index.html (pred closing main tag):

```html
<!-- Admin Modal -->
<div id="adminProductModal" class="modal" style="display: none;">
    <div class="modal-content">
        <span class="close" onclick="glaam.closeAdminModal()">&times;</span>
        <h2>➕ Upravljanje Produktov</h2>
        
        <form id="adminProductForm" onsubmit="glaam.saveProduct(event)">
            <input type="hidden" id="productId">
            
            <div class="form-group">
                <label>Ime produkta (SLO)</label>
                <input type="text" id="productNameSl" required>
            </div>
            
            <div class="form-group">
                <label>Opis (SLO)</label>
                <textarea id="productDescSl" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label>Cena (€)</label>
                <input type="number" id="productPrice" step="0.01" min="0" required>
            </div>
            
            <div class="form-group">
                <label>URL slike</label>
                <input type="url" id="productImage">
            </div>
            
            <div class="form-group">
                <label>
                    <input type="checkbox" id="productActive" checked>
                    Aktiven produkt
                </label>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary">💾 Shrani</button>
                <button type="button" class="btn-secondary" onclick="glaam.closeAdminModal()">Prekliči</button>
            </div>
        </form>
    </div>
</div>
```

### Admin funkcije v `script.js`:

```javascript
// Preveri admin status
async checkAdminStatus() {
    try {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) return false;
        
        const isAdmin = user.user_metadata?.role === 'admin' || 
                       user.raw_user_meta_data?.role === 'admin';
        
        this.isAdmin = isAdmin;
        return isAdmin;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Naloži produkte iz Supabase
async loadProductsFromSupabase() {
    try {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('active', true);
        
        if (error) throw error;
        
        this.supabaseProducts = data || [];
        console.log('Products loaded from Supabase:', data);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Shrani/posodobi produkt
async saveProduct(event) {
    event.preventDefault();
    
    const productData = {
        name: document.getElementById('productNameSl').value,
        description: document.getElementById('productDescSl').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image_url: document.getElementById('productImage').value,
        active: document.getElementById('productActive').checked
    };
    
    const productId = document.getElementById('productId').value;
    
    try {
        if (productId) {
            // Update
            const { error } = await this.supabase
                .from('products')
                .update(productData)
                .eq('id', productId);
            
            if (error) throw error;
            this.showNotification('Produkt posodobljen!', 'success');
        } else {
            // Insert
            const { error } = await this.supabase
                .from('products')
                .insert(productData);
            
            if (error) throw error;
            this.showNotification('Produkt dodan!', 'success');
        }
        
        this.closeAdminModal();
        await this.loadProductsFromSupabase();
    } catch (error) {
        console.error('Error saving product:', error);
        this.showNotification('Napaka pri shranjevanju', 'error');
    }
}

// Izbriši produkt
async deleteProduct(productId) {
    if (!confirm('Ali ste prepričani, da želite izbrisati ta produkt?')) {
        return;
    }
    
    try {
        const { error } = await this.supabase
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) throw error;
        
        this.showNotification('Produkt izbrisan!', 'success');
        await this.loadProductsFromSupabase();
    } catch (error) {
        console.error('Error deleting product:', error);
        this.showNotification('Napaka pri brisanju', 'error');
    }
}

// Odpri admin modal
openAdminModal(productId = null) {
    const modal = document.getElementById('adminProductModal');
    modal.style.display = 'block';
    
    if (productId) {
        // Edit mode
        const product = this.supabaseProducts.find(p => p.id === productId);
        if (product) {
            document.getElementById('productId').value = product.id;
            document.getElementById('productNameSl').value = product.name;
            document.getElementById('productDescSl').value = product.description || '';
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image_url || '';
            document.getElementById('productActive').checked = product.active;
        }
    } else {
        // Add mode
        document.getElementById('adminProductForm').reset();
        document.getElementById('productId').value = '';
    }
}

// Zapri admin modal
closeAdminModal() {
    document.getElementById('adminProductModal').style.display = 'none';
}
```

---

## 4️⃣ NAROČILA (ORDERS)

### Shrani naročilo v `script.js`:

```javascript
async createOrder(orderData) {
    try {
        const { data: { user } } = await this.supabase.auth.getUser();
        
        if (!user) {
            this.showNotification('Morate biti prijavljeni za naročilo', 'error');
            return null;
        }
        
        const orderPayload = {
            user_id: user.id,
            first_name: orderData.firstName,
            last_name: orderData.lastName,
            address: orderData.address,
            postal_code: orderData.postalCode,
            city: orderData.city,
            country: orderData.country,
            phone: orderData.phone,
            email: orderData.email,
            items: this.cartManager.getCart(),
            amount_total: this.cartManager.getTotal(),
            currency: 'EUR',
            status: 'pending'
        };
        
        const { data, error } = await this.supabase
            .from('orders')
            .insert(orderPayload)
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('Order created:', data);
        return data;
    } catch (error) {
        console.error('Error creating order:', error);
        this.showNotification('Napaka pri ustvarjanju naročila', 'error');
        return null;
    }
}

// Posodobi status naročila (samo admin)
async updateOrderStatus(orderId, newStatus) {
    try {
        const { error } = await this.supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);
        
        if (error) throw error;
        
        this.showNotification('Status posodobljen!', 'success');
    } catch (error) {
        console.error('Error updating order status:', error);
        this.showNotification('Napaka pri posodabljanju', 'error');
    }
}
```

---

## 5️⃣ POIZVEDBE (INQUIRIES)

### Že implementirano! RLS policies dovoljujejo:
- ✅ **Vsi lahko dodajo** inquiry (INSERT)
- ✅ **Samo admin vidi** vse inquiries (SELECT)

### Shrani inquiry:

```javascript
async submitInquiry(formData) {
    try {
        const { error } = await this.supabase
            .from('inquiries')
            .insert({
                name: formData.name,
                email: formData.email,
                message: formData.message
            });
        
        if (error) throw error;
        
        this.showNotification('Povpraševanje poslano!', 'success');
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        this.showNotification('Napaka pri pošiljanju', 'error');
    }
}

// Wedding inquiry
async submitWeddingInquiry(formData) {
    try {
        const { error } = await this.supabase
            .from('inquiries_wedding')
            .insert({
                name: formData.name,
                email: formData.email,
                wedding_date: formData.date,
                location: formData.location,
                message: formData.message
            });
        
        if (error) throw error;
        
        this.showNotification('Povpraševanje za poroko poslano!', 'success');
    } catch (error) {
        console.error('Error submitting wedding inquiry:', error);
    }
}

// Funeral inquiry
async submitFuneralInquiry(formData) {
    try {
        const { error } = await this.supabase
            .from('inquiries_funeral')
            .insert({
                name: formData.name,
                email: formData.email,
                funeral_date: formData.date,
                location: formData.location,
                message: formData.message
            });
        
        if (error) throw error;
        
        this.showNotification('Povpraševanje za žalni program poslano!', 'success');
    } catch (error) {
        console.error('Error submitting funeral inquiry:', error);
    }
}
```

---

## ✅ CHECKLIST ZA IMPLEMENTACIJO

### 1. Supabase Setup:
- [ ] Izvedi posodobljeno SQL shemo v Supabase SQL Editor
- [ ] Preveri, da so vse tabele ustvarjene (`cart_items`, `orders`, `inquiries`, itd.)
- [ ] Preveri RLS policies

### 2. Frontend Integration:
- [ ] Dodaj `cart-manager.js` v `index.html` (✅ že dodano)
- [ ] Integriraj CartManager v `script.js` (glej zgoraj)
- [ ] Dodaj Admin modal v `index.html`
- [ ] Implementiraj admin funkcije v `script.js`

### 3. Testiranje:
- [ ] Test 1: Prijava/odjava + košarica sinhronizacija
- [ ] Test 2: Admin dodajanje/brisanje produktov
- [ ] Test 3: Ustvarjanje naročil
- [ ] Test 4: Pošiljanje inquiries

---

## 🎯 KONČNI REZULTAT

Po implementaciji boš imel:
- ✅ Košarico vezano na uporabnika (Supabase + localStorage)
- ✅ Admin panel za upravljanje produktov
- ✅ Shranjevanje naročil v Supabase
- ✅ Inquiry forms z RLS pravicami
- ✅ Popolnoma funkcionalno e-trgovino!

**Ključ do uspeha**: Implementiraj korak-po-korak in testiraj vsako funkcionalnost posebej!

