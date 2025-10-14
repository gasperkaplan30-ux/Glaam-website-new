# 📱 MOBILE RESPONSIVE FIXES

## ✅ Implementirane izboljšave

### **1. Breakpoints (Media Queries)**
- **≤ 768px** - Tablet naprave (iPad, Android tableti)
- **≤ 640px** - Manjši telefoni (iPhone SE, Android mali zasloni)
- **≤ 480px** - Zelo majhni zasloni (optimizacija za iPhone 5/SE)

---

## 🔧 Popravljeni elementi

### **Navigation (Navigacija)**
- ✅ Hamburger menu za mobilne naprave
- ✅ Full-screen mobilni menu z večjimi gumbi
- ✅ Manjši logo in ikone za manjše zaslone
- ✅ Z-index popravljen za pravilno prekrivanje

### **Hero Section (Domača stran)**
- ✅ Manjši naslovi in podnaslovi
- ✅ Gumbi v stolpec namesto vrstice
- ✅ Optimiziran padding in spacing
- ✅ Zmanjšana višina za boljši prikaz

### **Product Cards (Ploščice)**
- ✅ **1 stolpec** namesto 3 na mobilnih napravah
- ✅ Avtomatska višina namesto fiksne
- ✅ Manjše slike (180-200px namesto 250px)
- ✅ Manjši fonti za naslove in opise
- ✅ Optimizirani quantity kontrole (-1+)
- ✅ Manjši gumbi "Dodaj v košarico"
- ✅ Boljši spacing med elementi

### **Product Footer (Cena + Gumb)**
- ✅ **Vertikalno poravnano** na majhnih zaslonih (≤640px)
- ✅ Cena in gumb drug pod drugim
- ✅ Manjši padding in fonti
- ✅ Optimiziran za dotik (večji touch targets)

### **Filter Buttons (Zavihki)**
- ✅ Horizontalno drsenje (scroll) na manjših zaslonih
- ✅ Smooth scrolling za iOS
- ✅ Manjši gumbi z optimiziranim paddingom
- ✅ Boljši spacing med gumbi

### **Wedding Section (Poroka)**
- ✅ Package cards optimizirane za mobilne
- ✅ Manjši fonti za naslove in cene
- ✅ Boljši padding za manjše zaslone
- ✅ Accordion deluje tudi na mobilnih

### **Cart Modal (Košarica)**
- ✅ **Full-screen** na mobilnih napravah
- ✅ Brez border-radius (polno okno)
- ✅ Optimiziran padding za manjše zaslone
- ✅ Manjši cart items za boljši pregled

### **Forms (Obrazci)**
- ✅ Vsa polja v 1 stolpec (namesto 2)
- ✅ Večji input fieldi za lažji vnos
- ✅ Optimiziran checkout form

### **Typography (Tipografija)**
- ✅ Manjši fonti za vse naslove
- ✅ Boljša berljivost na manjših zaslonih
- ✅ Optimiziran line-height za mobilne

### **Spacing & Padding**
- ✅ Zmanjšan padding za vse sekcije
- ✅ Manjši gap med elementi
- ✅ Optimiziran container padding (1rem namesto 2rem)

---

## 📊 Primerjava velikosti

### **Desktop (≥1024px)**
| Element | Velikost |
|---------|----------|
| Product Card | 3 stolpci, 500px višina |
| Product Image | 250px |
| Font Size (naslov) | 1.75rem |
| Container Padding | 2rem |

### **Tablet (768px)**
| Element | Velikost |
|---------|----------|
| Product Card | 1 stolpec, 420px min višina |
| Product Image | 200px |
| Font Size (naslov) | 1.4rem |
| Container Padding | 1.5rem |

### **Mobile (480px)**
| Element | Velikost |
|---------|----------|
| Product Card | 1 stolpec, 380px min višina |
| Product Image | 180px |
| Font Size (naslov) | 1.3rem |
| Container Padding | 1rem |

---

## 🧪 Kako testirati

### **1. V brskalniku (Chrome/Edge)**
1. Odprite spletno stran: `https://glaam-six.vercel.app/`
2. Pritisnite **F12** (Developer Tools)
3. Kliknite na **ikono telefona** (Device Toolbar) ali **Ctrl+Shift+M**
4. Izberite napravo:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPhone 14 Pro Max (430px)
   - iPad Mini (768px)
   - Samsung Galaxy S20 (360px)

### **2. Na pravem telefonu**
1. Odprite: `https://glaam-six.vercel.app/`
2. Preverite:
   - ✅ Ali se vse prikaže pravilno?
   - ✅ Ali lahko kliknete na vse gumbe?
   - ✅ Ali je besedilo berljivo?
   - ✅ Ali se ploščice prikazujejo v 1 stolpcu?
   - ✅ Ali lahko dodate izdelke v košarico?
   - ✅ Ali deluje hamburger menu?

### **3. Preverjanje različnih zaslonov**
- **Portret (pokončno)**: Normalen prikaz
- **Landscape (ležeče)**: Preverite, da vse deluje tudi ležeče

---

## 🐛 Če še vedno ni OK

### **Problem 1: Besedilo je še vedno premajhno**
**Rešitev:** Povečajte font-size v `@media (max-width: 480px)` sekciji

### **Problem 2: Elementi se še vedno prekrivajo**
**Rešitev:** Povečajte padding/margin v responsive sekcijah

### **Problem 3: Gumbi so pretežko klikljivi**
**Rešitev:** Povečajte `min-height` in `padding` za gumbe

### **Problem 4: Slike so prevelike**
**Rešitev:** Zmanjšajte `.product-image height` v media queries

### **Problem 5: Horizontalno drsenje (scroll)**
**Rešitev:** Preverite elemente z fiksno širino (width) in jih spremenite v `max-width: 100%`

---

## 📝 Dodatne optimizacije (opcijsko)

### **Performance**
- [ ] Lazy loading za slike
- [ ] Minifikacija CSS/JS
- [ ] Optimizacija slik (WebP format)

### **UX**
- [ ] Swipe gestures za filter buttons
- [ ] Pull-to-refresh
- [ ] Haptic feedback za gumbe

### **Accessibility**
- [ ] Večji touch targets (min 44x44px)
- [ ] Boljši kontrast za mobilne
- [ ] Focus states za keyboard navigation

---

## ✅ Checklist za testiranje

- [ ] Domača stran se pravilno prikaže
- [ ] Navigacija (hamburger menu) deluje
- [ ] Ploščice so v 1 stolpcu
- [ ] Gumbi so dovolj veliki za klik
- [ ] Besedilo je berljivo
- [ ] Košarica se odpre v full-screen
- [ ] Filter gumbi se lahko scrollajo
- [ ] Quantity kontrole (-1+) delujejo
- [ ] "Dodaj v košarico" gumb deluje
- [ ] Poroka zavihtek se pravilno prikaže
- [ ] Žalni program se pravilno prikaže
- [ ] Checkout form deluje
- [ ] Jezik switcher deluje

---

**Testirajte na telefonu in mi sporočite, če je še kaj narobe!** 📱✅

