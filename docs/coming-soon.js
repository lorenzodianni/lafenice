// Temporary page on lafenicecentroestetico.com until go-live (docs/rollout.md §2).
// Pasted by hand into the dashboard editor of the Worker `lafenice`: connecting
// the repo to that Worker replaces it with the real site. Delete this file then.
//
// ponytail: duplicates address, phone and hours from app/content/site.ts, since
// a pasted script cannot import it. It dies at go-live, keep it to these facts.

const html = `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>La Fenice, Centro Estetico a Cinisello Balsamo</title>
<style>
  :root { --pink-soft: #fbeaf0; --plum: #3a1526; --ink: #2b1a20; --ink-soft: #5a2e3d; --line: #ebb6c8; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100svh; display: grid; place-items: center;
    padding: 32px 16px; background: var(--pink-soft); color: var(--ink);
    font: 1rem/1.6 system-ui, sans-serif; text-align: center;
  }
  main { max-width: 30rem; }
  .eyebrow { margin: 0; font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-soft); }
  h1 { margin: .25rem 0 1.25rem; font: 400 clamp(2.75rem, 12vw, 4.5rem)/1 Georgia, serif; color: var(--plum); }
  .lead { margin: 0 0 2rem; font: italic 1.25rem/1.4 Georgia, serif; }
  address { font-style: normal; padding: 1.5rem 0; border-block: 1px solid var(--line); }
  address p { margin: 0 0 .5rem; }
  address p:last-child { margin: 0; }
  a { color: var(--plum); }
  .legal { margin: 2rem 0 0; font-size: .8rem; color: var(--ink-soft); }
</style>
</head>
<body>
<main>
  <p class="eyebrow">Centro Estetico</p>
  <h1>La Fenice</h1>
  <p class="lead">Il nuovo sito è in arrivo.</p>
  <address>
    <p><a href="https://www.google.com/maps/search/?api=1&amp;query=La%20Fenice%20Via%20Luigi%20Pirandello%201%2C%2020092%20Cinisello%20Balsamo%20(MI)">Via Luigi Pirandello 1<br>20092 Cinisello Balsamo (MI)</a></p>
    <p><a href="tel:+393714571906">+39 371 457 1906</a></p>
    <p>Mar - Ven 9:00 - 19:30 · Sab 9:00 - 19:00<br>Lun e Dom chiuso</p>
  </address>
  <p class="legal">Micaela Brunetti · P.IVA 11407830964</p>
</main>
</body>
</html>`;

// Every path gets the page: the double opt-in link in Brevo's emails already
// points to /pages/iscrizione-confermata on this domain.
export default {
  fetch() {
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
