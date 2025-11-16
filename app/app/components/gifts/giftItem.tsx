import { useTranslation } from "react-i18next";
import { CurrecnyService } from "~/services/currencyService";
import { GiftType, type Gift } from "~/services/infoService";


export function GiftItem({gift, amount, showPeso, onDelete}: {gift: Gift, amount: number, showPeso:boolean, onDelete: (id: number) => void}) {
    const {i18n, t} = useTranslation(["gifts", "common"]);

    function getText(gift: Gift){
        if (gift.type == GiftType.upToPrice) {
            return <p> {t("your_selected_up_to", {"amount": CurrecnyService.format_amount(amount, showPeso), "out_of": CurrecnyService.format_amount(gift.price_euro!, showPeso)})}</p>
        }
        else if (gift.type == GiftType.fixPrice) {
            const value_str = CurrecnyService.format_amount(gift.amount!, showPeso);
            const total_value = CurrecnyService.format_amount(amount * gift.amount!, showPeso);
            return <p> {t("your_selection_fix", {"amount": amount, "out_of": gift.amount, "value": value_str, "total_value": total_value})}</p>
        }
        else if (gift.type == GiftType.openPrice) {
            return <p> {t("your_selection_open", {"amount": CurrecnyService.format_amount(amount, showPeso)})}</p>
        }
        return ""
    }
    
    return <div  className="mb-3 border p-3 flex">
        <div className="flex-grow">
            <h5 className="font-bold">{gift.title[i18n.language]}</h5>
            {getText(gift) }
        </div>
        <button className="btn btn-small btn-red" onClick={() => onDelete(gift.id)}>{t("common:delete")}</button>
    </div>
}