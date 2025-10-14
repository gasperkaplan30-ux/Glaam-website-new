# Navodila za dodajanje slik produktov

## Potrebne dimenzije slik

Za pravilno prikazovanje slik v produktnih okvirjih uporabite naslednje dimenzije:

### Glavna velikost
- **Širina:** 250px
- **Višina:** 120px
- **Razmerje:** 25:12 (približno 2:1)

### Za retina zaslone
- **Minimalna ločljivost:** 500px × 240px
- **Priporočena ločljivost:** 750px × 360px

## Formati slik
- **JPG** - za fotografije (priporočeno)
- **PNG** - za slike s prozornim ozadjem
- **WebP** - za optimalno zmogljivost (priporočeno)

## Kako dodati sliko

1. **Pripravite sliko** z zgoraj navedenimi dimenzijami
2. **Poimenujte sliko** po produktu (npr. `romantic-bouquet.jpg`)
3. **Dodajte sliko** v to mapo (`images/`)
4. **Posodobite JavaScript** - v `script.js` poiščite produkt in dodajte:
   ```javascript
   image: 'images/ime-slike.jpg'
   ```

## Primer
```javascript
{
    id: 1,
    name: 'Romantični Šopek',
    description: 'Nežne rdeče in rožnate vrtnice za posebne trenutke.',
    price: 45,
    category: 'romantic',
    icon: 'fas fa-rose',
    color: 'from-pink-200 to-pink-300',
    image: 'images/romantic-bouquet.jpg' // ← Dodajte to vrstico
}
```

## Avtomatska prilagoditev

Slike se bodo samodejno prilagodile:
- ✅ Enaka velikost za vse produkte
- ✅ Centrirane in obrezane (object-fit: cover)
- ✅ Responsive za mobilne naprave
- ✅ Hover efekti (povečava 1.05x)
- ✅ Zaokroženi robovi

## Opombe
- Slike se prikazujejo samo, če je lastnost `image` definirana
- Če slika ni na voljo, se prikaže ikona produkta
- Vse slike morajo biti v mapi `images/`
