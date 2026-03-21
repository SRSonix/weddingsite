import { useUser } from "~/providers/userProvider";
import type { Route } from "./+types/admin";
import { useTranslation } from "react-i18next";
import CreateUser from "~/components/admin/createUser";
import AllUsers from "~/components/admin/allUsers";
import UserStatisticsPanel from "~/components/admin/userStatistics";
import AllUsersProvider from "~/providers/allUserProvider";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding - ADMIN" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Admin() {
  const {user} = useUser();
  const {t} = useTranslation("admin");


  return (
    <div>
      {user?.role === "ADMIN" ? 
        <AllUsersProvider>
          <div className="p-3">
            <UserStatisticsPanel></UserStatisticsPanel>
            <CreateUser></CreateUser>
            <AllUsers></AllUsers>
          </div>
        </AllUsersProvider> 
      :
        <div><p>{t('nothing-to-see')}</p></div>    
      }
    </div>
  )
}
