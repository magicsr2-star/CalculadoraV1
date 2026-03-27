# 🚀 Guía para subir Calc+ a Google Play Store

## Método: TWA (Trusted Web Activity)
La forma más rápida de publicar una PWA en Play Store sin necesidad de Android Studio en profundidad.

---

## PASO 1 — Alojar la app online (OBLIGATORIO)

La app **debe** estar en una URL pública con HTTPS.

### Opción A: GitHub Pages (gratis)
1. Sube la carpeta `calcplus-playstore/` a un repo en GitHub
2. Ve a Settings → Pages → Branch: main → /root → Save
3. Tu URL: `https://tu-usuario.github.io/calcplus/`

### Opción B: Netlify (gratis, más fácil)
1. Ve a https://netlify.com → "Add new site" → "Deploy manually"
2. Arrastra la carpeta `calcplus-playstore/`
3. Tu URL: `https://calcplus.netlify.app` (o el nombre que elijas)

### Opción C: Vercel (gratis)
```bash
npm i -g vercel
cd calcplus-playstore
vercel
```

---

## PASO 2 — Subir el archivo assetlinks.json

Este archivo vincula tu web con la app Android.

1. Debe estar accesible en: `https://tu-dominio.com/.well-known/assetlinks.json`
2. En Netlify/Vercel: crea la carpeta `.well-known/` y sube `assetlinks.json` dentro

---

## PASO 3 — Crear la APK con Bubblewrap (herramienta oficial de Google)

```bash
# Instalar Node.js (si no lo tienes): https://nodejs.org

# Instalar Bubblewrap
npm i -g @bubblewrap/cli

# Crear proyecto Android
bubblewrap init --manifest https://tu-dominio.com/manifest.json

# Cuando pregunte:
# - Package ID: com.calcplus.app
# - App name: Calc+
# - App version: 1
# - App version name: 1.1
# - Signing key: (crear nuevo)

# Construir APK/AAB
bubblewrap build
```

Esto genera `app-release-signed.aab` — el archivo que subes a Play Store.

---

## PASO 4 — Obtener el SHA256 Fingerprint

Después de crear el keystore en el paso anterior:

```bash
keytool -list -v -keystore android.keystore -alias android -storepass [tu-password]
```

Copia el valor SHA256 y ponlo en `assetlinks.json` donde dice `REEMPLAZAR_CON_TU_SHA256_FINGERPRINT`.

Luego vuelve a subir el archivo a tu web.

---

## PASO 5 — Crear cuenta de desarrollador en Play Store

1. Ve a https://play.google.com/console
2. Paga los $25 USD de registro (único pago)
3. Crea una nueva app

---

## PASO 6 — Subir a Play Store

En Google Play Console:
1. **Producción** → Crear nueva versión
2. Sube el archivo `.aab`
3. Rellena:
   - Descripción corta (80 chars): "Calculadora con gastos, lista de compra y split. 100% offline."
   - Descripción larga: (usa el README como base)
   - Capturas de pantalla: mínimo 2, formato 1080×1920 (ver sección abajo)
   - Icono de la tienda: 512×512 PNG (ya tienes `icons/icon-512x512.png`)
   - Gráfico de presentación: 1024×500 PNG (necesitas crearlo)

---

## 📸 Capturas de pantalla necesarias

Necesitas mínimo 2 capturas de 1080×1920px mostrando:
1. La calculadora principal
2. La lista de compra
3. Los descuentos (recomendada)

**Herramienta gratuita para crearlas:**
https://www.appscreenshot.io o simplemente toma screenshots en el móvil.

---

## ✅ Checklist final

- [ ] App alojada en HTTPS
- [ ] `.well-known/assetlinks.json` accesible públicamente
- [ ] SHA256 actualizado en assetlinks.json
- [ ] APK/AAB generado con Bubblewrap
- [ ] Capturas de pantalla preparadas (mín. 2)
- [ ] Icono 512×512 listo (ya tienes uno ✓)
- [ ] Cuenta de desarrollador en Play Console ($25)
- [ ] App subida y en revisión

---

## ⏱️ Tiempo estimado de revisión

Google suele tardar **1-3 días laborables** en aprobar apps nuevas.

---

## 🔗 Recursos útiles

- Bubblewrap: https://github.com/GoogleChromeLabs/bubblewrap
- Play Console: https://play.google.com/console
- TWA Guide: https://developer.chrome.com/docs/android/trusted-web-activity
