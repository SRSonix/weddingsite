import {createContext, useContext, useEffect, useState} from "react";
import { InfoService, type Gift } from "~/services/infoService"
import { useUser } from "./userProvider";


type GiftsContextType = {
    gifts: {[key: number]: Gift};
}

const GiftsContext = createContext<GiftsContextType | undefined>(undefined);

export default function GiftsProvider({children}: {children: React.ReactNode}){
    const {user} = useUser();
    const [gifts, setGifts] = useState<{[key: number]: Gift}>([]);

    useEffect(() =>{
        if (user){
            InfoService.getGifts().then((gifts) => setGifts(gifts));
        }
    }, [user]);

    return (
        <GiftsContext.Provider value={{gifts}}>
            {children}
        </GiftsContext.Provider>
    )
}

export function useGifts(){
    const context = useContext(GiftsContext);
    if (!context) throw new Error("useGifts must be used within a GiftsProvider");
    return context;
}
