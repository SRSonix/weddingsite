import { useTranslation } from "react-i18next"

export function SpecialDates(){
    const {t} = useTranslation(["traveling", "common"])

    return <div>
        <h4>{t("strike")}</h4>
        <div>{t("strike_text")}</div>
        <h4>{t("wedding_day")}</h4>
        <div>{t("wedding_day_text")}</div>
        <h4>{t("public_holiday")}</h4>
        <div>{t("public_holiday_text")}</div>
    </div>
}