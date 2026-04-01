import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";

import { InfoService, type AgendaData, type AgendaItem } from "~/services/infoService";


export function Agenda(){
    const [agenda, setAgenda] = useState<AgendaData | undefined>(undefined)
    const {user} = useUser();
    const {i18n} = useTranslation("app");

    function getAgendaString(agenda: AgendaItem): string{
        const lang = i18n.language as keyof AgendaItem;
        return agenda[lang] || agenda.en;
    }

    useEffect(() => {
        if (user !== undefined) {
            InfoService.getAganda().then((agenda) => {
                setAgenda(agenda)
            })
        }
    }, [user])

    return <div className="space-y-3">
        {
            agenda !== undefined  &&
            Object.entries(agenda.items).map(([key, value]) => (
                <div key={key} className="bg-olive-50 border border-olive-100 rounded-lg px-4 py-2 shadow-sm flex gap-3 items-baseline">
                    <span className="font-bold text-olive-700 shrink-0">{key}</span>
                    <span className="text-sm">{getAgendaString(value)}</span>
                </div>
            ))
        }
    </div>
}
