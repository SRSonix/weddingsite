
import { useState, type ChangeEvent, type FormEvent} from "react";
import { useAllUsers } from "~/providers/allUserProvider";
import { Language, UserService } from "~/services/userService";

export default function CreateUser(){
  const [formData, setFormData] = useState({first_name: undefined, last_name: undefined, role: "USER", language: undefined});
  const [newUserUrl, setNewUserUrl] = useState<string | undefined>(undefined);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const {reloadUsers} = useAllUsers();
  
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
          setNewUserUrl(`${import.meta.env.VITE_WEBSITE_URL}?token=${token}`);
        }
        else {
          setNewUserUrl(undefined);
        }

        reloadUsers();
      }
    )
  }
      
  return (
    <div className="mt-3">
      <button onClick={() => setShowCreateUser(!showCreateUser)} className="btn">create user</button>
      <div className={showCreateUser ? "": "hidden" +  " mt-2"}>
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
            <select id="role" defaultValue="USER" onChange={handleChange} className="input-block" >
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
        <div className={(newUserUrl!==undefined ? "": "hidden ")}>
          <p className="break-all">new user was created with url {newUserUrl}</p>
          <button onClick={() => {navigator.clipboard.writeText(newUserUrl ? newUserUrl : "")}} className="font-bolt py-2 px-4 mx-3 rounded bg-gray-200 hover:bg-gray-400">
            copy url to clipboard
          </button>
          <button onClick={() => setNewUserUrl(undefined)} className="font-bolt py-2 px-4 rounded bg-gray-200 hover:bg-gray-400 mx-3">
            I have saved the url! 
          </button>
        </div>
      </div>  
    </div>
  )
}