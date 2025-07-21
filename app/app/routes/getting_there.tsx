import { ContentTile } from "~/components/common/content_tile";
import type { Route } from "./+types/getting_there";
import { useTranslation } from "react-i18next";
import { EmptyState } from "~/components/common/empty_state";
import { ComingSoon } from "~/components/common/coming_soon";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function GettingThere() {
  const {t} = useTranslation(["getting_there", "common"]);

  return (
    <EmptyState>
      <ComingSoon>
        <ul className="list-disc list-inside">
          <li>{t("safety")}</li>
          <li>{t("visa")}</li>
          <li>{t("vaccines")}</li>
          <li>{t("cancun-airport")}</li>
          <li>{t("cdmx-airport")}</li>
        </ul>
      </ComingSoon>
    </EmptyState>
  )
}
