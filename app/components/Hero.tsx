import { Fragment } from "react";
import hero1 from "~/assets/placeholder-hero.svg";
import hero2 from "~/assets/placeholder-hero-2.svg";
import hero3 from "~/assets/placeholder-hero-3.svg";
import { site, treatments } from "~/content/site";
import styles from "./Hero.module.scss";

// PLACEHOLDER: real photos pending.
const slides = [hero1, hero2, hero3];

// The slider works without JS: the track scrolls and snaps, the dots are
// anchors to each slide. This script only adds what needs state: the arrows
// (hidden until it runs), the autoplay, the active dot and dots that move the
// track without jumping to the anchor. Plain JS, because the home ships no
// React to the client.
const sliderScript = `(function(){
var t=document.getElementById("hero-track");if(!t)return;
var box=t.parentElement,dots=[].slice.call(box.querySelectorAll("[data-dot]"));
box.dataset.js="1";
var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
var go=function(d){t.scrollBy({left:d*t.clientWidth,behavior:still?"auto":"smooth"})};
box.querySelector("[data-prev]").onclick=function(){go(-1)};
box.querySelector("[data-next]").onclick=function(){go(1)};
t.addEventListener("scroll",function(){
var i=Math.round(t.scrollLeft/t.clientWidth);
dots.forEach(function(d,n){d.setAttribute("aria-current",n===i?"true":"false")});
},{passive:true});
dots.forEach(function(d,n){d.addEventListener("click",function(e){
e.preventDefault();
t.scrollTo({left:n*t.clientWidth,behavior:still?"auto":"smooth"})})});
if(still)return;
var timer=setInterval(function(){
if(document.hidden)return;
if(t.scrollLeft+t.clientWidth>=t.scrollWidth-4)t.scrollTo({left:0,behavior:"smooth"});else go(1);
},6000);
["pointerdown","keydown","wheel"].forEach(function(e){
t.addEventListener(e,function(){clearInterval(timer)},{once:true,passive:true})});
box.addEventListener("click",function(e){if(e.target.closest("button,[data-dot]"))clearInterval(timer)});
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
          <div
            className={styles.track}
            id="hero-track"
            // No tabindex: browsers already make a scrollable box focusable,
            // and the arrows and dots are keyboard controls of their own.
          >
            {slides.map((src, i) => (
              <img
                key={src}
                id={`hero-slide-${i + 1}`}
                src={src}
                // Decorative duplicates: one description is enough for the set.
                alt={i === 0 ? "Interni del centro estetico La Fenice" : ""}
                width={1200}
                height={600}
                // The other slides are in the viewport too, so `lazy` would
                // not defer them: only their priority can drop.
                fetchPriority={i === 0 ? "high" : "low"}
              />
            ))}
          </div>

          <button
            className={`${styles.arrow} ${styles.prev}`}
            type="button"
            data-prev=""
            aria-label="Immagine precedente"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            className={`${styles.arrow} ${styles.next}`}
            type="button"
            data-next=""
            aria-label="Immagine successiva"
          >
            <span aria-hidden="true">›</span>
          </button>

          <div className={styles.dots}>
            {slides.map((src, i) => (
              <a
                key={src}
                className={styles.dot}
                href={`#hero-slide-${i + 1}`}
                data-dot=""
                aria-current={i === 0 ? "true" : "false"}
              >
                <span className={styles.hidden}>
                  Immagine {i + 1} di {slides.length}
                </span>
              </a>
            ))}
          </div>

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

      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static string, no user input
        dangerouslySetInnerHTML={{ __html: sliderScript }}
      />
    </>
  );
}
