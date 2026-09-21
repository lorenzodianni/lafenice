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
          Dicembre 2020 ha segnato per me l'inizio di un nuovo capitolo, nato
          dal desiderio di ricominciare e dalla volontà di trasformare un sogno
          in realtà.
        </p>
        <p>Proprio da questo desiderio di rinascita nasce il nome La Fenice.</p>
        <p>
          Da questo sogno prende forma un luogo dove bellezza, benessere e cura
          di sé si incontrano, in un ambiente dove ogni persona possa sentirsi
          accolta, ascoltata e coccolata.
        </p>
        <p>
          La Fenice è il simbolo di un nuovo inizio, della forza di credere
          ancora nei propri sogni e della bellezza di rinascere.
        </p>
        <p className={`eyebrow ${styles.sign}`}>
          <b>{site.owner.name}</b>
          {site.owner.role}
        </p>
      </div>
    </section>
  );
}
