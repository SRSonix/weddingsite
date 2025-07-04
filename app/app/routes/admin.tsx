import { User, UserService, useUser } from "~/providers/userProvider";
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
  const [formData, setFormData] = useState({ first_name: undefined, last_name: undefined, role: "USER" });
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
      
    UserService.createUser({first_name:formData.first_name, last_name:formData.last_name, role:formData.role}).then(
      (token) => {
        if (token !== undefined){
          console.log("user was created");
          setNewUserToken(token);
        }
        else {
          console.log("user creation failed!")
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
          <div>
            <button onClick={() => setCreateUserHidden(!createUserHidden)}  className="font-bolt py-2 px-4 rounded bg-gray-200 hover:bg-gray-400">create user</button>
            <div className={createUserHidden ? "hidden": "" +  "mt-2"}>
              <form onSubmit={createUser} className="w-full max-w-lg flex flex-wrap">
                <div className="px-3">
                  <label htmlFor="first_name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">username</label>
                  <input id="first_name" type="text" placeholder="first name" onChange={handleChange} className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none focus:bg-white focus:border-gray-500"></input>
                </div>
                <div className="px-3">
                  <label htmlFor="last_name" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">username</label>
                  <input id="last_name" type="text" placeholder="last name" onChange={handleChange} className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 focus:outline-none focus:bg-white focus:border-gray-500"></input>
                </div>
                <div className="px-3">
                  <label htmlFor="role" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">role</label>
                  <select id="role" defaultValue="USER" onChange={handleChange} className="block w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <option value="USER">user</option>
                      <option value="ADMIN">admin</option>
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
          <div>
            <button onClick={() => showUsers()}  className="font-bolt py-2 px-4 rounded bg-gray-200 hover:bg-gray-400">show all users</button>
            <div>
              <ul >
                {allUsers.map((item: User, index) => (
                  <li key={index}>
                    <div>{item.first_name} | {item.last_name} | {item.role} | {item.diet} | {item.mail} | {item.attendance} </div>
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
