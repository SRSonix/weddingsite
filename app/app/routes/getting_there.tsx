import { ContentTile } from "~/common/content_tile";
import type { Route } from "./+types/getting_there";
import { useTranslation } from "react-i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function GettingThere() {
  const {t} = useTranslation(["getting_there", "common"]);

  return (
    <div>
      <ContentTile header={t("cancun-airport")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("cdmx-airport")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("visa")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
      <ContentTile header={t("vaccines")}>
        <p>{t("placeholder-text", { ns: 'common' })}</p>
      </ContentTile>
    </div>
  )
}
