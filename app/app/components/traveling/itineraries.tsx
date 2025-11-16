import { useTranslation } from "react-i18next"

export default function Itineraries(){
    const {t} = useTranslation(["traveling", "common"])

    return (
        <div className="text-justify">


            <h4>{t("itinerary_intro")}</h4>
            <h4>Day 1: Cancun &amp; {t("arrival")}</h4>
            <div className="text-justify">
                {t("day1_cancun_arrival")}
            </div>

            <h4>Days 1-4: Cozumel</h4>
            <div className="text-justify">
                {t("days1_4_cozumel")}
            </div>
            <div className="text-justify">
                {t("cozumel_highlights")}
            </div>
            <div className="text-justify">
                {t("cozumel_stay_tip")}
            </div>

            <h4>Day 4: Tulum</h4>
            <div className="text-justify">
                {t("day4_tulum")}
            </div>
            <div className="text-justify">
                {t("tulum_train_tip")}
            </div>

            <h4>Days 4-6: Bacalar</h4>
            <div className="text-justify">
                {t("days4_6_bacalar")}
            </div>
            <div className="text-justify">
                {t("bacalar_sites")}
            </div>

            <h4>Days 6-8: Xpujil and Calakmul</h4>
            <div className="text-justify">
                {t("days6_8_xpujil_calakmul")}
            </div>
            <div className="text-justify">
                {t("skip_xpujil_tip")}
            </div>
            <div className="text-justify">
                {t("calakmul_ruins_desc")}
            </div>

            <h4>Days 8-11: Palenque</h4>
            <div className="text-justify">
                {t("days8_11_palenque")}
            </div>
            <div className="text-justify">
                {t("palenque_nature")}
            </div>

            <h4>Days 11-14: Mérida &amp; {t("wedding")}</h4>
            <div className="text-justify">
                {t("days11_14_merida_wedding")}
            </div>
            <div className="text-justify">
                {t("merida_hotel_tip")}
            </div>

            <h4>Day 14: Cancun &amp; {t("departure")}</h4>
            <div className="text-justify">
                {t("day14_cancun_departure")}
            </div>
        </div>
        )
    }
