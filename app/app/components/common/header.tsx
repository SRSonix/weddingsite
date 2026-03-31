import { useEffect, useState } from "react"
import i18n from "i18next";
import { useUser } from "~/providers/userProvider";
import { InfoService, type OverviewInfo } from "~/services/infoService";
import ReactCountryFlag from "react-country-flag";

export function Header() {
    const {user} = useUser();
    const [overviewInfo, setOverviewInfo] = useState<OverviewInfo | undefined>(undefined);

    useEffect(() => {
        if (user != null) {
            InfoService.getOverviewInfo().then(setOverviewInfo);
        }
    }, [user]);

    const daysToGo = overviewInfo?.date
        ? Math.ceil((new Date(overviewInfo.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header className="text-center py-8 bg-white border-b border-olive-200">
            {user && overviewInfo?.date && (
                <p className="text-olive-600 text-base mb-1">{overviewInfo.date}</p>
            )}
            <p className="font-wedding text-7xl text-olive-700">Alexine & Michael</p>
            {user && daysToGo !== null && (
                <p className="text-olive-500 text-sm mt-1">{daysToGo} days to go</p>
            )}
            <div className="mt-5 flex justify-center gap-3">
                <button onClick={() => changeLanguage('de')} className="hover:opacity-70 transition-opacity">
                    <ReactCountryFlag countryCode="DE" svg style={{width: '1.5rem', height: '1.5rem'}} title="German" />
                </button>
                <button onClick={() => changeLanguage('fr')} className="hover:opacity-70 transition-opacity">
                    <ReactCountryFlag countryCode="FR" svg style={{width: '1.5rem', height: '1.5rem'}} title="French" />
                </button>
            </div>
        </header>
    );
}
