import { IntroAnimation } from '@/components/ui'
import { css } from 'styled-components/macro'

export const panelStyles = css`
  --iframe-width: 560px;
  --iframe-min-width: 560px;
  --iframe-max-width: 960px;
  --iframe-height: 80vh;
  --iframe-min-height: 50vh;
  --iframe-max-height: 80vh;
  --iframe-border-radius: 12px;
  border-radius: var(--iframe-border-radius);
  border: var(--border);
  width: var(--iframe-width);
  font-family: var(--sans-serif);
  opacity: var(--iframe-opacity);
  min-width: var(--iframe-min-width);
  max-width: var(--iframe-max-width);
  min-height: var(--iframe-min-height);
  box-shadow: var(--iframe-box-shadow);
  animation: var(--iframe-intro-animation);
  background: var(--iframe-background-color);
`

export const buttonStyles = css`
  --width: 120px;
  --height: 20px;
  --iframe-width: var(--width);
  --iframe-min-width: var(--width);
  --iframe-max-width: var(--width);
  --iframe-height: var(--height);
  --iframe-min-height: var(--height);
  --iframe-max-height: var(--height);
  --iframe-border-radius: 8px;
  border-radius: var(--iframe-border-radius) 0 0 var(--iframe-border-radius);
`

export const iframeBase = css`
  --iframe-opacity: 0; // initial opacity
  --iframe-background-color: #fff;
  --iframe-box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075);

  --iframe-intro-animation: ${IntroAnimation} 0.2s 0.1s forwards
    cubic-bezier(0.2, 0.8, 0.2, 1);

  pointer-events: auto; // in case we have no pointer-events on the overlay, revert to back here
  --iframe-z-index: 9999999;
  z-index: var(--iframe-z-index);
`

export const BoxShadows = css`
  --iframe-box-shadow: 0 1px 1px hsl(0deg 0% 0% / 0.075),
    0 2px 2px hsl(0deg 0% 0% / 0.075), 0 4px 4px hsl(0deg 0% 0% / 0.075),
    0 8px 8px hsl(0deg 0% 0% / 0.075), 0 16px 16px hsl(0deg 0% 0% / 0.075);
`

export const zIndex = css`
  --iframe-z-index: 9999999;
  z-index: var(--iframe-z-index);
`
