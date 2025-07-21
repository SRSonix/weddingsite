import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Route } from "./+types/user";
import { Attandance, UserService, useUser } from "~/providers/userProvider";
import { useTranslation } from "react-i18next";
import { Rsvp } from "~/components/user/rsvp";
import { UserLogin } from "~/components/user/login";


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
      <div className="mt-8">
        Hello {user ? user.first_name: "- you are not logged in"}!
      </div>
      {user?.role == "ADMIN" && <div className="text-red-900">You are admin!</div>}
      {user ? 
        <div>
          <div className="mt-8">
            <h3>User Info</h3>
            <ul>
              <li>First Name: <span>{user?.first_name}</span></li>
              <li>Last Name: <span>{user?.last_name}</span></li>
            </ul>
          </div>
          <Rsvp></Rsvp>
          <div>
            <button onClickCapture={logout} className="btn px-3 mt-7">
                logout
            </button>
          </div>
        </div>
        : <UserLogin></UserLogin>
      }
    </>
  )
}
