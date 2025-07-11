import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Imprint(){
    return (
        <div>
            <div>
                <h2 id="imprint">Imprint</h2>
                <p>Responsible for the content of this website according to §5 TMG:</p>
                
                <h3>Name:</h3>
                <p>Michael Meißner</p>
                <h3>Address:</h3>
                <p>Lerchanuer Str. 317, 80995 München</p>
                <h3>Email:</h3>
                <p>web.meissner+weddingsite@pm.me</p>

                <h3>Disclaimer:</h3>
                <p>This website is a private, non-commercial site created for the organization and planning of a private wedding event.</p>

                <h3>Liability for Content:</h3>
                <p>The content of this website has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content.</p>

                <h3>Data Protection:</h3>
                <p>Please refer to our Privacy Policy for information on how we handle your personal data.</p>
            </div>
            <div id="policies">
                <h2>Session and Privacy Policy for Wedding website</h2>
                <h3>Introduction</h3>
                <p>This policy explains how your personal data is processed and how session management works on this website, in compliance with the EU General Data Protection Regulation (GDPR) and German data protection law (BDSG).</p>
    
                <h3>Data Controller</h3>
                <p>The data controller is the host of the wedding website. Contact details are provided on the imprint section of this page.</p>
    
                <h3>What Data Is Collected</h3>
                <p>User Account Data: Name, user ID (assigned by the host)</p>
                <p>Participation Data: Attendance status, email address, dietary preferences, arrival and departure dates including accompanying guests for the user, and other information relevant to the event</p>
                <p>Session Data: Session token for browser session management, last website visit timestamp</p>
                <p>User password: User passwords are stored in a secure way for authentification.</p>

                <h3>Purpose of Data Processing</h3>
                <p>Event Organization: To manage invitations, collect RSVPs, and plan the event (including dietary and logistical arrangements)</p>
                <p>Session Management: To maintain login status and enhance user experience</p>
                <p>Security: To protect against unauthorized access and ensure the integrity of the website</p>

                <h3>Legal Basis</h3>
                <p>Art. 6(1)(f) GDPR: Legitimate interests in managing the event and organizing guest information</p>

                <h3>Session Management</h3>
                <p>Session Token: A session token is stored in your browser to keep you logged in. The session expires after 7 days of inactivity.</p>
                <p>Tracking Last Visit: The website records the last time you accessed the site using the session token, solely for organizational purposes.</p>
                
                <h3>Data Recipients</h3>
                <p>Your data will only be accessible to the website admins and the groom and bride, and if necessary the website host.</p>
                
                <h3>Data Storage Duration</h3>
                <p>Account, Event Data and last visit timestamps: Stored until the event is over and for a reasonable period thereafter (e.g., for thank-you notes or resolving queries), unless legal retention periods require longer storage.</p>

                <h3>Your Rights</h3>
                <p>You have the following rights under the GDPR:</p>
                <ul>
                    <li>Access: Request information about your stored data</li>
                    <li>Rectification: Correct inaccurate data</li>
                    <li>Erasure: Request deletion of your data (unless required by law)</li>
                    <li>Restriction: Limit processing of your data</li>
                    <li>Objection: Object to processing on grounds relating to your situation</li>
                    <li>Data Portability: Receive your data in a structured, commonly used format</li>              
                </ul>
                <p>To exercise your rights, contact the website host via the contact information provided.</p>
        
                <h3>Data Security</h3>
                <p>Appropriate technical and organizational measures are in place to protect your data against loss, misuse, unauthorized access, disclosure, or alteration.</p>
        
                <h3>Changes to This Policy</h3>
                <p>We may update this policy to reflect changes in legal requirements or website functionality. You will be informed of significant changes.</p>
            </div>
        </div>
    );
}
