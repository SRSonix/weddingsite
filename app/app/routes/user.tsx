import { useContext, useState, type FormEvent } from "react";
import type { Route } from "./+types/user";
import { useUser } from "~/services/userProvider";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Traveling() {
  const {user, logout, login} = useUser();
  const [userToken, setuserToken] = useState('');

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userToken) {
      alert('Please fill in token.');
      return;
    }

    login(userToken);
  };

  return (
    <>
      <div className="mt-8">
        Hello {user ? user.username: "- you are not logged in"}!
      </div>
      {user ? 
        <div>
          <div className="mt-8">
            <h3>User Info</h3>
            <ul>
              <li>User-Id: {user?.id}</li>
              <li>Username: {user?.username}</li>
              <li>Role: {user?.role}</li>
            </ul>
          </div>
          <div >
            <button onClickCapture={logout} className="bg-transparent hover:bg-yellow-700/80 text-yellow-700/80 font-semibold hover:text-white py-2 px-4 border border-yellow-700/80 hover:border-transparent rounded">
                logout
            </button>
          </div>
        </div>
        : <div>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="userToken">Token:</label>
                <input
                  type="password"
                  id="userToken"
                  value={userToken}
                  onChange={(e) => setuserToken(e.target.value)}
                />
              </div>
              <button type="submit">Log In</button>
            </form>
        </div>
      }
    </>
  )
}
