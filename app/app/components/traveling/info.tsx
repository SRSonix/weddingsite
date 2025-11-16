import { useTranslation } from "react-i18next"

export function TravelInfo(){
    const {t} = useTranslation(["traveling", "common"])

    return <>
        <h4>Yucatan</h4>
        <div className="text-justify">
            {t("yucatan_intro")}
        </div>
        <div className="text-justify">
            {t("stay_recommendation")}
        </div>

        <h4>Tren Maya</h4>
        <div className="text-justify">
            {t("tren_maya_intro")}
        </div>
        <div className="text-justify">
            {t("tren_maya_loop")}
        </div>
        <div>
            Tickets: https://reservas.ventaboletostrenmaya.com.mx/
        </div>

        <h4>Rome2Rome</h4>
        <div className="text-justify">
            one of the best ways to find your way around Mecico is https://www.rome2rio.com/. 
        </div>

        <h4>Mosqito Prep</h4>
        <div className="text-justify">
            netz + spray
        </div>

        <h4>Visa & transfer</h4>
        <div className="text-justify">
            mexico 

            transfer (US + CANADA)
        </div>

        <h4>Accomondations</h4>
        <div>
            airbnb & booking.com
        </div>

        <h4>pubic holiday on 12.12.</h4>
        <div>
            this is holiday.
        </div>

    </>
}