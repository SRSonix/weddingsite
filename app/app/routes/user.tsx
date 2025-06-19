import { useContext } from "react";
import type { Route } from "./+types/user";
import { UserService } from "~/services/userService";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Traveling() {
  const user = useContext(UserService.userContext)

  return (
    <>
      <div className="mt-8">
        Hello {user ? user.username: "- you are not logged in"}!
      </div>
      <div className="mt-8" >
        <h3>User Info</h3>
        <ul>
          <li>User-Id: {user?.id}</li>
          <li>Username: {user?.username}</li>
          <li>Role: {user?.role}</li>
        </ul>
      </div>
    </>
  )
}
