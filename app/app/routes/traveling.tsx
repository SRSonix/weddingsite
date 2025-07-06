import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/traveling";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Traveling() {
  const {t} = useTranslation(["traveling", "common"])

  return (
    <div>
      <ContentTile header={t("safety-link")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("recommended-sites")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("itineraries")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("food")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("culture")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
    </div>
  )
}
