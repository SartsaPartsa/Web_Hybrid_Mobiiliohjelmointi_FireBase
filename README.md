# Web_Hybrid_Mobiiliohjelmointi_FireBase

Web- ja hybriditeknologiat mobiiliohjelmoinnissa -kurssin viikkotehtävä8 - Sara Vehviläinen

## Kotityöt-sovellus (Expo + Firebase + TypeScript)

React Native -sovellus kotitöiden hallintaan Firebase Firestore -tietokannalla.

### Toiminnallisuudet

- ✅ Kotitöiden lisääminen (nimi + tekijä)
- ✅ Kotitöiden muokkaaminen
- ✅ Tilan vaihtaminen (Kesken ↔ Tehty)
- ✅ Kotitöiden poistaminen
- ✅ Reaaliaikainen synkronointi Firestoren kanssa

### Projektin rakenne

```
kotityot-app/
├── App.tsx             # Pääsovellus (TypeScript)
├── firebaseConfig.ts   # Firebase-konfiguraatio (TypeScript)
├── tsconfig.json       # TypeScript-konfiguraatio
├── package.json        # Projektiasetukset
├── components/         # Komponentit (TypeScript)
├── hooks/              # Custom hooks (TypeScript)
└── assets/             # Kuvat ja resurssit
```

### Teknologiat

- **React Native** (Expo)
- **TypeScript** (type-safe kehitys)
- **Firebase Firestore** (reaaliaikainen tietokanta)
- **React Hooks** (useState, useEffect)

### Asennus ja käynnistys

1. **Asenna riippuvuudet:**
   ```bash
   cd kotityot-app
   npm install
   ```

2. **Päivitä Firebase-asetukset:**
   - Avaa `firebaseConfig.ts`
   - Korvaa Firebase Console -projektisi tiedoilla

3. **Päivitä Firestore-säännöt:**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

4. **Käynnistä sovellus:**
   ```bash
   npm start
   ```

5. **Avaa sovellus:**
   - Paina `w` → Web-selain
   - Paina `i` → iOS-simulaattori
   - Paina `a` → Android-emulaattori
   - Skannaa QR-koodi puhelimella (Expo Go)

### Firebase-projekti

- **Projektin nimi:** kotityot-30b93
- **Tietokanta:** Firestore
- **Kokoelma:** `tasks`

### Tietorakenne

Jokainen kotityö Firestoressa:
```typescript
interface Task {
  id: string;
  title: string;
  assignedTo: string;
  status: "Kesken" | "Tehty";
}
```

### TypeScript-edut

- 🔒 **Type-safety**: Virheet havaitaan ennen ajoa
- 🚀 **Automaattinen koodintäydennys**: Parempi kehittäjäkokemus
- 📖 **Dokumentoitu koodi**: Tyypit toimivat dokumentaationa
- 🛡️ **Vähemmän bugeja**: Typot ja väärät tyypit estetään

### Tekijä

Sara Vehviläinen - 2026

