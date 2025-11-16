import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";

import { InfoService, type Agenda } from "~/services/infoService";


export function Agenda(){
    const [agenda, setAgenda] = useState<Agenda | undefined>(undefined)
    const {user} = useUser()

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
            Object.entries(agenda.items).map(([key, value]) => <div>{key}: {value}</div>) 
        }
    </div>
}
