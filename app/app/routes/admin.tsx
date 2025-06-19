import type { Route } from "./+types/admin";
import { useUser } from "~/services/userProvider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding - ADMIN" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Home() {
  const {user} = useUser();

  return (
    <>
      {user?.role === "ADMIN" &&    
        <div>
          <h2> Admin Site</h2>
            <p>nothing would show up if you were not logged in as admin.</p>
          </div>    
      }
      {(user===undefined || user.role !== "ADMIN") &&    
        <div><p> UPS. you are not an admin! Nothing to see here...</p></div>    
      }
    </>
  )
}
