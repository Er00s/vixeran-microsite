# VIXERAN® Autumn Campaign Microsite

Micrositio de la campaña **"Autumn is Building Season"** — Fase 1: frontend estático.

Angular 21 (standalone · signals · zoneless) · Tailwind CSS 4 · ngx-translate · Leaflet.

El plan de desarrollo completo, con fases, estimaciones y puntos abiertos, está en
[`PLAN.md`](./PLAN.md).

---

## Arranque

```bash
npm ci
npm start          # http://localhost:4200
npm run build      # producción → dist/vixeran-microsite/browser
```

Requiere Node ≥ 20.19 o ≥ 22.12.

---

## Estructura

```
src/app/core/       modelos, TrialsService, LanguageService, escalas y estadística
src/app/shared/     section-shell, stat-tile, media-placeholder
src/app/layout/     header, rail 01–06, footer, selector de idioma
src/app/features/   las 6 secciones del journey
src/app/pages/      home (one-pager) y legal (lazy)
src/assets/data/    JSON de ensayos, clima, KPIs y países
src/assets/i18n/    en · es · de · fr · pl
src/styles.css      design tokens (@theme) y utilidades de campaña (@utility)
```

---

## Tareas frecuentes

### Cambiar un texto

Nunca se edita un template: se edita la clave en `src/assets/i18n/<idioma>.json`.
`en.json` es el fallback, así que toda clave nueva tiene que existir ahí.

### Agregar un idioma

1. Copiar `src/assets/i18n/en.json` a `<código>.json` y traducirlo.
2. Añadir `{ code: '<código>', label: '<Nombre>' }` a `APP_LANGUAGES`
   en `src/app/core/services/language.service.ts`.

No hace falta tocar nada más. El idioma se resuelve por `?lang=` → `localStorage` →
idioma del navegador → `en`.

### Agregar o reordenar una sección

Editar `JOURNEY_SECTIONS` en `src/app/core/models/section.model.ts`. De ahí salen el
rail lateral, el menú superior y el menú móvil. Después crear el componente en
`features/` y montarlo en `pages/home/home.ts`.

### Actualizar los datos de ensayos

Reemplazar `src/assets/data/trials.json` y `trial-weather.json` respetando las
interfaces de `core/models/`. `trial-kpis.json` está precalculado: si cambian los
ensayos, hay que recalcularlo (promedios, conteos, mejor ensayo).

### Cambiar colores o tipografía

Todo vive en el bloque `@theme` de `src/styles.css`. No hay `tailwind.config.js`:
Tailwind 4 usa configuración CSS-first, y cada token se convierte en utilidad
automáticamente (`--color-brand-700` → `bg-brand-700`).

### Encontrar los assets pendientes

```bash
grep -rn "app-media-placeholder" src/app
```

Cada placeholder está rotulado con la imagen que le corresponde.

---

## Notas de implementación

- **Leaflet se carga en diferido.** `import('leaflet')` dentro de `afterNextRender`,
  así no entra en el bundle inicial ni se ejecuta en un prerender. Leaflet es CommonJS:
  el import se normaliza con `module.default ?? module`.
- **El mapa y el dashboard comparten escala de color** (`core/services/gain-scale.ts`).
  Cambiar un umbral ahí lo cambia en los dos.
- **Los charts son SVG propio**, sin librería. La estadística (Pearson, mínimos
  cuadrados, ticks) está en `core/services/statistics.ts`.
- **Font inlining está desactivado** en la configuración de producción: dejaba el build
  dependiendo de alcanzar `fonts.googleapis.com`, lo que falla detrás de un proxy
  corporativo. Cuando lleguen las tipografías de marca, se auto-hospedan.
- **Los popups del mapa se traducen** mediante un `effect()` que observa el idioma
  activo y reconstruye los marcadores.
