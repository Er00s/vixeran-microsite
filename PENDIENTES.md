# Pendientes — Micrositio VIXERAN® Fase 1

Actualizado: 10 de agosto de 2026
Estado del código: **build verde · 0 violaciones de axe · 0 overflow en 390/768/1440**

Este documento lista **solo lo que falta**. Lo ya terminado está en [`PLAN.md`](./PLAN.md);
cómo trabajar sobre el proyecto está en [`README.md`](./README.md).

---

## 0. Resumen: quién destraba qué

| Responsable | Cuántos ítems | Bloquea |
|-------------|---------------|---------|
| **Marketing / Brand** | 6 | Todo el contenido visible. **Camino crítico.** |
| **Legal Syngenta** | 1 | Publicación en la UE |
| **Cliente / IT Syngenta** | 3 | Deploy y decisión de tiles |
| **Equipo de desarrollo** | 9 | Nada externo; se puede avanzar ya |

> El código no es el cuello de botella. Los ítems de la sección 1 son los que hay
> que pedir hoy.

---

## 1. Bloqueado por terceros

### 1.1 Marketing / Brand

- [ ] **Definir la cifra headline de rendimiento** ⚠️ *el más importante*
  El boceto dice *"Average yield increase with VIXERAN® +12 %"*. Los 51 STR dan
  **+1,3 %** de promedio, con 21 de 40 ensayos positivos. Hoy el sitio muestra el
  número real calculado en vivo. Hay que decidir una de tres:
  1. cambiar el mensaje a la cifra real,
  2. definir el subconjunto del que sale el +12 % (¿solo ensayos con estrés de N?,
     ¿solo 2023-24?) y lo aplicamos en el pipeline de datos, o
  3. usar otra métrica como titular (por ejemplo biomasa, +2,5 %, o el mejor ensayo, +23,5 %).
  Cualquiera de las tres es media hora de trabajo. Lo que no se puede es publicar
  una cifra que el dataset contradice.

- [ ] **Key Visual y arte de campaña** — 9 espacios reservados en el código:

  | Ubicación | Asset |
  |-----------|-------|
  | `welcome-section.ts:21` | Hero Key Visual (fondo, 2560×1200) |
  | `welcome-section.ts:77` | Ilustración del hero (recorte con transparencia) |
  | `foundations-section.ts:31` | 4 iconos: raíz, biomasa, copo de nieve, brote |
  | `foundations-section.ts:42` | Ilustración subterránea de raíces |
  | `bio-engineers-section.ts:52` | Ilustración del modo de acción |
  | `success-section.ts:55` | Franja de fotografía de campo (21:9) |
  | `contact-section.ts:64` | Key Visual de cierre + QR |

  Formato pedido: AVIF/WebP con fallback, y las medidas anotadas en cada placeholder.
  Para verlos todos: `grep -rn "app-media-placeholder" src/app`

- [ ] **Tipografías de marca Syngenta** (archivos `.woff2`)
  Hoy el sitio usa Barlow Condensed + Inter desde Google Fonts. Cuando lleguen los
  archivos, se auto-hospedan en `src/assets/fonts` — que además es lo correcto para
  GDPR, porque Google Fonts también transmite la IP del visitante.

- [ ] **Copys definitivos en inglés** — hoy hay una base funcional en `src/assets/i18n/en.json`
- [ ] **Testimonios reales** de agricultor y de experto Syngenta (hoy son de ejemplo)
- [ ] **Validación por mercado de DE / FR / PL / ES** — las traducciones actuales son
      una base técnica correcta, pero ningún país las revisó. Cada mercado debería
      leer su archivo antes de publicar.

### 1.2 Legal Syngenta

- [ ] **Textos legales**: aviso legal, política de privacidad, política de cookies,
      términos de uso. Van en `legal.<slug>.body` de cada archivo i18n, o se
      reemplazan los enlaces por las URLs corporativas.
      La política de cookies tiene que mencionar explícitamente la transferencia de
      IP a OpenStreetMap, que es lo que el banner declara.

### 1.3 Cliente / IT Syngenta

- [ ] **Dominio de producción.** Hay 3 `TODO(hosting)` esperándolo:
      `seo.service.ts` (canonical + Open Graph), `public/robots.txt`, `public/sitemap.xml`
- [ ] **Decisión sobre los tiles del mapa** (`TODO(client decision)` en `trial-map.ts`).
      Hoy es OpenStreetMap detrás del consentimiento del visitante, así que no hay
      transferencia sin permiso — pero los términos de OSM desaconsejan el uso comercial.
      Tres caminos: seguir así asumiendo el riesgo, contratar MapTiler/Mapbox (necesita
      API key), o reemplazar el fondo por un GeoJSON propio de Europa (elimina el
      tercero por completo y encaja mejor con el estilo ilustrado de la campaña).
- [ ] **Tag de analítica corporativa**, si lo quieren. El gancho ya existe:
      `ConsentService.analyticsAllowed()`.

---

## 2. Trabajo de desarrollo (no bloqueado)

### 2.1 Pulido visual

- [ ] Animaciones de entrada por scroll, coherentes con la metáfora de construcción.
      Usar `IntersectionObserver` (ya hay uno en `journey-nav.ts` para copiar el patrón)
      y respetar `prefers-reduced-motion`.
- [ ] Estados de carga: hoy los KPIs muestran `—` mientras resuelve el JSON. Un skeleton
      quedaría mejor.
- [ ] Revisar el hero en pantallas muy anchas (≥1920): la ilustración queda con mucho aire.

### 2.2 Rendimiento

- [ ] Medir Lighthouse en móvil y llegar a ≥90. Punto de partida: **92 kB iniciales**
      transferidos, con Leaflet en chunk diferido.
- [ ] Servir las imágenes de campaña con `<picture>` + AVIF/WebP y `loading="lazy"`
      (aplica cuando lleguen los assets).
- [ ] Evaluar `@defer` de Angular en la sección 04, para no cargar el dashboard
      meteorológico hasta que el visitante llegue ahí.

### 2.3 Calidad y QA

- [ ] **QA multi-idioma con contenido definitivo.** El alemán tiene palabras largas que
      pueden romper la grilla de KPIs y el menú superior; el polaco también. Hoy los
      cinco idiomas están a paridad de claves (199 claves, verificado), pero con textos
      de base.
- [ ] Tests unitarios de lo que tiene lógica de verdad: `statistics.ts` (Pearson, OLS),
      `gain-scale.ts` (umbrales de color) y los filtros de `TrialsService`.
      El proyecto se generó con `--skip-tests`, así que hay que agregar el runner.
- [ ] Prueba manual con lector de pantalla (NVDA o VoiceOver). Axe no detecta todo:
      confirma que el orden de lectura y la tabla del mapa se entienden.
- [ ] Prueba en navegadores reales: Safari (iOS y macOS) y Firefox. Hasta ahora todo
      se verificó en Chromium.

### 2.4 Entrega

- [ ] Configurar `base-href` si el sitio va en un subdirectorio:
      `ng build --base-href=/vixeran/`
- [ ] **Fallback SPA en el servidor**: cualquier 404 tiene que reescribirse a
      `index.html`, o las rutas `/legal/...` dan error al recargar. Es la única
      exigencia que el micrositio le hace al hosting.
- [ ] CI en GitHub Actions: `npm ci && npm run build` en cada PR.
- [ ] Imagen de Open Graph en `public/assets/og/vixeran-autumn-campaign.jpg`
      (1200×630). La referencia ya está escrita en `seo.service.ts`.

---

## 3. Deuda técnica conocida

Ninguna de estas rompe nada hoy. Se anotan para que no se descubran de sorpresa.

- **`trial-kpis.json` está precalculado.** Si se actualizan los ensayos, hay que
  recalcularlo o el hero y la franja de KPIs quedan desfasados respecto del mapa.
  Conviene convertirlo en un script de build antes de que pase.
- **Font inlining desactivado** en la config de producción. Hacía que el build
  dependiera de alcanzar `fonts.googleapis.com`, lo que falla detrás de un proxy
  corporativo. Se resuelve solo cuando se auto-hospeden las tipografías.
- **Leaflet es CommonJS**, así que el build avisa de un *optimization bailout*.
  Está silenciado con `allowedCommonJsDependencies`. Sin impacto real: Leaflet ya
  está en un chunk aparte.
- **Angular 21, no 22.** La 22 exige Node ≥ 22.22.3. Subir es `ng update` cuando el
  equipo tenga esa versión de Node.
- **El formulario de contacto no envía nada.** Es intencional en Fase 1: al elegir
  país muestra un mensaje y nada más. `ContactSection.submit()` es el punto de
  enganche para el backend.

---

## 4. Fase 2 — cuando el cliente pida autonomía

Fuera del alcance actual, anotado para que se vea el camino:

1. Cambiar 3 constantes de URL en `trials.service.ts` por endpoints REST.
2. Conectar `ContactSection.submit()` al endpoint de captación de leads.
3. Servir los JSON de i18n desde el CMS en lugar de `assets/i18n/`.
4. Panel de administración por país (proyecto aparte).

El frontend ya está preparado para los cuatro puntos: toda la lectura de datos pasa
por `TrialsService` y ningún componente conoce el origen.

---

## 5. Estimación de lo que queda

| Bloque | Esfuerzo | Depende de |
|--------|----------|------------|
| Integrar arte y copys definitivos | ~5 días | Marketing |
| Animaciones, Lighthouse, QA multi-idioma | ~2 días | — |
| Tests unitarios y QA cross-browser | ~2 días | — |
| Entrega y deploy | ~2 días | Hosting definido |
| **Total** | **~11 días hábiles** | |

Los ~4 días de la sección 2.1–2.3 se pueden hacer en paralelo mientras se esperan
los assets.
