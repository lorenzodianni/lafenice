import heroImage from "~/assets/placeholder-hero.svg";
import { site, treatments } from "~/content/site";
import styles from "./Hero.module.scss";

export function Hero() {
  const marquee = treatments.map((t) => (
    <span key={t.name}>
      {t.name}
      <b>·</b>
    </span>
  ));

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.media}>
          {/* PLACEHOLDER: real photo pending */}
          <img
            src={heroImage}
            alt="Interni del centro estetico La Fenice"
            width={1200}
            height={600}
            fetchPriority="high"
          />
          <span className={styles.badge}>Dal {site.foundingYear}</span>
        </div>
        <div className={styles.copy}>
          <span className={styles.spine} aria-hidden="true" />
          <p className="eyebrow">
            {site.kind} a {site.address.city} · {site.owner.name}
          </p>
          <h1>
            Rinasci a ogni <em>cura.</em>
          </h1>
          <p className={styles.lead}>
            Trattamenti viso e corpo pensati su misura, in uno spazio dove
            prendersi cura di sé è un rito. Come la fenice, ogni volta si torna
            più luminose.
          </p>
          <div className={styles.actions}>
            <a className="btn" href="#contatti">
              Prenota un trattamento
            </a>
            <a className="btn btn-ghost" href="#trattamenti">
              Scopri i servizi
            </a>
          </div>
        </div>
      </section>

      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.track}>
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>
    </>
  );
}
