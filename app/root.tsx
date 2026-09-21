import frauncesItalic from "@fontsource-variable/fraunces/files/fraunces-latin-opsz-italic.woff2?url";
import fraunces from "@fontsource-variable/fraunces/files/fraunces-latin-opsz-normal.woff2?url";
import mulish from "@fontsource-variable/mulish/files/mulish-latin-wght-normal.woff2?url";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "react-router";

import type { Route } from "./+types/root";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { site } from "./content/site";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/mulish";
import "./styles/global.scss";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: "/favicon.png", type: "image/png" },
  // Above-the-fold fonts, fetched with the HTML instead of after the CSS.
  ...[fraunces, frauncesItalic, mulish].map((href) => ({
    rel: "preload",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous" as const,
    href,
  })),
];

// Closes the mobile <details> menu after a same-page anchor tap. Plain JS so
// it works on pages that ship no React on the client.
const closeMenuScript = `document.addEventListener("click",function(e){var a=e.target.closest("details a");if(a)a.closest("details").open=false})`;

export function Layout({ children }: { children: React.ReactNode }) {
  // Pages are static HTML with no client React unless a route exports
  // `handle = { hydrate: true }`. Dev keeps the scripts for HMR.
  const handles = useMatches().map(
    (m) => (m.handle ?? {}) as { hydrate?: boolean; hideNewsletter?: boolean },
  );
  const hydrate = import.meta.env.DEV || handles.some((h) => h.hydrate);

  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        {children}
        {/* Newsletter pages skip the footer signup: it would repeat their own. */}
        <Footer newsletter={!handles.some((h) => h.hideNewsletter)} />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user input
          dangerouslySetInnerHTML={{ __html: closeMenuScript }}
        />
        {hydrate && (
          <>
            <ScrollRestoration />
            <Scripts />
          </>
        )}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = "Si è verificato un errore";
  let details = "Riprova tra qualche istante.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error) && error.status === 404) {
    title = "Pagina non trovata";
    details = "La pagina che cerchi non esiste o è stata spostata.";
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="wrap section">
      {/* An error renders only the root route, which has no meta: React
          hoists this <title> into <head>. */}
      <title>{`${title} | ${site.name}`}</title>
      <h1>{title}</h1>
      <p>{details}</p>
      <a className="btn" href="/">
        Torna alla home
      </a>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
