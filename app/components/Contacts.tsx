import {
  cityLine,
  closedDays,
  fullAddress,
  mapsUrl,
  openingHours,
  phoneHref,
  site,
  whatsappHref,
} from "~/content/site";
import styles from "./Contacts.module.scss";

export function Contacts() {
  return (
    <section id="contatti" className="section" aria-labelledby="contatti-title">
      <div className={`wrap ${styles.inner}`}>
        <div>
          <p className="eyebrow">Contatti</p>
          <h2 id="contatti-title">Vieni a trovarci</h2>
          <dl className={styles.info}>
            <div>
              <dt>Indirizzo</dt>
              <dd>
                {site.address.street}
                <br />
                <small>{cityLine}</small>
              </dd>
            </div>
            <div>
              <dt>Orari</dt>
              <dd>
                {openingHours.map((h) => (
                  <div key={h.days}>
                    {h.days} {h.time}
                  </div>
                ))}
                <small>Chiuso: {closedDays.join(", ")}</small>
              </dd>
            </div>
            <div>
              <dt>Telefono</dt>
              <dd>
                <a href={phoneHref}>{site.phone}</a>
                {whatsappHref && (
                  <>
                    <br />
                    <a href={whatsappHref}>
                      <small>Scrivici su WhatsApp</small>
                    </a>
                  </>
                )}
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
          </dl>
          <a className={`btn ${styles.cta}`} href={phoneHref}>
            Prenota ora
          </a>
        </div>

        {/* No map embed: it would set third-party cookies (see CLAUDE.md). */}
        <a className={styles.map} href={mapsUrl}>
          <span className={styles.credit} aria-hidden="true">
            © Google
          </span>
          <span className={styles.mapLabel}>
            Apri in Google Maps
            <small>{fullAddress}</small>
          </span>
        </a>
      </div>
    </section>
  );
}
