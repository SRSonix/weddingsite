import { ContentTile } from "~/common/content_tile";
import type { Route } from "./+types/overview";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Overview() {
  const {t} = useTranslation(["overview", "common"]);

  return (
    <div>
      <ContentTile header={t("location")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("date")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("dress-code")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("be-safe")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
    </div>
  )
}
