/**
 * Windows display scaling (125% / 150% / 175%) shrinks the CSS viewport.
 * A 1920×1080 monitor at 150% reports ~1280×720 CSS pixels, so the 1800px
 * Figma layout never activates and the stacked "laptop" rules take over.
 *
 * When the CSS screen itself was squeezed below 1800px by OS DPI (not Ctrl +/-
 * browser zoom, which leaves screen.width unchanged), apply the 1920 artboard
 * and scale it to fit.
 *
 * Chrome / Edge can use CSS `zoom` (keeps position:fixed and Leaflet clicks).
 * If zoom does not actually paint (Electron, Firefox), fall back to a
 * transform scale on `.vx-canvas` / `.vx-chrome`.
 */
(function () {
  var DESIGN = 1920;
  var FIGMA_MIN = 1800;
  var DESK_MIN = 1200;

  function supportsZoomSyntax() {
    try {
      return typeof CSS !== 'undefined' && CSS.supports && CSS.supports('zoom', '1');
    } catch (err) {
      return false;
    }
  }

  function zoomPaints() {
    if (!supportsZoomSyntax() || /Firefox\/\d+/i.test(navigator.userAgent)) {
      return false;
    }
    var probe = document.createElement('div');
    probe.style.cssText =
      'position:absolute;left:0;top:0;width:100px;height:100px;zoom:0.5;opacity:0;pointer-events:none';
    document.documentElement.appendChild(probe);
    var painted = Math.abs(probe.getBoundingClientRect().width - 50) < 2;
    probe.remove();
    return painted;
  }

  var useZoom = zoomPaints();
  var lastKey = '';
  var observing = false;

  function currentScale() {
    return window.innerWidth / DESIGN;
  }

  function syncTransformHeight() {
    var html = document.documentElement;
    var canvas = document.querySelector('.vx-canvas');
    var scaler = document.querySelector('.vx-scaler');
    if (!canvas || !scaler) return;

    if (!html.classList.contains('vx-artboard-transform')) {
      scaler.style.height = '';
      return;
    }

    scaler.style.height = canvas.scrollHeight * currentScale() + 'px';
  }

  function apply() {
    var html = document.documentElement;
    var w = window.innerWidth;
    var dpr = window.devicePixelRatio || 1;
    var screenW = window.screen && screen.width ? screen.width : w;
    var native = w >= FIGMA_MIN;
    var screenSqueezed = screenW < FIGMA_MIN && screenW * dpr >= FIGMA_MIN;
    var nearlyFull = !screenW || w >= screenW * 0.88;
    var compensate = !native && w >= DESK_MIN && screenSqueezed && nearlyFull;

    var scale = compensate ? String(currentScale()) : '1';
    var useTransform = compensate && !useZoom;
    var key =
      (native || compensate ? '1' : '0') +
      '|' +
      (compensate ? '1' : '0') +
      '|' +
      (useTransform ? 't' : 'z') +
      '|' +
      scale;
    if (key === lastKey) {
      if (useTransform) syncTransformHeight();
      return;
    }
    lastKey = key;

    html.classList.toggle('vx-figma', native || compensate);
    html.classList.toggle('vx-artboard', compensate);
    html.classList.toggle('vx-artboard-transform', useTransform);
    html.style.setProperty('--vx-artboard-scale', scale);
    html.style.zoom = compensate && useZoom ? scale : '';

    syncTransformHeight();
  }

  function watchCanvas() {
    if (observing || typeof ResizeObserver === 'undefined') return;
    if (!document.body) {
      requestAnimationFrame(watchCanvas);
      return;
    }
    observing = true;
    new ResizeObserver(function () {
      syncTransformHeight();
    }).observe(document.body);
    syncTransformHeight();
  }

  apply();
  watchCanvas();
  window.addEventListener('load', apply);
  window.addEventListener('resize', apply, true);
  window.addEventListener('orientationchange', apply);

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', apply);
  }

  window.addEventListener('beforeprint', function () {
    lastKey = '';
    document.documentElement.classList.remove('vx-artboard', 'vx-artboard-transform');
    document.documentElement.style.zoom = '';
    document.documentElement.style.setProperty('--vx-artboard-scale', '1');
    syncTransformHeight();
  });
  window.addEventListener('afterprint', apply);
})();
