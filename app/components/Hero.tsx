import { Fragment } from "react";
import hero1 from "~/assets/placeholder-hero.svg";
import hero2 from "~/assets/placeholder-hero-2.svg";
import hero3 from "~/assets/placeholder-hero-3.svg";
import { site, treatments } from "~/content/site";
import styles from "./Hero.module.scss";

// PLACEHOLDER: real photos pending. The crossfade is pure CSS (see the module),
// so the home ships no JS: adding or removing a slide means updating the
// `animation-delay` list there too.
const slides = [hero1, hero2, hero3];

export function Hero() {
  const marquee = treatments.map((t) => (
    <Fragment key={t.name}>
      {t.name}
      <b>·</b>
    </Fragment>
  ));

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.media}>
          {slides.map((src, i) => (
            <img
              key={src}
              src={src}
              // Decorative duplicates: one description is enough for the set.
              alt={i === 0 ? "Interni del centro estetico La Fenice" : ""}
              width={1200}
              height={600}
              {...(i === 0 ? { fetchPriority: "high" as const } : {})}
            />
          ))}
          <span className={styles.badge}>Dal {site.foundingYear}</span>
        </div>
        <div className={`wrap ${styles.copy}`}>
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
