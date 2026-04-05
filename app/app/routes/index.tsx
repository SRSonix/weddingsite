import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/index";
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";
import { EmptyState } from "~/components/common/empty_state";
import { InfoService, OverviewInfo, type PaymentDetails } from "~/services/infoService";
import { useEffect, useState } from "react";
import { Agenda } from "~/components/index/agenda";
import { Rsvp } from "~/components/index/rsvp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brautkleid bleibt Blaukraut" },
    { name: "description", content: "Brautkleid bleibt Blaukraut" },
  ];
}

export default function Overview() {
  const {t} = useTranslation("app");
  const {user} = useUser();

  const [overviewInfo, setOverviewInfo] = useState<OverviewInfo | undefined>(undefined);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | undefined>(undefined);

  useEffect(() => {
    if (user != undefined) {
      InfoService.getOverviewInfo().then(setOverviewInfo);
      InfoService.getPaymentDetails().then(setPaymentDetails);
    }
  }, [user]);

  return (
   <>
    <EmptyState>
      <div className="content-tile-wrap">
        <ContentTile fullWidth>
          <img
            src={`${import.meta.env.VITE_API_URL}/image/couple.jpeg`}
            alt={t("couple_photo_alt", "Photo of the couple")}
            className="w-full rounded-lg"
          />
        </ContentTile>
        <ContentTile header={t("need_to_know", "Need to Know")}>
          <div className="space-y-4">
            <div>
              <h4>{t("location", "Location")}</h4>
              <div className="text-sm mt-1">
                <p className="font-medium">{overviewInfo?.location?.split(",")[0]}</p>
                <p>{overviewInfo?.location?.split(",").slice(1).join(",").trim()}</p>
                {overviewInfo?.location_maps_link && <a href={overviewInfo.location_maps_link} target="_blank" rel="noreferrer" className="underline text-olive-500 text-xs mt-0.5 inline-block">{t("maps", "Maps")}</a>}
              </div>
            </div>
            <div>
              <h4>{t("dress_code", "Dress code")}</h4>
              <p className="text-sm mt-1">{t("dress_text", "Elegant, but no strict dress code — wear what makes you feel good!")}</p>
            </div>
            <div>
              <h4>{t("parking", "Parking")}</h4>
              <p className="text-sm mt-1">{t("parking_text", "Parking is available at the venue.")}</p>
            </div>
            {overviewInfo?.hotels && overviewInfo.hotels.length > 0 && (
              <div>
                <h4>{t("hotels", "Accommodation")}</h4>
                <div className="text-sm mt-1">
                  {overviewInfo.hotels.map((hotel) => (
                    <div key={hotel.name}>
                      <p className="font-medium">{hotel.name}</p>
                      <p>Tel: {hotel.tel} &middot; <a href={`${hotel.web}`} target="_blank" rel="noreferrer" className="underline">{hotel.web}</a></p>
                    </div>
                  ))}
                  <p className="italic mt-1">{t("hotels_contact_us", "For other options or questions, feel free to reach out to us.")}</p>
                </div>
              </div>
            )}
            <div>
              <h4>{t("phone", "Phone")}</h4>
              <div className="text-sm mt-1">
                {Object.entries(overviewInfo?.phone || {}).map(([name, number]) => (
                  <p key={name}>{name}: {number}</p>
                ))}
              </div>
            </div>
            <div>
              <h4>{t("companions", "Partners & Children")}</h4>
              <p className="text-sm mt-1">{t("companions_text", "Your group has been set up for you. Please confirm attendance and note any dietary requirements for each person. If someone is missing, please contact us directly.")}</p>
              <p className="text-sm mt-1">{t("companions_children", "Age groups: Infant (0-3), Child (4-12), Adult (13+).")}</p>
            </div>
            <div>
              <h4>{t("gifts", "Gifts")}</h4>
              <p className="text-sm mt-1">{t("gifts_intro", "We truly have everything we need — but if you'd like to contribute towards our wedding expenses, we'd be very grateful. Cash at the wedding or a bank transfer are both very welcome:")}</p>
              {paymentDetails && (
                <div className="text-sm mt-1 leading-snug">
                  <p><span className="font-bold">Name:</span> {paymentDetails.bank.name}</p>
                  <p><span className="font-bold">IBAN:</span> {paymentDetails.bank.iban}</p>
                  <p><span className="font-bold">BIC:</span> {paymentDetails.bank.bic}</p>
                </div>
              )}
            </div>
          </div>
        </ContentTile>
        <ContentTile header={t("agenda", "Programme")}><Agenda></Agenda></ContentTile>
        <ContentTile header={t("rsvp", "Registration")} fullWidth><Rsvp></Rsvp></ContentTile>
      </div>
    </EmptyState>
    </>
  )
}
