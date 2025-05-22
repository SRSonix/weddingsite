import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { User, UserService } from "~/services/userService";
import { useSearchParams, Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Home() {
  const [user, setUser] = useState<User|undefined>(undefined)
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    setSearchParams({});

    UserService.login_and_fetch_user(token).then(
      (newUser) => {
        console.log("setting user to "+newUser)
        setUser(newUser);
      }
    )
  }, []);

  return (
    <UserService.userContext.Provider value={user}>
      <div>
        <h1>Little Mexican Wedding</h1>
        Hello {user ? user.username: "- you are not logged in"}!</div>
      {user?.role === "ADMIN" && 
        <p>Congrats you are admin. Go to the <Link to="/admin">admin site</Link>.</p>
      }

    </UserService.userContext.Provider>
  )
}
