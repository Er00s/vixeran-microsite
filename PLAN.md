# VIXERAN® Autumn Campaign Microsite — Plan de desarrollo

**Fase 1 · Frontend estático (Angular 21 + Tailwind 4)**
Documento de trabajo · 10 de agosto de 2026

---

## 1. Alcance de la Fase 1

Construir el micrositio completo como **aplicación estática**, sin backend, siguiendo la
Opción 1 (MVP) de `Propuesta_Arquitectura_Micrositio.pdf` y la estructura de 6 secciones
aprobada en `VIXERAN Autumn Campaign Microsite Structure Proposal.pdf`.

**Entra en Fase 1**

| # | Sección | Contenido |
|---|---------|-----------|
| 01 | Welcome to the Building Site | Hero + Key Visual + CTA |
| 02 | Lay the Foundations | 4 pilares de implantación otoñal |
| 03 | Meet the Bio Engineers | Modo de acción N₂ → NH₄⁺ → crecimiento + beneficios |
| 04 | Explore the Construction Sites | **Mapa de ensayos interactivo + panel meteorológico** |
| 05 | Building Success Across Europe | Testimonios + KPIs de ensayos |
| 06 | Ready to Build Yours? | Selector de país + CTA de contacto |
| 07 | Footer | Logo Syngenta + enlaces legales |

**No entra en Fase 1** (queda para Fase 2 / backend)

- Panel de administración y edición de contenido por país.
- Persistencia del formulario de contacto (hoy no envía datos a ningún lado).
- Base de datos de representantes locales por mercado.
- Autenticación.

---

## 2. Stack y decisiones técnicas

| Decisión | Elección | Motivo |
|----------|----------|--------|
| Framework | **Angular 21** (standalone, signals, zoneless) | Sin NgModules, `OnPush` en todo, change detection sin Zone.js → menos JS y menos re-renders. |
| Estilos | **Tailwind CSS v4** (config CSS-first) | No hay `tailwind.config.js`: los design tokens de campaña viven en `@theme` dentro de `src/styles.css`. Un solo lugar para el color system. |
| i18n | **@ngx-translate v18** + JSON por idioma | Permite **cambiar de idioma en runtime** con un `<select>`. El i18n nativo de Angular exige un build por locale y una URL por idioma, lo que multiplica los deploys — inviable para 8+ mercados en un MVP. |
| Mapa | **Leaflet 1.9 + markercluster**, carga diferida | Mismo motor que el HTML original → migración 1:1 sin riesgo. `import()` dinámico: 150 kB que no entran en el bundle inicial. |
| Gráficos | **SVG inline propio** (sin librería) | 11 scatter plots con línea de tendencia y Pearson r. La matemática son ~40 líneas (`core/services/statistics.ts`); una librería de charts costaría 100–300 kB y pelearía con el lenguaje visual de campaña. |
| Datos | **JSON estático tipado** en `assets/data/` | Un único servicio (`TrialsService`) los consume por HTTP. En Fase 2 se cambian 3 URLs por endpoints REST y **ningún componente se toca**. |
| Rutas | Single page + anchors; legales lazy | El journey es una narrativa de scroll, no 6 páginas. |

### Versiones instaladas

```
@angular/core 21.2 · @angular/cli 21.2 · typescript 5.9
tailwindcss 4.3 · @tailwindcss/postcss 4.3
@ngx-translate/core 18 · @ngx-translate/http-loader 18
leaflet 1.9.4 · leaflet.markercluster 1.5.3
Node ≥ 20.19 / 22.12
```

> Angular 22 requiere Node ≥ 22.22.3. Se fijó Angular 21 para no bloquear a nadie
> por versión de Node; subir a 22 más adelante es `ng update` y poco más.

---

## 3. Estructura del proyecto

```
src/
├─ app/
│  ├─ core/
│  │  ├─ models/         trial.model.ts · weather.model.ts · section.model.ts
│  │  └─ services/       trials.service.ts · language.service.ts
│  │                     gain-scale.ts (colores/tamaños) · statistics.ts (Pearson, OLS)
│  ├─ shared/components/ section-shell · stat-tile · media-placeholder
│  ├─ layout/            site-header · journey-nav (rail 01–06) · site-footer
│  │                     language-switcher
│  ├─ features/
│  │  ├─ welcome/        01
│  │  ├─ foundations/    02
│  │  ├─ bio-engineers/  03
│  │  ├─ trials/         04 → trials-section
│  │  │                       ├─ trial-map/          (Leaflet)
│  │  │                       └─ weather-dashboard/  (+ scatter-chart)
│  │  ├─ success/        05
│  │  └─ contact/        06
│  ├─ pages/             home · legal
│  ├─ app.config.ts      providers: http, router, translate, APP_INITIALIZER de idioma
│  └─ app.routes.ts
├─ assets/
│  ├─ data/              trials.json · trial-weather.json · trial-kpis.json · countries.json
│  └─ i18n/              en · es · de · fr · pl .json
└─ styles.css            @theme (design tokens) + @utility (vx-*)
```

**Dos reglas que sostienen la arquitectura**

1. `JOURNEY_SECTIONS` (en `core/models/section.model.ts`) es la única fuente de verdad
   del recorrido: alimenta el rail lateral 01–06, el menú superior y el menú móvil.
   Agregar o reordenar una sección se hace ahí, no en tres templates.
2. Ningún texto vive en un template. Todo pasa por una clave i18n.

---

## 4. Datos de ensayos

Los 51 Single Trial Reports y sus variables meteorológicas se extrajeron de los dos
HTML existentes y se normalizaron a JSON tipado (camelCase, unidades en el nombre del
campo, `null` explícito donde no hay dato).

| Archivo | Contenido |
|---------|-----------|
| `trials.json` | 51 ensayos: geo, variedad, suelo, producto, tratamiento, control vs VIXERAN, ganancias % |
| `trial-weather.json` | 11 variables meteorológicas por ensayo + ganancia de rendimiento/biomasa |
| `trial-kpis.json` | Agregados precalculados para el hero y la franja de KPIs |
| `countries.json` | Catálogo de países (código ISO + nombre) para el selector de contacto |

Cifras reales del dataset (calculadas, no estimadas):

```
51 ensayos · 8 países · 4 campañas (2021-22 … 2024-25)
40 ensayos con dato de rendimiento · 48 con dato de biomasa
Ganancia media de rendimiento: +1,29 %
Ganancia media de biomasa:     +2,49 %
Ensayos con respuesta positiva de rendimiento: 21 de 40
Mejor ensayo: +23,46 % (PLUP0S0052024, Polonia)
```

> ⚠️ **Punto a resolver con Marketing antes del lanzamiento.** El boceto muestra un
> *"Average yield increase with VIXERAN® +12 %"*. El dataset de los 51 STR no respalda
> esa cifra: el promedio es **+1,3 %** y algo más de la mitad de los ensayos con cosecha
> registrada da resultado positivo. O la cifra del boceto viene de otro subconjunto
> (por ejemplo, solo ensayos con estrés de nitrógeno, o solo la campaña 2023-24), o hay
> que cambiarla. **Hoy el micrositio muestra el número real calculado en vivo**; si
> Marketing quiere un recorte distinto, hay que definir el criterio y lo aplicamos en el
> pipeline de datos, no a mano.

---

## 5. Fases de trabajo

### ✅ Fase 1.0 — Fundaciones (HECHO)

- [x] Proyecto Angular 21 + Tailwind 4 + design tokens de campaña
- [x] i18n runtime con 5 idiomas (EN, ES, DE, FR, PL) y detección `?lang=` → localStorage → navegador
- [x] Extracción y tipado de los 51 ensayos + 11 variables meteorológicas
- [x] Layout: header pegajoso, rail lateral 01–06 con scroll-spy, footer
- [x] Las 6 secciones maquetadas y conectadas al i18n
- [x] **Mapa de ensayos migrado a Angular**: clusters, filtros país/campaña/métrica, popups, estadísticas en vivo
- [x] **Panel meteorológico migrado a Angular**: 11 scatter plots, Pearson r, línea de tendencia, toggles por país, hallazgos rankeados
- [x] Build de producción verde · bundle inicial **90 kB** transferidos (Leaflet queda en chunk diferido)

### Fase 1.1 — Contenido y arte (≈ 1 semana, bloqueada por assets)

| Tarea | Depende de |
|-------|-----------|
| Sustituir los 9 `<app-media-placeholder>` por el arte real | Key Visual, ilustraciones Bio Engineers, iconografía, fotografía de campo |
| Auto-hospedar tipografías de marca en `src/assets/fonts` | Archivos de fuente Syngenta |
| Copys definitivos EN + validación por mercado de DE/FR/PL/ES | Marketing |
| Testimonios reales de agricultor y experto | Marketing |
| Textos legales (aviso legal, privacidad, cookies, términos) | Legal Syngenta |
| Definir la cifra headline de rendimiento (ver §4) | Marketing + Technical |

> Buscar `app-media-placeholder` en el código da la lista completa de assets pendientes,
> cada uno rotulado con qué imagen va ahí.

### Fase 1.2 — Pulido y calidad (≈ 1 semana)

| Tarea | Detalle |
|-------|---------|
| Responsive fino | Repaso 360 / 768 / 1024 / 1440 / 1920, sobre todo mapa y grilla de charts |
| Accesibilidad | Auditoría axe: contraste, foco visible, orden de tabulación, alternativa tabular al mapa |
| SEO y compartición | `<meta>` por idioma, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD de producto |
| Consentimiento de cookies | Requisito UE; el mapa carga tiles de OpenStreetMap (IP de terceros) → hay que declararlo o servir tiles propios |
| Animación de scroll | Entrada progresiva de secciones, coherente con la metáfora de construcción |
| Rendimiento | Lighthouse ≥ 90 en móvil; imágenes en AVIF/WebP con `<picture>` |
| QA multi-idioma | Verificar que ningún texto rompe el layout en DE (palabras largas) ni en PL |

### Fase 1.3 — Entrega (≈ 2 días)

| Tarea | Detalle |
|-------|---------|
| Definir hosting | Pendiente de decisión. El build es estático puro (`dist/vixeran-microsite/browser`) y funciona en Netlify, Vercel, S3+CloudFront o un servidor de IT Syngenta |
| Configurar `base-href` | `ng build --base-href=/vixeran/` si va en un subdirectorio |
| Fallback SPA | El servidor debe reescribir 404 → `index.html` (única condición del hosting) |
| CI | GitHub Actions: `npm ci && npm run build` en cada PR |
| Analítica | Insertar el tag corporativo de Syngenta cuando lo provean |

### Fase 2 — Backend (posterior, fuera de este plan)

El frontend ya está preparado: toda la lectura de datos pasa por `TrialsService`.
Migrar a la Opción 2 de la propuesta de arquitectura es:

1. Cambiar 3 constantes de URL en `trials.service.ts` por endpoints REST.
2. Conectar `ContactSection.submit()` al endpoint de captación de leads.
3. Servir los JSON de i18n desde el CMS en vez de `assets/i18n/`.
4. Construir el panel de administración por país (proyecto aparte).

---

## 6. Estimación

| Fase | Estado | Esfuerzo |
|------|--------|----------|
| 1.0 Fundaciones + migración de mapa y dashboard | ✅ Hecho | — |
| 1.1 Contenido y arte | Bloqueada por assets | ~5 días |
| 1.2 Pulido y calidad | Pendiente | ~5 días |
| 1.3 Entrega y deploy | Pendiente | ~2 días |
| **Total restante** | | **~12 días hábiles** |

El camino crítico **no es el código**: es la entrega del Key Visual, las ilustraciones,
los copys definitivos y los textos legales. Conviene pedirlos ya.

---

## 7. Riesgos abiertos

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| La cifra de +12 % no coincide con los datos (§4) | Alto — credibilidad y compliance | Definir el criterio con Marketing/Technical antes del lanzamiento |
| Tiles de OpenStreetMap: uso comercial y privacidad | Medio | Evaluar un proveedor con contrato (MapTiler, Mapbox) o un GeoJSON propio de Europa sin tiles externos |
| Traducciones DE/FR/PL sin validar por mercado | Medio | Las que van en el repo son una base funcional; cada país debe revisar su archivo antes de publicar |
| Sin hosting definido | Medio | El build es estático puro, así que la decisión puede tomarse tarde sin afectar el desarrollo |
| Datos de ensayos congelados en JSON | Bajo en Fase 1 | Cada actualización requiere un deploy; es exactamente el trade-off aceptado en la Opción 1 |

---

## 8. Cómo arrancar

```bash
npm ci
npm start          # http://localhost:4200
npm run build      # → dist/vixeran-microsite/browser
```

Cambiar de idioma: el selector del header, o `?lang=de` en la URL.
