// Cart Manager - Upravljanje košarice z Supabase sinhronizacijo
class CartManager {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
        this.cart = [];
        this.currentUser = null;
    }

    // Inicializiraj košarico
    async initialize() {
        try {
            // Preveri trenutnega uporabnika
            const { data: { user } } = await this.supabase.auth.getUser();
            this.currentUser = user;

            if (user) {
                // Uporabnik je prijavljen - naloži iz Supabase
                await this.loadCartFromSupabase();
                
                // Migriraj localStorage v Supabase (če obstaja)
                await this.migrateLocalStorageToSupabase();
            } else {
                // Uporabnik ni prijavljen - naloži iz localStorage
                this.loadCartFromLocalStorage();
            }
        } catch (error) {
            console.error('Error initializing cart:', error);
            this.loadCartFromLocalStorage(); // Fallback
        }
    }

    // Naloži košarico iz Supabase
    async loadCartFromSupabase() {
        try {
            // Poskusimo naložiti z join na products tabelo
            let { data, error } = await this.supabase
                .from('cart_items')
                .select(`
                    id,
                    product_id,
                    quantity,
                    products (
                        id,
                        name,
                        description,
                        price,
                        image_url
                    )
                `)
                .eq('user_id', this.currentUser.id);

            // Če join ne deluje (ker products tabela morda ne obstaja ali ima drugačno strukturo),
            // naložimo samo cart_items in uporabimo product_id direktno
            if (error || !data || data.length === 0 || !data[0].products) {
                console.log('Products join failed or no products relation, loading cart_items only');
                const { data: cartData, error: cartError } = await this.supabase
                    .from('cart_items')
                    .select('id, product_id, quantity')
                    .eq('user_id', this.currentUser.id);

                if (cartError) throw cartError;
                if (!cartData || cartData.length === 0) {
                    this.cart = [];
                    return;
                }

                // Če nimate products tabele, shranimo samo product_id
                // Frontend bo moral pridobiti podatke o produktih iz lokalnega arraya
                this.cart = cartData.map(item => ({
                    id: item.product_id, // Shrani product_id (BIGINT ali UUID)
                    quantity: item.quantity,
                    cartItemId: item.id
                }));

                console.log('Cart loaded from Supabase (without products join):', this.cart);
                return;
            }

            // Pretvori v cart format (če products join deluje)
            this.cart = data.map(item => ({
                id: item.products ? item.products.id : item.product_id,
                name: item.products ? item.products.name : `Product ${item.product_id}`,
                description: item.products ? item.products.description : '',
                price: item.products ? parseFloat(item.products.price) : 0,
                image: item.products ? item.products.image_url : null,
                quantity: item.quantity,
                cartItemId: item.id
            }));

            console.log('Cart loaded from Supabase:', this.cart);
        } catch (error) {
            console.error('Error loading cart from Supabase:', error);
            this.cart = [];
        }
    }

    // Naloži košarico iz localStorage
    loadCartFromLocalStorage() {
        try {
            const savedCart = localStorage.getItem('glaam_cart');
            this.cart = savedCart ? JSON.parse(savedCart) : [];
            console.log('Cart loaded from localStorage:', this.cart);
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            this.cart = [];
        }
    }

    // Migriraj localStorage v Supabase
    async migrateLocalStorageToSupabase() {
        try {
            const savedCart = localStorage.getItem('glaam_cart');
            if (!savedCart) return;

            const localCart = JSON.parse(savedCart);
            if (localCart.length === 0) return;

            console.log('Migrating localStorage cart to Supabase...');

            for (const item of localCart) {
                await this.addToCartSupabase(item.id, item.quantity);
            }

            // Počisti localStorage po migraciji
            localStorage.removeItem('glaam_cart');
            console.log('Migration complete. localStorage cleared.');
        } catch (error) {
            console.error('Error migrating cart:', error);
        }
    }

    // Dodaj artikel v košarico
    async addToCart(productId, quantity = 1, productData = null) {
        if (this.currentUser) {
            // Uporabnik je prijavljen - dodaj v Supabase
            await this.addToCartSupabase(productId, quantity);
            await this.loadCartFromSupabase(); // Osveži
        } else {
            // Uporabnik ni prijavljen - dodaj v localStorage
            this.addToCartLocalStorage(productId, quantity, productData);
        }
    }

    // Dodaj v Supabase
    async addToCartSupabase(productId, quantity) {
        try {
            // Preveri, ali artikel že obstaja v košarici
            const { data: existing } = await this.supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('user_id', this.currentUser.id)
                .eq('product_id', productId)
                .single();

            if (existing) {
                // Posodobi količino
                const { error } = await this.supabase
                    .from('cart_items')
                    .update({ 
                        quantity: existing.quantity + quantity,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id);

                if (error) throw error;
            } else {
                // Dodaj nov artikel
                const { error } = await this.supabase
                    .from('cart_items')
                    .insert({
                        user_id: this.currentUser.id,
                        product_id: productId,
                        quantity: quantity
                    });

                if (error) throw error;
            }
        } catch (error) {
            console.error('Error adding to cart (Supabase):', error);
            throw error;
        }
    }

    // Dodaj v localStorage
    addToCartLocalStorage(productId, quantity, productData) {
        const existingIndex = this.cart.findIndex(item => item.id === productId);

        if (existingIndex !== -1) {
            this.cart[existingIndex].quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                ...productData,
                quantity: quantity
            });
        }

        this.saveCartToLocalStorage();
    }

    // Odstrani artikel iz košarice
    async removeFromCart(productId) {
        if (this.currentUser) {
            await this.removeFromCartSupabase(productId);
            await this.loadCartFromSupabase();
        } else {
            this.removeFromCartLocalStorage(productId);
        }
    }

    // Odstrani iz Supabase
    async removeFromCartSupabase(productId) {
        try {
            const { error } = await this.supabase
                .from('cart_items')
                .delete()
                .eq('user_id', this.currentUser.id)
                .eq('product_id', productId);

            if (error) throw error;
        } catch (error) {
            console.error('Error removing from cart (Supabase):', error);
            throw error;
        }
    }

    // Odstrani iz localStorage
    removeFromCartLocalStorage(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToLocalStorage();
    }

    // Posodobi količino
    async updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            await this.removeFromCart(productId);
            return;
        }

        if (this.currentUser) {
            await this.updateQuantitySupabase(productId, newQuantity);
            await this.loadCartFromSupabase();
        } else {
            this.updateQuantityLocalStorage(productId, newQuantity);
        }
    }

    // Posodobi količino v Supabase
    async updateQuantitySupabase(productId, newQuantity) {
        try {
            const { error } = await this.supabase
                .from('cart_items')
                .update({ 
                    quantity: newQuantity,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', this.currentUser.id)
                .eq('product_id', productId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating quantity (Supabase):', error);
            throw error;
        }
    }

    // Posodobi količino v localStorage
    updateQuantityLocalStorage(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToLocalStorage();
        }
    }

    // Počisti celotno košarico
    async clearCart() {
        if (this.currentUser) {
            await this.clearCartSupabase();
        }
        this.cart = [];
        this.saveCartToLocalStorage();
    }

    // Počisti košarico v Supabase
    async clearCartSupabase() {
        try {
            const { error } = await this.supabase
                .from('cart_items')
                .delete()
                .eq('user_id', this.currentUser.id);

            if (error) throw error;
        } catch (error) {
            console.error('Error clearing cart (Supabase):', error);
            throw error;
        }
    }

    // Shrani v localStorage
    saveCartToLocalStorage() {
        try {
            localStorage.setItem('glaam_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    }

    // Pridobi košarico
    getCart() {
        return this.cart;
    }

    // Pridobi število artiklov
    getItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Pridobi skupno ceno
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Ob prijavi
    async onUserLogin(user) {
        this.currentUser = user;
        await this.loadCartFromSupabase();
        await this.migrateLocalStorageToSupabase();
    }

    // Ob odjavi
    async onUserLogout() {
        this.currentUser = null;
        this.cart = [];
        // Ne brišemo iz localStorage - uporabnik lahko kasneje kupi kot gost
    }
}

// Export za uporabo v script.js
window.CartManager = CartManager;

