import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/overview";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useUser } from "~/providers/userProvider";
import { EmptyState } from "~/components/common/empty_state";
import { InfoService, OverviewInfo } from "~/services/infoService";
import { useEffect, useState } from "react";
import { Agenda } from "~/components/overview/agenda";
import { Rsvp } from "~/components/user/rsvp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Overview() {
  const {t} = useTranslation(["overview", "common"]);
  const {user} = useUser();

  const [overviewInfo, setOverviewInfo] = useState<OverviewInfo | undefined>(undefined);

  useEffect(() => {
    if (user != undefined) InfoService.getOverviewInfo().then(
      (overviewInfo) => {
        setOverviewInfo(overviewInfo);
      });
  }, [user]);

  return (
   <>
    <EmptyState>
      <div className="content-tile-wrap">
        <ContentTile header={t("need_to_know")}>
          <div className="lg:min-w-120">
            <ul className="list-disc list-outside pl-5">
             <li><span className="font-bold">{t("date_and_time")}</span>: {overviewInfo?.date}, {t("arrival")} {overviewInfo?.arrival_time}</li>
            <li><span className="font-bold">{t("location")}</span>: {overviewInfo?.location}</li>
            <li><span className="font-bold">{t("dress_code")}</span>: {t("dress_text")}</li>
            <li><span className="font-bold">{t("climate")}</span>: {t("climate_text")}</li>
            <li><span className="font-bold">{t("getting_there")}</span>: {overviewInfo?.car_minutes} {t("minutes_by_car")} {overviewInfo?.car_from}</li>
            <li><span className="font-bold">{t("parking")}</span>: {t("parking_text")}</li>
            <li><span className="font-bold">{t("gifts")}</span>: <Trans i18nKey="overview:gifts_text">text<Link className="text-interact" to="/gifts">text</Link>text</Trans></li>
            <li><span className="font-bold">{t("pre_wedding")}</span>: {t("pre_wedding_text")} {overviewInfo?.pre_wedding_day} - {overviewInfo?.pre_wedding_location}</li>
            <li><span className="font-bold">{t("post_wedding")}</span>: {t("post_wedding_text")} {overviewInfo?.post_wedding_location} {t("on")} {t(overviewInfo?.post_wedding_day || "")}</li>
              <li><span className="font-bold align-top">WhatsApp</span>:
                <div className="inline-block align-top ml-2"> {
                  Object.entries(overviewInfo?.whatsapp || []).map(([key, value]) => <span className="block">{key}: {value}</span>)
                }</div>
              </li>
            </ul>
          </div>
        </ContentTile>
        <ContentTile header={t("agenda")}><Agenda></Agenda></ContentTile>
        <ContentTile header={t("rsvp")}><Rsvp></Rsvp></ContentTile>
      </div>
    </EmptyState>
    </>
  )
}
