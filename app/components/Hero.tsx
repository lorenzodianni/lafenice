import "@blossom-carousel/web/style.css";
import { Fragment } from "react";
import hero1 from "~/assets/placeholder-hero.svg";
import hero2 from "~/assets/placeholder-hero-2.svg";
import hero3 from "~/assets/placeholder-hero-3.svg";
import { site, treatments } from "~/content/site";
// The library registers custom elements, so it must run in the browser only:
// imported as a URL and loaded as a module script, never bundled into the
// server build (the Worker has no `customElements`) and without pulling React
// onto the client.
import blossomUrl from "../../node_modules/@blossom-carousel/web/dist/blossom-carousel-web.es.js?url";
import styles from "./Hero.module.scss";

// PLACEHOLDER: real photos pending.
const slides = [hero1, hero2, hero3];

const CAROUSEL_ID = "hero-slider";

// Blossom has no autoplay, so this is the one piece left to us: scroll the
// carousel by one slide every 6s and stop for good as soon as the visitor
// takes over (drag, key, wheel, or the arrows and dots, which fire `command`).
// Plain JS, because the home ships no React to the client.
const autoplayScript = `(function(){
var c=document.getElementById("${CAROUSEL_ID}");
if(!c||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var timer=setInterval(function(){
if(document.hidden)return;
if(c.scrollLeft+c.clientWidth>=c.scrollWidth-4)c.scrollTo({left:0,behavior:"smooth"});
else c.scrollBy({left:c.clientWidth,behavior:"smooth"});
},6000);
var stop=function(){clearInterval(timer)};
["pointerdown","keydown","wheel","command"].forEach(function(e){
c.addEventListener(e,stop,{once:true,passive:true})});
})()`;

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
          {/* Without JS this is still a scroll container that snaps: the
              styles are ours, Blossom adds drag and the controls. */}
          <blossom-carousel id={CAROUSEL_ID} className={styles.track}>
            {slides.map((src, i) => (
              <img
                key={src}
                src={src}
                data-blossom-slide=""
                // Decorative duplicates: one description is enough for the set.
                alt={i === 0 ? "Interni del centro estetico La Fenice" : ""}
                width={1200}
                height={600}
                // The other slides are in the viewport too, so `lazy` would
                // not defer them: only their priority can drop.
                fetchPriority={i === 0 ? "high" : "low"}
              />
            ))}
          </blossom-carousel>

          {/* The controls only work once the elements are defined, so CSS
              keeps them hidden until then. */}
          <blossom-prev
            className={`${styles.arrow} ${styles.prev}`}
            for={CAROUSEL_ID}
          >
            ‹
          </blossom-prev>
          <blossom-next
            className={`${styles.arrow} ${styles.next}`}
            for={CAROUSEL_ID}
          >
            ›
          </blossom-next>
          <blossom-dots className={styles.dots} for={CAROUSEL_ID} />

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
        <div className={styles.marqueeTrack}>
          <span>{marquee}</span>
          <span>{marquee}</span>
        </div>
      </div>

      <script type="module" src={blossomUrl} />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user input
        dangerouslySetInnerHTML={{ __html: autoplayScript }}
      />
    </>
  );
}
