import { Link } from "react-router";
import { useTranslation } from "react-i18next";


export function Footer()
{
    const {t} = useTranslation("app");
    return (
        <footer className="mt-10 bg-olive-600/70 text-white flex flex-col items-center lg:flex-row lg:justify-center py-1">
            <div className="px-2">© 2026 Michael Meißner</div>
            <div className="lg:border-l border-white/40 px-2">Kontakt: <a href="mailto:web.meissner+blaukraut@pm.me">web.meissner+blaukraut@pm.me</a></div>
            <div className="lg:border-l border-white/40 px-2">
                <Link to="/datenschutzerklärung">{t("privacy_policy", "Session and Privacy Policy")}</Link>
            </div>
        </footer>
    )
}