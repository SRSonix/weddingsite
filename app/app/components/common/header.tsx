import { useEffect, useState } from "react"
import { useUser } from "~/providers/userProvider";
import { InfoService, type OverviewInfo } from "~/services/infoService";

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

    return (
        <header className="text-center py-8 bg-white border-b border-olive-200">
            {user && overviewInfo?.date && (
                <p className="text-olive-600 text-base mb-1">{new Date(overviewInfo.date).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
            )}
            <p className="font-wedding text-7xl text-olive-700">Alexine & Michael</p>
            {user && daysToGo !== null && (
                <p className="text-olive-500 text-sm mt-1">{daysToGo} days to go</p>
            )}
        </header>
    );
}
