import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/overview";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router";

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
      <ContentTile header={t("rsvp")}>
        <p>{t("hey_there", {ns: 'common'})}</p> 
        <p className="mt-2"><Trans i18nKey="overview:rsvp_help_us_with">text<Link to="/user" className="text-blue-600 hover:text-gray-300">text</Link>text</Trans></p>
        <p className="mt-2">{t("rsvp_for_no_show")}</p>
        <p className="mt-2">{t("rsvp_why_we_need")}</p>
      </ContentTile>
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
