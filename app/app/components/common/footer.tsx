import { Link } from "react-router";


export function Footer()
{
    return (
        <footer className="mt-10 bg-yellow-700/70 text-white">
            © 2025 Michael Meißner | <Link to="/imprint#imprint" > Imprint</Link> | <Link to="/imprint#policies">Session and Privacy Policy</Link> | Kontakt: <a href="mailto:web.meissner+weddingsite@pm.me">web.meissner+weddingsite@pm.me</a>
        </footer>
    )
}