import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/overview";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useUser } from "~/providers/userProvider";
import { EmptyState } from "~/components/common/empty_state";
import { InfoService, OverviewInfo } from "~/services/infoService";
import { useEffect, useState } from "react";

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
        <ContentTile>
          <div className="flex items-center justify-center h-full min-h-60 max-h-120 lg:min-w-180">
            <img src={import.meta.env.VITE_API_URL + "/image/overview/landscape_1.jpg"} className="max-h-full max-w-full"></img>
          </div>
        </ContentTile>
        <ContentTile header={t("rsvp")}>
          <div className="lg:min-w-120">
            <p>{t("hey_there", {ns: 'common'})}</p> 
            <p className="mt-2"><Trans i18nKey="overview:rsvp_help_us_with">text<Link to="/user" className="text-blue-600 hover:text-gray-300">text</Link>text</Trans></p>
            <p className="mt-2">{t("rsvp_for_no_show")}</p>
            <p className="mt-2">{t("rsvp_why_we_need")}</p>
          </div>
        </ContentTile>
        <ContentTile header={t("need_to_know")}>
          <div className="lg:min-w-120">
            <ul className="list-disc list-outside pl-5">
              <li><span className="font-bold">Date and Time</span>: {overviewInfo?.date}, arrival {overviewInfo?.arrival_time}</li>
              <li><span className="font-bold">Location</span>: {overviewInfo?.location}.</li>
              <li><span className="font-bold">Dress code</span>: What makes you feel elegant - and not too hot!</li>
              <li><span className="font-bold">Climate</span>: 30ºC by day, 20 by night, humid</li>
              <li><span className="font-bold">Getting there</span>: {overviewInfo?.car_minutes} minutes by car from {overviewInfo?.car_from}</li>
              <li><span className="font-bold">Parking</span>: not available, please use Uber or Taxi</li>
              <li><span className="font-bold">Gifts</span>: We have small suitcases, a donation or experience is great!</li>
              <li><span className="font-bold">Post-wedding</span>: feel free to join us at the {overviewInfo?.post_wedding_location} on {overviewInfo?.post_wedding_day} ❤️</li>
              <li><span className="font-bold align-top">WhatsApp</span>: 
                <div className="inline-block align-top ml-2"> {
                  Object.entries(overviewInfo?.whatsapp || []).map(([key, value]) => <span className="block">{key}: {value}</span>)
                }</div>
              </li>
            </ul>
          </div>
        </ContentTile>
         <ContentTile>
          <div className="flex items-center justify-center h-full min-h-60 max-h-150 lg:min-w-60">
            <img src={import.meta.env.VITE_API_URL + "/image/overview/portrait_1.jpg"} className="max-h-full  max-w-full"></img>
          </div>
        </ContentTile>
      </div>
    </EmptyState>
    </>
  )
} 
