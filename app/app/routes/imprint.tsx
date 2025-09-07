import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Imprint(){
    return (
      <div className="content-tile-wrap">
            <ContentTile header="Imprint" id="imprint">
                <div>
                    <h4>Website Provider</h4>
                    <p>Responsible for the content of this website according to §5 TMG:</p>
                    <p><span>Name:</span> Michael Meißner</p>
                    <p><span>Address:</span> Lerchanuer Str. 317, 80995 München</p>
                    <p><span>Email:</span> web.meissner+weddingsite@pm.me</p>
                </div>
                <div>
                    <h4>Disclaimer:</h4>
                    <p>This website is a private, non-commercial site created for the organization and planning of a private wedding event.</p>
                </div>
                <div>
                    <h4>Liability for Content:</h4>
                    <p>The content of this website has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content.</p>
                </div>
                <div>
                    <h4>Data Protection:</h4>
                    <p>Please refer to our Privacy Policy for information on how we handle your personal data.</p>
                </div>
            </ContentTile>
            <ContentTile header="Session and Privacy Policy" id="policies">
                <div>
                    <h4>Introduction</h4>
                    <p>This policy explains how your personal data is processed and how session management works on this website, in compliance with the EU General Data Protection Regulation (GDPR) and German data protection law (BDSG).</p>
                </div>
                <div>
                    <h4>Data Controller</h4>
                    <p>The data controller is the host of the wedding website. Contact details are provided on the imprint section of this page.</p>
                </div>
                <div>
                    <h4>What Data Is Collected</h4>
                    <ul className="list-disc list-inside">
                        <li>User Account Data: Name, user ID (assigned by the host)</li>
                        <li>Participation Data: Attendance status, email address, dietary preferences, arrival and departure dates for the user, and other information relevant to the event</li>
                        <li>Session Data: Session token for browser session management, last website visit timestamp</li>
                        <li>User password: User passwords are stored in a secure way for authentification.</li>
                    </ul>
                </div>
                <div>
                    <h4>Purpose of Data Processing</h4>
                    <ul>
                        <li>Event Organization: To manage invitations, collect RSVPs, and plan the event (including dietary and logistical arrangements)</li>
                        <li>Session Management: To maintain login status and enhance user experience</li>
                        <li>Security: To protect against unauthorized access and ensure the integrity of the website</li>
                    </ul>
                </div>
                <div>
                    <h4>Legal Basis</h4>
                    <p>Art. 6(1)(f) GDPR: Legitimate interests in managing the event and organizing guest information</p>
                </div>
                <div>
                    <h4>Session Management</h4>
                    <ul className="list-disc list-inside">
                        <li>Session Token: A session token is stored in your browser to keep you logged in. The session expires after 7 days of inactivity.</li>
                        <li>Tracking Last Visit: The website records the last time you accessed the site using the session token, solely for organizational purposes.</li>
                    </ul>
                </div>
                <div>
                    <h4>Data Recipients</h4>
                    <p>Your data will only be accessible to the website admins and the groom and bride, and if necessary the website host.</p>
                </div>
                <div>
                    <h4>Data Storage Duration</h4>
                    <p>Account, Event Data and last visit timestamps: Stored until the event is over and for a reasonable period thereafter (e.g., for thank-you notes or resolving queries), unless legal retention periods require longer storage.</p>
                </div>
                <div>
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
                    <p>To exercise your rights, contact the website host via the contact information provided.</p>
                </div>
                <div>
                    <h4>Data Security</h4>
                    <p>Appropriate technical and organizational measures are in place to protect your data against loss, misuse, unauthorized access, disclosure, or alteration.</p>
                </div>
                <div>
                    <h4>Embedded YouTube Videos</h4>
                    <p>Our website offers the ability to view selected YouTube videos directly on our pages. To protect your privacy and comply with legal requirements, these videos are not loaded automatically when you visit our website.</p>
                    <p>When you access a page with a YouTube video, you will first see a placeholder indicating that external content is blocked. The actual video and any related content from YouTube will only be loaded if you actively consent by clicking the provided button (“Load video” or similar). Only after your consent will a connection to YouTube's servers be established. At that point, YouTube (Google Ireland Limited) may receive information such as your IP address, browser information, timestamp, and the page you visited.</p>
                    <p>Even if the so-called “privacy-enhanced mode” is used for embedding, data such as your IP address and device details will be transmitted to YouTube/Google when you load the video. If you are logged in to a Google or YouTube account while watching, this information may be linked to your personal profile by YouTube.</p>
                    <p>Your consent to load external content is voluntary and can be revoked at any time. No connection to YouTube servers or data transfer takes place before you give your explicit consent.</p>
                    <p>Further details on how YouTube and Google process your data can be found in their Privacy Policy.</p>
                </div>
                <div>
                    <h4>Changes to This Policy</h4>
                    <p>We may update this policy to reflect changes in legal requirements or website functionality. You will be informed of significant changes.</p>
                </div>
            </ContentTile>
        </div>
    );
}
