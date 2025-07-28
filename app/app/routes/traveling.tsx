import type { Route } from "./+types/traveling";
import { useTranslation } from "react-i18next";
import { EmptyState } from "~/components/common/empty_state";
import { ComingSoon } from "~/components/common/coming_soon";

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
      <ComingSoon>
        <ul className="list-disc list-inside">
          <li>{t("recommended-sites")}</li>
          <li>{t("itineraries")}</li>
          <li>{t("food")}</li>
          <li>{t("culture")}</li>
        </ul>
      </ComingSoon>
    </EmptyState>
  )
}
