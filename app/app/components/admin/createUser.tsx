
import { useState, type ChangeEvent, type FormEvent} from "react";
import { useAllUsers } from "~/providers/allUserProvider";
import { InvitedBy, Language, UserService } from "~/services/userService";

export default function CreateUser(){
  const [formData, setFormData] = useState({name: undefined, role: "USER", language: undefined, invited_by: undefined});
  const [newUserUrl, setNewUserUrl] = useState<string | undefined>(undefined);
  const {reloadAllUsers} = useAllUsers();

  function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  function createUser(e: FormEvent){
    e.preventDefault();

    if (formData.name === undefined){
      alert("name missing");
      return;
    }

    if (formData.language === undefined){
      alert("language missing");
      return;
    }

    UserService.createUser({
      name: formData.name,
      role: formData.role,
      language: formData.language,
      invited_by: formData.invited_by,
    }).then(
      (token) => {
        if (token !== undefined){
          setNewUserUrl(`${import.meta.env.VITE_WEBSITE_URL}?token=${token}`);
        }
        else {
          setNewUserUrl(undefined);
        }

        reloadAllUsers();
      }
    )
  }

  return (
    <div>
      <form onSubmit={createUser} className="w-full flex flex-wrap">
        <div className="px-3">
          <label htmlFor="name" className="input-label">username</label>
          <input id="name" type="text" placeholder="name" onChange={handleChange} className="input-block"></input>
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
          <select id="language" defaultValue={""} onChange={handleChange} className="input-block">
            <option disabled value={""}>Not set</option>
            <option value={Language.de}>{Language.de}</option>
            <option value={Language.fr}>{Language.fr}</option>
          </select>
        </div>
        <div className="px-3">
          <label htmlFor="invited_by" className="input-label">invited by</label>
          <select id="invited_by" defaultValue={""} onChange={handleChange} className="input-block">
            <option value="">not set</option>
            <option value={InvitedBy.groom}>groom</option>
            <option value={InvitedBy.bride}>bride</option>
            <option value={InvitedBy.both}>both</option>
          </select>
        </div>
        <div className="px-3 mt-7">
          <button type="submit" className="btn">submit</button>
        </div>
      </form>
      {newUserUrl !== undefined && (
        <div className="mt-3">
          <p className="break-all">new user was created with url {newUserUrl}</p>
          <button onClick={() => navigator.clipboard.writeText(newUserUrl)} className="btn btn-small mr-2">
            copy url to clipboard
          </button>
          <button onClick={() => setNewUserUrl(undefined)} className="btn btn-small">
            I have saved the url!
          </button>
        </div>
      )}
    </div>
  )
}
