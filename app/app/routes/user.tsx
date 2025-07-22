import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Route } from "./+types/user";
import { Attandance, UserService, useUser } from "~/providers/userProvider";
import { useTranslation } from "react-i18next";
import { Rsvp } from "~/components/user/rsvp";
import { UserLogin } from "~/components/user/login";
import { ContentTile } from "~/components/common/content_tile";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Users() {
  const {t} = useTranslation(["user", "common"])
  const {user, logout } = useUser();

  return (
    <>
      
      {user ? 
        <div className="content-tile-wrap">
          <ContentTile header="User Info">
          <ul>
            <li>First Name: <span>{user?.first_name}</span></li>
            <li>Last Name: <span>{user?.last_name}</span></li>
            {user?.role == "ADMIN" && <li className="text-red-900">You are admin!</li>}
          </ul>
          <button onClickCapture={logout} className="btn px-3 mt-7">
                logout
            </button>
          </ContentTile>
          <ContentTile header="RSVP"><Rsvp></Rsvp></ContentTile>
        </div>
        : <UserLogin></UserLogin>
      }
    </>
  )
}
