import { Trans, useTranslation } from "react-i18next"

export function Websites(){
    const {t} = useTranslation(["traveling", "common"])

    return <div>
        <h4>{t("common:traveling")}</h4>
        <div className="text-justify">
            <Trans i18nKey="traveling:rome2rome">text <a href="https://www.rome2rio.com/" target="_blank" className="text-interact">text</a>text</Trans>
        </div>
        <div className="text-justify mt-3">
            <Trans i18nKey="traveling:tren_maya_tickets">text <a href="https://reservas.ventaboletostrenmaya.com.mx/" target="_blank" className="text-interact">text</a>text</Trans>
        </div>
        <h4>{t("accomondations")}</h4>
        <div>
            <Trans i18nKey="traveling:accomondations_text">
                text
                <a href="https://www.airbnb.com/" target="_blank" className="text-interact"></a>
                <a href="https://www.booking.com/" target="_blank" className="text-interact"></a>
                <a href="mailto:info@little-mexican-wedding.info" target="_blank" className="text-interact"></a>
            </Trans>
        </div>
    </div>
}