import i18n from "i18next";
import type { User } from "./userService";
import { formatEuropeanDate } from "./infoService";

export class InviteTextService {
  static async generateInviteText(user: User, url: string, weddingDate: string, rsvpDeadline: string): Promise<string> {
    const nameList = user.familyMembers.map(fm => fm.name).filter(Boolean) as string[];
    const allNames = nameList.length > 1
      ? nameList.slice(0, -1).join(", ") + " & " + nameList[nameList.length - 1]
      : nameList[0] ?? "";
    const count = user.familyMembers.length;
    const lng = user.language ?? undefined;

    if (lng) {
      await i18n.loadLanguages(lng);
    }

    return i18n.t("invite-text", {
      ns: "app",
      lng,
      count,
      names: allNames,
      weddingDate: formatEuropeanDate(weddingDate, lng),
      rsvpDeadline: formatEuropeanDate(rsvpDeadline, lng),
      url,
    });
  }
}
