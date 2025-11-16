import type { Route } from "./+types/traveling";
import { useTranslation } from "react-i18next";
import { EmptyState } from "~/components/common/empty_state";
import { ComingSoon } from "~/components/common/coming_soon";
import Itineraries from "~/components/traveling/itineraries";
import { ContentTile } from "~/components/common/content_tile";
import { TravelInfo } from "~/components/traveling/info";

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
      <ContentTile header={undefined}><TravelInfo></TravelInfo></ContentTile>

      <ContentTile header={t("itineraries")} >
        <Itineraries/>
      </ContentTile>
      </div>
    </EmptyState>
  )
}
