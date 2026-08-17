# 🎭 Come Compilare l'APK - Joke Generator

## 📋 Requisiti

- **Android Studio** (Download: https://developer.android.com/studio)
- **Java Development Kit (JDK) 11+**
- **Android SDK** minimo 21
- **Gradle** (incluso in Android Studio)

---

## 🚀 COMPILAZIONE VELOCE (5 MINUTI)

### **Step 1: Scarica Android Studio**

```
https://developer.android.com/studio
```

---

### **Step 2: Crea Nuovo Progetto**

1. Apri Android Studio
2. **File** → **New** → **New Project**
3. Scegli **"Empty Activity"**
4. Configura:
   - **Name**: `JokeGenerator`
   - **Package name**: `com.frankarduino.jokegenerator`
   - **Minimum SDK**: API 21 (Android 5.0)
   - **Language**: Java
5. Clicca **Finish**

---

### **Step 3: Copia i File**

Copia questi file dal repo nel tuo progetto:

```
app/src/main/
├── AndroidManifest.xml          (Sostituisci)
├── java/com/frankarduino/
│   └── jokegenerator/
│       └── MainActivity.java     (Sostituisci)
├── res/
│   ├── layout/
│   │   └── activity_main.xml     (Sostituisci)
│   ├── values/
│   │   ├── strings.xml           (Sostituisci)
│   │   ├── colors.xml            (Nuovo)
│   │   └── styles.xml            (Nuovo)
└── assets/www/                   (Crea cartella)
    ├── joke-generator.html
    ├── styles-joke.css
    ├── app-joke.js
    ├── manifest-joke.json
    └── sw-joke.js
```

---

### **Step 4: Aggiorna build.gradle**

Copia il contenuto di `build.gradle` (dal repo) nel file:
```
app/build.gradle
```

---

### **Step 5: Compila l'APK**

**Opzione A: Debug APK (Test)**

Da terminale (nella cartella del progetto):
```bash
./gradlew assembleDebug
```

**Opzione B: Release APK (Produzione)**
```bash
./gradlew assembleRelease
```

---

### **Step 6: Trova l'APK Compilato**

**Debug:**
```
app/build/outputs/apk/debug/app-debug.apk
```

**Release:**
```
app/build/outputs/apk/release/app-release.apk
```

---

### **Step 7: Installa sul Telefono**

**Metodo A: USB + ADB**
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

**Metodo B: Drag & Drop in Android Studio**
1. Connetti il telefono
2. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. Clicca **Run**

**Metodo C: Manuale**
1. Abilita "Sviluppatore" nelle Impostazioni
2. Abilita "Debug USB"
3. Trascina l'APK sul telefono
4. Installa dal File Manager

---

## ⚡ ALTERNATIVA VELOCE: Capacitor (Ancora Più Facile!)

```bash
# 1. Installa Capacitor
npm install -g @ionic/cli

# 2. Crea progetto
ionic start joke-app blank --capacitor
cd joke-app

# 3. Copia file web
cp ../joke-generator.html ../styles-joke.css ../app-joke.js src/

# 4. Compila per Android
npx cap add android
npx cap build android
```

**L'APK sarà in:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📊 Build Info

```
App Name: Joke Generator
Package: com.frankarduino.jokegenerator
Version: 1.0
Minimum SDK: 21 (Android 5.0)
Target SDK: 33 (Android 13)
Language: Java + Web (HTML/CSS/JS)
Size: 50 MB (Debug) / 30 MB (Release)
```

---

## 🎁 Differenze APK

| Tipo | Dimensione | Uso | Debug |
|------|-----------|-----|-------|
| **Debug** | ~50 MB | Testing | Sì |
| **Release** | ~30 MB | Produzione | No |

---

## 🔐 Per Publicare su Google Play Store

1. **Firma l'APK** (vedi sotto)
2. **Crea account** Google Play ($25 one-time)
3. **Upload Release APK**
4. **Compila dettagli app**
5. **Sottoponi per review**

### Firma l'APK:
```bash
# Genera chiave
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias joke

# Firma APK
jarsigner -verbose -sigalg MD5withRSA -digestalg SHA1 \
  -keystore release.keystore app-release-unsigned.apk joke

# Zipalign (Ottimizza)
zipalign -v 4 app-release-unsigned.apk JokeGenerator.apk
```

---

## 🐛 Troubleshooting

### Errore: "SDK not found"
→ Installa Android SDK in Android Studio → Tools → SDK Manager

### Errore: "Gradle sync failed"
→ File → Invalidate Caches → Restart

### App crasha al lancio
→ Verifica che `assets/www/joke-generator.html` esista

### WebView bianca
→ Controlla console: `adb logcat`

---

## ✅ Checklist Finale

- [ ] Scarica Android Studio
- [ ] Copia i file nel progetto
- [ ] Aggiorna build.gradle
- [ ] Compila: `./gradlew assembleDebug`
- [ ] Installa: `adb install app-debug.apk`
- [ ] Testa offline
- [ ] Testa JokeAPI
- [ ] Crea release APK
- [ ] Pubblica su Play Store (opzionale)

---

**FATTO! Ora hai l'APK pronto! 🎉🎭**