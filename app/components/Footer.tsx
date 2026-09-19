import logo from "~/assets/logo.webp";
import { fullAddress, site, socialLinks } from "~/content/site";
import styles from "./Footer.module.scss";
import { NewsletterForm, newsletterPitch } from "./NewsletterForm";

export function Footer({ newsletter }: { newsletter: boolean }) {
  return (
    <footer className={styles.footer}>
      {newsletter && (
        <section
          className={styles.newsletter}
          aria-labelledby="newsletter-title"
        >
          <div className={`wrap ${styles.newsletterInner}`}>
            <div>
              <p className="eyebrow">Newsletter</p>
              <h2 id="newsletter-title">
                Le novità del centro, <em>in anteprima</em>
              </h2>
              <p className={styles.pitch}>{newsletterPitch}</p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      )}
      <div className={`wrap ${styles.inner}`}>
        <img src={logo} alt="" width={36} height={46} loading="lazy" />
        <span className={styles.wordmark}>
          <b>{site.name}</b>
          <span>{site.owner.name}</span>
        </span>
        {socialLinks.length > 0 && (
          <ul className={styles.social}>
            {socialLinks.map(([label, url]) => (
              <li key={label}>
                <a href={url} rel="me">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className={styles.legal}>
          © 2026 {site.legalName} · {fullAddress} · P.IVA {site.vatId} ·{" "}
          <a href="/policies/privacy-policy">Privacy</a>
        </p>
      </div>
    </footer>
  );
}
