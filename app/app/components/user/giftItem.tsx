import { GiftType, type Gift } from "~/services/infoService";


export function GiftItem({gift, amount, onDelete}: {gift: Gift, amount: number, onDelete: (id: number) => void}) {
    return <div  className="mb-3 border p-3">
        {gift.type == GiftType.upToPrice ?
            <span>
                {gift.title["en"]}: {amount} out of {gift.price_euro}
            </span>    
        :
            <span>
                {gift.title["en"]}: {amount} x {gift.price_euro} (out of {gift.amount})
            </span>
        }
        <button className="btn btn-small btn-red" onClick={() => onDelete(gift.id)}>delete</button>
    </div>
}