import { useId } from "react";
import { euro, type Product } from "~/content/products";
import styles from "./ProductSection.module.scss";

// The mockup's product block. The home renders it as a teaser (h2 + link to
// the product page); the product page renders it as the main content (h1 +
// preorder form), so the image is its LCP and loads eagerly. The teaser keeps
// only what sells the product: delivery estimate and preorder highlights are
// about the request, so they sit next to the form, not twice on the site.
export function ProductSection({
  product,
  heading: Heading,
  id,
  children,
}: {
  product: Product;
  heading: "h1" | "h2";
  id?: string;
  children: React.ReactNode;
}) {
  const titleId = useId();
  const isPage = Heading === "h1";
  const [before, after] = product.title.split(product.titleAccent);
  const paragraphs = product.description.split("\n\n");

  return (
    <section
      id={id}
      className={`section ${styles.section}`}
      aria-labelledby={titleId}
    >
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.visual}>
          <span className={styles.ribbon}>Anteprima · Nuova linea</span>
          <img
            className={styles.media}
            src={product.featuredImage.url}
            alt={product.featuredImage.altText}
            width={product.featuredImage.width}
            height={product.featuredImage.height}
            {...(isPage
              ? { fetchPriority: "high" as const }
              : { loading: "lazy" as const })}
          />
          {isPage && (
            <p className={styles.eta}>
              <b>Consegna stimata</b>
              <span>{product.delivery}</span>
            </p>
          )}
        </div>

        <div>
          <p className="eyebrow">{product.tagline}</p>
          <Heading id={titleId}>
            {after === undefined ? (
              product.title
            ) : (
              <>
                {before}
                <em>{product.titleAccent}</em>
                {after}
              </>
            )}
          </Heading>
          <div className={styles.desc}>
            {/* The home is a teaser: the whole copy would make it a duplicate
                of the product page for a crawler. */}
            {(isPage ? paragraphs : paragraphs.slice(0, 1)).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className={styles.price}>
            <b>{euro.format(Number(product.price))}</b>
            <span>{product.shippingNote}</span>
          </p>
          {isPage && (
            <ul className={styles.highlights}>
              {product.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
