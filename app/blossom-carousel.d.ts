// JSX types for the custom elements of @blossom-carousel/web: the package
// ships Vue/React wrappers, but we render the plain elements (no React on the
// client) and TypeScript does not know them.
import type { HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "blossom-carousel": HTMLAttributes<HTMLElement>;
    }
  }
}
