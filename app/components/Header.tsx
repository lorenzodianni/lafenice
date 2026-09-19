import logo from "~/assets/logo.png";
import { site } from "~/content/site";
import styles from "./Header.module.scss";

const links = [
  { href: "/#preordine", label: "Preordine", accent: true },
  { href: "/#trattamenti", label: "Trattamenti" },
  { href: "/#studio", label: "Lo studio" },
  { href: "/#contatti", label: "Contatti" },
  // On desktop the header button covers it.
  { href: "/#contatti", label: "Prenota", mobileOnly: true },
];

// Anchor links stay on the page, so the open mobile menu would cover the content.
function closeMenu(event: React.MouseEvent<HTMLElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

const toAnchor = (link: (typeof links)[number]) => (
  <a
    key={link.label}
    href={link.href}
    className={link.accent ? styles.accent : undefined}
    onClick={closeMenu}
  >
    {link.label}
  </a>
);

export function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/">
        <img src={logo} alt="" width={33} height={42} />
        <span className={styles.wordmark}>
          <b>{site.name}</b>
          <span>{site.kind}</span>
        </span>
      </a>

      <nav className={styles.nav} aria-label="Principale">
        {links.filter((link) => !link.mobileOnly).map(toAnchor)}
      </nav>
      <a className={`btn ${styles.cta}`} href="/#contatti">
        Prenota
      </a>

      {/* Native disclosure: the mobile menu works before and without JS. */}
      <details className={styles.menu}>
        <summary>
          <span className="sr-only">Menu</span>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <i aria-hidden="true" />
        </summary>
        <nav aria-label="Principale">{links.map(toAnchor)}</nav>
      </details>
    </header>
  );
}
