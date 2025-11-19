import { useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { GiftType, type Gift } from "~/services/infoService";
import { CurrecnyService } from "~/services/currencyService";

export function AddGift({gifts, handleAddGiftClaim, showPeso}: {gifts: {[key: number]: Gift},handleAddGiftClaim: (id: number, amount:number) => Promise<boolean>, showPeso: boolean}) {
    const {i18n, t} = useTranslation(["gifts", "common"]);
    const [visible, setVisible] = useState<boolean >(false);
    const [selectedGiftId, setSelectedGiftId] = useState<number|null>(null);
    const [amount, setAmount] = useState<number|null>(null);
    const [alert, setAlert] = useState<string>("")

    function handleGiftSelection(event: ChangeEvent<HTMLSelectElement>):void{
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
            setAlert(t("select_gift"))
            return;
        }
        if (amount == null) {
            setAlert(t("select_amount"))
            return;
        }
        let amount_clean = amount;
        if ([GiftType.upToPrice, GiftType.openPrice].includes(gifts[selectedGiftId].type) && showPeso) {
            if (amount % 20 != 0){
                setAlert(t("mxn_invalid_amount", {"amount": 20}))
                return;
            }
            else amount_clean = amount / 20;
        }

        setAlert("");
        handleAddGiftClaim(selectedGiftId, amount_clean).then((success) => {
            console.log(success)

            if (success) {
                setSelectedGiftId(null);
                setAmount(null);
                setVisible(false);
            }
            else setAlert("Could not add gift claim. Please try again later.")
        });
    }

    function getGiftSelectOption(g: Gift){
        const title = g.title[i18n.language] || g.title["en"]

        if (g.type == GiftType.upToPrice) {
            if (g.price_euro_left === 0) return <></>;

            return <option value={g.id} disabled={g.price_euro_left===0}>{t("select_up_to", {"title": title, "total_value": CurrecnyService.format_amount(g.price_euro, showPeso), "value_left": CurrecnyService.format_amount(g.price_euro_left!, showPeso)})}</option>
        }
        else if (g.type == GiftType.openPrice) {
            return <option value={g.id}>{title} ({t("custom_donation")})</option>
        }
        else if (g.type == GiftType.fixPrice) {
            if (g.amount_left === 0) return <></>;

            return <option value={g.id} disabled={g.amount_left===0}>{t("select_fix", {"title": title, "price": CurrecnyService.format_amount(g.price_euro, showPeso), "amount_left": g.amount_left})}</option>
        }
       
        return <></>
    }

    return (
    <div>
        <div hidden={alert === ""} className="text-red-700">{alert}</div>
        <div hidden={!visible} className="inline">
                <select id="gift_id" value={selectedGiftId === null ? "" : selectedGiftId}  onChange={handleGiftSelection} className="input-inline w-full mb-3"> 
                <option value="" disabled>{t("select_gift")}</option>
                {Object.values(gifts).map((g) => getGiftSelectOption(g))}
            </select>
            {
                selectedGiftId != null && gifts[selectedGiftId] && gifts[selectedGiftId].type == GiftType.fixPrice && 
                <select id="gift_id" value={amount === null ? "" : amount} onChange={(e) => handleAmountChange(e.target.value)} className="input-inline w-full mb-3">
                    <option value="" disabled>{t("select_amount")}</option>
                    {[...Array(gifts[selectedGiftId].amount_left!).keys()].map((i) => (
                        <option value={i+1}>{i+1}</option>
                    ))}
                </select>
            }
            {
                selectedGiftId != null && [ GiftType.upToPrice, GiftType.openPrice].includes(gifts[selectedGiftId] && gifts[selectedGiftId].type) && 
                <div className="flex"><input type="text" value={amount || 0} onChange={(e) => handleAmountChange(e.target.value)} className="input-inline flex-grow mb-3"></input> {showPeso? "MXN" : "\u20AC"}</div>
            }
        </div>
        <button hidden={visible} onClick={() => setVisible(true)} className="btn" >{t("add_gift")}</button>
        <button hidden={!visible} className="btn btn-green mr-2" onClick={handleSubmit}>{t("common:submit")}</button>
        <button hidden={!visible} onClick={cancel} className="btn btn-red mr-3" >{t("common:cancel")}</button>
    </div>
    )
}