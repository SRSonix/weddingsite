
export class CurrecnyService{
    static get_value(amount: number, showPeso: boolean): number{
        if (showPeso){
            return amount * 20;
        }
        else {
            return amount;
        }
    }

    static format_amount(amout_euro: number, showPeso: boolean): string{
        const value  = CurrecnyService.get_value(amout_euro, showPeso);
        if (showPeso){
            return `${value} MXN`;
        }
        else {
            return `${value} \u20AC`;
        }
    }
}