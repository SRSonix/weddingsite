import type { Route } from "./+types/traveling";
import { useTranslation } from "react-i18next";
import { EmptyState } from "~/components/common/empty_state";
import { ComingSoon } from "~/components/common/coming_soon";
import Itineraries from "~/components/traveling/itineraries";
import { ContentTile } from "~/components/common/content_tile";
import { TravelInfo } from "~/components/traveling/info";
import { Websites } from "~/components/traveling/websites";
import { SpecialDates } from "~/components/traveling/specialDates";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Traveling() {
  const {t} = useTranslation(["traveling", "common"])

  return (
    <EmptyState>

      <div className="content-tile-wrap">
      <ContentTile header={t("travel_info")}><TravelInfo></TravelInfo></ContentTile>
      <ContentTile header={t("special_dates")}><SpecialDates></SpecialDates></ContentTile>
      <ContentTile header={t("websites")}><Websites></Websites></ContentTile>
      <ContentTile header={t("itinerary_intro")} >
        <Itineraries/>
      </ContentTile>
      </div>
    </EmptyState>
  )
}
