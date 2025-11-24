import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";

import { InfoService, type AgendaData, type AgendaItem } from "~/services/infoService";


export function Agenda(){
    const [agenda, setAgenda] = useState<AgendaData | undefined>(undefined)
    const {user} = useUser();
    const {i18n} = useTranslation(["gifts", "common"]);

    function getAgendaString(agenda: AgendaItem): string{
        return agenda[i18n.language] || agenda.en;
    }

    useEffect(() => {
        if (user !== undefined) {
            InfoService.getAganda().then((agenda) => {
                setAgenda(agenda)
            })
        }
    }, [user])

    return <div>
        {
            agenda !== undefined  && 
            Object.entries(agenda.items).map(([key, value]) => <div><span className="font-bold">{key}</span>: {getAgendaString(value)}</div>) 
        }
    </div>
}
