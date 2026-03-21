import { Link } from "react-router";


export function Footer()
{
    return (
        <footer className="mt-10 bg-yellow-700/70 text-white">
            <div className="inline sm:border-r solid px-2">© 2026 Michael Meißner</div><br className="sm:hidden"/>
            <div className="inline lg:border-r solid px-2">Kontakt: <a href="mailto:web.meissner+blaukraut@pm.me">web.meissner+weddingsite@pm.me</a></div><br className="lg:hidden"/>
            <div className="inline border-r solid px-2"><Link to="/imprint#imprint" > Imprint</Link></div>
            <div className="inline px-2"><Link to="/imprint#policies">Session and Privacy Policy</Link></div>
        </footer>
    )
}