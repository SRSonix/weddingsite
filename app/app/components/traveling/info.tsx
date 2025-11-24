import { useTranslation } from "react-i18next"

export function TravelInfo(){
    const {t} = useTranslation(["traveling", "common"])

    return <div>
        <h4>{t("visa_transfer")}</h4>
        <div className="text-justify">
            <h5>{t("mexico")}</h5>
            <p>{t("mex_visa")}</p>
            <h5>{t("transfer")}</h5>
            <p>{t("transfer_visa")}</p>
        </div>
        <h4>{t("mosqito_prep")}</h4>
        <div className="text-justify">
            {t("mosqito_prep_text_1")}<br/>{t("mosqito_prep_text_2")}
        </div>
        <h4>{t("yucatan")}</h4>
        <div className="text-justify">
            {t("yucatan_intro")}
        </div>
        <div className="text-justify">
            {t("stay_recommendation")}
        </div>
        <h4>{t("tren_maya")}</h4>
        <div className="text-justify">
            {t("tren_maya_intro")}
        </div>
        <div className="text-justify">
            {t("tren_maya_loop")}
        </div>
        <div>
            {t("tickets")}: <a href=" https://reservas.ventaboletostrenmaya.com.mx/" target="_blank" className="text-interact">reservas.ventaboletostrenmaya.com.mx</a>
        </div>
    </div>
}