import { useUser } from "~/providers/userProvider";
import type { Route } from "./+types/admin";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { UserService, type User } from "~/services/userService";
import CreateUser from "~/components/admin/createUser";
import AllUsers from "~/components/admin/allUsers";


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
        <div>
          <h2>User Management</h2>
          <CreateUser></CreateUser>
          <AllUsers></AllUsers>
        </div> 
      :
        <div><p>{t('nothing-to-see')}</p></div>    
      }
    </div>
  )
}
