import { Fragment } from "react";
import angoloAttesa from "~/assets/studio/angolo-attesa.webp";
import angoloAttesa800 from "~/assets/studio/angolo-attesa-800.webp";
import biglietto from "~/assets/studio/biglietto.webp";
import biglietto800 from "~/assets/studio/biglietto-800.webp";
import cabina from "~/assets/studio/cabina.webp";
import cabina800 from "~/assets/studio/cabina-800.webp";
import ingresso from "~/assets/studio/ingresso.webp";
import ingresso800 from "~/assets/studio/ingresso-800.webp";
import postazioneUnghie from "~/assets/studio/postazione-unghie.webp";
import postazioneUnghie800 from "~/assets/studio/postazione-unghie-800.webp";
import sala from "~/assets/studio/sala.webp";
import { site, treatments } from "~/content/site";
import styles from "./Hero.module.scss";

// WebP made once with cwebp from the client's photos (no build pipeline for
// six pictures). `small` is the 800w file for phones. The hall has none: it is
// landscape, and cropped into the portrait frame of a phone it shows at about
// 1.7 times the viewport width, so 800w would be too small there.
// `position` keeps the subject in the frame: on a desktop the frame is a wide
// strip that shows about a quarter of a portrait photo's height, and on a
// phone the hall loses its sides, sign included.
const slides = [
  {
    src: sala,
    width: 1600,
    height: 1148,
    position: "10%",
    alt: "La sala del centro estetico La Fenice, con la reception e la postazione unghie",
  },
  {
    src: ingresso,
    small: ingresso800,
    width: 1022,
    height: 1600,
    position: "50% 68%",
    alt: "L'ingresso, con la vetrata e il bancone con l'insegna La Fenice",
  },
  {
    src: cabina,
    small: cabina800,
    width: 1066,
    height: 1600,
    position: "50% 70%",
    alt: "La cabina dei trattamenti con il lettino",
  },
  {
    src: postazioneUnghie,
    small: postazioneUnghie800,
    width: 1066,
    height: 1600,
    alt: "La postazione per manicure e unghie, con l'espositore degli smalti",
  },
  {
    src: angoloAttesa,
    small: angoloAttesa800,
    width: 1000,
    height: 1600,
    alt: "L'angolo d'attesa con la poltrona e i prodotti in vendita",
  },
  {
    src: biglietto,
    small: biglietto800,
    width: 1066,
    height: 1600,
    position: "50% 30%",
    alt: "Il biglietto da visita con il logo La Fenice, tra i fiori",
  },
];

const SLIDER_ID = "hero-slider";

// Infinite loop: the strip holds three copies of the slides and the script
// keeps the visitor in the middle copy, jumping a copy back or forward once the
// scroll has settled. The copies are identical, so the jump is invisible.
const COPIES = [0, 1, 2];

// The swipe is the native scroll, the same on a finger and on a trackpad: this
// script adds the arrows, the dots and the autoplay. The dots are anchors to
// the middle copy, so they work without JS too. Plain JS, because the home
// ships no React to the client.
const sliderScript = `(function(){
var c=document.getElementById("${SLIDER_ID}"),box=c&&c.parentElement;
if(!c)return;
var n=${slides.length},dots=[].slice.call(box.querySelectorAll("[data-dot]")),at=0,last=0;
box.dataset.js="1";
var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
// Fractional: clientWidth is rounded, and on a fractional viewport that
// rounding drifts by a pixel per slide until the loop stops normalising.
var wid=function(){return c.getBoundingClientRect().width};
var set=function(){return wid()*n};
var to=function(x,fast){c.scrollTo({left:x,behavior:fast||still?"instant":"smooth"})};
// Counted from the slide the track is heading to, not from where it is: a
// second press during the smooth scroll adds a slide instead of snapping back
// to the same one. Reset once the scroll settles.
var want=null;
var go=function(d){var w=wid();
want=(want===null?Math.round(c.scrollLeft/w):want)+d;to(want*w)};
var norm=function(){
want=null;
var w=wid(),s=set(),x=c.scrollLeft,off=x%w;
// Between two slides means the scroll is still running: the jump would land
// off a slide.
if(off>2&&off<w-2)return;
if(x>=2*s)to(x-s,1);else if(x<s)to(x+s,1);
};
// Back to the middle copy, on the slide in view. Reading the width forces a
// layout, so the first one waits for the frame instead of holding up the
// parser.
var home=function(){last=wid();to(set()+at*last,1)};
requestAnimationFrame(home);
// Only a real width change: on Android the URL bar collapsing fires resize.
addEventListener("resize",function(){if(wid()!==last)home()});
box.querySelector("[data-prev]").onclick=function(){go(-1)};
box.querySelector("[data-next]").onclick=function(){go(1)};
if("onscrollend" in c)c.addEventListener("scrollend",norm);
else{var settle;c.addEventListener("scroll",function(){
clearTimeout(settle);settle=setTimeout(norm,250)},{passive:true})}
c.addEventListener("scroll",function(){
var i=Math.round(c.scrollLeft/wid())%n;
if(i===at)return;
at=i;
dots.forEach(function(d,k){d.setAttribute("aria-current",k===i?"true":"false")});
},{passive:true});
dots.forEach(function(d,k){d.addEventListener("click",function(e){
e.preventDefault();to(set()+k*wid())})});
if(still)return;
// Re-armed by every scroll of the track, whoever moves it: a step fires only
// after six seconds of stillness, never in the middle of a swipe, where it
// would land two slides ahead. A trackpad swipe pauses it; a page scroll past
// the hero does not touch it.
var timer,arm=function(){clearTimeout(timer);
timer=setTimeout(function(){if(!document.hidden)go(1);arm()},6000)};
arm();
c.addEventListener("scroll",arm,{passive:true});
// Using the controls stops it for good: a click or a tap, or focus from the
// keyboard or a screen reader. Not pointerdown: on a phone the hero fills the
// screen, and the swipe up that scrolls the page starts on a photo.
var stop=function(){clearTimeout(timer);c.removeEventListener("scroll",arm)};
["click","focusin"].forEach(function(e){box.addEventListener(e,stop,{once:true})});
})()`;

// One chevron, mirrored for the previous button: an SVG sits exactly in the
// middle of the round button, a text glyph does not.
const chevron = (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M9 5l7 7-7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
          <div id={SLIDER_ID} className={styles.track}>
            {COPIES.map((copy) =>
              slides.map((s, i) => (
                <img
                  key={`${copy}-${s.src}`}
                  // Only the middle copy is a link target for the dots.
                  id={copy === 1 ? `hero-slide-${i + 1}` : undefined}
                  src={s.src}
                  srcSet={s.small && `${s.small} 800w, ${s.src} ${s.width}w`}
                  // The frame is always the full viewport width. Only with a
                  // srcset: alone, sizes is invalid HTML.
                  sizes={s.small && "100vw"}
                  style={{ objectPosition: s.position }}
                  // A mouse drag on the slider must not pull a ghost copy of
                  // the photo along.
                  draggable={false}
                  // The other copies are decorative duplicates: each photo is
                  // described once, where a screen reader or a crawler meets
                  // it first in the document.
                  alt={copy === 0 ? s.alt : ""}
                  width={s.width}
                  height={s.height}
                  // Every copy has the same URLs, so what the preload
                  // scanner meets first is what gets fetched: the priority
                  // goes on the first copy, the rest must not compete.
                  fetchPriority={copy === 0 && i === 0 ? "high" : "low"}
                />
              )),
            )}
          </div>

          <button
            className={`${styles.arrow} ${styles.prev}`}
            type="button"
            data-prev=""
            aria-label="Immagine precedente"
          >
            {chevron}
          </button>
          <button
            className={`${styles.arrow} ${styles.next}`}
            type="button"
            data-next=""
            aria-label="Immagine successiva"
          >
            {chevron}
          </button>

          <div className={styles.dots}>
            {slides.map((s, i) => (
              <a
                key={s.src}
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
