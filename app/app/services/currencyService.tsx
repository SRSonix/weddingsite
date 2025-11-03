
export class CurrecnyService{
    static format_amount(amout_euro: number, showPeso: boolean): string{
        if (showPeso){
            return `${amout_euro * 20} MEX`;
        }
        else {
            return `${amout_euro} \u20AC`;
        }
    }
}