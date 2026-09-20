import { treatments } from "~/content/site";
import styles from "./Treatments.module.scss";

export function Treatments() {
  return (
    <section
      id="trattamenti"
      className="section"
      aria-labelledby="trattamenti-title"
    >
      <div className="wrap">
        <div className={styles.head}>
          <div>
            <p className="eyebrow">I trattamenti</p>
            <h2 id="trattamenti-title">Un percorso per ogni esigenza</h2>
          </div>
          <p>
            Dalla pelle del viso al benessere del corpo: gesti professionali e
            prodotti selezionati, calibrati su di te.
          </p>
        </div>

        <ul className={styles.grid}>
          {treatments.map((t, i) => (
            <li key={t.name} className={styles.card}>
              {/* Decorative: the heading right below already names it. */}
              <img
                className={styles.photo}
                src={t.image}
                alt=""
                width={800}
                height={600}
                loading="lazy"
              />
              <div className={styles.body}>
                <span className={styles.num}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
