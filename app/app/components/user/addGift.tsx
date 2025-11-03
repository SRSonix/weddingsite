import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";
import { GiftType, InfoService, type Gift } from "~/services/infoService";
import { UserService, type GiftClaim } from "~/services/userService";
import { GiftItem } from "./giftItem";
import { CurrecnyService } from "~/services/currencyService";

export function AddGift({gifts, handleAddGiftClaim, showPeso}: {gifts: {[key: number]: Gift},handleAddGiftClaim: (id: number, amount:number) => void, showPeso: boolean}) {
    const {user} = useUser();
    const [visible, setVisible] = useState<boolean >(false);
    const [selectedGiftId, setSelectedGiftId] = useState<number|null>(null);
    const [amount, setAmount] = useState<number|null>(null);
    const [alert, setAlert] = useState<string>("")

    function hdanleGiftSelection(event: ChangeEvent<HTMLSelectElement>):void{
        setAlert("");
        const id = parseInt(event.target.value);

        if (isNaN(id)) {
            setSelectedGiftId(null);
        }
        else{
            setSelectedGiftId(id);
        }

        setAmount(null);
    }

    function cancel():void{
        setAlert("");
        setSelectedGiftId(null);
        setAmount(null);
        setVisible(false);
    }

    function handleAmountChange(value: string):void{
        setAlert("");

        const parsedInput = parseInt(value.replace(/\D/g, ""));
        if (isNaN(parsedInput) || selectedGiftId == null){
            setAmount(null);
            return
        }
        const selectedGift = gifts[selectedGiftId]

        if (selectedGift.type === GiftType.upToPrice){
            if (showPeso) setAmount(Math.min(parsedInput, selectedGift.price_euro_left! * 20))
            else setAmount(Math.min(parsedInput, selectedGift.price_euro_left!))
        }
        else{
            setAmount(parsedInput)
        }
    }

    function handleSubmit(): void{
        if (selectedGiftId == null) {
            setAlert("please select gift")
            return;
        }
        if (amount == null) {
            setAlert("please select amount")
            return;
        }
        let amount_clean = amount;
        if (gifts[selectedGiftId].type == GiftType.upToPrice && showPeso) {
            if (amount % 20 != 0){
                setAlert("Please select a multiple of 20 MEX.")
                return;
            }
            else amount_clean = amount / 20;
        }

        setAlert("");
        handleAddGiftClaim(selectedGiftId, amount_clean);
        setSelectedGiftId(null);
        setAmount(null);
        setVisible(false);
    }

    return (
    <div>
        <div hidden={alert === ""} className="text-red-700">{alert}</div>
        <div hidden={!visible} className="inline">
                <select id="gift_id" value={selectedGiftId === null ? "" : selectedGiftId}  onChange={hdanleGiftSelection} className="input-inline w-full mb-3"> 
                <option value="" disabled>Please select a gift</option>
                {Object.values(gifts).map((g) => (
                    g.type==GiftType.fixPrice ? 
                        <option value={g.id} disabled={g.amount_left===0}>{g.title["en"]} {CurrecnyService.format_amount(g.price_euro, showPeso)} ({g.amount_left} left)</option>
                    :
                        <option value={g.id} disabled={g.price_euro_left===0}>{g.title["en"]} up to {CurrecnyService.format_amount(g.price_euro, showPeso)} ({CurrecnyService.format_amount(g.price_euro_left!, showPeso)} left)</option>
                ))}
            </select>
            {
                selectedGiftId != null && gifts[selectedGiftId] && gifts[selectedGiftId].type == GiftType.fixPrice && 
                <select id="gift_id" value={amount === null ? "" : amount} onChange={(e) => handleAmountChange(e.target.value)} className="input-inline w-full mb-3">
                    <option value="" disabled>Please select an the amount</option>
                    {[...Array(gifts[selectedGiftId].amount_left!).keys()].map((i) => (
                        <option value={i+1}>{i+1}</option>
                    ))}
                </select>
            }
            {
                selectedGiftId != null && gifts[selectedGiftId] && gifts[selectedGiftId].type == GiftType.upToPrice && 
                <div className="flex"><input type="text" value={amount || 0} onChange={(e) => handleAmountChange(e.target.value)} className="input-inline flex-grow mb-3"></input> {showPeso? "MEX" : "\u20AC"}</div>
            }
        </div>
        <button hidden={visible} onClick={() => setVisible(true)} className="btn" >Add Gift</button>
        <button hidden={!visible} onClick={cancel} className="btn btn-red mr-3" >Cancel</button>
        <button hidden={!visible} className="btn btn-green" onClick={handleSubmit}>Submit</button>
    </div>
    )
}