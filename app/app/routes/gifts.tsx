import type { Route } from "./+types/gifts";
import { useTranslation } from "react-i18next";
import { EmptyState } from "~/components/common/empty_state";
import { ContentTile } from "~/components/common/content_tile";
import { Gifts } from "~/components/gifts/gifts";
import { GiftInfo } from "~/components/gifts/giftInfo";
import GiftsProvider from "~/providers/giftsProvider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function GettingThere() {
  const {t} = useTranslation(["gifts", "common"]);

  return (
    <EmptyState>
        <GiftsProvider>
          <div className="content-tile-wrap">
            <ContentTile header={t("gift_info")}><GiftInfo></GiftInfo></ContentTile>
            <ContentTile header={t("your_gifts")}><Gifts></Gifts></ContentTile>
          </div>
        </GiftsProvider>
    </EmptyState>
  )
}