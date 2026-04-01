import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/overview";
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
  const {t, i18n} = useTranslation("app");
  const lang = i18n.language as "de" | "fr";
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
          <div className="w-full aspect-[4/3] rounded-lg bg-olive-50 border-2 border-dashed border-olive-600/40 flex items-center justify-center text-olive-600/40 text-sm">
            photo
          </div>
        </ContentTile>
        <ContentTile header={t("need_to_know", "Need to Know")}>
          <div className="lg:min-w-120 space-y-4">
            <div>
              <h4>{t("date_and_time", "Date and Time")}</h4>
              <p className="text-sm mt-1">{overviewInfo?.date ? new Date(overviewInfo.date).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}) : ''}, {t("arrival", "Arrival")} {overviewInfo?.arrival_time}</p>
            </div>
            <div>
              <h4>{t("location", "Location")}</h4>
              <p className="text-sm mt-1">
                {overviewInfo?.location_maps_link
                  ? <a href={overviewInfo.location_maps_link} target="_blank" rel="noreferrer">{overviewInfo.location}</a>
                  : overviewInfo?.location}
              </p>
            </div>
            <div>
              <h4>{t("dress_code", "Dress code")}</h4>
              <p className="text-sm mt-1">{t("dress_text", "Elegant, but no strict dress code — wear what makes you feel good!")}</p>
            </div>
            <div>
              <h4>{t("parking", "Parking")}</h4>
              <p className="text-sm mt-1">{t("parking_text", "Parking is available at the venue.")}</p>
            </div>
            {overviewInfo?.hotels?.[lang] && overviewInfo.hotels[lang].length > 0 && (
              <div>
                <h4>{t("hotels", "Accommodation")}</h4>
                <div className="text-sm mt-1">
                  {overviewInfo.hotels[lang].map((hotel) => (
                    <p key={hotel}>{hotel}</p>
                  ))}
                  <p className="italic">{t("hotels_contact_us", "For other options or questions, feel free to reach out to us.")}</p>
                </div>
              </div>
            )}
            {overviewInfo?.public_transport?.[lang] && (
              <div>
                <h4>{t("public_transport", "Public Transport")}</h4>
                <p className="text-sm mt-1">{overviewInfo.public_transport[lang]}</p>
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
              <p className="text-sm mt-1">{t("companions_text", "Please add anyone you would like to bring and remove anyone who will not be joining. We plan with these people, so it is important to keep this list up to date.")}</p>
            </div>
            <div>
              <h4>{t("gifts", "Gifts")}</h4>
              <p className="text-sm mt-1">{t("gifts_intro", "We truly have everything we need — but if you'd like to contribute towards our wedding expenses, we'd be very grateful. You can make a bank transfer to:")}</p>
              {paymentDetails && (
                <ul className="list-none mt-2 text-sm space-y-1">
                  <li><span className="font-bold">Name:</span> {paymentDetails.bank.name}</li>
                  <li><span className="font-bold">IBAN:</span> {paymentDetails.bank.iban}</li>
                  <li><span className="font-bold">BIC:</span> {paymentDetails.bank.bic}</li>
                </ul>
              )}
              <p className="text-sm mt-2">{t("gifts_cash", "Cash at the wedding is also very welcome!")}</p>
            </div>
          </div>
        </ContentTile>
        <ContentTile header={t("agenda", "Programme")}><Agenda></Agenda></ContentTile>
<ContentTile header={t("rsvp", "Please fill out RSVP")} fullWidth><Rsvp></Rsvp></ContentTile>
      </div>
    </EmptyState>
    </>
  )
}
