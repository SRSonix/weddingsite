import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";
import { GiftType, InfoService, type Gift } from "~/services/infoService";
import { UserService, type GiftClaim } from "~/services/userService";
import { GiftItem } from "./giftItem";

export function AddGift({handleAddGiftClaim}: {handleAddGiftClaim: (id: number, amount:number) => void}) {
    const {user} = useUser();
    const [gifts, setGifts] = useState<{[key: number]: Gift}>([]);
    const [visible, setVisible] = useState<boolean >(false);
    const [selectedGiftId, setSelectedGiftId] = useState<number|null>(null);
    const [amount, setAmount] = useState<number|null>(null);
    const [alert, setAlert] = useState<string>("")

    useEffect(() =>{
        if (user){
            InfoService.getGifts().then((gifts) => setGifts(gifts))
        }
    }, [user]);

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

        if (selectedGift.type == GiftType.fixPrice){
            setAmount(Math.min(parsedInput, selectedGift.amount_left!))
        }
        else {
            setAmount(Math.min(parsedInput, selectedGift.price_euro_left!))
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

        setAlert("");
        handleAddGiftClaim(selectedGiftId, amount);
        setSelectedGiftId(null);
        setAmount(null);
        setVisible(false);
    }

    return (
    <div>
        <div hidden={alert === ""} className="text-red-700">{alert}</div>
        <div hidden={!visible} className="inline">
                <select id="gift_id" value={selectedGiftId === null ? "" : selectedGiftId}  onChange={hdanleGiftSelection} className="input"> 
                <option value="">Please select a gift</option>
                {Object.values(gifts).map((g) => (
                    <option value={g.id}>{g.title["en"]} {g.type==GiftType.fixPrice ? <>{g.price_euro} &euro;</>: <>up to {g.price_euro_left!} &euro;</>}</option>
                ))}
            </select>
            {
                selectedGiftId != null && gifts[selectedGiftId] && gifts[selectedGiftId].type == GiftType.fixPrice && 
                <select id="gift_id" value={amount === null ? "" : amount} onChange={(e) => handleAmountChange(e.target.value)} className="input">
                    <option value="">Please select an the amount</option>
                    {[...Array(gifts[selectedGiftId].amount_left!).keys()].map((i) => (
                        <option value={i+1}>{i+1}</option>
                    ))}
                </select>
            }
            {
                selectedGiftId != null && gifts[selectedGiftId] && gifts[selectedGiftId].type == GiftType.upToPrice && 
                <><input type="text" value={amount || 0} onChange={(e) => handleAmountChange(e.target.value)}></input> &euro;</>
            }
        </div>
        <button hidden={visible} onClick={() => setVisible(true)} className="btn" >Add Gift</button>
        <button hidden={!visible} onClick={cancel} className="btn btn-red" >Cancel</button>
        <button hidden={!visible} className="btn btn-green" onClick={handleSubmit}>Submit</button>
    </div>
    )
}