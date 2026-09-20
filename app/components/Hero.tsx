import "@blossom-carousel/web/style.css";
// The library registers custom elements, so it must run in the browser only:
// imported as a URL and loaded as a module script, never as a normal import,
// which would put it in the server build (the Worker has no `customElements`)
// and, with the React wrapper, React on the client.
import blossomUrl from "@blossom-carousel/web?url";
import { Fragment } from "react";
import hero1 from "~/assets/placeholder-hero.svg";
import hero2 from "~/assets/placeholder-hero-2.svg";
import hero3 from "~/assets/placeholder-hero-3.svg";
import { site, treatments } from "~/content/site";
import styles from "./Hero.module.scss";

// PLACEHOLDER: real photos pending.
const slides = [hero1, hero2, hero3];

const CAROUSEL_ID = "hero-slider";

// Infinite loop, hand made: Blossom's own `repeat` is experimental and does
// not settle on a slide when they are full width. Instead the strip holds
// three copies of the slides, every one of them a Blossom slide so its arrows
// and drag can cross the seams, and the script keeps the visitor in the middle
// copy, jumping a copy back or forward once the scroll has settled. The copies
// are identical, so the jump is invisible.
const COPIES = [0, 1, 2];

// Blossom drives the track: drag with the pointer on top of the native
// scroll. Everything with a state of its own is ours, because Blossom's own
// controls keep an index that the jumps of the infinite loop would make stale:
// the arrows (hidden until this script runs), the dots (its own would draw one
// per slide, that is nine) and the autoplay, which it does not have. The dots
// are anchors to the middle copy, so they work without JS too. Plain JS,
// because the home ships no React to the client.
const sliderScript = `(function(){
var c=document.getElementById("${CAROUSEL_ID}"),box=c&&c.parentElement;
if(!c)return;
var n=${slides.length},dots=[].slice.call(box.querySelectorAll("[data-dot]")),at=0,last=0;
box.dataset.js="1";
var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
// Fractional: clientWidth is rounded, and on a fractional viewport that
// rounding drifts by a pixel per slide until the loop stops normalising.
var wid=function(){return c.getBoundingClientRect().width};
var set=function(){return wid()*n};
// Never "auto": the library's CSS sets scroll-behavior: smooth on the track,
// and "auto" defers to it, which would animate the jumps of the loop and the
// reduced motion case too.
var to=function(x,fast){c.scrollTo({left:x,behavior:fast||still?"instant":"smooth"})};
var go=function(d){to(c.scrollLeft+d*wid())};
var norm=function(){
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
var timer=setInterval(function(){if(!document.hidden)go(1)},6000);
// No wheel: the hero fills the top of the page, so scrolling past it with the
// pointer over it would stop the slideshow nobody touched.
["pointerdown","keydown"].forEach(function(e){
box.addEventListener(e,function(){clearInterval(timer)},{once:true,passive:true})});
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
          {/* Without JS this is still a scroll container that snaps: the
              styles are ours, Blossom adds drag and the controls. */}
          <blossom-carousel id={CAROUSEL_ID} className={styles.track}>
            {COPIES.map((copy) =>
              slides.map((src, i) => (
                <img
                  key={`${copy}-${src}`}
                  // Only the middle copy is a link target for the dots.
                  id={copy === 1 ? `hero-slide-${i + 1}` : undefined}
                  src={src}
                  data-blossom-slide=""
                  // Decorative duplicates: one description is enough for the
                  // whole set, and it goes on the first one in the document,
                  // which is what a crawler or a page without JS reads.
                  alt={
                    copy === 0 && i === 0
                      ? "Interni del centro estetico La Fenice"
                      : ""
                  }
                  width={1200}
                  height={600}
                  // Every copy has the same three URLs, so what the preload
                  // scanner meets first is what gets fetched: the priority
                  // goes on the first copy, the rest must not compete.
                  fetchPriority={copy === 0 && i === 0 ? "high" : "low"}
                />
              )),
            )}
          </blossom-carousel>

          {/* The controls only work once the elements are defined, so CSS
              keeps them hidden until then. */}
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
        dangerouslySetInnerHTML={{ __html: sliderScript }}
      />
    </>
  );
}
