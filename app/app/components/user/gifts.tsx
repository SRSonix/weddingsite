import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";
import { GiftType, InfoService, type Gift } from "~/services/infoService";
import { UserService, type GiftClaim } from "~/services/userService";
import { GiftItem } from "./giftItem";
import { AddGift } from "./addGift";

export function Gifts() {
    const {user} = useUser();
    const [giftClaims, setGiftClaims] = useState<GiftClaim[] >([]);
    const [gifts, setGifts] = useState<{[key: number]: Gift}>([]);

    useEffect(() =>{
        if (user){
            UserService.getGiftClaims(user.id).then((claims) =>  setGiftClaims(claims))
            InfoService.getGifts().then((gifts) => setGifts(gifts))
        }
    }, [user]);

    function removeGiftClaim(giftId: number){
        UserService.removeGiftClaim(user!.id, giftId)
        .then((claims) => setGiftClaims(claims))
    }

    function addGiftClaim(giftId: number, amount: number){
        UserService.addGiftClaim(user!.id, giftId, amount)
        .then((claims) => setGiftClaims(claims))
    }

    return (
        <div>
            <div>
                <p>Your presence at our wedding means the world to us! If you'd like to give a little something, we've gathered a few meaningful options. You can choose one of our <strong>small suitcases</strong>, make a <strong>donation</strong>, or share an <strong>experience</strong> with us—each one will make our journey together even more special.</p>
                <p>We've prepared two types of gifts: <strong>smaller gifts</strong> that you can give as a whole, and <strong>larger ones</strong> to which you can contribute any amount you wish, up to what's still needed after others have joined in.</p>
                <p>All prices are displayed either in <strong>euro (€)</strong> or <strong>Mexican peso (MXN)</strong>, depending on your selection, with a fixed conversion rate applied. Payments can be made via <strong>PayPal</strong> or <strong>bank transfer</strong>, and we'll provide the details for both options here soon.</p>
            </div>
            <div>
                You have selected {giftClaims.length} Gift(s):
                <ul>
                    {giftClaims.map((g) => {
                        const gift = gifts[g.id]
                        if (!gift) return <></>
                        return <li>
                            <GiftItem gift={gift} amount={g.amount} onDelete={removeGiftClaim}></GiftItem>
                        </li>})}
                </ul>
            </div>
            <AddGift handleAddGiftClaim={addGiftClaim}></AddGift>
        </div>
    )
}