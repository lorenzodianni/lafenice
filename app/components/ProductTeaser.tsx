import type { Product } from "~/content/products";
import styles from "./ProductTeaser.module.scss";

export function ProductTeaser({ product }: { product: Product }) {
  const split = product.title.lastIndexOf(" ");
  const url = `/products/${product.handle}`;

  return (
    <section
      id="preordine"
      className={`section ${styles.teaser}`}
      aria-labelledby="preordine-title"
    >
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.visual}>
          <span className={styles.ribbon}>Anteprima · Nuova linea</span>
          <div className={styles.media}>
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText}
              width={product.featuredImage.width}
              height={product.featuredImage.height}
              loading="lazy"
            />
          </div>
          <p className={styles.eta}>
            <b>Consegna stimata</b>
            <span>{product.delivery}</span>
          </p>
        </div>

        <div>
          <p className="eyebrow">{product.tagline}</p>
          <h2 id="preordine-title">
            {product.title.slice(0, split)}{" "}
            <em>{product.title.slice(split + 1)}</em>
          </h2>
          <p className={styles.desc}>{product.description}</p>
          <ul className={styles.highlights}>
            {product.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <a className="btn" href={url}>
            Preordina ora
          </a>
        </div>
      </div>
    </section>
  );
}
