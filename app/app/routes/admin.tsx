import { useUser } from "~/providers/userProvider";
import type { Route } from "./+types/admin";
import { useTranslation } from "react-i18next";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding - ADMIN" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Home() {
  const {user} = useUser();
  const {t} = useTranslation("admin");

  return (
    <>
      {user?.role === "ADMIN" &&    
        <div>
          <h2>{t('admin site')}</h2>
            <p>{t('nothing would show up if you were not logged in.')}</p>
          </div>    
      }
      {(user===undefined || user.role !== "ADMIN") &&    
        <div><p>{t('ups. you are not an admin. nothing to see here.')}</p></div>    
      }
    </>
  )
}
