/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    "spline-viewer": {
      url?: string;
      className?: string;
    };
  }
}

declare module "*.glb";
declare module "*.png";
