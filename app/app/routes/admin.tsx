import { Guest, Language, User, UserService, useUser } from "~/providers/userProvider";
import type { Route } from "./+types/admin";
import { useTranslation } from "react-i18next";
import { useState, type ChangeEvent, type FormEvent} from "react";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Little Mexican Wedding - ADMIN" },
    { name: "description", content: "Welcome to our little mexican wedding!" },
  ];
}

export default function Home() {
  const [formData, setFormData] = useState({first_name: undefined, last_name: undefined, role: "USER", language: undefined});
  const [newUserToken, setNewUserToken] = useState(undefined);
  const [createUserHidden, setCreateUserHidden] = useState(true)
  const [allUsers, setAllUsers] = useState<Array<User>>([])

  const {user} = useUser();
  const {t} = useTranslation("admin");

  function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  function createUser(e: FormEvent){
    e.preventDefault();
    
    if (formData.first_name === undefined){
      alert("first_name missing");
      return;
    }

    if (formData.last_name === undefined){
      alert("last_name missing");
      return;
    }
      
    UserService.createUser({first_name:formData.first_name, last_name:formData.last_name, role:formData.role, language: formData.language}).then(
      (token) => {
        if (token !== undefined){
          setNewUserToken(token);
        }
        else {
          setNewUserToken(undefined);
        }
      }
    )
  }

  function showUsers(){    
    UserService.getAllUsers().then(
      (users) => {
        setAllUsers(users || []);
      }
    )
  }

  return (
    <>
      {user?.role === "ADMIN" ?  
        <div>
          <h2>User Management</h2>
          <div className="mt-3">
            <button onClick={() => setCreateUserHidden(!createUserHidden)} className="btn">create user</button>
            <div className={createUserHidden ? "hidden": "" +  "mt-2"}>
              <form onSubmit={createUser} className="w-full flex flex-wrap">
                <div className="px-3">
                  <label htmlFor="first_name" className="input-label">username</label>
                  <input id="first_name" type="text" placeholder="first name" onChange={handleChange} className="input-block"></input>
                </div>
                <div className="px-3">
                  <label htmlFor="last_name" className="input-label">username</label>
                  <input id="last_name" type="text" placeholder="last name" onChange={handleChange} className="input-block"></input>
                </div>
                <div className="px-3">
                  <label htmlFor="role" className="input-label">role</label>
                  <select id="role" defaultValue="USER" onChange={handleChange} className="input-block">
                      <option value="USER">user</option>
                      <option value="ADMIN">admin</option>
                  </select>
                </div>
                <div className="px-3">
                  <label htmlFor="language" className="input-label">language</label>
                  <select id="language" defaultValue={undefined} onChange={handleChange} className="input-block">
                      <option value={undefined}>Not set</option>
                      <option value={Language.en}>{Language.en}</option>
                      <option value={Language.de}>{Language.de}</option>
                      <option value={Language.es}>{Language.es}</option>
                  </select>
                </div>
                <div className="px-3 mt-7">
                  <button type="submit" className="font-bolt py-2 px-4 rounded bg-gray-200 hover:bg-gray-400">submit</button>
                </div>
              </form>
              <div className={(newUserToken!==undefined ? "": "hidden ")}>
                <p className="break-all">new user was created with token {newUserToken}</p>
                <button onClick={() => {navigator.clipboard.writeText(newUserToken ? newUserToken : "")}} className="font-bolt py-2 px-4 mx-3 rounded bg-gray-200 hover:bg-gray-400">
                copy token to clipboard
                </button>
                <button onClick={() => setNewUserToken(undefined)} className="font-bolt py-2 px-4 rounded bg-gray-200 hover:bg-gray-400 mx-3">
                I have saved the token! 
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button onClick={() => showUsers()}  className="btn">show all users</button>
            <div>
              <ul className="list-disc list-inside">
                {allUsers.map((item: User, index) => (
                  <li key={index}>
                    <div className="inline">{item.first_name} | {item.last_name} | {item.role} | {item.diet || "diet not set"} | {item.mail || "mail not set"} | {item.attendance || "attendance not set"} | {item.language || "language not set"}  | {item.arrival_date || "arrival_date not set"}  | {item.departure_date || "departure_date not set"} | {item.departure_date || "departure_date not set"} | guests: {item.guests.map((guest: Guest, index) => (guest.first_name + "/" + guest.last_name  + "/" + guest.diet) + "|" )}  </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>          
        </div> 
      :
        <div><p>{t('nothing-to-see')}</p></div>    
      }
    </>
  )
}
