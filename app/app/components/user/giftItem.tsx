import { CurrecnyService } from "~/services/currencyService";
import { GiftType, type Gift } from "~/services/infoService";


export function GiftItem({gift, amount, showPeso, onDelete}: {gift: Gift, amount: number, showPeso:boolean, onDelete: (id: number) => void}) {
    return <div  className="mb-3 border p-3 flex">
        <div className="flex-grow">
            <h5 className="font-bold">{gift.title["en"]}</h5>
            {gift.type == GiftType.upToPrice ?
                <p> you have selected {CurrecnyService.format_amount(amount, showPeso)} (out of {CurrecnyService.format_amount(gift.price_euro!, showPeso)})</p>
            :
               <p> you have selected {amount} (out of {gift.amount}) items of {CurrecnyService.format_amount(gift.amount!, showPeso)} </p>
            }
        </div>
        <button className="btn btn-small btn-red" onClick={() => onDelete(gift.id)}>delete</button>
    </div>
}