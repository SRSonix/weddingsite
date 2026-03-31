import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/overview";
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";
import { EmptyState } from "~/components/common/empty_state";
import { InfoService, OverviewInfo, type PaymentDetails } from "~/services/infoService";
import { useEffect, useState } from "react";
import { Agenda } from "~/components/overview/agenda";
import { Rsvp } from "~/components/user/rsvp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brautkleid bleibt Blaukraut" },
    { name: "description", content: "Brautkleid bleibt Blaukraut" },
  ];
}

export default function Overview() {
  const {t} = useTranslation(["overview", "common"]);
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
        <ContentTile header={t("need_to_know")}>
          <div className="lg:min-w-120">
            <ul className="list-disc list-outside pl-5">
              <li><span className="font-bold">{t("date_and_time")}</span>: {overviewInfo?.date}, {t("arrival")} {overviewInfo?.arrival_time}</li>
              <li><span className="font-bold">{t("location")}</span>: {overviewInfo?.location}</li>
              <li><span className="font-bold">{t("dress_code")}</span>: {t("dress_text")}</li>
              <li><span className="font-bold">{t("parking")}</span>: {t("parking_text")}</li>
              <li><span className="font-bold align-top">Phone</span>:
                <div className="inline-block align-top ml-2">
                  {Object.entries(overviewInfo?.phone || {}).map(([name, number]) => (
                    <span key={name} className="block">{name}: {number}</span>
                  ))}
                </div>
              </li>
            </ul>
            <h4 className="mt-4">{t("gifts")}</h4>
            <p className="text-sm mt-1">
              We truly have everything we need — but if you'd like to contribute towards our wedding expenses, we'd be very grateful. You can make a bank transfer to:
            </p>
            {paymentDetails && (
              <ul className="list-none mt-2 text-sm space-y-1">
                <li><span className="font-bold">Name:</span> {paymentDetails.bank.name}</li>
                <li><span className="font-bold">IBAN:</span> {paymentDetails.bank.iban}</li>
                <li><span className="font-bold">BIC:</span> {paymentDetails.bank.bic}</li>
              </ul>
            )}
          </div>
        </ContentTile>
        <ContentTile header={t("agenda")}><Agenda></Agenda></ContentTile>
        <ContentTile header={t("rsvp")} fullWidth><Rsvp></Rsvp></ContentTile>
      </div>
    </EmptyState>
    </>
  )
}
