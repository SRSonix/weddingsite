import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";
import { GiftType, InfoService, type Gift } from "~/services/infoService";
import { UserService, type GiftClaim } from "~/services/userService";
import { GiftItem } from "../gifts/giftItem";
import { AddGift } from "./addGift";

export function Gifts() {
    const {t} = useTranslation(["gifts", "common"]);
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

    async function addGiftClaim(giftId: number, amount: number): Promise<boolean>{
        const result = await UserService.addGiftClaim(user!.id, giftId, amount)
        reloadUser();

        return result
    }

    return (
        <div>
            <p>{t("select_gift_text")}:</p>
            <div className="flex justify-end">
                {t("prices_in")}:
                <div className="inline ml-2">
                    <input type="radio" name="currency" id="eur" checked={!showPeso} onChange={() => setShowPeso(false)}/>
                    <label htmlFor="m" onClick={() => setShowPeso(false)}>&euro;</label>
                </div>
                <div className="inline ml-2">
                    <input type="radio" name="currency" id="mxn" checked={showPeso} onChange={() => setShowPeso(true)}/>
                    <label htmlFor="f" onClick={() => setShowPeso(true)}>MXN</label>
                </div>
            </div>
            <div>
                <h4>{t("yourSelectionAmount", {"count": giftClaims.length})}</h4>
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