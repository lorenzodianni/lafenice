import { site } from "~/content/site";
import styles from "./Studio.module.scss";

export function Studio() {
  return (
    <section
      id="studio"
      className={`section ${styles.studio}`}
      aria-labelledby="studio-title"
    >
      <div className={`wrap ${styles.inner}`}>
        <p className="eyebrow">Lo studio</p>
        <h2 id="studio-title">La fenice come promessa</h2>
        <p>
          La Fenice nasce dal desiderio di offrire uno spazio accogliente dove
          l'estetica incontra la cura della persona. Il simbolo che ci
          accompagna racconta esattamente questo: la capacità di rigenerarsi, di
          tornare a sentirsi bene nella propria pelle.
        </p>
        <p>
          Ogni trattamento è studiato sulla persona, con prodotti professionali
          e tempo dedicato. Senza fretta, senza protocolli uguali per tutte.
        </p>
        <p className={styles.sign}>
          <b>{site.owner.name}</b>
          {site.owner.role}
        </p>
      </div>
    </section>
  );
}
