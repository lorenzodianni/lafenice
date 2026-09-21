import logo from "~/assets/logo.svg";
import { products } from "~/content/products";
import { site } from "~/content/site";
import styles from "./Header.module.scss";

const links = [
  { href: `/products/${products[0].handle}`, label: "Preordine", accent: true },
  { href: "/#trattamenti", label: "Trattamenti" },
  { href: "/#studio", label: "Lo studio" },
  { href: "/#contatti", label: "Contatti" },
];

const nav = (
  <nav aria-label="Principale">
    {links.map((link) => (
      <a
        key={link.href}
        href={link.href}
        className={link.accent ? styles.accent : undefined}
      >
        {link.label}
      </a>
    ))}
  </nav>
);

const cta = (
  <a className="btn" href="/#contatti">
    Prenota
  </a>
);

export function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="/">
        <img src={logo} alt="" width={32} height={42} />
        <span className={styles.wordmark}>
          <b>{site.name}</b>
          <span>{site.kind}</span>
        </span>
      </a>

      <div className={styles.desktop}>
        {nav}
        {cta}
      </div>

      {/* Native disclosure: works without JS. The inline script in root.tsx
          closes it after a same-page anchor tap. */}
      <details className={styles.menu}>
        <summary aria-label="Menu">
          <i />
          <i />
          <i />
        </summary>
        <div className={styles.panel}>
          {nav}
          {cta}
        </div>
      </details>
    </header>
  );
}
