import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { User, UserService } from "~/services/userService";
import { useSearchParams } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [user, setUser] = useState<User|undefined>(undefined)
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    const token = searchParams.get("token");

    UserService.login_and_fetch_user(id, token).then(
      (newUser) => {
        console.log("setting user to "+newUser)
        setUser(newUser);
      }
    )
  }, []);

  return (
    <UserService.userContext.Provider value={user}>
      <div>Hello</div>
      <p>{import.meta.env.VITE_API_URL}</p>
      <p>{user ? user.username: "no-user"}</p>
    </UserService.userContext.Provider>
  )
}
