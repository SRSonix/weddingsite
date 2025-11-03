import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";
import { GiftType, InfoService, type Gift } from "~/services/infoService";
import { UserService, type GiftClaim } from "~/services/userService";
import { GiftItem } from "./giftItem";
import { AddGift } from "./addGift";

export function Gifts() {
    const {user, reloadUser} = useUser();
    const [giftClaims, setGiftClaims] = useState<GiftClaim[] >([]);
    const [gifts, setGifts] = useState<{[key: number]: Gift}>([]);
    const [showPeso, setShowPeso] = useState(false);

    useEffect(() =>{
        if (user){
            InfoService.getGifts().then((gifts) => setGifts(gifts))
            setGiftClaims(user.giftClaims)

            if( user.language == "es") setShowPeso(true);
        }
    }, [user]);

    function removeGiftClaim(giftId: number){
        UserService.removeGiftClaim(user!.id, giftId)
        .then(() => reloadUser())
    }

    function addGiftClaim(giftId: number, amount: number){
        UserService.addGiftClaim(user!.id, giftId, amount)
        .then(() => reloadUser())
    }

    return (
        <div>
            <div>
                <p className="text-[0.8rem]/4 text-gray-700">As we'll be traveling with limited luggage, we'd appreciate a contribution toward an experience or donation instead of physical gifts. Our gift list includes both smaller and larger items: smaller ones are individual gifts, while larger ones can be shared and partially contributed to. Select a gift and the amount, in oder to coordinate the gifts.</p>                    
                <p className="text-[0.8rem]/4 text-gray-700">All prices are shown in either Euro (€) or Mexican Peso (MXN) (using a fixed exchange rate). Contributions can be made via PayPal or bank transfer (Details will be shared here soon).</p>
            </div>
            <div className="flex justify-end">
                show prices in:
                <div className="inline ml-2">
                    <input type="radio" name="currency" id="eur" checked={!showPeso} onChange={() => setShowPeso(false)}/>
                    <label htmlFor="m" onClick={() => setShowPeso(false)}>&euro;</label>
                </div>
                <div className="inline ml-2">
                    <input type="radio" name="currency" id="mex" checked={showPeso} onChange={() => setShowPeso(true)}/>
                    <label htmlFor="f"onClick={() => setShowPeso(true)}>MEX</label>
                </div>
            </div>
            <div>
                <h4>You have selected {giftClaims.length} Gift(s)</h4>
                <ul>
                    {giftClaims.map((g) => {
                        const gift = gifts[g.gift_id]
                        if (!gift) return <div> {g.gift_id} / {g.amount}</div>
                        return <li>
                            <GiftItem gift={gift} amount={g.amount} onDelete={removeGiftClaim} showPeso={showPeso}></GiftItem>
                        </li>})}
                </ul>
            </div>
            <h4>Add a gift</h4>
            <AddGift gifts={gifts} handleAddGiftClaim={addGiftClaim} showPeso={showPeso}></AddGift>
        </div>
    )
}