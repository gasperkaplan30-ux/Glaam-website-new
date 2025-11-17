// Glaam Website JavaScript
console.log('Script.js se je naložil!');

// Global Supabase client - will be initialized when DOM is ready
let supabase = null;

class GlaamWebsite {
    constructor() {
        this.cart = [];
        this.cartManager = null; // CartManager za Supabase sinhronizacijo
        this.currentPage = 'domov';
        this.products = this.initProducts();
        this.weddingPackages = this.initWeddingPackages();
        this.currentProductsFilter = 'romantic';
        // Map product ids to i18n keys for names and descriptions
        this.productTranslationMap = {
            // Romantic
            1: { name: 'products.romantic.romanticBouquet', desc: 'products.romantic.romanticDesc' },
            2: { name: 'products.romantic.mysteriousBouquet', desc: 'products.romantic.mysteriousDesc' },
            3: { name: 'products.romantic.gentleBouquet', desc: 'products.romantic.gentleDesc' },
            4: { name: 'products.romantic.passionBouquet', desc: 'products.romantic.passionDesc' },
            5: { name: 'products.romantic.loveBouquet', desc: 'products.romantic.loveDesc' },
            6: { name: 'products.romantic.dreamyBouquet', desc: 'products.romantic.dreamyDesc' },
            20: { name: 'products.romantic.firstDates', desc: 'products.romantic.firstDatesDesc' },
            18: { name: 'products.romantic.valentineBouquet', desc: 'products.romantic.valentineDesc' },
            19: { name: 'products.romantic.eveningBouquet', desc: 'products.romantic.eveningDesc' },
            21: { name: 'products.romantic.engagementBouquet', desc: 'products.romantic.engagementDesc' },
            22: { name: 'products.romantic.longDistanceLove', desc: 'products.romantic.longDistanceDesc' },
            33: { name: 'products.romantic.classicRomantic', desc: 'products.romantic.classicRomanticDesc' },
            34: { name: 'products.romantic.gentlePink', desc: 'products.romantic.gentlePinkDesc' },
            35: { name: 'products.romantic.elegantWhite', desc: 'products.romantic.elegantWhiteDesc' },
            36: { name: 'products.romantic.mysticPurple', desc: 'products.romantic.mysticPurpleDesc' },
            37: { name: 'products.romantic.goldenRomantic', desc: 'products.romantic.goldenRomanticDesc' },
            // Celebration
            7: { name: 'products.celebration.sunnyBouquet', desc: 'products.celebration.sunnyDesc' },
            8: { name: 'products.celebration.holidayBouquet', desc: 'products.celebration.holidayDesc' },
            9: { name: 'products.celebration.birthdayBouquet', desc: 'products.celebration.birthdayDesc' },
            10: { name: 'products.celebration.ceremonialBouquet', desc: 'products.celebration.ceremonialDesc' },
            11: { name: 'products.celebration.newYearBouquet', desc: 'products.celebration.newYearDesc' },
            23: { name: 'products.celebration.mothersDay', desc: 'products.celebration.mothersDayDesc' },
            24: { name: 'products.celebration.fathersDay', desc: 'products.celebration.fathersDayDesc' },
            25: { name: 'products.celebration.easterBouquet', desc: 'products.celebration.easterDesc' },
            26: { name: 'products.celebration.christmasBouquet', desc: 'products.celebration.christmasDesc' },
            27: { name: 'products.celebration.graduationBouquet', desc: 'products.celebration.graduationDesc' },
            38: { name: 'products.celebration.festiveMixed', desc: 'products.celebration.festiveMixedDesc' },
            39: { name: 'products.celebration.birthdaySpecial', desc: 'products.celebration.birthdaySpecialDesc' },
            40: { name: 'products.celebration.classicFestive', desc: 'products.celebration.classicFestiveDesc' },
            41: { name: 'products.celebration.newYearSpecial', desc: 'products.celebration.newYearSpecialDesc' },
            42: { name: 'products.celebration.happyMixed', desc: 'products.celebration.happyMixedDesc' },
            // Seasonal
            12: { name: 'products.seasonal.naturalBouquet', desc: 'products.seasonal.naturalDesc' },
            13: { name: 'products.seasonal.springBouquet', desc: 'products.seasonal.springDesc' },
            14: { name: 'products.seasonal.summerBouquet', desc: 'products.seasonal.summerDesc' },
            15: { name: 'products.seasonal.autumnBouquet', desc: 'products.seasonal.autumnDesc' },
            16: { name: 'products.seasonal.winterBouquet', desc: 'products.seasonal.winterDesc' },
            17: { name: 'products.seasonal.gardenBouquet', desc: 'products.seasonal.gardenDesc' },
            32: { name: 'products.seasonal.mixedSeasonal', desc: 'products.seasonal.mixedSeasonalDesc' },
            47: { name: 'products.seasonal.wildNatural', desc: 'products.seasonal.wildNaturalDesc' },
            // Custom flowers
            301: { name: 'products.custom.redRoses' },
            302: { name: 'products.custom.whiteLilies' },
            303: { name: 'products.custom.sunflowers' },
            304: { name: 'products.custom.orchids' },
            305: { name: 'products.custom.tulips' },
            306: { name: 'products.custom.peonies' },
            307: { name: 'products.custom.gerberas' },
            308: { name: 'products.custom.chrysanthemums' },
            309: { name: 'products.custom.irises' },
            310: { name: 'products.custom.daffodils' },
            311: { name: 'products.custom.gladiolus' },
            312: { name: 'products.custom.freesias' },
            313: { name: 'products.custom.alstroemerias' },
            314: { name: 'products.custom.lisianthus' },
            315: { name: 'products.custom.protea' },
            316: { name: 'products.custom.anthuriums' },
            317: { name: 'products.custom.callaLilies' },
            318: { name: 'products.custom.dendrobium' },
            319: { name: 'products.custom.babysBreath' },
            320: { name: 'products.custom.limonium' },
            321: { name: 'products.custom.goldenrod' },
            322: { name: 'products.custom.asters' },
            323: { name: 'products.custom.delphiniums' },
            324: { name: 'products.custom.lavender' },
            325: { name: 'products.custom.eucalyptus' },
            326: { name: 'products.custom.ruscus' },
            327: { name: 'products.custom.asparagusFern' }
        };
        // Map funeral product ids to i18n keys for names and descriptions
        this.funeralTranslationMap = {
            // Venčki
            201: { name: 'funeral.products.classicWreath', desc: 'funeral.products.classicWreathDesc' },
            202: { name: 'funeral.products.luxuryWreath', desc: 'funeral.products.luxuryWreathDesc' },
            203: { name: 'funeral.products.smallWreath', desc: 'funeral.products.smallWreathDesc' },
            // Ikebane
            204: { name: 'funeral.products.ikebanaTraditional', desc: 'funeral.products.ikebanaTraditionalDesc' },
            205: { name: 'funeral.products.ikebanaModern', desc: 'funeral.products.ikebanaModernDesc' },
            206: { name: 'funeral.products.ikebanaMini', desc: 'funeral.products.ikebanaMiniDesc' },
            // Srčni Aranžmaji
            207: { name: 'funeral.products.heartClassic', desc: 'funeral.products.heartClassicDesc' },
            208: { name: 'funeral.products.heartLarge', desc: 'funeral.products.heartLargeDesc' },
            209: { name: 'funeral.products.heartDouble', desc: 'funeral.products.heartDoubleDesc' }
        };
        this.funeralProducts = this.initFuneralProducts();
        this.observers = new Map();
        this.customBouquetMaxItems = 5; // Default to 5 items
        this.currentLanguage = 'sl'; // Default language
        
        // Initialize Supabase client
        this.initializeSupabase();
        console.log('Supabase client initialized:', window.supabaseClient);
        console.log('Supabase auth available:', !!(window.supabaseClient && window.supabaseClient.auth));
        console.log('Supabase getUser available:', !!(window.supabaseClient && window.supabaseClient.auth && window.supabaseClient.auth.getUser));
        
        // Initialize CartManager (če je na voljo)
        this.initializeCartManager();
        
        // Load cart from localStorage (fallback, če CartManager še ni inicializiran)
        this.loadCartFromStorage();
        
        // CRITICAL: Load language preference BEFORE initializing i18n
        this.loadLanguagePreference();
        
        // Initialize i18n with the correct language
        this.initializeI18n();
        
        // Check if user is logged in (only if Supabase is available)
        if (window.supabaseClient && window.supabaseClient.auth && window.supabaseClient.auth.getUser) {
            this.checkLoginStatus();
        } else {
            console.warn('Supabase not available, skipping login check');
        }
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initAnimations();
        this.initNavigation();
        this.initProductRendering();
        this.initForms();
        this.hideLoadingScreen();
        this.initScrollEffects();
        this.initParticles();
    }

    // Initialize CartManager
    async initializeCartManager() {
        try {
            if (window.CartManager && window.supabaseClient) {
                this.cartManager = new CartManager(window.supabaseClient);
                await this.cartManager.initialize();
                
                // Sinhroniziraj lokalno košarico z CartManager
                let cartItems = this.cartManager.getCart();
                
                // Če CartManager naloži samo product_id (brez products join),
                // dodaj podatke o produktih iz lokalnega arraya
                cartItems = cartItems.map(item => {
                    // Če item nima imena ali cene, poišči produkt v lokalnem arrayu
                    if (!item.name || !item.price) {
                        let product = this.products.find(p => p.id === item.id);
                        if (!product) {
                            product = this.weddingPackages.find(p => p.id === item.id);
                        }
                        if (!product) {
                            product = this.funeralProducts.find(p => p.id === item.id);
                        }
                        
                        if (product) {
                            return {
                                ...item,
                                name: product.name,
                                description: product.description,
                                price: product.price,
                                image: product.image
                            };
                        }
                    }
                    return item;
                });
                
                this.cart = cartItems;
                this.updateCart();
                
                console.log('CartManager initialized successfully with', cartItems.length, 'items');
            } else {
                console.warn('CartManager or Supabase client not available');
            }
        } catch (error) {
            console.error('Error initializing CartManager:', error);
        }
    }

    initializeSupabase() {
        console.log('Supabase client already initialized in index.html');
        
        if (window.supabaseClient) {
            console.log('Using existing Supabase client:', !!window.supabaseClient);
            console.log('Auth available:', !!window.supabaseClient.auth);
            console.log('getUser available:', !!window.supabaseClient.auth?.getUser);
            
            // Store globally for other functions
            supabase = window.supabaseClient;
        } else {
            console.warn('No Supabase client found in window.supabaseClient');
        }
    }

    initializeI18n() {
        // Initialize i18next
        if (typeof i18next !== 'undefined') {
            i18next.init({
                lng: this.currentLanguage,
                fallbackLng: 'sl',
                resources: {
                    sl: {
                        translation: {
                            // Slovenian translations will be loaded from JSON file
                        }
                    },
                    en: {
                        translation: {
                            // English translations will be loaded from JSON file
                        }
                    }
                }
            }).then(() => {
                console.log('i18next initialized');
                this.loadTranslations();
            });
        } else {
            console.warn('i18next not available');
        }
    }

    async loadTranslations() {
        try {
            console.log('Loading translations...');
            
            // Load Slovenian translations
            const slResponse = await fetch('locales/sl/translation.json');
            if (!slResponse.ok) {
                throw new Error(`Failed to load Slovenian translations: ${slResponse.status}`);
            }
            const slTranslations = await slResponse.json();
            
            // Load English translations
            const enResponse = await fetch('locales/en/translation.json');
            if (!enResponse.ok) {
                throw new Error(`Failed to load English translations: ${enResponse.status}`);
            }
            const enTranslations = await enResponse.json();
            
            // Update i18next resources
            i18next.addResourceBundle('sl', 'translation', slTranslations);
            i18next.addResourceBundle('en', 'translation', enTranslations);
            
            console.log('Translations loaded successfully');
            
            // Change to current language and apply translations
            i18next.changeLanguage(this.currentLanguage).then(() => {
                this.applyTranslations();
                this.updateLanguageButtons();
                this.renderProducts(this.currentProductsFilter || 'romantic');
                // Force update funeral products as they are static HTML
                this.updateFuneralProducts();
            });
        } catch (error) {
            console.error('Error loading translations:', error);
            console.error('Error details:', error.message);
            
            // Fallback: try alternative paths
            try {
                console.log('Trying alternative paths...');
                const slResponse2 = await fetch('/locales/sl/translation.json');
                const enResponse2 = await fetch('/locales/en/translation.json');
                
                if (slResponse2.ok && enResponse2.ok) {
                    const slTranslations2 = await slResponse2.json();
                    const enTranslations2 = await enResponse2.json();
                    
                    i18next.addResourceBundle('sl', 'translation', slTranslations2);
                    i18next.addResourceBundle('en', 'translation', enTranslations2);
                    
                    console.log('Translations loaded with alternative paths');
                    
                    i18next.changeLanguage(this.currentLanguage).then(() => {
                        this.applyTranslations();
                        this.updateLanguageButtons();
                        this.renderProducts(this.currentProductsFilter || 'romantic');
                        // Force update funeral products as they are static HTML
                        this.updateFuneralProducts();
                    });
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        }
    }

    loadLanguagePreference() {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && (savedLanguage === 'sl' || savedLanguage === 'en')) {
            this.currentLanguage = savedLanguage;
        } else {
            // Default to Slovenian and persist
            this.currentLanguage = 'sl';
            localStorage.setItem('language', 'sl');
        }
        this.updateLanguageButtons();
    }

    saveLanguagePreference(language) {
        localStorage.setItem('language', language);
        this.currentLanguage = language;
    }

    switchLanguage(language) {
        if (language === this.currentLanguage) return;
        
        console.log(`Switching language from ${this.currentLanguage} to ${language}`);
        
        this.saveLanguagePreference(language);
        
        if (typeof i18next !== 'undefined') {
            i18next.changeLanguage(language).then(() => {
                console.log(`Language changed to: ${language}`);
                // Force update all translations including funeral products
                this.applyTranslations();
                this.updateFuneralProducts();
                // Immediately reload the page to ensure all translations are applied
                window.location.reload();
            });
        }
    }

    updateLanguageButtons() {
        const slBtn = document.getElementById('langSLO');
        const enBtn = document.getElementById('langANG');
        
        if (slBtn && enBtn) {
            slBtn.classList.toggle('active', this.currentLanguage === 'sl');
            enBtn.classList.toggle('active', this.currentLanguage === 'en');
        }
    }

    applyTranslations() {
        if (typeof i18next === 'undefined') return;
        // Generic: prepiši besedilo za vse elemente z data-i18n
        const allNodes = document.querySelectorAll('[data-i18n]');
        allNodes.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = i18next.t(key);
            if (text && text !== key) {
                el.textContent = text;
            }
        });
    }

    getTranslation(key, fallback = '') {
        if (typeof i18next !== 'undefined') {
            const translated = i18next.t(key);
            return translated !== key ? translated : fallback;
        } else if (this.translations && this.translations[this.currentLanguage]) {
            const keys = key.split('.');
            let value = this.translations[this.currentLanguage];
            for (const k of keys) {
                value = value?.[k];
            }
            return value || fallback;
        }
        return fallback;
    }

    updateElementText(selector, key) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && typeof i18next !== 'undefined') {
                const translated = i18next.t(key);
                if (translated && translated !== key) {
                    element.textContent = translated;
                }
            }
        });
    }

    getTranslatedName(product) {
        if (typeof i18next !== 'undefined') {
            // Check funeral products first
            if (this.funeralTranslationMap && this.funeralTranslationMap[product.id]?.name) {
                const key = this.funeralTranslationMap[product.id].name;
                const t = i18next.t(key);
                if (t && t !== key) return t;
            }
            // Then check regular products
            if (this.productTranslationMap && this.productTranslationMap[product.id]?.name) {
                const key = this.productTranslationMap[product.id].name;
                const t = i18next.t(key);
                if (t && t !== key) return t;
            }
        }
        return product.name;
    }

    getTranslatedDesc(product) {
        if (typeof i18next !== 'undefined') {
            // Check funeral products first
            if (this.funeralTranslationMap && this.funeralTranslationMap[product.id]?.desc) {
                const key = this.funeralTranslationMap[product.id].desc;
                const t = i18next.t(key);
                if (t && t !== key) return t;
            }
            // Then check regular products
            if (this.productTranslationMap && this.productTranslationMap[product.id]?.desc) {
                const key = this.productTranslationMap[product.id].desc;
                const t = i18next.t(key);
                if (t && t !== key) return t;
            }
        }
        return product.description || '';
    }

    // Update funeral products translations manually (they are static HTML)
    updateFuneralProducts() {
        if (typeof i18next === 'undefined') return;
        
        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                const translation = i18next.t(key);
                if (translation && translation !== key) {
                    // Update text but preserve HTML content inside
                    const textContent = el.textContent.trim();
                    const newText = translation;
                    
                    // Only update if content is different
                    if (textContent !== newText) {
                        el.textContent = newText;
                    }
                }
            }
        });
        
        // Update validation messages for form inputs
        document.querySelectorAll('[data-i18n-msg]').forEach(input => {
            const key = input.getAttribute('data-i18n-msg');
            if (key) {
                const msg = i18next.t(key);
                if (msg && msg !== key) {
                    input.setCustomValidity('');
                    input.setAttribute('oninvalid', `this.setCustomValidity('${msg}')`);
                    input.setAttribute('oninput', `this.setCustomValidity('')`);
                }
            }
        });
    }

    // Product Data
    initProducts() {
        console.log('Initializing products data...');
        const products = [
            // Romantični šopki
            {
                id: 1,
                name: 'Romantični Šopek',
                description: 'Nežne rdeče in rožnate vrtnice za posebne trenutke.',
                price: 45,
                category: 'romantic',
                icon: 'fas fa-rose',
                color: 'from-pink-200 to-pink-300',
                image: 'images/Romantični-šopek.png' // Dodajte sliko v mapo images/
            },
            {
                id: 2,
                name: 'Skrivnostni Šopek',
                description: 'Elegantne vijolične in modre ločije za poseben vtis.',
                price: 55,
                category: 'romantic',
                icon: 'fas fa-magic',
                color: 'from-purple-200 to-blue-300'
            },
            {
                id: 3,
                name: 'Nežni Šopek',
                description: 'Beli in rožnati cvetovi za nežne trenutke.',
                price: 38,
                category: 'romantic',
                icon: 'fas fa-heart',
                color: 'from-pink-200 to-white'
            },
            {
                id: 4,
                name: 'Strast Šopek',
                description: 'Intenzivne rdeče vrtnice za izpovedovanje ljubezni.',
                price: 60,
                category: 'romantic',
                icon: 'fas fa-fire',
                color: 'from-red-200 to-pink-300'
            },
            {
                id: 5,
                name: 'Ljubezen Šopek',
                description: 'Mešanica rdečih in belih vrtnic za izražanje ljubezni.',
                price: 52,
                category: 'romantic',
                icon: 'fas fa-heart',
                color: 'from-red-200 to-white'
            },
            {
                id: 6,
                name: 'Sanjski Šopek',
                description: 'Rožnate peonije in bele lilije za sanjski vtis.',
                price: 48,
                category: 'romantic',
                icon: 'fas fa-star',
                color: 'from-pink-200 to-purple-200'
            },
            {
                id: 18,
                name: 'Valentinov Šopek',
                description: 'Klasični rdeči in rožnati cvetovi za Valentinovo.',
                price: 55,
                category: 'romantic',
                icon: 'fas fa-heart',
                color: 'from-red-200 to-pink-200'
            },
            {
                id: 19,
                name: 'Večerni Šopek',
                description: 'Elegantni temni cvetovi za romantične večere.',
                price: 62,
                category: 'romantic',
                icon: 'fas fa-moon',
                color: 'from-purple-200 to-blue-200'
            },
            {
                id: 20,
                name: 'Prvi Srečanja',
                description: 'Nežni beli cvetovi za prvi srečanja.',
                price: 45,
                category: 'romantic',
                icon: 'fas fa-kiss',
                color: 'from-white to-pink-200'
            },
            {
                id: 21,
                name: 'Zaroka Šopek',
                description: 'Luxury cvetovi za prošnje in zaroke.',
                price: 75,
                category: 'romantic',
                icon: 'fas fa-gem',
                color: 'from-pink-200 to-gold-200'
            },
            {
                id: 22,
                name: 'Ljubezen na Daljavo',
                description: 'Posebni šopek za izražanje ljubezni na daljavo.',
                price: 50,
                category: 'romantic',
                icon: 'fas fa-heart-broken',
                color: 'from-pink-200 to-purple-200'
            },
            {
                id: 33,
                name: 'Klasični Romantični',
                description: 'Klasični rdeči vrtnice za romantične trenutke.',
                price: 47,
                category: 'romantic',
                icon: 'fas fa-rose',
                color: 'from-red-200 to-pink-200'
            },
            {
                id: 34,
                name: 'Nežni Rožnati',
                description: 'Nežni rožnati cvetovi za nežne trenutke.',
                price: 43,
                category: 'romantic',
                icon: 'fas fa-heart',
                color: 'from-pink-200 to-white'
            },
            {
                id: 35,
                name: 'Elegantni Beli',
                description: 'Elegantni beli cvetovi za posebne priložnosti.',
                price: 52,
                category: 'romantic',
                icon: 'fas fa-star',
                color: 'from-white to-pink-200'
            },
            {
                id: 36,
                name: 'Mistični Vijolični',
                description: 'Mistični vijolični cvetovi za skrivnostne trenutke.',
                price: 58,
                category: 'romantic',
                icon: 'fas fa-magic',
                color: 'from-purple-200 to-blue-200'
            },
            {
                id: 37,
                name: 'Zlatni Romantični',
                description: 'Zlatni odtenki za luksuzne romantične trenutke.',
                price: 65,
                category: 'romantic',
                icon: 'fas fa-gem',
                color: 'from-yellow-200 to-gold-200'
            },

            // Praznični šopki
            {
                id: 7,
                name: 'Sončni Šopek',
                description: 'Živahne sončnice in rumeno cvetje za pozitivno energijo.',
                price: 35,
                category: 'celebration',
                icon: 'fas fa-sun',
                color: 'from-yellow-200 to-orange-300'
            },
            {
                id: 8,
                name: 'Praznični Šopek',
                description: 'Barviti mešani cvetovi za posebne praznike.',
                price: 48,
                category: 'celebration',
                icon: 'fas fa-gift',
                color: 'from-purple-200 to-pink-200'
            },
            {
                id: 9,
                name: 'Rojstnodnevni Šopek',
                description: 'Veseli mešani cvetovi za rojstnodnevne proslave.',
                price: 42,
                category: 'celebration',
                icon: 'fas fa-birthday-cake',
                color: 'from-yellow-200 to-pink-200'
            },
            {
                id: 10,
                name: 'Slavnostni Šopek',
                description: 'Elegantni beli in zlati cvetovi za slavnostne priložnosti.',
                price: 65,
                category: 'celebration',
                icon: 'fas fa-crown',
                color: 'from-yellow-200 to-white'
            },
            {
                id: 11,
                name: 'Novoletni Šopek',
                description: 'Sveži cvetovi za novoletno razpoloženje.',
                price: 38,
                category: 'celebration',
                icon: 'fas fa-snowflake',
                color: 'from-blue-200 to-white'
            },
            {
                id: 23,
                name: 'Matični Dan',
                description: 'Posebni šopek za materinski dan.',
                price: 42,
                category: 'celebration',
                icon: 'fas fa-female',
                color: 'from-pink-200 to-purple-200'
            },
            {
                id: 24,
                name: 'Očetov Dan',
                description: 'Moški šopek za očetovski dan.',
                price: 40,
                category: 'celebration',
                icon: 'fas fa-male',
                color: 'from-blue-200 to-green-200'
            },
            {
                id: 25,
                name: 'Velikonočni Šopek',
                description: 'Pomladni cvetovi za velikonočne praznike.',
                price: 35,
                category: 'celebration',
                icon: 'fas fa-egg',
                color: 'from-yellow-200 to-green-200'
            },
            {
                id: 26,
                name: 'Božični Šopek',
                description: 'Praznični cvetovi za božično razpoloženje.',
                price: 45,
                category: 'celebration',
                icon: 'fas fa-tree',
                color: 'from-green-200 to-red-200'
            },
            {
                id: 27,
                name: 'Diplomski Šopek',
                description: 'Posebni šopek za diplomske proslave.',
                price: 48,
                category: 'celebration',
                icon: 'fas fa-graduation-cap',
                color: 'from-blue-200 to-gold-200'
            },
            {
                id: 38,
                name: 'Slavnostni Mešani',
                description: 'Mešanica cvetov za slavnostne priložnosti.',
                price: 55,
                category: 'celebration',
                icon: 'fas fa-crown',
                color: 'from-purple-200 to-pink-200'
            },
            {
                id: 39,
                name: 'Rođendanski Posebni',
                description: 'Posebni šopek za rođendanske proslave.',
                price: 42,
                category: 'celebration',
                icon: 'fas fa-birthday-cake',
                color: 'from-yellow-200 to-orange-200'
            },
            {
                id: 40,
                name: 'Praznični Klasični',
                description: 'Klasični praznični cvetovi.',
                price: 38,
                category: 'celebration',
                icon: 'fas fa-gift',
                color: 'from-red-200 to-green-200'
            },
            {
                id: 41,
                name: 'Novoletni Posebni',
                description: 'Posebni šopek za novoletne proslave.',
                price: 45,
                category: 'celebration',
                icon: 'fas fa-snowflake',
                color: 'from-blue-200 to-white'
            },
            {
                id: 42,
                name: 'Veseli Mešani',
                description: 'Veseli mešani cvetovi za proslave.',
                price: 40,
                category: 'celebration',
                icon: 'fas fa-smile',
                color: 'from-yellow-200 to-pink-200'
            },

            // Sezonski šopki
            {
                id: 12,
                name: 'Naravni Šopek',
                description: 'Divji cvetovi in zelenje za ljubitelje narave.',
                price: 40,
                category: 'seasonal',
                icon: 'fas fa-leaf',
                color: 'from-green-200 to-teal-300'
            },
            {
                id: 13,
                name: 'Pomladni Šopek',
                description: 'Sveži tulipani in narcise za pomladno razpoloženje.',
                price: 42,
                category: 'seasonal',
                icon: 'fas fa-seedling',
                color: 'from-green-200 to-yellow-200'
            },
            {
                id: 14,
                name: 'Poletni Šopek',
                description: 'Svetli cvetovi za vroče poletne dni.',
                price: 45,
                category: 'seasonal',
                icon: 'fas fa-sun',
                color: 'from-orange-200 to-yellow-200'
            },
            {
                id: 15,
                name: 'Jesenski Šopek',
                description: 'Topli jesenski odtenki za spremembo sezone.',
                price: 43,
                category: 'seasonal',
                icon: 'fas fa-leaf',
                color: 'from-orange-200 to-red-200'
            },
            {
                id: 16,
                name: 'Zimski Šopek',
                description: 'Hladni odtenki za zimsko razpoloženje.',
                price: 47,
                category: 'seasonal',
                icon: 'fas fa-snowflake',
                color: 'from-blue-200 to-purple-200'
            },
            {
                id: 17,
                name: 'Vrtni Šopek',
                description: 'Mešanica vrtnih cvetov za domačo atmosfero.',
                price: 39,
                category: 'seasonal',
                icon: 'fas fa-tree',
                color: 'from-green-200 to-brown-200'
            },
            {
                id: 32,
                name: 'Mešani Sezonski',
                description: 'Mešanica cvetov iz vseh sezon.',
                price: 43,
                category: 'seasonal',
                icon: 'fas fa-calendar',
                color: 'from-green-200 to-blue-200'
            },
            {
                id: 47,
                name: 'Naravni Divji',
                description: 'Divji naravni cvetovi.',
                price: 37,
                category: 'seasonal',
                icon: 'fas fa-tree',
                color: 'from-green-200 to-brown-200'
            },

            // Rože za zavihtek "Po meri"
            {
                id: 301,
                name: '1x Rdeče Vrtnice',
                description: '12 rdečih vrtnic v elegantni embalaži.',
                price: 2.50,
                category: 'custom',
                icon: 'fas fa-rose',
                color: 'from-red-200 to-pink-200'
            },
            {
                id: 302,
                name: '1x Beli Lilije',
                description: '5 belih lilij za posebne trenutke.',
                price: 3.00,
                category: 'custom',
                icon: 'fas fa-star',
                color: 'from-white to-pink-200'
            },
            {
                id: 303,
                name: '1x Sončnice',
                description: '5 velikih sončnic za veselo razpoloženje.',
                price: 1.80,
                category: 'custom',
                icon: 'fas fa-sun',
                color: 'from-yellow-200 to-orange-200'
            },
            {
                id: 304,
                name: '1x Orhideje',
                description: 'Elegantne bele orhideje v lončku.',
                price: 4.50,
                category: 'custom',
                icon: 'fas fa-leaf',
                color: 'from-white to-purple-200'
            },
            {
                id: 305,
                name: '1x Tulipani',
                description: '10 barvitih tulipanov za pomlad.',
                price: 0.60,
                category: 'custom',
                icon: 'fas fa-seedling',
                color: 'from-pink-200 to-yellow-200'
            },
            {
                id: 306,
                name: '1x Peonije',
                description: '5 rožnatih peonij za romantične trenutke.',
                price: 2.80,
                category: 'custom',
                icon: 'fas fa-heart',
                color: 'from-pink-200 to-white'
            },
            {
                id: 307,
                name: '1x Gerberi',
                description: 'Barviti gerberi za veselo razpoloženje.',
                price: 1.50,
                category: 'custom',
                icon: 'fas fa-sun',
                color: 'from-orange-200 to-yellow-200'
            },
            {
                id: 308,
                name: '1x Hrizanteme',
                description: 'Jesenske hrizanteme v različnih barvah.',
                price: 1.20,
                category: 'custom',
                icon: 'fas fa-leaf',
                color: 'from-orange-200 to-red-200'
            },
            {
                id: 309,
                name: '1x Irisi',
                description: 'Modri irisi za elegantne trenutke.',
                price: 2.20,
                category: 'custom',
                icon: 'fas fa-eye',
                color: 'from-blue-200 to-purple-200'
            },
            {
                id: 310,
                name: '1x Narcise',
                description: 'Rumene narcise za pomladno razpoloženje.',
                price: 0.80,
                category: 'custom',
                icon: 'fas fa-seedling',
                color: 'from-yellow-200 to-white'
            },
            {
                id: 311,
                name: '1x Gladioli',
                description: 'Visoki gladioli za impozantne aranžmaje.',
                price: 2.40,
                category: 'custom',
                icon: 'fas fa-arrow-up',
                color: 'from-pink-200 to-purple-200'
            },
            {
                id: 312,
                name: '1x Frezije',
                description: 'Dišeče bele frezije za nežne trenutke.',
                price: 2.60,
                category: 'custom',
                icon: 'fas fa-star',
                color: 'from-white to-yellow-200'
            },
            {
                id: 313,
                name: '1x Alstromerije',
                description: 'Barvite alstromerije za dolgotrajno veselje.',
                price: 1.90,
                category: 'custom',
                icon: 'fas fa-seedling',
                color: 'from-pink-200 to-orange-200'
            },
            {
                id: 314,
                name: '1x Eustoma',
                description: 'Elegantne bele eustome za posebne priložnosti.',
                price: 2.70,
                category: 'custom',
                icon: 'fas fa-heart',
                color: 'from-white to-pink-200'
            },
            {
                id: 315,
                name: '1x Protea',
                description: 'Eksotične protee za unikatne aranžmaje.',
                price: 3.80,
                category: 'custom',
                icon: 'fas fa-fire',
                color: 'from-red-200 to-pink-200'
            },
            {
                id: 316,
                name: '1x Anthurium',
                description: 'Rdeči anthurium za dolgotrajno veselje.',
                price: 2.30,
                category: 'custom',
                icon: 'fas fa-heart',
                color: 'from-red-200 to-white'
            },
            {
                id: 317,
                name: '1x Calla Lilije',
                description: 'Elegantne bele calla lilije za poroke.',
                price: 3.20,
                category: 'custom',
                icon: 'fas fa-star',
                color: 'from-white to-green-200'
            },
            {
                id: 318,
                name: '1x Dendrobium',
                description: 'Barvite dendrobium orhideje v lončku.',
                price: 3.50,
                category: 'custom',
                icon: 'fas fa-leaf',
                color: 'from-purple-200 to-pink-200'
            },
            {
                id: 319,
                name: '1x Gypsophila',
                description: 'Nežni beli gypsophila za dopolnitev aranžmajev.',
                price: 0.90,
                category: 'custom',
                icon: 'fas fa-snowflake',
                color: 'from-white to-pink-200'
            },
            {
                id: 320,
                name: '1x Limonium',
                description: 'Modri limonium za trajne aranžmaje.',
                price: 1.10,
                category: 'custom',
                icon: 'fas fa-leaf',
                color: 'from-blue-200 to-purple-200'
            },
            {
                id: 321,
                name: '1x Solidago',
                description: 'Rumena solidago za žive aranžmaje.',
                price: 1.00,
                category: 'custom',
                icon: 'fas fa-sun',
                color: 'from-yellow-200 to-orange-200'
            },
            {
                id: 322,
                name: '1x Aster',
                description: 'Jesenske astre v različnih barvah.',
                price: 1.30,
                category: 'custom',
                icon: 'fas fa-star',
                color: 'from-purple-200 to-pink-200'
            },
            {
                id: 323,
                name: '1x Delphinium',
                description: 'Visoki modri delphinium za impozantne aranžmaje.',
                price: 2.10,
                category: 'custom',
                icon: 'fas fa-arrow-up',
                color: 'from-blue-200 to-purple-200'
            },
            {
                id: 324,
                name: '1x Lavanda',
                description: 'Dišeča vijolična lavanda za sproščujoče trenutke.',
                price: 1.60,
                category: 'custom',
                icon: 'fas fa-leaf',
                color: 'from-purple-200 to-blue-200'
            },
            {
                id: 325,
                name: '1x Eukaliptus',
                description: 'Sveži eukaliptus listi za aromaterapijo.',
                price: 0.70,
                category: 'custom',
                icon: 'fas fa-leaf',
                color: 'from-green-200 to-blue-200'
            },
            {
                id: 326,
                name: '1x Ruscus',
                description: 'Zeleni ruscus za dopolnitev aranžmajev.',
                price: 0.60,
                category: 'custom',
                icon: 'fas fa-tree',
                color: 'from-green-200 to-teal-200'
            },
            {
                id: 327,
                name: '1x Asparagus',
                description: 'Elegantni asparagus za fino dopolnitev.',
                price: 0.80,
                category: 'custom',
                icon: 'fas fa-seedling',
                color: 'from-green-200 to-yellow-200'
            }
        ];
        console.log(`Products initialized: ${products.length} items`);
        return products;
    }

    // Wedding Packages Data
    initWeddingPackages() {
        return [
            {
                id: 101,
                name: 'Osnovni Poročni Paket',
                description: 'Poročni šopek, boutonnière in osnovna dekoracija.',
                price: 150,
                category: 'wedding',
                icon: 'fas fa-rings-wedding',
                includes: ['Poročni šopek', 'Boutonnière', 'Osnovna dekoracija']
            },
            {
                id: 102,
                name: 'Klasični Poročni Paket',
                description: 'Popoln poročni paket z dekoracijo cerkve.',
                price: 280,
                category: 'wedding',
                icon: 'fas fa-church',
                includes: ['Poročni šopek', 'Boutonnière', 'Cerkvena dekoracija', 'Centerpieces']
            },
            {
                id: 103,
                name: 'Luxury Poročni Paket',
                description: 'Luksuzni poročni paket z popolno dekoracijo.',
                price: 450,
                category: 'wedding',
                icon: 'fas fa-crown',
                includes: ['Poročni šopek', 'Boutonnière', 'Cerkvena dekoracija', 'Centerpieces', 'Lokacija dekoracija']
            },
            {
                id: 104,
                name: 'Poročni Šopek',
                description: 'Samo poročni šopek za nevesto.',
                price: 85,
                category: 'wedding',
                icon: 'fas fa-rose',
                includes: ['Poročni šopek']
            },
            {
                id: 105,
                name: 'Set Gumbnic',
                description: 'Gumbnice za ženina in družabnike.',
                price: 45,
                category: 'wedding',
                icon: 'fas fa-user-tie',
                includes: ['Gumbnica za ženina', 'Gumbnica za družabnike']
            },
            {
                id: 106,
                name: 'Cerkvena Dekoracija',
                description: 'Popolna dekoracija cerkve za poroko.',
                price: 200,
                category: 'wedding',
                icon: 'fas fa-cross',
                includes: ['Dekoracija prizorišča', 'Cerkveni okraski']
            }
        ];
    }

    // Funeral Products Data
    initFuneralProducts() {
        return [
            // Venčki
            {
                id: 201,
                name: 'Klasični Žalni Venček',
                description: 'Tradicionalni venček iz svežega cvetja in zelenja za dostojanstven spomin.',
                price: 80,
                category: 'funeral',
                icon: 'fas fa-circle'
            },
            {
                id: 202,
                name: 'Luksuzni Venček',
                description: 'Elegantni venček z ekskluzivnimi cvetovi za poseben spomin.',
                price: 120,
                category: 'funeral',
                icon: 'fas fa-circle'
            },
            {
                id: 203,
                name: 'Mali Venček',
                description: 'Kompaktni venček za intimne obrede in spominske slovesnosti.',
                price: 50,
                category: 'funeral',
                icon: 'fas fa-circle'
            },
            // Ikebane
            {
                id: 204,
                name: 'Tradicionalna Ikebana',
                description: 'Elegantni japonski aranžma za miren in dostojanstven spomin.',
                price: 60,
                category: 'funeral',
                icon: 'fas fa-leaf'
            },
            {
                id: 205,
                name: 'Moderni Ikebana',
                description: 'Sodobna interpretacija tradicionalne japonske umetnosti.',
                price: 85,
                category: 'funeral',
                icon: 'fas fa-leaf'
            },
            {
                id: 206,
                name: 'Mini Ikebana',
                description: 'Majhen, a izrazit aranžma za osebne spominske trenutke.',
                price: 40,
                category: 'funeral',
                icon: 'fas fa-leaf'
            },
            // Srčni Aranžmaji
            {
                id: 207,
                name: 'Klasično Srce',
                description: 'Personalizirani aranžma v obliki srca za izražanje ljubezni in spomina.',
                price: 95,
                category: 'funeral',
                icon: 'fas fa-heart'
            },
            {
                id: 208,
                name: 'Veliko Srce',
                description: 'Impozanten srčni aranžma za posebne spominske slovesnosti.',
                price: 150,
                category: 'funeral',
                icon: 'fas fa-heart'
            },
            {
                id: 209,
                name: 'Dvojno Srce',
                description: 'Elegantni aranžma z dvema srcama za izražanje globoke ljubezni.',
                price: 180,
                category: 'funeral',
                icon: 'fas fa-heart'
            }
        ];
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]') || e.target.closest('[data-page]')) {
                e.preventDefault();
                const target = e.target.closest('[data-page]') || e.target;
                const page = target.dataset.page;
                const filter = target.dataset.filter;
                
                console.log('Navigation clicked:', page, target);
                this.navigateToPage(page);
                
                // If it's a dropdown filter, apply the filter
                if (filter && page === 'sopki') {
                    setTimeout(() => {
                        this.applyFilter(filter);
                    }, 100);
                }
            }
        });

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        
        // Dodaj overlay element (če še ne obstaja)
        let menuOverlay = document.querySelector('.mobile-menu-overlay');
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'mobile-menu-overlay';
            menuOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: rgba(0, 0, 0, 0.5); z-index: 10001; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; visibility: hidden;';
            document.body.appendChild(menuOverlay);
        }
        
        // Posodobi overlay, ko se meni odpre/zapre
        const updateOverlay = () => {
            if (navMenu && navMenu.classList.contains('active')) {
                menuOverlay.style.opacity = '1';
                menuOverlay.style.pointerEvents = 'auto';
                menuOverlay.style.visibility = 'visible';
                document.body.style.overflow = 'hidden'; // Prepreči scroll samo ko je meni odprt
            } else {
                menuOverlay.style.opacity = '0';
                menuOverlay.style.pointerEvents = 'none';
                menuOverlay.style.visibility = 'hidden';
                document.body.style.overflow = ''; // Omogoči scroll ko je meni zaprt
            }
        };
        
        // Inicialno skrij meni na mobilnih napravah
        if (window.innerWidth <= 768 && navMenu) {
            navMenu.classList.remove('active');
            updateOverlay();
        }
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const isActive = navMenu.classList.contains('active');
                console.log('Mobile toggle clicked, isActive:', isActive);
                
                if (isActive) {
                    // Zapri meni
                    console.log('Closing menu');
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    // Odstrani inline stile
                    navMenu.style.removeProperty('display');
                    navMenu.style.removeProperty('visibility');
                    navMenu.style.removeProperty('opacity');
                    navMenu.style.removeProperty('position');
                    navMenu.style.removeProperty('top');
                    navMenu.style.removeProperty('left');
                    navMenu.style.removeProperty('width');
                    navMenu.style.removeProperty('height');
                    navMenu.style.removeProperty('background');
                    navMenu.style.removeProperty('flex-direction');
                    navMenu.style.removeProperty('justify-content');
                    navMenu.style.removeProperty('align-items');
                    navMenu.style.removeProperty('padding');
                    navMenu.style.removeProperty('box-shadow');
                    navMenu.style.removeProperty('z-index');
                    navMenu.style.removeProperty('overflow-y');
                    navMenu.style.removeProperty('list-style');
                    navMenu.style.removeProperty('gap');
                    navMenu.style.removeProperty('pointer-events');
                } else {
                    // Odpri meni
                    console.log('Opening menu');
                    navMenu.classList.add('active');
                    mobileToggle.classList.add('active');
                    
                    // Nastavi inline stile TAKOJ - ne čakaj na requestAnimationFrame
                    // Uporabi cssText za zagotovitev, da se vse nastavi naenkrat
                    const menuStyles = `
                        display: flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: fixed !important;
                        top: 80px !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: calc(100vh - 80px) !important;
                        background: #ffffff !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                        align-items: center !important;
                        padding: 2rem !important;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
                        z-index: 10002 !important;
                        overflow-y: auto !important;
                        list-style: none !important;
                        gap: 0 !important;
                        pointer-events: auto !important;
                        margin: 0 !important;
                        transform: none !important;
                    `;
                    navMenu.style.cssText = menuStyles;
                    
                    // Posodobi overlay
                    updateOverlay();
                    
                    // Preveri, ali se meni res prikaže
                    setTimeout(() => {
                        const computed = window.getComputedStyle(navMenu);
                        console.log('Menu opened - display:', computed.display);
                        console.log('Menu opened - visibility:', computed.visibility);
                        console.log('Menu opened - opacity:', computed.opacity);
                        console.log('Menu opened - z-index:', computed.zIndex);
                        console.log('Menu opened - position:', computed.position);
                        if (computed.display === 'none') {
                            console.error('MENU JE ŠE VEDNO SKRIT! Poskušam ponovno prikazati...');
                            navMenu.style.cssText = menuStyles;
                        }
                    }, 100);
                }
            });
        }
        
        // Funkcija za zapiranje menija
        const closeMobileMenu = () => {
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (navMenu) {
                navMenu.classList.remove('active');
                // Odstrani vse inline stile
                navMenu.style.removeProperty('display');
                navMenu.style.removeProperty('visibility');
                navMenu.style.removeProperty('opacity');
                navMenu.style.removeProperty('position');
                navMenu.style.removeProperty('top');
                navMenu.style.removeProperty('left');
                navMenu.style.removeProperty('width');
                navMenu.style.removeProperty('height');
                navMenu.style.removeProperty('background');
                navMenu.style.removeProperty('flex-direction');
                navMenu.style.removeProperty('justify-content');
                navMenu.style.removeProperty('align-items');
                navMenu.style.removeProperty('padding');
                navMenu.style.removeProperty('box-shadow');
                navMenu.style.removeProperty('z-index');
                navMenu.style.removeProperty('overflow-y');
                navMenu.style.removeProperty('list-style');
                navMenu.style.removeProperty('gap');
                navMenu.style.removeProperty('pointer-events');
            }
            updateOverlay();
        };
        
        // Zapri meni, ko kliknemo na overlay
        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMobileMenu);
        }
        
        // Zapri meni, ko kliknemo na navigacijski link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Opazuj spremembe v navMenu
        if (navMenu) {
            const observer = new MutationObserver(updateOverlay);
            observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
        }
        
        // Zapri meni, ko se okno preoblikuje (desktop -> mobile)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu) {
                navMenu.classList.remove('active');
                if (mobileToggle) mobileToggle.classList.remove('active');
                updateOverlay();
            }
        });
        
        // Dropdown menu toggle (mobile + desktop): keep open when clicking inside menu
        document.addEventListener('click', (e) => {
            const rootDropdown = e.target.closest('.dropdown');
            const isTrigger = e.target.closest('.dropdown > a, .dropdown > button, .dropdown > .nav-link');
            const inMenu = !!e.target.closest('.dropdown-menu');

            // If clicking a trigger, toggle only that dropdown
            if (isTrigger && rootDropdown) {
                e.preventDefault();
                const wasActive = rootDropdown.classList.contains('active');
                document.querySelectorAll('.dropdown').forEach(dd => dd.classList.remove('active'));
                if (!wasActive) rootDropdown.classList.add('active');
                return;
            }

            // If clicking inside an open menu, keep it open
            if (inMenu && rootDropdown) {
                rootDropdown.classList.add('active');
                return;
            }

            // Otherwise, close all dropdowns
            document.querySelectorAll('.dropdown').forEach(dd => dd.classList.remove('active'));
        });

        // Close mobile menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle?.classList.remove('active');
                navMenu?.classList.remove('active');
                document.body.style.overflow = '';
                updateOverlay();
            });
        });

        // Language selection buttons - with mobile support
        const langSLO = document.getElementById('langSLO');
        const langANG = document.getElementById('langANG');
        
        if (langSLO) {
            // Click event works on both desktop and mobile
            langSLO.addEventListener('click', () => {
                this.switchLanguage('sl');
            });
        }
        
        if (langANG) {
            // Click event works on both desktop and mobile
            langANG.addEventListener('click', () => {
                this.switchLanguage('en');
            });
        }

        // Cart functionality
        const cartBtn = document.getElementById('cartBtn');
        const testCartBtn = document.getElementById('testCartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const closeCart = document.getElementById('closeCart');

        if (cartBtn) {
            console.log('Cart button found, adding event listener');
            cartBtn.addEventListener('click', () => toggleCart());
        } else {
            console.error('Cart button not found!');
        }

        // Add event listeners for global cart functions - REMOVED DUPLICATE LISTENER

        document.addEventListener('click', (e) => {
            if (e.target.id === 'testCartBtn') {
                console.log('Test cart button clicked!');
                toggleCart();
            }
        });



        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeCart') {
                closeCart();
            }
        });

        // Add event listeners for custom size buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('size-btn') || e.target.closest('.size-btn')) {
                const sizeBtn = e.target.closest('.size-btn');
                const maxItems = parseInt(sizeBtn.getAttribute('data-max-items'));
                const sizeLabel = sizeBtn.querySelector('.size-label').textContent;
                
                // Update active size button
                document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
                sizeBtn.classList.add('active');
                
                // Store max items for custom bouquets
                this.customBouquetMaxItems = maxItems;
                this.customBouquetName = sizeLabel;
                
                // Check if there's already a custom bouquet selected
                const existingBouquet = this.cart.find(item => item.isCustomBouquet);
                
                if (existingBouquet) {
                    // Show confirmation dialog for bouquet change
                    this.showBouquetChangeDialog(sizeLabel, maxItems);
                } else {
                    // Store selected bouquet info for later creation
                    this.selectedBouquetInfo = { name: sizeLabel, maxItems: maxItems };
                    this.showNotification(`Izbrali ste ${sizeLabel}. Sedaj izberite rože za dodajanje v šopek!`, 'info');
                }
                
                console.log(`Selected custom bouquet: ${sizeLabel} (${maxItems} items max)`);
            }
        });

        // Ensure custom tab starts with no selection
        const customButtons = document.getElementById('customSizeButtons');
        if (customButtons) {
            customButtons.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        }

        // Add click outside to close cart
        document.addEventListener('click', (e) => {
            const cart = document.getElementById('simpleCart');
            const cartContainer = document.querySelector('.cart-container');
            
            if (cart && cart.classList.contains('show')) {
                // Check if click is outside cart container
                if (e.target === cart || e.target.classList.contains('cart-overlay')) {
                    console.log('Clicked outside cart - closing');
                    hideCart();
                }
            }
        });

        // Add direct event listener to cart modal
        const cartModal = document.getElementById('simpleCart');
        if (cartModal) {
            cartModal.addEventListener('click', (e) => {
                if (e.target === cartModal) {
                    console.log('Clicked on cart modal background - closing');
                    hideCart();
                }
            });
        }

        // Prevent cart container clicks from closing the cart
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        if (closeCart) {
            closeCart.addEventListener('click', () => this.closeCart());
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // Login functionality
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const loginModal = document.getElementById('loginModal');
        const loginOverlay = document.getElementById('loginOverlay');
        const closeLogin = document.getElementById('closeLogin');
        const loginForm = document.getElementById('loginForm');
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        const showForgotPassword = document.getElementById('showForgotPassword');
        const backToLogin = document.getElementById('backToLogin');

        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        if (closeLogin) {
            closeLogin.addEventListener('click', () => this.hideLoginModal());
        }

        if (loginOverlay) {
            loginOverlay.addEventListener('click', () => this.hideLoginModal());
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (showForgotPassword) {
            showForgotPassword.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }

        if (backToLogin) {
            backToLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideForgotPasswordModal();
                this.showLoginModal();
            });
        }

        // Registration functionality
        const registrationModal = document.getElementById('registrationModal');
        const closeRegistration = document.getElementById('closeRegistration');
        const registrationForm = document.getElementById('registrationForm');

        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegistrationModal();
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideRegistrationModal();
                this.showLoginModal();
            });
        }

        if (closeRegistration) {
            closeRegistration.addEventListener('click', () => this.hideRegistrationModal());
        }

        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }

        // Forgot password functionality
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        const closeForgotPassword = document.getElementById('closeForgotPassword');
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');

        if (closeForgotPassword) {
            closeForgotPassword.addEventListener('click', () => this.hideForgotPasswordModal());
        }

        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Order form functionality
        const orderModal = document.getElementById('orderModal');
        const closeOrder = document.getElementById('closeOrder');
        const orderForm = document.getElementById('orderForm');

        if (closeOrder) {
            closeOrder.addEventListener('click', () => this.hideOrderModal());
        }

        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.handleOrderForm(e));
        }

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                this.handleFilter(e.target);
            }
            
            // Category filter buttons (for "Vsi" tab)
            if (e.target.matches('.category-filter-btn')) {
                // Remove active class from all category filter buttons
                document.querySelectorAll('.category-filter-btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Filter products by category
                const category = e.target.dataset.category;
                this.renderProducts(category);
            }
        });

        // Scroll to top on page change
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link')) {
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
            }
        });

        // Hero scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.querySelector('.about-section');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }



        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCart();
                this.closeNotification();
            }
        });
    }

    // Loading Screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        }
    }

    // Navigation
    initNavigation() {
        // Set initial page to home (Domov)
        this.showPage('domov');
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'domov';
            this.showPage(page, false);
        });
    }

    navigateToPage(pageId) {
        this.showPage(pageId);
        history.pushState({ page: pageId }, '', `#${pageId}`);
    }

    showPage(pageId, updateHistory = true) {
        // Get all pages
        const allPages = document.querySelectorAll('.page-section');
        const targetPage = document.getElementById(pageId);
        
        if (!targetPage) return;

        // INSTANTLY show target page first - FORCE with direct style manipulation
        targetPage.classList.add('active');
        targetPage.style.setProperty('display', 'block', 'important');
        targetPage.style.setProperty('visibility', 'visible', 'important');
        targetPage.style.setProperty('opacity', '1', 'important');
        this.currentPage = pageId;

        // Then hide all other pages - FORCE hidden with direct style
        allPages.forEach(page => {
            if (page.id !== pageId) {
                page.classList.remove('active');
                page.style.setProperty('display', 'none', 'important');
                page.style.setProperty('visibility', 'hidden', 'important');
                page.style.setProperty('opacity', '0', 'important');
            }
        });
        
        // Scroll to top when changing pages
        window.scrollTo({
            top: 0,
            behavior: 'instant'
        });

        // Update navigation
        this.updateNavigation(pageId);

        // Only trigger counters for home page, skip animations to prevent hiding elements
        if (pageId === 'domov') {
            setTimeout(() => {
                this.initCounters();
            }, 100);
        }
    }

    updateNavigation(activePageId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === activePageId) {
                link.classList.add('active');
            }
        });
    }

    // Animations
    initAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Add fade-in class to elements
        const elementsToAnimate = document.querySelectorAll(`
            #${this.currentPage} .section-header,
            #${this.currentPage} .feature-card,
            #${this.currentPage} .product-card,
            #${this.currentPage} .funeral-card,
            #${this.currentPage} .wedding-info,
            #${this.currentPage} .contact-form-section
        `);

        elementsToAnimate.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Scroll Effects
    initScrollEffects() {
        let lastScrollY = window.scrollY;
        const navbar = document.getElementById('navbar');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Navbar scroll effect
            if (navbar) {
                if (currentScrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            // Parallax effect for hero section (disabled to prevent text overlap)
            // const heroSection = document.querySelector('.hero-section');
            // if (heroSection && window.innerWidth > 768) {
            //     const scrolled = currentScrollY * 0.5;
            //     heroSection.style.transform = `translateY(${scrolled}px)`;
            // }

            lastScrollY = currentScrollY;
        });
    }

    // Particles Animation
    initParticles() {
        const heroParticles = document.querySelector('.hero-particles');
        if (heroParticles) {
            // Create floating particles
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 6 + 2}px;
                    height: ${Math.random() * 6 + 2}px;
                    background: var(--primary-pink);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    opacity: ${Math.random() * 0.5 + 0.2};
                    animation: particleFloat ${Math.random() * 10 + 15}s infinite ease-in-out;
                `;
                heroParticles.appendChild(particle);
            }
        }

        // Add particle float animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
                50% { transform: translateY(-40px) translateX(-5px) rotate(180deg); }
                75% { transform: translateY(-20px) translateX(-10px) rotate(270deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Products
    initProductRendering() {
        // Don't render products immediately, wait for DOM to be ready
        setTimeout(() => {
        this.renderProducts();
        }, 100);
    }

    renderProducts(filter = 'romantic') {
        this.currentProductsFilter = filter;
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) {
            console.log('productsGrid element not found, skipping render');
            return;
        }

        if (!this.products || !Array.isArray(this.products)) {
            console.log('Products array not available, skipping render');
            return;
        }

        // Toggle compact layout for custom tab (1.2x size, 5 per row)
        if (filter === 'custom') {
            productsGrid.classList.add('custom-grid');
        } else {
            productsGrid.classList.remove('custom-grid');
        }

        const filteredProducts = this.products.filter(product => product.category === filter);

        console.log(`Rendering ${filteredProducts.length} products for filter: ${filter}`);
        console.log('Available products:', this.products.map(p => ({ id: p.id, name: p.name, category: p.category })));
        console.log('Filtered products:', filteredProducts.map(p => ({ id: p.id, name: p.name, category: p.category })));

        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = '<div class="no-products">Ni artiklov za prikaz.</div>';
            return;
        }

        // Regular rendering for specific categories
        productsGrid.innerHTML = filteredProducts.map(product => {
            const isCustomMode = filter === 'custom';
            
            // For custom products, don't show description (only name)
            const showDescription = !isCustomMode;
            
            return `
            <div class="product-card fade-in" data-category="${product.category}" onclick="glaam.selectProduct(${product.id})">
                <div class="product-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" class="product-img">` : 
                        `<i class="${product.icon}"></i>`
                    }
                </div>
                <div class="product-info">
                    <h3 class="product-title">${this.getTranslatedName(product)}</h3>
                    ${showDescription ? `<p class="product-description">${this.getTranslatedDesc(product)}</p>` : ''}
                    <div class="product-quantity">
                        <button class="quantity-btn" onclick="event.stopPropagation(); glaam.decreaseQuantity(${product.id})">-</button>
                        <span class="quantity-display" id="qty-${product.id}">1</span>
                        <button class="quantity-btn" onclick="event.stopPropagation(); glaam.increaseQuantity(${product.id})">+</button>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.price}€</span>
                        <button class="product-btn" onclick="event.stopPropagation(); ${isCustomMode ? `glaam.addFlowerToCustomBouquet(${product.id})` : `glaam.addToCart(${product.id})`}">
                            ${typeof i18next !== 'undefined' ? i18next.t('products.addToCart') : 'Dodaj v košarico'}
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');

        // Reinitialize animations for new products
        setTimeout(() => this.initAnimations(), 100);
    }


// Tudi funkcijo renderWeddingPackages() lahko odstranite, ker se ne bo več uporabljala:
/*
renderWeddingPackages() {
    const weddingSection = document.querySelector('#poroka .wedding-content');
    if (!weddingSection) return;

    const packagesHTML = `
        <div class="wedding-packages">
            <h3>${typeof i18next !== 'undefined' ? i18next.t('wedding.packages.title') : 'Naši Poročni Paketi'}</h3>
            <div class="packages-grid">
                ${this.weddingPackages.map(pkg => `
                    <div class="package-card fade-in">
                        <div class="package-icon">
                            <i class="${pkg.icon}"></i>
                        </div>
                        <h4>${pkg.name}</h4>
                        <p>${pkg.description}</p>
                        <ul class="package-includes">
                            ${pkg.includes.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('')}
                        </ul>
                        <div class="package-price">${pkg.price}€</div>
                        <button class="package-btn" onclick="bloom.addToCart(${pkg.id})">
                            <i class="fas fa-shopping-bag"></i> Izberi Paket
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    weddingSection.insertAdjacentHTML('beforeend', packagesHTML);
}
*/

    handleFilter(filterBtn) {
        console.log('Handle filter called with:', filterBtn);
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        filterBtn.classList.add('active');

        // Filter products
        const filter = filterBtn.dataset.filter;
        console.log('Filter from handleFilter:', filter);
        this.currentProductsFilter = filter;
        this.renderProducts(filter);
        
        // Also call applyFilter to show/hide custom size buttons
        this.applyFilter(filter);
    }

    applyFilter(filter) {
        console.log(`Applying filter: ${filter}`);
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        // Show/hide category filters based on selected tab
        const categoryFilters = document.getElementById('categoryFilters');
        if (categoryFilters) {
            if (filter === 'all') {
                categoryFilters.style.display = 'block';
            } else {
                categoryFilters.style.display = 'none';
            }
        }

        // Show/hide custom size buttons based on filter and clear previous selection
        const customSizeButtons = document.getElementById('customSizeButtons');
        if (customSizeButtons) {
            const isCustom = filter === 'custom';
            customSizeButtons.style.display = isCustom ? 'flex' : 'none';
            if (isCustom) {
                customSizeButtons.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
                this.customBouquetMaxItems = undefined;
            }
        }

        // Render products with filter
        this.renderProducts(filter);
    }

    // Cart Management
    async addToCart(productId) {
        // Check products, wedding packages, and funeral products
        let product = this.products.find(p => p.id === productId);
        if (!product) {
            product = this.weddingPackages.find(p => p.id === productId);
        }
        if (!product) {
            product = this.funeralProducts.find(p => p.id === productId);
        }
        
        if (product) {
            let quantity = 1;
            if (productId <= 75) { // Regular products have IDs 1-75
                const quantityElement = document.getElementById(`qty-${productId}`);
                quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;
            }
            
            // Uporabi CartManager če je na voljo
            if (this.cartManager) {
                try {
                    await this.cartManager.addToCart(productId, quantity, product);
                    this.cart = this.cartManager.getCart();
                    this.updateCart();
                    this.showNotification(`${product.name} dodan v košarico!`, 'success');
                    console.log(`Product ${product.name} (qty: ${quantity}) added to cart via CartManager`);
                } catch (error) {
                    console.error('Error adding to cart via CartManager:', error);
                    // Fallback na lokalno košarico
                    this.addToCartLocal(product, quantity);
                }
            } else {
                // Fallback na lokalno košarico
                this.addToCartLocal(product, quantity);
            }
        } else {
            console.error(`Product with ID ${productId} not found`);
        }
    }
    
    // Lokalna metoda za dodajanje (fallback)
    addToCartLocal(product, quantity) {
        const existingItem = this.cart.find(item => item.id === product.id && !item.isCustomBouquet);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            this.showNotification(`${product.name} - količina povečana na ${existingItem.quantity}!`, 'success');
        } else {
            this.cart.push({ ...product, quantity: quantity });
            this.showNotification(`${product.name} dodan v košarico!`, 'success');
        }
        
        this.updateCart();
        this.saveCartToStorage();
        console.log(`Product ${product.name} (qty: ${quantity}) added to cart locally. Total items: ${this.cart.length}`);
    }

    increaseQuantity(productId) {
        const quantityElement = document.getElementById(`qty-${productId}`);
        if (quantityElement) {
            const currentQty = parseInt(quantityElement.textContent);
            const newQty = Math.min(currentQty + 1, 99); // Max 99
            quantityElement.textContent = newQty;
        }
    }

    decreaseQuantity(productId) {
        const quantityElement = document.getElementById(`qty-${productId}`);
        if (quantityElement) {
            const currentQty = parseInt(quantityElement.textContent);
            const newQty = Math.max(currentQty - 1, 1); // Min 1
            quantityElement.textContent = newQty;
        }
    }

    selectProduct(productId) {
        // Remove selection from all products
        document.querySelectorAll('.product-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked product
        const productCard = document.querySelector(`[onclick*="selectProduct(${productId})"]`);
        if (productCard) {
            productCard.classList.add('selected');
        }
    }

    async removeFromCart(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            // Uporabi CartManager če je na voljo
            if (this.cartManager) {
                try {
                    await this.cartManager.removeFromCart(productId);
                    this.cart = this.cartManager.getCart();
                    this.updateCart();
                    this.showNotification(`🗑️ ${item.name} odstranjen iz košarice`, 'info');
                    console.log(`Product ${productId} removed from cart via CartManager`);
                } catch (error) {
                    console.error('Error removing from cart via CartManager:', error);
                    // Fallback na lokalno košarico
                    this.removeFromCartLocal(productId, item);
                }
            } else {
                // Fallback na lokalno košarico
                this.removeFromCartLocal(productId, item);
            }
        }
    }
    
    // Lokalna metoda za odstranjevanje (fallback)
    removeFromCartLocal(productId, item) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCart();
        this.showNotification(`🗑️ ${item.name} odstranjen iz košarice`, 'info');
        this.saveCartToStorage();
    }

    updateCart() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.classList.toggle('show', totalItems > 0);
        }

        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.2rem; padding: 40px 0;">Vaša košarica je prazna.</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 2px solid #f0f0f0; background: #fafafa; border-radius: 10px; margin-bottom: 15px;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 8px 0; font-size: 1.2rem; color: #333; font-weight: bold;">${item.name}</h4>
                            <p style="margin: 0; color: #666; font-size: 1rem;">${item.price}€ na kos</p>
                        </div>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="display: flex; align-items: center; gap: 10px; background: white; padding: 8px 12px; border-radius: 25px; border: 2px solid #e91e63;">
                                <button onclick="updateQuantityGlobal(${item.id}, -1)" style="background: #e91e63; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; font-weight: bold; transition: all 0.3s;" onmouseover="this.style.background='#d81b60'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='#e91e63'; this.style.transform='scale(1)'">-</button>
                                <span style="font-weight: bold; font-size: 1.1rem; min-width: 30px; text-align: center;">${item.quantity}</span>
                                <button onclick="updateQuantityGlobal(${item.id}, 1)" style="background: #e91e63; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; font-weight: bold; transition: all 0.3s;" onmouseover="this.style.background='#d81b60'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='#e91e63'; this.style.transform='scale(1)'">+</button>
                        </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold; font-size: 1.3rem; color: #e91e63;">${(item.price * item.quantity).toFixed(2)}€</div>
                            </div>
                            <button onclick="removeFromCartGlobal(${item.id})" style="background: #ff4757; color: white; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; font-weight: bold; transition: all 0.3s; margin-left: 10px;" title="${typeof i18next !== 'undefined' ? i18next.t('products.removeFromCart') : 'Odstrani iz košarice'}" onmouseover="this.style.background='#ff3742'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='#ff4757'; this.style.transform='scale(1)'">×</button>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `${total.toFixed(2)}€`;
        }
    }

    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (!cartSidebar || !cartOverlay) return;

        const isOpen = cartSidebar.style.display === 'flex';

        if (isOpen) {
            // Close cart
            cartSidebar.style.display = 'none';
            cartOverlay.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            // Open cart
            cartSidebar.style.display = 'flex';
            cartOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.style.display = 'none';
            cartOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    // Cart Storage Functions
    saveCartToStorage() {
        localStorage.setItem('glaamCart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('glaamCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCart();
        }
    }

    async clearCart() {
        // Počisti CartManager če je na voljo
        if (this.cartManager) {
            try {
                await this.cartManager.clearCart();
                this.cart = [];
            } catch (error) {
                console.error('Error clearing cart via CartManager:', error);
                // Fallback
                this.cart = [];
                this.saveCartToStorage();
            }
        } else {
            // Fallback na lokalno košarico
            this.cart = [];
            this.saveCartToStorage();
        }
        this.updateCart();
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        if (cartItems) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.1rem;">Vaša košarica je prazna.</p>';
        }

        if (cartTotal) {
            cartTotal.textContent = '0€';
        }

        const alertText = typeof i18next !== 'undefined' ? i18next.t('notifications.cartCleared') : 'Košarica je bila izpraznjena!';
        alert(alertText);
    }

    // Login Functions
    showLoginModal() {
        const loginModal = document.getElementById('loginModal');
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (loginModal && loginOverlay) {
            // Close any other modals first
            this.hideForgotPasswordModal();
            this.hideRegistrationModal();
            
            // Show login modal
            loginModal.classList.add('show');
            loginOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Update translations for login modal
            if (typeof i18next !== 'undefined') {
                i18next.updatePage();
            }
        }
    }

    hideLoginModal() {
        const loginModal = document.getElementById('loginModal');
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (loginModal && loginOverlay) {
            loginModal.classList.remove('show');
            loginOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (!email || !password) {
            this.showNotification('Prosimo, izpolnite vsa polja', 'error');
            return;
        }

        try {
            console.log('Attempting Supabase signIn with email:', email);
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });
            console.log('Supabase signIn response:', { data, error });

            if (error) {
                console.log('Supabase signIn error:', error);
                console.log('Error message:', error.message);
                // Handle specific error cases with clearer messages
                if (error.message.includes('Invalid login credentials') || 
                    error.message.includes('Invalid credentials') ||
                    error.message.includes('Wrong password') ||
                    error.message.includes('incorrect password')) {
                    this.showNotification('Napačno geslo. Preverite geslo ali se registrirajte, če še nimate računa.', 'error');
                } else if (error.message.includes('Email not confirmed')) {
                    this.showNotification('Prosim potrdite svoj email, preden se prijavite.', 'error');
                } else if (error.message.includes('Too many requests')) {
                    this.showNotification('Preveč poskusov prijave. Počakajte malo in poskusite znova.', 'error');
                } else if (error.message.includes('User not found') || 
                           error.message.includes('user not found') ||
                           error.message.includes('No user found')) {
                    this.showNotification('Ta email ni registriran. Registrirajte se ali preverite email naslov.', 'error');
                } else if (error.message.includes('Account not found') ||
                           error.message.includes('account not found')) {
                    this.showNotification('Račun s tem emailom ne obstaja. Registrirajte se ali preverite email naslov.', 'error');
                } else {
                    this.showNotification(`Napaka pri prijavi: ${error.message}`, 'error');
                }
                return;
            }

            if (data.user) {
                // Check if email is confirmed
                if (!data.user.email_confirmed_at) {
                    this.showNotification('Prosim potrdite svoj email, preden se prijavite.', 'error');
                    return;
                }

                this.showNotification('notifications.loginSuccess', 'success');
                this.hideLoginModal();
                
                // Update UI
                this.updateUserUI(data.user);
                
                // Save login state
                localStorage.setItem('glaamUser', JSON.stringify({ 
                    email: data.user.email, 
                    userId: data.user.id,
                    loggedIn: true 
                }));
                
                // Inicializiraj CartManager ob prijavi
                if (this.cartManager) {
                    await this.cartManager.onUserLogin(data.user);
                    this.cart = this.cartManager.getCart();
                    this.updateCart();
                } else {
                    // Inicializiraj CartManager če še ni bil inicializiran
                    await this.initializeCartManager();
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Napaka pri prijavi. Poskusite znova.', 'error');
        }
    }

    async checkLoginStatus() {
        try {
            if (!window.supabaseClient || !window.supabaseClient.auth || !window.supabaseClient.auth.getUser) {
                console.warn('Supabase auth not available, skipping login check');
                console.log('window.supabaseClient:', window.supabaseClient);
                console.log('window.supabaseClient.auth:', window.supabaseClient?.auth);
                console.log('window.supabaseClient.auth.getUser:', window.supabaseClient?.auth?.getUser);
                return;
            }
            console.log('Attempting Supabase getUser check');
            const { data: { user } } = await window.supabaseClient.auth.getUser();
            console.log('Supabase getUser response:', { user });
            
            if (user) {
                // User is logged in
                this.updateUserUI(user);
                
                // Save login state
                localStorage.setItem('glaamUser', JSON.stringify({ 
                    email: user.email, 
                    userId: user.id,
                    loggedIn: true 
                }));
            } else {
                // User is not logged in
                this.hideUserMenu();
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            this.hideUserMenu();
        }
    }

    updateUserUI(user) {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn && logoutBtn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'flex';
        }
    }

    hideUserMenu() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn && logoutBtn) {
            loginBtn.style.display = 'flex';
            logoutBtn.style.display = 'none';
            loginBtn.onclick = () => this.showLoginModal();
        }
    }

    showUserMenu() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn && logoutBtn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'flex';
        }
    }

    // Registration Modal Functions
    showRegistrationModal() {
        const registrationModal = document.getElementById('registrationModal');
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (registrationModal && loginOverlay) {
            // Hide other modals first
            this.hideLoginModal();
            this.hideForgotPasswordModal();
            
            // Show registration modal
            registrationModal.classList.add('show');
            loginOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Update translations for registration modal
            if (typeof i18next !== 'undefined') {
                i18next.updatePage();
            }
        }
    }

    hideRegistrationModal() {
        const registrationModal = document.getElementById('registrationModal');
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (registrationModal && loginOverlay) {
            registrationModal.classList.remove('show');
            loginOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    async handleRegistration(e) {
        console.log('handleRegistration called - NEW VERSION');
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        // Clear previous error and success messages
        const errorDiv = document.getElementById('passwordError');
        const successDiv = document.getElementById('registrationSuccess');
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        if (successDiv) {
            successDiv.style.display = 'none';
        }
        
        // Validate password confirmation
        if (password !== confirmPassword) {
            if (errorDiv) {
                errorDiv.textContent = 'Gesli se ne ujemata!';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (!email || !password || !confirmPassword) {
            if (errorDiv) {
                errorDiv.textContent = 'Prosimo, izpolnite vsa polja!';
                errorDiv.style.display = 'block';
            }
            return;
        }

        if (password.length < 6) {
            if (errorDiv) {
                errorDiv.textContent = 'Geslo mora imeti vsaj 6 znakov!';
                errorDiv.style.display = 'block';
            }
            return;
        }

        // Check if Supabase is properly configured
        console.log('Supabase check:', window.supabaseClient, window.supabaseClient?.supabaseUrl);
        console.log('Supabase auth check:', window.supabaseClient?.auth);
        console.log('Supabase auth signUp check:', window.supabaseClient?.auth?.signUp);
        
        if (!window.supabaseClient || !window.supabaseClient.auth || !window.supabaseClient.auth.signUp || window.supabaseClient.supabaseUrl === 'YOUR_SUPABASE_URL' || window.supabaseClient.supabaseUrl === 'NOT_CONFIGURED') {
            console.log('Supabase not configured properly');
            if (errorDiv) {
                errorDiv.textContent = 'Napaka: Supabase ni pravilno konfiguriran. Kontaktirajte administratorja.';
                errorDiv.style.display = 'block';
            }
            return;
        }

        try {
            console.log('Attempting to register user with Supabase');
            // Try to register the user directly
            console.log('Attempting Supabase signUp with email:', email);
            const { data, error } = await window.supabaseClient.auth.signUp({
                email: email,
                password: password
            });
            console.log('Supabase signUp response:', { data, error });
            console.log('Full response data:', JSON.stringify(data, null, 2));

            if (error) {
                console.log('Supabase signUp error:', error);
                console.log('Error message:', error.message);
                // Handle specific error cases
                if (error.message.includes('User already registered') || 
                    error.message.includes('already been registered') ||
                    error.message.includes('already registered') ||
                    error.message.includes('already exists') ||
                    error.message.includes('duplicate') ||
                    error.message.includes('email address is already in use') ||
                    error.message.includes('email already registered') ||
                    error.message.includes('email address already registered') ||
                    error.message.includes('Email address already in use') ||
                    error.message.includes('Email already registered') ||
                    error.message.includes('Email address already registered') ||
                    error.message.includes('A user with this email address has already been registered') ||
                    error.message.includes('Email is already registered') ||
                    error.message.includes('User with this email already exists') ||
                    error.message.includes('Email already in use') ||
                    error.message.includes('Email address already in use')) {
                    console.log('User already registered error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Ta email je že registriran. Poskusite se prijaviti ali uporabite drug email naslov.';
                        errorDiv.style.display = 'block';
                    }
                } else if (error.message.includes('Password should be at least')) {
                    console.log('Password too short error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Geslo mora imeti vsaj 6 znakov.';
                        errorDiv.style.display = 'block';
                    }
                } else if (error.message.includes('Invalid email')) {
                    console.log('Invalid email error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Vnesite veljaven email naslov.';
                        errorDiv.style.display = 'block';
                    }
                } else if (error.message.includes('Signup is disabled')) {
                    console.log('Signup disabled error');
                    if (errorDiv) {
                        errorDiv.textContent = 'Registracija je trenutno onemogočena.';
                        errorDiv.style.display = 'block';
                    }
                } else {
                    console.log('Generic error:', error.message);
                    if (errorDiv) {
                        errorDiv.textContent = `Napaka pri registraciji: ${error.message}`;
                        errorDiv.style.display = 'block';
                    }
                }
                return;
            }

            if (data.user) {
                console.log('Registration successful:', data.user);
                console.log('User created_at:', data.user.created_at);
                console.log('User email_confirmed_at:', data.user.email_confirmed_at);
                console.log('User last_sign_in_at:', data.user.last_sign_in_at);
                console.log('User identities:', data.user.identities);
                console.log('User recovery_sent_at:', data.user.recovery_sent_at);
                
                // Check if this is a new user or existing user
                // If the user was created very recently (within last few seconds), it's likely a new user
                const userCreatedAt = new Date(data.user.created_at);
                const now = new Date();
                const timeDiff = now.getTime() - userCreatedAt.getTime();
                
                console.log('Time difference:', timeDiff, 'ms');
                
                // Check if user has empty identities array (new user with existing email)
                if (data.user.identities && data.user.identities.length === 0) {
                    console.log('User has empty identities array (likely duplicate email)');
                    if (errorDiv) {
                        errorDiv.textContent = 'Ta email je že registriran. Poskusite se prijaviti ali uporabite drug email naslov.';
                        errorDiv.style.display = 'block';
                    }
                    return;
                }
                
                // Check if user has recovery_sent_at but no email_confirmed_at (existing user)
                if (data.user.recovery_sent_at && !data.user.email_confirmed_at) {
                    console.log('User has recovery_sent_at but no email_confirmed_at (existing user)');
                    if (errorDiv) {
                        errorDiv.textContent = 'Ta email je že registriran. Poskusite se prijaviti ali uporabite drug email naslov.';
                        errorDiv.style.display = 'block';
                    }
                    return;
                }
                
                // Check if user was created more than 30 seconds ago (existing user)
                if (timeDiff > 30000) { // 30 seconds
                    console.log('User might already exist (created more than 30 seconds ago)');
                    if (errorDiv) {
                        errorDiv.textContent = 'Ta email je že registriran. Poskusite se prijaviti ali uporabite drug email naslov.';
                        errorDiv.style.display = 'block';
                    }
                    return;
                }
                
                // Check if user already has confirmed email (existing user)
                if (data.user.email_confirmed_at) {
                    console.log('User already has confirmed email (existing user)');
                    if (errorDiv) {
                        errorDiv.textContent = 'Ta email je že registriran. Poskusite se prijaviti ali uporabite drug email naslov.';
                        errorDiv.style.display = 'block';
                    }
                    return;
                }
                
                // Check if user has last_sign_in_at (existing user)
                if (data.user.last_sign_in_at) {
                    console.log('User already has sign-in history (existing user)');
                    if (errorDiv) {
                        errorDiv.textContent = 'Ta email je že registriran. Poskusite se prijaviti ali uporabite drug email naslov.';
                        errorDiv.style.display = 'block';
                    }
                    return;
                }
                
                // Show success message in modal
                if (successDiv) {
                    successDiv.textContent = 'Uspešna registracija! Preverite email za potrditev računa.';
                    successDiv.style.display = 'block';
                }
                
                // Also show notification
                this.showNotification('Uspešna registracija! Preverite email za potrditev.', 'success');
                
                // Clear form
                e.target.reset();
                
                // Hide modal after 3 seconds
                setTimeout(() => {
                    this.hideRegistrationModal();
                    if (successDiv) {
                        successDiv.style.display = 'none';
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error details:', error.message, error.stack);
            console.error('Error type:', typeof error);
            console.error('Error constructor:', error.constructor.name);
            console.error('Full error object:', JSON.stringify(error, null, 2));
            console.error('Supabase object:', window.supabaseClient);
            console.error('Supabase auth:', window.supabaseClient?.auth);
            console.error('Supabase auth signUp:', window.supabaseClient?.auth?.signUp);
            console.error('Supabase auth signUp type:', typeof window.supabaseClient?.auth?.signUp);
            console.error('Supabase auth signUp function:', window.supabaseClient?.auth?.signUp?.toString());
            console.error('Supabase auth signUp function length:', window.supabaseClient?.auth?.signUp?.length);
            console.error('Supabase auth signUp function name:', window.supabaseClient?.auth?.signUp?.name);
            console.error('Supabase auth signUp function prototype:', window.supabaseClient?.auth?.signUp?.prototype);
            console.error('Supabase auth signUp function constructor:', window.supabaseClient?.auth?.signUp?.constructor);
            console.error('Supabase auth signUp function constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor name:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.name);
            console.error('Supabase auth signUp function constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype constructor prototype:', window.supabaseClient?.auth?.signUp?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype?.constructor?.prototype);
            if (errorDiv) {
                errorDiv.textContent = `Napaka pri registraciji: ${error.message}`;
                errorDiv.style.display = 'block';
            }
        }
    }

    async logout() {
        // Počisti CartManager ob odjavi
        if (this.cartManager) {
            await this.cartManager.onUserLogout();
            this.cart = [];
            this.updateCart();
        }
        try {
            const { error } = await window.supabaseClient.auth.signOut();
            
            if (error) {
                this.showNotification(`Napaka pri odjavi: ${error.message}`, 'error');
                return;
            }

            localStorage.removeItem('glaamUser');
            const loginBtn = document.getElementById('loginBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            
            if (loginBtn && logoutBtn) {
                loginBtn.style.display = 'flex';
                logoutBtn.style.display = 'none';
                loginBtn.onclick = () => this.showLoginModal();
            }
            
            this.showNotification('notifications.logoutSuccess', 'info');
        } catch (error) {
            console.error('Logout error:', error);
            this.showNotification('Napaka pri odjavi. Poskusite znova.', 'error');
        }
    }

    // Forgot Password Modal Functions
    showForgotPasswordModal() {
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (forgotPasswordModal && loginOverlay) {
            // Hide login modal first
            this.hideLoginModal();
            this.hideRegistrationModal();
            
            // Show forgot password modal
            forgotPasswordModal.classList.add('show');
            loginOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Update translations for forgot password modal
            if (typeof i18next !== 'undefined') {
                i18next.updatePage();
            }
        }
    }

    hideForgotPasswordModal() {
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (forgotPasswordModal && loginOverlay) {
            forgotPasswordModal.classList.remove('show');
            loginOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        if (!email) {
            this.showNotification('Prosimo, vnesite email naslov', 'error');
            return;
        }

        // Clear previous messages
        const errorDiv = document.getElementById('forgotPasswordError');
        const successDiv = document.getElementById('forgotPasswordSuccess');
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        try {
            // Server-side check to avoid user enumeration issues and false positives
            console.log('Checking if user exists for email:', email);
            console.log('Calling API endpoint: /api/check-user-exists');
            
            let userExists = false;
            
            try {
                const checkResponse = await fetch('/api/check-user-exists', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                console.log('API response status:', checkResponse.status);
                console.log('API response ok:', checkResponse.ok);

                if (checkResponse.ok) {
                    const responseData = await checkResponse.json();
                    console.log('API response data:', responseData);
                    userExists = responseData.exists === true;
                } else {
                    console.log('API call failed, status:', checkResponse.status);
                    // If API fails, we'll show a generic error and not proceed
                    if (errorDiv) {
                        errorDiv.textContent = 'Pri preverjanju uporabnika je prišlo do napake. Poskusite znova.';
                        errorDiv.style.display = 'block';
                    }
                    this.showNotification('Pri preverjanju uporabnika je prišlo do napake. Poskusite znova.', 'error');
                    return;
                }
            } catch (apiError) {
                console.log('API call exception:', apiError);
                // If API fails completely, we'll show a generic error and not proceed
                if (errorDiv) {
                    errorDiv.textContent = 'Pri preverjanju uporabnika je prišlo do napake. Poskusite znova.';
                    errorDiv.style.display = 'block';
                }
                this.showNotification('Pri preverjanju uporabnika je prišlo do napake. Poskusite znova.', 'error');
                return;
            }
            
            if (!userExists) {
                console.log('User does not exist, showing error message');
                if (errorDiv) {
                    errorDiv.textContent = 'Ta email ni registriran. Registrirajte se ali preverite email naslov.';
                    errorDiv.style.display = 'block';
                }
                this.showNotification('Ta email ni registriran. Registrirajte se ali preverite email naslov.', 'error');
                return;
            }
            
            console.log('User exists, proceeding with password reset');

            // User exists, proceed with password reset
            console.log('Sending password reset email to:', email);
            const { error } = await window.supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: "https://glaam-bqgr.vercel.app/reset-password"
            });

            if (error) {
                console.log('Password reset error:', error.message);
                
                if (error.message.includes('Invalid email')) {
                    if (errorDiv) {
                        errorDiv.textContent = 'Vnesite veljaven email naslov.';
                        errorDiv.style.display = 'block';
                    }
                    this.showNotification('Vnesite veljaven email naslov.', 'error');
                } else if (error.message.includes('Too many requests')) {
                    if (errorDiv) {
                        errorDiv.textContent = 'Preveč poskusov. Počakajte malo in poskusite znova.';
                        errorDiv.style.display = 'block';
                    }
                    this.showNotification('Preveč poskusov. Počakajte malo in poskusite znova.', 'error');
                } else {
                    if (errorDiv) {
                        errorDiv.textContent = `Napaka: ${error.message}`;
                        errorDiv.style.display = 'block';
                    }
                    this.showNotification(`Napaka: ${error.message}`, 'error');
                }
                return;
            }

            // Show success message
            if (successDiv) {
                successDiv.textContent = 'Email za ponastavitev gesla je poslan. Preverite svojo pošto.';
                successDiv.style.display = 'block';
            }
            
            this.showNotification('Email za ponastavitev gesla je poslan!', 'success');
            
            // Clear form
            e.target.reset();
            
        } catch (error) {
            console.error('Forgot password error:', error);
            if (errorDiv) {
                errorDiv.textContent = 'Napaka pri pošiljanju emaila. Poskusite znova.';
                errorDiv.style.display = 'block';
            }
            this.showNotification('Napaka pri pošiljanju emaila. Poskusite znova.', 'error');
        }
    }

    // Order Form Functions
    async showOrderForm() {
        // Check if user is logged in via Supabase Auth
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        if (!user) {
            const message = typeof i18next !== 'undefined' ? i18next.t('notifications.loginRequired') : 'Za zaključek nakupa se morate prijaviti!';
            this.showNotification(message, 'error');
            this.showLoginModal();
            return;
        }

        // Check if cart is empty
        if (this.cart.length === 0) {
            this.showNotification('Vaša košarica je prazna!', 'error');
            return;
        }

        // First, hide the cart with smooth transition
        const cart = document.getElementById('simpleCart');
        if (cart) {
            // Add hiding animation class
            cart.classList.add('hiding');
            cart.classList.remove('show');
            
            // Hide cart completely after animation
            setTimeout(() => {
                cart.style.setProperty('display', 'none', 'important');
                cart.style.setProperty('opacity', '0', 'important');
                cart.style.setProperty('visibility', 'hidden', 'important');
                cart.classList.remove('hiding');
            }, 300);
        }

        // Then show the order form after a short delay for smooth transition
        setTimeout(() => {
            const orderModal = document.getElementById('orderModal');
            const loginOverlay = document.getElementById('loginOverlay');
            
            if (orderModal && loginOverlay) {
                // Show overlay first
                loginOverlay.classList.add('show');
                
                // Show order modal with animation
                orderModal.classList.add('showing');
                orderModal.style.setProperty('display', 'block', 'important');
                orderModal.style.setProperty('opacity', '1', 'important');
                orderModal.style.setProperty('visibility', 'visible', 'important');
                orderModal.style.setProperty('z-index', '1050', 'important');
                
                document.body.style.overflow = 'hidden';
                
                // Add show class after animation
                setTimeout(() => {
                    orderModal.classList.add('show');
                    orderModal.classList.remove('showing');
                }, 300);
            }
        }, 300); // 300ms delay for smooth transition
    }

    hideOrderModal() {
        const orderModal = document.getElementById('orderModal');
        const loginOverlay = document.getElementById('loginOverlay');
        
        if (orderModal && loginOverlay) {
            // Hide order modal with animation
            orderModal.classList.remove('show');
            orderModal.classList.add('hiding');
            
            // Hide overlay
            loginOverlay.classList.remove('show');
            
            // Hide order modal completely after animation
            setTimeout(() => {
                orderModal.style.setProperty('display', 'none', 'important');
                orderModal.style.setProperty('opacity', '0', 'important');
                orderModal.style.setProperty('visibility', 'hidden', 'important');
                orderModal.classList.remove('hiding');
            }, 300);
            
            document.body.style.overflow = '';
            
            // Show cart again after closing order form
            setTimeout(() => {
                const cart = document.getElementById('simpleCart');
                if (cart && this.cart.length > 0) {
                    cart.style.setProperty('display', 'flex', 'important');
                    cart.style.setProperty('opacity', '1', 'important');
                    cart.style.setProperty('visibility', 'visible', 'important');
                    cart.classList.add('show');
                }
            }, 300);
        }
    }

    async handleOrderForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const orderData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            postalCode: formData.get('postalCode'),
            city: formData.get('city'),
            country: formData.get('country'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'address', 'postalCode', 'city', 'country', 'phone', 'email'];
        const missingFields = requiredFields.filter(field => !orderData[field] || orderData[field].trim() === '');
        
        if (missingFields.length > 0) {
            this.showNotification('Prosimo, izpolnite vsa obvezna polja!', 'error');
            return;
        }

        // Validate postal code format
        if (!/^\d{4}$/.test(orderData.postalCode)) {
            this.showNotification('Poštna številka mora imeti 4 številke!', 'error');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(orderData.email)) {
            this.showNotification('Prosimo, vnesite veljaven email naslov!', 'error');
            return;
        }

        try {
            // Get current user (optional - can be null for guest checkout)
            let userId = null;
            try {
            const { data: { user } } = await window.supabaseClient.auth.getUser();
                userId = user?.id || null;
            } catch (authError) {
                console.log('User not authenticated, proceeding with guest checkout');
            }

            // Prepare items for API (with unit_amount in cents)
            const itemsForAPI = this.cart.map(item => ({
                name: item.name,
                description: item.description || '',
                images: item.image ? [item.image] : [],
                unit_amount: Math.round(item.price * 100), // Convert to cents
                quantity: item.quantity
            }));

            // Prepare items for Stripe
            const lineItems = this.cart.map(item => ({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: item.name,
                        description: item.description || '',
                        images: item.image ? [item.image] : []
                    },
                    unit_amount: Math.round(item.price * 100) // Convert to cents
                },
                quantity: item.quantity
            }));

            const totalAmount = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Log data being sent to API
            console.log('Cart items:', this.cart);
            console.log('Items for API:', itemsForAPI);
            console.log('Total amount:', totalAmount);

            // Determine API URL based on environment
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const apiUrl = isLocal ? 'https://glaam-bqgr-dtu38ckg3-mgs-projects-007b05b7.vercel.app/api/create-checkout-session' : '/api/create-checkout-session';
            
            console.log('API URL:', apiUrl);
            console.log('Is local:', isLocal);
            
            // Create Stripe checkout session
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: itemsForAPI,
                    customerInfo: {
                        firstName: orderData.firstName,
                        lastName: orderData.lastName,
                        address: orderData.address,
                        postalCode: orderData.postalCode,
                        city: orderData.city,
                        country: orderData.country,
                        phone: orderData.phone,
                        email: orderData.email
                    },
                    userId: userId,
                    successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: `${window.location.origin}/cancel`
                })
            });

            if (!response.ok) {
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                    if (errorData.details) {
                        errorMessage += ` - ${errorData.details}`;
                    }
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
                }
                
                if (response.status === 405) {
                    errorMessage = 'API endpoint not available. Please deploy to Vercel for full functionality.';
                }
                
                throw new Error(errorMessage);
            }

            const { url, orderId, sessionId } = await response.json();

            if (url) {
                this.showNotification('Preusmerjam na plačilo...', 'success');
                this.hideOrderModal();
                
                // Clear cart after successful redirect
                this.cart = [];
                this.saveCartToStorage();
                this.updateCart();
                
                // Redirect to Stripe Checkout
            window.location.href = url;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error) {
            console.error('Order processing error:', error);
            let errorMessage = error.message;
            
            // Try to parse error details if available
            if (error.message.includes('Failed to create order')) {
                if (error.message.includes('null value in column "amount_total"')) {
                    errorMessage = 'Napaka pri izračunu zneska. Preverite podatke izdelkov.';
                } else {
                    errorMessage = 'Napaka pri ustvarjanju naročila. Preverite, ali je Supabase tabela ustvarjena.';
                }
            } else if (error.message.includes('Supabase connection failed')) {
                errorMessage = 'Napaka pri povezavi s Supabase. Preverite konfiguracijo.';
            } else if (error.message.includes('Stripe configuration missing')) {
                errorMessage = 'Napaka pri Stripe konfiguraciji. Preverite ključe.';
            } else if (error.message.includes('Invalid item price or quantity')) {
                errorMessage = 'Napaka pri podatkih izdelkov. Preverite cene in količine.';
            } else if (error.message.includes('Invalid total amount')) {
                errorMessage = 'Napaka pri izračunu skupnega zneska.';
            }
            
            this.showNotification(`Napaka pri obdelavi naročila: ${errorMessage}`, 'error');
        }
    }


    // Forms
    initForms() {
        const weddingForm = document.getElementById('weddingForm');
        if (weddingForm) {
            weddingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleWeddingForm(e.target);
            });
        }

        const funeralForm = document.getElementById('funeralForm');
        if (funeralForm) {
            funeralForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFuneralForm(e.target);
            });
        }

        // Add floating label effects
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.setAttribute('valid', '');
                } else {
                    input.removeAttribute('valid');
                }
            });
        });
    }

    async handleWeddingForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.name || !data.email || !data.weddingDate || !data.location || !data.message) {
            this.showNotification('Prosimo, izpolnite vsa polja.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Prosimo, vnesite veljaven email naslov.', 'error');
            return;
        }
        
        // Validate date (should be in the future)
        const weddingDate = new Date(data.weddingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (weddingDate < today) {
            this.showNotification('Datum poroke mora biti v prihodnosti.', 'error');
            return;
        }
        
        // Validate message length
        if (data.message.length < 10) {
            this.showNotification('Sporočilo mora biti vsaj 10 znakov dolgo.', 'error');
            return;
        }
        
        // Validate name length
        if (data.name.length < 2) {
            this.showNotification('Ime mora biti vsaj 2 znaka dolgo.', 'error');
            return;
        }
        
        // Validate location length
        if (data.location.length < 3) {
            this.showNotification('Lokacija mora biti vsaj 3 znake dolga.', 'error');
            return;
        }
        
        // Validate message length (max 500 characters)
        if (data.message.length > 500) {
            this.showNotification('Sporočilo ne sme biti daljše od 500 znakov.', 'error');
            return;
        }
        
        // Validate name length (max 100 characters)
        if (data.name.length > 100) {
            this.showNotification('Ime ne sme biti daljše od 100 znakov.', 'error');
            return;
        }
        
        // Validate location length (max 200 characters)
        if (data.location.length > 200) {
            this.showNotification('Lokacija ne sme biti daljša od 200 znakov.', 'error');
            return;
        }
        
        // Validate email length (max 255 characters)
        if (data.email.length > 255) {
            this.showNotification('Email ne sme biti daljši od 255 znakov.', 'error');
            return;
        }
        
        // Get submit button and disable it during submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pošiljam...';
            
            // Save to Supabase
            const { data: result, error } = await window.supabaseClient
                .from('inquiries_wedding')
                .insert([
                    {
                        name: data.name,
                        email: data.email,
                        wedding_date: data.weddingDate,
                        location: data.location,
                        message: data.message
                    }
                ]);

            if (error) {
                console.error('Error saving wedding inquiry:', error);
                this.showNotification(typeof i18next !== 'undefined' ? i18next.t('funeral.products.inquiryError') : 'Napaka pri pošiljanju povpraševanja. Prosimo poskusite znova.', 'error');
                return;
            }

            this.showNotification('Povpraševanje poslano! Kmalu se vam bomo oglasili.', 'success');
            form.reset();
            
            // Remove valid attributes from inputs
            form.querySelectorAll('input, textarea').forEach(input => {
                input.removeAttribute('valid');
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            this.showNotification('Napaka pri pošiljanju povpraševanja. Prosimo poskusite znova.', 'error');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    async handleFuneralForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.name || !data.email || !data.funeralDate || !data.location || !data.message) {
            this.showNotification('Prosimo, izpolnite vsa polja.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Prosimo, vnesite veljaven email naslov.', 'error');
            return;
        }
        
        // Validate date (should be in the future)
        const funeralDate = new Date(data.funeralDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (funeralDate < today) {
            this.showNotification('Datum slovesnosti mora biti v prihodnosti.', 'error');
            return;
        }
        
        // Validate message length
        if (data.message.length < 10) {
            this.showNotification('Sporočilo mora biti vsaj 10 znakov dolgo.', 'error');
            return;
        }
        
        // Validate name length
        if (data.name.length < 2) {
            this.showNotification('Ime mora biti vsaj 2 znaka dolgo.', 'error');
            return;
        }
        
        // Validate location length
        if (data.location.length < 3) {
            this.showNotification('Lokacija mora biti vsaj 3 znake dolga.', 'error');
            return;
        }
        
        // Validate message length (max 500 characters)
        if (data.message.length > 500) {
            this.showNotification('Sporočilo ne sme biti daljše od 500 znakov.', 'error');
            return;
        }
        
        // Validate name length (max 100 characters)
        if (data.name.length > 100) {
            this.showNotification('Ime ne sme biti daljše od 100 znakov.', 'error');
            return;
        }
        
        // Validate location length (max 200 characters)
        if (data.location.length > 200) {
            this.showNotification('Lokacija ne sme biti daljša od 200 znakov.', 'error');
            return;
        }
        
        // Validate email length (max 255 characters)
        if (data.email.length > 255) {
            this.showNotification('Email ne sme biti daljši od 255 znakov.', 'error');
            return;
        }
        
        // Get submit button and disable it during submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pošiljam...';
            
            // Save to Supabase
            const { data: result, error } = await window.supabaseClient
                .from('inquiries_funeral')
                .insert([
                    {
                        name: data.name,
                        email: data.email,
                        funeral_date: data.funeralDate,
                        location: data.location,
                        message: data.message
                    }
                ]);

            if (error) {
                console.error('Error saving funeral inquiry:', error);
                this.showNotification(typeof i18next !== 'undefined' ? i18next.t('funeral.products.inquiryError') : 'Napaka pri pošiljanju povpraševanja. Prosimo poskusite znova.', 'error');
                return;
            }

            this.showNotification(typeof i18next !== 'undefined' ? i18next.t('funeral.products.inquirySent') : 'Povpraševanje za žalni program poslano! Kmalu se vam bomo oglasili.', 'success');
            form.reset();
            
            // Remove valid attributes from inputs
            form.querySelectorAll('input, textarea').forEach(input => {
                input.removeAttribute('valid');
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            this.showNotification('Napaka pri pošiljanju povpraševanja. Prosimo poskusite znova.', 'error');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }



    // Counters Animation
    initCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                counter.textContent = Math.floor(current);
                
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                }
            }, 30);
        };

        // Animate counters when they come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    animateCounter(entry.target);
                    entry.target.dataset.animated = 'true';
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        const icon = notification.querySelector('.notification-icon');
        const messageEl = notification.querySelector('.notification-message');

        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        icon.className = `notification-icon ${icons[type]}`;
        
        // Translate message if it's a translation key
        let displayMessage = message;
        if (typeof i18next !== 'undefined' && message.startsWith('notifications.')) {
            displayMessage = i18next.t(message);
        }
        
        messageEl.textContent = displayMessage;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.add('show');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.closeNotification();
        }, 5000);
    }

    closeNotification() {
        const notification = document.getElementById('notification');
        notification.classList.remove('show');
    }

    // Utility Functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Lazy Loading Images
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Accessibility
    initAccessibility() {
        // Skip to main content
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Preskoči na glavno vsebino';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-pink);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Announce page changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(announcer);

        this.announcer = announcer;
    }

    announcePageChange(pageName) {
        if (this.announcer) {
            this.announcer.textContent = `Naložena stran: ${pageName}`;
        }
    }

    // Performance Monitoring
    initPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            console.log(`Glaam Website Performance:
                Load Time: ${loadTime}ms
                DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms
                First Paint: ${performance.getEntriesByType('paint')[0]?.startTime}ms
            `);
        });
    }

    createCustomBouquet(bouquetName, maxItems) {
        // Check if custom bouquet already exists in cart
        const existingBouquet = this.cart.find(item => item.isCustomBouquet && item.name === bouquetName);
        
        if (existingBouquet) {
            // Update existing bouquet
            console.log('Custom bouquet already exists, updating...');
        } else {
            // Create new custom bouquet
            const customBouquet = {
                id: `custom-${Date.now()}`,
                name: bouquetName,
                price: 0, // Will be calculated based on selected flowers
                quantity: 1,
                isCustomBouquet: true,
                maxItems: maxItems,
                selectedFlowers: [],
                image: 'https://via.placeholder.com/250x200?text=Šopek+po+meri'
            };
            
            this.cart.push(customBouquet);
            console.log(`Created new custom bouquet: ${bouquetName} (max ${maxItems} items)`);
        }
        
        this.updateCart();
        this.saveCartToStorage();
    }

    addFlowerToCustomBouquet(productId) {
        // Check if we have selected bouquet info but no bouquet created yet
        if (!this.selectedBouquetInfo) {
            this.showNotification('⚠️ Najprej izberite velikost šopka zgoraj!', 'warning');
            return false;
        }
        
        // Find the active custom bouquet
        let customBouquet = this.cart.find(item => item.isCustomBouquet);
        
        // If no bouquet exists but we have selected info, create it now
        if (!customBouquet && this.selectedBouquetInfo) {
            this.createCustomBouquet(this.selectedBouquetInfo.name, this.selectedBouquetInfo.maxItems);
            customBouquet = this.cart.find(item => item.isCustomBouquet);
        }
        
        // Get quantity from the quantity display
        const quantityElement = document.getElementById(`qty-${productId}`);
        const quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;
        
        // Check if adding this quantity would exceed max items
        const currentCount = customBouquet.selectedFlowers.length;
        const newCount = currentCount + quantity;
        
        if (newCount > customBouquet.maxItems) {
            const maxDisplay = customBouquet.maxItems === 999 ? '∞' : customBouquet.maxItems;
            const available = customBouquet.maxItems - currentCount;
            this.showNotification(`Lahko dodate še samo ${available} ${available === 1 ? 'rožo' : available <= 4 ? 'rože' : 'rož'}! (${currentCount}/${maxDisplay})`, 'warning');
            return false;
        }
        
        // Find the product
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            this.showNotification('Roža ni najdena!', 'error');
            return false;
        }
        
        // Add flowers to bouquet (multiple times based on quantity)
        for (let i = 0; i < quantity; i++) {
            customBouquet.selectedFlowers.push({
                id: product.id,
                name: product.name,
                price: product.price,
                icon: product.icon
            });
        }
        
        // Update bouquet price
        customBouquet.price = customBouquet.selectedFlowers.reduce((total, flower) => total + flower.price, 0);
        
        const maxDisplay = customBouquet.maxItems === 999 ? '∞' : customBouquet.maxItems;
        const flowerWord = quantity === 1 ? 'roža' : quantity <= 4 ? 'rože' : 'rož';
        this.showNotification(`${quantity} ${flowerWord} ${product.name} dodano v šopek! (${customBouquet.selectedFlowers.length}/${maxDisplay})`, 'success');
        
        // Reset quantity to 1 after adding
        if (quantityElement) {
            quantityElement.textContent = '1';
        }
        
        this.updateCart();
        this.saveCartToStorage();
        
        return true;
    }

    showBouquetChangeDialog(newBouquetName, newMaxItems) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'bouquet-change-overlay';
        overlay.innerHTML = `
            <div class="bouquet-change-modal">
                <div class="bouquet-change-header">
                    <h3>Zamenjava šopka</h3>
                    <button class="close-dialog-btn">&times;</button>
                </div>
                <div class="bouquet-change-content">
                    <p>Želite zamenjati trenutni šopek z <strong>${newBouquetName}</strong>?</p>
                    <div class="bouquet-change-options">
                        <button class="bouquet-option-btn keep-flowers" data-action="keep">
                            <i class="fas fa-arrows-alt"></i>
                            Obdrži rože in premesti v nov šopek
                        </button>
                        <button class="bouquet-option-btn new-bouquet" data-action="new">
                            <i class="fas fa-plus"></i>
                            Ustvari nov prazen šopek
                        </button>
                        <button class="bouquet-option-btn cancel" data-action="cancel">
                            <i class="fas fa-times"></i>
                            Prekliči
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target.classList.contains('close-dialog-btn')) {
                this.closeBouquetChangeDialog();
            }
        });
        
        overlay.querySelectorAll('.bouquet-option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleBouquetChange(action, newBouquetName, newMaxItems);
                this.closeBouquetChangeDialog();
            });
        });
        
        // Add escape key listener
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeBouquetChangeDialog();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    closeBouquetChangeDialog() {
        const overlay = document.querySelector('.bouquet-change-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    handleBouquetChange(action, newBouquetName, newMaxItems) {
        const existingBouquet = this.cart.find(item => item.isCustomBouquet);
        
        if (action === 'keep' && existingBouquet) {
            // Keep existing flowers and move to new bouquet
            const flowers = [...existingBouquet.selectedFlowers];
            this.removeFromCart(existingBouquet.id);
            
            const newBouquet = {
                id: `custom-${Date.now()}`,
                name: newBouquetName,
                price: flowers.reduce((total, flower) => total + flower.price, 0),
                quantity: 1,
                isCustomBouquet: true,
                maxItems: newMaxItems,
                selectedFlowers: flowers,
                image: 'https://via.placeholder.com/250x200?text=Šopek+po+meri'
            };
            
            this.cart.push(newBouquet);
            this.showNotification(`Rože premaknjene v ${newBouquetName}!`, 'success');
            
        } else if (action === 'new') {
            // Create new empty bouquet
            this.removeFromCart(existingBouquet.id);
            this.selectedBouquetInfo = { name: newBouquetName, maxItems: newMaxItems };
            this.showNotification(`Ustvarjen nov ${newBouquetName}!`, 'success');
            
        } else if (action === 'cancel') {
            // Do nothing, keep existing bouquet
            return;
        }
        
        this.updateCart();
        this.saveCartToStorage();
    }
}

// Single initialization - prevent multiple event listeners
(function() {
    let initialized = false;
    
    function initGlaam() {
        if (initialized || window.glaam) {
            console.log('Glaam already initialized, skipping...');
            return;
        }
        
        initialized = true;
        console.log('DOM loaded, initializing Glaam website...');
        window.glaam = new GlaamWebsite();
        console.log('Glaam website initialized successfully!');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlaam);
    } else {
        initGlaam();
    }
})();

// BEAUTIFUL CART FUNCTIONS
function showCart() {
    console.log('SHOW CART CALLED!');
    const cart = document.getElementById('simpleCart');
    const cartContent = document.getElementById('cartContent');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    
    if (cart) {
        // Force show the cart with inline styles (without !important)
        cart.style.setProperty('display', 'flex', 'important');
        cart.style.setProperty('opacity', '1', 'important');
        cart.style.setProperty('visibility', 'visible', 'important');
        cart.style.setProperty('z-index', '999999', 'important');
        cart.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Cart should be visible now!');
        console.log('Cart display style:', cart.style.display);
        console.log('Cart classes:', cart.className);
        console.log('Cart computed display:', window.getComputedStyle(cart).display);
        
        // Update cart content
        console.log('Updating cart content...');
        console.log('cartContent element:', cartContent);
        console.log('window.glaam:', window.glaam);
        
        if (cartContent) {
            if (!window.glaam || !window.glaam.cart || window.glaam.cart.length === 0) {
                const emptyText = typeof i18next !== 'undefined' ? i18next.t('cart.empty') : 'Vaša košarica je prazna';
                const emptySubtitleText = typeof i18next !== 'undefined' ? i18next.t('cart.emptySubtitle') : 'Dodajte izdelke, da začnete z nakupom';
                cartContent.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p data-i18n="cart.empty">${emptyText}</p>
                        <span data-i18n="cart.emptySubtitle">${emptySubtitleText}</span>
                    </div>
                `;
            } else {
                cartContent.innerHTML = window.glaam.cart.map((item, index) => {
                    if (item.isCustomBouquet) {
                        // Custom bouquet display
                        const flowersList = item.selectedFlowers.length > 0 
                            ? item.selectedFlowers.map(flower => `• ${flower.name}`).join('<br>')
                            : '• Še ni dodanih rož';
                        
                        return `<div class="cart-item custom-bouquet" style="animation-delay: ${index * 0.1}s">
                            <div class="item-info">
                                <h4 class="item-name">${item.name}</h4>
                                <div class="selected-flowers">
                                    <strong>Izbrane rože:</strong><br>
                                    ${flowersList}
                                </div>
                                <p class="item-price">${item.selectedFlowers.length}/${item.maxItems === 999 ? '∞' : item.maxItems} rož</p>
                            </div>
                            <div class="item-controls">
                                <div class="item-total">${item.price.toFixed(2)}€</div>
                                <button class="remove-btn" onclick="removeFromCartGlobal('${item.id}')" title="Odstrani šopek">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>`;
                    } else {
                        // Regular product display
                        return `<div class="cart-item" style="animation-delay: ${index * 0.1}s">
                            <div class="item-info">
                                <h4 class="item-name">${item.name}</h4>
                                <p class="item-price">${item.price.toFixed(2)}€ na kos</p>
                            </div>
                            <div class="item-controls">
                                <div class="quantity-controls">
                                    <button class="qty-btn" onclick="updateQuantityGlobal(${item.id}, -1)">-</button>
                                    <span class="qty-display">${item.quantity}</span>
                                    <button class="qty-btn" onclick="updateQuantityGlobal(${item.id}, 1)">+</button>
                                </div>
                                <div class="item-total">${(item.price * item.quantity).toFixed(2)}€</div>
                                <button class="remove-btn" onclick="removeFromCartGlobal(${item.id})" title="${typeof i18next !== 'undefined' ? i18next.t('products.removeFromCart') : 'Odstrani iz košarice'}">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        </div>`;
                    }
                }).join('');
            }
        }
        
        // Update total amount
        console.log('Updating total amount...');
        console.log('cartTotalAmount element:', cartTotalAmount);
        if (cartTotalAmount && window.glaam && window.glaam.cart) {
            const total = window.glaam.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            console.log('Cart total:', total);
            cartTotalAmount.textContent = `${total.toFixed(2)}€`;
        } else if (cartTotalAmount) {
            cartTotalAmount.textContent = '0,00€';
        }
    } else {
        console.error('Cart not found!');
    }
}

function hideCart() {
    console.log('HIDE CART CALLED!');
    const cart = document.getElementById('simpleCart');
    if (cart) {
        cart.style.setProperty('display', 'none', 'important');
        cart.style.setProperty('opacity', '0', 'important');
        cart.style.setProperty('visibility', 'hidden', 'important');
        cart.classList.remove('show');
        document.body.style.overflow = '';
        console.log('Cart hidden!');
    }
}

// Global cart functions for HTML onclick events
function toggleCart() {
    console.log('🛒 Global toggleCart() called!');
    const cart = document.getElementById('simpleCart');
    console.log('Cart element found:', cart);
    
    // Ensure global cart exists without auto-adding demo items
    if (!window.glaam) window.glaam = { cart: [] };
    if (!window.glaam.cart) window.glaam.cart = [];
    
    if (cart && cart.classList.contains('show')) {
        console.log('Cart is showing, hiding it...');
        hideCart();
    } else {
        console.log('Cart is hidden, showing it...');
        showCart();
    }
}

function closeCart() {
    hideCart();
}

async function clearCart() {
    // Clear the cart array
    if (window.glaam) {
        // Uporabi CartManager če je na voljo
        if (window.glaam.cartManager) {
            try {
                await window.glaam.cartManager.clearCart();
                window.glaam.cart = [];
            } catch (error) {
                console.error('Error clearing cart via CartManager:', error);
                // Fallback
                window.glaam.cart = [];
                window.glaam.saveCartToStorage();
            }
        } else {
            // Fallback na lokalno košarico
            window.glaam.cart = [];
            window.glaam.saveCartToStorage();
        }
        window.glaam.updateCart();
        
        // Show notification
        const clearMsg = typeof i18next !== 'undefined' ? i18next.t('notifications.cartCleared') : 'Košarica je bila očiščena!';
        window.glaam.showNotification(`🗑️ ${clearMsg}`, 'info');
        
        // Update cart display
        showCart();
    }
}

// Global function to add product to cart
function addToCartGlobal(productId) {
    if (window.glaam) {
        window.glaam.addToCart(productId);
        // Show cart after adding product
        setTimeout(() => {
            toggleCart();
        }, 500);
    }
}

// Global function to remove product from cart
function removeFromCartGlobal(productId) {
    if (window.glaam) {
        window.glaam.removeFromCart(productId);
        showCart(); // Refresh cart display
    }
}

// Global function to update quantity
async function updateQuantityGlobal(productId, change) {
    if (window.glaam) {
        const item = window.glaam.cart.find(item => item.id === productId);
        if (item) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) {
                await window.glaam.removeFromCart(productId);
            } else {
                // Uporabi CartManager če je na voljo
                if (window.glaam.cartManager) {
                    try {
                        await window.glaam.cartManager.updateQuantity(productId, newQuantity);
                        window.glaam.cart = window.glaam.cartManager.getCart();
                    } catch (error) {
                        console.error('Error updating quantity via CartManager:', error);
                        // Fallback
                        item.quantity = newQuantity;
                        window.glaam.saveCartToStorage();
                    }
                } else {
                    // Fallback na lokalno košarico
                    item.quantity = newQuantity;
                    window.glaam.saveCartToStorage();
                }
                window.glaam.updateCart();
                showCart(); // Refresh cart display
            }
        }
    }
}

// Global function to show order form
function showOrderForm() {
    if (window.glaam) {
        window.glaam.showOrderForm();
    }
}