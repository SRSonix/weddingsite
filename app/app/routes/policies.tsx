import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brautkleid bleibt Blaukraut" },
    { name: "description", content: "Brautkleid bleibt Blaukraut" },
  ];
}

const tile = "border-2 border-olive-600/70 rounded-xl lg:[grid-row:1/span_20] lg:grid lg:[grid-template-rows:subgrid]";
const section = "p-3 border-b border-olive-100 last:border-b-0";

export default function Policies(){
    return (
        <div className="content-tile-wrap">
            <div className="w-full grid lg:grid-cols-2 gap-3">

                <div className={tile} id="policies">
                    <div className={section}><h3>Session and Privacy Policy</h3></div>
                    <div className={section}>
                        <h4>Introduction</h4>
                        <p>This policy explains how your personal data is processed and how session management works on this website, in compliance with the EU General Data Protection Regulation (GDPR) and German data protection law (BDSG).</p>
                    </div>
                    <div className={section}>
                        <h4>Data Controller</h4>
                        <p>Michael Meißner</p>
                        <p>Email: web.meissner+blaukraut@pm.me</p>
                    </div>
                    <div className={section}>
                        <h4>What Data Is Collected</h4>
                        <ul className="list-disc list-inside">
                            <li>User Account Data: Name, user ID, role (assigned by the host), and which side of the couple invited you (bride, groom, or both)</li>
                            <li>Authentication Data: A personal invite token assigned by the website operator and used to log in</li>
                            <li>RSVP Data: Attendance status, email address and preferred language</li>
                            <li>Family Member Data: Name, dietary preferences, and child status for each person in your group</li>
                            <li>Session Data: A session token stored in your browser, plus the timestamp of your last website visit</li>
                        </ul>
                    </div>
                    <div className={section}>
                        <h4>Purpose of Data Processing</h4>
                        <ul className="list-disc list-inside">
                            <li>Event Organization: To manage invitations, collect RSVPs, and plan the event (including dietary and logistical arrangements)</li>
                            <li>Session Management: To maintain login status and enhance user experience</li>
                            <li>Security: To protect against unauthorized access and ensure the integrity of the website</li>
                        </ul>
                    </div>
                    <div className={section}>
                        <h4>Legal Basis</h4>
                        <p>Art. 6(1)(f) GDPR (legitimate interest): For event organization, management of guest information, and the technical operation and security of the website.</p>
                    </div>
                    <div className={section}>
                        <h4>Cookies and Session Management</h4>
                        <ul className="list-disc list-inside">
                            <li>Session Token: A session token is stored as a cookie in your browser to keep you logged in. The session expires after 7 days of inactivity. As this cookie is technically necessary for the operation of the website, no separate consent is required (§ 25(2) TDDDG).</li>
                            <li>Tracking Last Visit: The website records the last time you accessed the site using the session token, solely for organizational purposes.</li>
                        </ul>
                    </div>
                    <div className={section}>
                        <h4>Data Recipients</h4>
                        <p>Your data will only be accessible to the website admins and the bride and groom, and if necessary the website host.</p>
                    </div>
                    <div className={section}>
                        <h4>Data Storage Duration</h4>
                        <p>Account, Authentication, Family Member, RSVP data, and last visit timestamps: Stored until the event is over and for a reasonable period thereafter (e.g., for thank-you notes or resolving queries), unless legal retention periods require longer storage.</p>
                    </div>
                    <div className={section}>
                        <h4>Your Rights</h4>
                        <p>You have the following rights under the GDPR:</p>
                        <ul className="list-disc list-inside">
                            <li>Access: Request information about your stored data</li>
                            <li>Rectification: Correct inaccurate data</li>
                            <li>Erasure: Request deletion of your data (unless required by law)</li>
                            <li>Restriction: Limit processing of your data</li>
                            <li>Objection: Object to processing on grounds relating to your situation</li>
                            <li>Data Portability: Receive your data in a structured, commonly used format</li>
                        </ul>
                        <p>To exercise your rights, contact the data controller via the email address provided above.</p>
                        <p>You also have the right to lodge a complaint with a data protection supervisory authority. The competent authority is the Bavarian State Office for Data Protection Supervision (BayLDA), Promenade 18, 91522 Ansbach, Germany, https://www.lda.bayern.de.</p>
                    </div>
                    <div className={section}>
                        <h4>Data Security</h4>
                        <p>Appropriate technical and organizational measures are in place to protect your data against loss, misuse, unauthorized access, disclosure, or alteration.</p>
                    </div>
                    <div className={section}>
                        <h4>Changes to This Policy</h4>
                        <p>We may update this policy to reflect changes in legal requirements or website functionality. You will be informed of significant changes.</p>
                    </div>
                </div>

                <div className={tile} id="datenschutz">
                    <div className={section}><h3>Datenschutzerklärung</h3></div>
                    <div className={section}>
                        <h4>Einleitung</h4>
                        <p>Diese Richtlinie erläutert, wie Ihre personenbezogenen Daten auf dieser Website verarbeitet werden und wie das Sitzungsmanagement funktioniert, in Übereinstimmung mit der EU-Datenschutz-Grundverordnung (DSGVO) und dem deutschen Datenschutzrecht (BDSG).</p>
                    </div>
                    <div className={section}>
                        <h4>Verantwortlicher</h4>
                        <p>Michael Meißner</p>
                        <p>E-Mail: web.meissner+blaukraut@pm.me</p>
                    </div>
                    <div className={section}>
                        <h4>Welche Daten werden erhoben</h4>
                        <ul className="list-disc list-inside">
                            <li>Kontodaten: Name, Benutzer-ID, Rolle (vergeben durch den Administrator) sowie die Angabe, von welcher Seite des Brautpaares Sie eingeladen wurden (Braut, Bräutigam oder beide)</li>
                            <li>Authentifizierungsdaten: Ein persönlicher Einladungstoken, der vom Website-Betreiber vergeben und zur Anmeldung verwendet wird</li>
                            <li>RSVP-Daten: Teilnahmestatus, E-Mail-Adresse und bevorzugte Sprache</li>
                            <li>Begleitpersonendaten: Name, Ernährungspräferenzen und Kindstatus für jede Person Ihrer Gruppe</li>
                            <li>Sitzungsdaten: Ein Sitzungstoken im Browser sowie der Zeitstempel Ihres letzten Website-Besuchs</li>
                        </ul>
                    </div>
                    <div className={section}>
                        <h4>Zweck der Datenverarbeitung</h4>
                        <ul className="list-disc list-inside">
                            <li>Veranstaltungsorganisation: Zur Verwaltung von Einladungen, Erfassung von RSVPs und Planung der Veranstaltung (einschließlich Ernährungs- und Logistikplanung)</li>
                            <li>Sitzungsverwaltung: Zur Aufrechterhaltung des Anmeldestatus und Verbesserung der Nutzererfahrung</li>
                            <li>Sicherheit: Zum Schutz vor unbefugtem Zugriff und zur Gewährleistung der Integrität der Website</li>
                        </ul>
                    </div>
                    <div className={section}>
                        <h4>Rechtsgrundlage</h4>
                        <p>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse): Für die Veranstaltungsorganisation, die Verwaltung der Gästeinformationen sowie den technischen Betrieb und die Sicherheit der Website.</p>
                    </div>
                    <div className={section}>
                        <h4>Cookies und Sitzungsverwaltung</h4>
                        <ul className="list-disc list-inside">
                            <li>Sitzungstoken: Ein Sitzungstoken wird als Cookie in Ihrem Browser gespeichert, um Sie angemeldet zu halten. Die Sitzung läuft nach 7 Tagen Inaktivität ab. Da dieses Cookie für den Betrieb der Website technisch notwendig ist, bedarf es keiner gesonderten Einwilligung (§ 25 Abs. 2 TDDDG).</li>
                            <li>Letzter Besuch: Die Website erfasst den Zeitpunkt Ihres letzten Zugriffs mithilfe des Sitzungstokens, ausschließlich zu organisatorischen Zwecken.</li>
                        </ul>
                    </div>
                    <div className={section}>
                        <h4>Datenempfänger</h4>
                        <p>Ihre Daten sind ausschließlich für die Website-Administratoren sowie das Brautpaar zugänglich und, falls erforderlich, für den Website-Betreiber.</p>
                    </div>
                    <div className={section}>
                        <h4>Speicherdauer</h4>
                        <p>Konto-, Authentifizierungs-, Begleitpersonen-, RSVP-Daten und Zeitstempel des letzten Besuchs werden gespeichert bis zum Ende der Veranstaltung und für einen angemessenen Zeitraum danach (z. B. für Danksagungen oder zur Klärung von Rückfragen), sofern gesetzliche Aufbewahrungsfristen keine längere Speicherung erfordern.</p>
                    </div>
                    <div className={section}>
                        <h4>Ihre Rechte</h4>
                        <p>Sie haben folgende Rechte gemäß der DSGVO:</p>
                        <ul className="list-disc list-inside">
                            <li>Auskunft: Anforderung von Informationen über Ihre gespeicherten Daten</li>
                            <li>Berichtigung: Korrektur unrichtiger Daten</li>
                            <li>Löschung: Anforderung der Löschung Ihrer Daten (sofern nicht gesetzlich vorgeschrieben)</li>
                            <li>Einschränkung: Begrenzung der Verarbeitung Ihrer Daten</li>
                            <li>Widerspruch: Widerspruch gegen die Verarbeitung aus Gründen Ihrer besonderen Situation</li>
                            <li>Datenübertragbarkeit: Erhalt Ihrer Daten in einem strukturierten, gängigen Format</li>
                        </ul>
                        <p>Zur Ausübung Ihrer Rechte wenden Sie sich bitte über die oben angegebene E-Mail-Adresse an den Verantwortlichen.</p>
                        <p>Darüber hinaus haben Sie das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die für den Verantwortlichen zuständige Aufsichtsbehörde ist:</p>
                        <p>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach, https://www.lda.bayern.de</p>
                    </div>
                    <div className={section}>
                        <h4>Datensicherheit</h4>
                        <p>Es sind geeignete technische und organisatorische Maßnahmen zum Schutz Ihrer Daten vor Verlust, Missbrauch, unbefugtem Zugriff, Offenlegung oder Veränderung getroffen.</p>
                    </div>
                    <div className={section}>
                        <h4>Änderungen dieser Richtlinie</h4>
                        <p>Wir können diese Richtlinie aktualisieren, um Änderungen gesetzlicher Anforderungen oder der Website-Funktionalität widerzuspiegeln. Über wesentliche Änderungen werden Sie informiert.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
