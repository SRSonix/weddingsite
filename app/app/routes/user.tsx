import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Route } from "./+types/user";
import { Attandance, UserService, useUser } from "~/providers/userProvider";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Users() {
  const {user, logout, login, updateUser} = useUser();
  const [userToken, setuserToken] = useState('');
  const [editUserInfo, setEditUserInfo] = useState(false);
  const [formData, setFormData] = useState<{diet: string | undefined, mail: string | undefined, attendance: Attandance | undefined}>({diet: undefined, mail: undefined, attendance: undefined});

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userToken) {
      alert('Please fill in token.');
      return;
    }

    login(userToken);
  };

  useEffect(() => {
    // This code runs every time 'count' changes
    setFormData({diet: user?.diet, mail: user?.mail, attendance: user?.attendance})
  }, [user]); // <-- 'count' is the dependency

  function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  function toggleEditUserData(){
    if (editUserInfo && user?.id){
      console.log("updating user data", formData);

      updateUser(user?.id, formData);
    }
    
    setEditUserInfo(!editUserInfo);
  }

  return (
    <>
      <div className="mt-8">
        Hello {user ? user.first_name: "- you are not logged in"}!
      </div>
      {user?.role == "ADMIN" && <div>You are admin!</div>}
      {user ? 
        <div>
          <div className="mt-8">
            <h3>User Info</h3>
            <ul>
              <li>First Name: <span>{user?.first_name}</span></li>
              <li>Last Name: <span>{user?.last_name}</span></li>
              <li>Diet: {editUserInfo ? <input placeholder="diet" defaultValue={formData.diet} id="diet" onChange={handleChange} className="bg-gray-200 border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"></input>  : <span>{user?.diet}</span>}</li>
              <li>mail: {editUserInfo ? <input placeholder="mail" defaultValue={formData.mail} id="mail" onChange={handleChange} className="bg-gray-200 border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"></input>  : <span>{user?.mail}</span>}</li>
              <li>attendance: {editUserInfo ? <select defaultValue={formData.attendance} id="attendance" onChange={handleChange} className="bg-gray-200 border border-gray-200 text-gray-700 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value={Attandance.undecided}>{Attandance.undecided}</option>
                <option value={Attandance.will_join}>{Attandance.will_join}</option>
                <option value={Attandance.will_not_join}>{Attandance.will_not_join}</option>
              </select>  : <span>{user?.attendance}</span>}</li>
            </ul>
          </div>
          <div>
            <button onClickCapture={toggleEditUserData} className="bg-transparent hover:bg-yellow-700/80 text-yellow-700/80 font-semibold hover:text-white py-2 px-4 border border-yellow-700/80 hover:border-transparent rounded">
                {editUserInfo ? "submit" : "edit user info"}
            </button>
            <button onClickCapture={logout} className="bg-transparent hover:bg-yellow-700/80 text-yellow-700/80 font-semibold hover:text-white py-2 px-4 border border-yellow-700/80 hover:border-transparent rounded">
                logout
            </button>
          </div>
        </div>
        : <div>
            <form onSubmit={handleFormSubmit} className="w-full max-w-lg flex flex-wrap">
              <div>
                <label htmlFor="userToken" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Token:</label>
                <input
                  className="block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none focus:bg-white focus:border-gray-500"
                  type="password"
                  id="userToken"
                  placeholder="token"
                  value={userToken}
                  onChange={(e) => setuserToken(e.target.value)}
                />
              </div>
              <div className="px-3 mt-7">
                <button type="submit" className="font-bolt py-2 px-4 rounded bg-gray-200 hover:bg-gray-400">Log In</button>
              </div>
            </form>
        </div>
      }
    </>
  )
}
