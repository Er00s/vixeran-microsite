import { ChangeDetectionStrategy, Component } from '@angular/core';

interface NitrogenBubble {
  id: string;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
  drift: string;
}

/**
 * Three N-bubbles that rise a little and fade out on a loop.
 * The host is just a positioning box; the parent places it over the photo.
 */
@Component({
  selector: 'app-nitrogen-bubbles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
  },
  styles: `
    :host {
      display: block;
      pointer-events: none;
    }

    .vx-n-bubble {
      position: absolute;
      top: var(--n-top);
      left: var(--n-left);
      width: var(--n-size);
      height: var(--n-size);
      object-fit: contain;
      will-change: transform, opacity;
      animation: vx-n-rise var(--n-duration) var(--n-delay) ease-in-out infinite;
    }

    @keyframes vx-n-rise {
      0% {
        opacity: 0;
        transform: translate3d(0, 1.25rem, 0) scale(0.9);
      }
      16% {
        opacity: 1;
      }
      58% {
        opacity: 0.85;
      }
      100% {
        opacity: 0;
        transform: translate3d(var(--n-drift), -4.75rem, 0) scale(1.06);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .vx-n-bubble {
        opacity: 0.85;
        animation: none;
        transform: none;
      }
    }
  `,
  template: `
    @for (bubble of bubbles; track bubble.id) {
      <img
        class="vx-n-bubble select-none"
        [style.--n-top]="bubble.top"
        [style.--n-left]="bubble.left"
        [style.--n-size]="bubble.size"
        [style.--n-delay]="bubble.delay"
        [style.--n-duration]="bubble.duration"
        [style.--n-drift]="bubble.drift"
        src="assets/all/slide-04/burbuja-N.webp"
        alt=""
      />
    }
  `,
})
export class NitrogenBubbles {
  protected readonly bubbles: readonly NitrogenBubble[] = [
    {
      id: 'a',
      top: '36%',
      left: '12%',
      size: 'clamp(2.75rem, 5.6vw, 5.5rem)',
      delay: '0s',
      duration: '6.4s',
      drift: '12px',
    },
    {
      id: 'b',
      top: '6%',
      left: '46%',
      size: 'clamp(1.85rem, 3.8vw, 3.5rem)',
      delay: '2s',
      duration: '7.5s',
      drift: '-16px',
    },
    {
      id: 'c',
      top: '48%',
      left: '66%',
      size: 'clamp(1.35rem, 2.7vw, 2.4rem)',
      delay: '3.6s',
      duration: '8.3s',
      drift: '20px',
    },
  ];
}
