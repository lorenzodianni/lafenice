import logo from "~/assets/logo.png";
import { fullAddress, site, socialLinks } from "~/content/site";
import styles from "./Footer.module.scss";

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
};

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.inner}`}>
        <img src={logo} alt="" width={36} height={46} loading="lazy" />
        <span className={styles.wordmark}>
          <b>{site.name}</b>
          <span>{site.owner.name}</span>
        </span>
        {socialLinks.length > 0 && (
          <ul className={styles.social}>
            {socialLinks.map(([key, url]) => (
              <li key={key}>
                <a href={url} rel="me noopener">
                  {socialLabels[key] ?? key}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p className={styles.legal}>
          © {new Date().getFullYear()} {site.legalName} · {fullAddress} · P.IVA{" "}
          {site.vatId} · <a href="/policies/privacy-policy">Privacy</a>
        </p>
      </div>
    </footer>
  );
}
