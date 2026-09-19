import { fullAddress, mapsUrl, phoneHref, site } from "~/content/site";
import styles from "./Contacts.module.scss";

const time = (t: string) => t.replace(/^0/, "");

export function Contacts() {
  return (
    <section id="contatti" className="section" aria-labelledby="contatti-title">
      <div className={`wrap ${styles.inner}`}>
        <div>
          <p className="eyebrow">Contatti</p>
          <h2 id="contatti-title" className={styles.title}>
            Vieni a trovarci
          </h2>
          <dl className={styles.info}>
            <div>
              <dt>Indirizzo</dt>
              <dd>
                {site.address.street}
                <br />
                <small>
                  {site.address.postalCode} {site.address.city} (
                  {site.address.province})
                </small>
              </dd>
            </div>
            <div>
              <dt>Orari</dt>
              <dd>
                {site.hours.map((h) => (
                  <span key={h.label} className={styles.line}>
                    {h.label} {time(h.opens)} - {time(h.closes)}
                  </span>
                ))}
                <small>{site.closedNote}</small>
              </dd>
            </div>
            <div>
              <dt>Telefono</dt>
              <dd>
                <a href={phoneHref}>{site.phone}</a>
                {site.whatsapp && (
                  <>
                    <br />
                    <a href={`https://wa.me/${site.whatsapp}`}>
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
        <a className={styles.map} href={mapsUrl} rel="noopener">
          <span className={styles.pin} aria-hidden="true" />
          <span className={styles.mapLabel}>
            Apri in Google Maps
            <small>{fullAddress}</small>
          </span>
        </a>
      </div>
    </section>
  );
}
