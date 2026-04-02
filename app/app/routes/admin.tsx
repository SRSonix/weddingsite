import { useUser } from "~/providers/userProvider";
import type { Route } from "./+types/admin";
import { useTranslation } from "react-i18next";
import CreateUser from "~/components/admin/createUser";
import AllUsers from "~/components/admin/allUsers";
import UserStatisticsPanel from "~/components/admin/userStatistics";
import AllUsersProvider from "~/providers/allUserProvider";
import { ContentTile } from "~/components/common/content_tile";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Brautkleid bleibt Blaukraut - ADMIN" },
    { name: "description", content: "Brautkleid bleibt Blaukraut" },
  ];
}

export default function Admin() {
  const {user} = useUser();
  const {t} = useTranslation("app");

  return (
    <div>
      {user?.role === "ADMIN" ?
        <AllUsersProvider>
          <div className="content-tile-wrap">
            <ContentTile header="User Statistics" fullWidth>
              <UserStatisticsPanel />
            </ContentTile>
            <ContentTile header="Create User" fullWidth>
              <CreateUser />
            </ContentTile>
            <ContentTile header="Users" fullWidth>
              <AllUsers />
            </ContentTile>
          </div>
        </AllUsersProvider>
      :
        <div><p>{t('nothing-to-see', 'You are not an admin!')}</p></div>
      }
    </div>
  )
}
