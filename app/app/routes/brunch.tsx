import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";
import { ContentTile } from "~/components/common/content_tile";
import { useUser } from "~/providers/userProvider";
import { Attandance, UserService, type BrunchRsvpResult } from "~/services/userService";

type State = "loading" | "done" | "failed";

export default function Brunch() {
  const {t, i18n} = useTranslation("app");
  const {user} = useUser();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("brunch_token");
  const lng = searchParams.get("lng");
  const [state, setState] = useState<State>("loading");
  const [result, setResult] = useState<BrunchRsvpResult | undefined>(undefined);
  const submitted = useRef(false);

  useEffect(() => {
    if (!lng || user) return;
    i18n.changeLanguage(lng);
  }, [lng, user, i18n]);

  useEffect(() => {
    if (submitted.current) return;
    submitted.current = true;

    if (!token) {
      setState("failed");
      return;
    }

    UserService.submitBrunchRsvp(token).then((rsvpResult) => {
      if (!rsvpResult) {
        setState("failed");
        return;
      }
      setResult(rsvpResult);
      setState("done");
    });
  }, [token]);

  return (
    <div className="content-tile-wrap">
      <ContentTile header={t("brunch", "Brunch")} fullWidth>
        {state === "loading" && (
          <p>{t("brunch_loading", "Saving your answer...")}</p>
        )}
        {state === "failed" && (
          <p className="text-red-700">
            {t("brunch_link_invalid", "This link is no longer valid. Please open your personal invite link to set your brunch attendance, or contact us directly.")}
          </p>
        )}
        {state === "done" && result && (
          <div className="space-y-2">
            <p className="font-medium">
              {result.brunch_attendance === Attandance.will_join
                ? t("brunch_confirmed_join", "Hi {{name}}, {{count}} people from your group are registered for the brunch.", {name: result.name, count: result.joining})
                : t("brunch_confirmed_not_join", "Hi {{name}}, your group is not registered for the brunch.", {name: result.name})}
            </p>
            {result.undecided > 0 && (
              <p>{t("brunch_confirmed_undecided", "{{count}} people from your group are still undecided.", {count: result.undecided})}</p>
            )}
            <p className="text-sm">
              {t("brunch_change_hint", "You can adjust this for each person individually - just open your personal invite link and edit your group.")}
            </p>
          </div>
        )}
        <p className="text-sm mt-4">
          <Link className="text-blue-600" to="/">{t("brunch_back_home", "Back to main page")}</Link>
        </p>
      </ContentTile>
    </div>
  );
}
