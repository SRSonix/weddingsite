import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { User, UserService } from "~/services/userService";
import { useSearchParams, Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding - ADMIN" },
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
      {user?.role === "ADMIN" &&    
        <div>
          <h2> Admin Site</h2>
            <p>nothing would show up if you were not logged in as admin.</p>
          </div>    
      }
      {(user===undefined || user.role !== "ADMIN") &&    
        <div><p> UPS. you are not an admin!</p></div>    
      }
      
    </UserService.userContext.Provider>
  )
}
