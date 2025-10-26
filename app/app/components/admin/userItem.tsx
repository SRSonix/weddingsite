import { useEffect, useState, type ChangeEvent } from "react";
import { useAllUsers } from "~/providers/allUserProvider";
import { Role, UserCoreInfo, UserService, type User } from "~/services/userService";


export function UserItem({user}: {user:User}){
    const [infoMessage, setInfoMessage] = useState("");
    const [userUrl, setUserUrl] = useState("");
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<UserCoreInfo>(UserCoreInfo.getEmpty());
    const {updateUserCoreInfo, deleteUser} = useAllUsers();

    const userAgent = window.navigator.userAgent;
    const isSafari = userAgent.includes("Safari") && !userAgent.includes("Chrome");

    function getUserUrl(id: number){
      const url =  UserService.getCustomUserUrl(id).then(
        (url) => {
           if (url === undefined){
            setInfoMessage("something went wrong copying the info message!");
            return;
          }

          setUserUrl(url);
          
          if (isSafari) {
            setInfoMessage("token was fetched. click the other button to copy it.")
            return;
          }

          setInfoMessage(url);          
          navigator.clipboard.writeText(url); 
        }
      );
    }

    function resetUserToken(id: number){
      if(! window.confirm('Are you sure you want to update the user token? this will invalidate the past url given to the user!')) return;

      UserService.resetUserToken(id).then(
        () =>setInfoMessage("The token is reset. Please sent the user the new url as the old one is no longer working.")
      )
    }

    function copyUrl() {
      navigator.clipboard.writeText(userUrl); 
      setInfoMessage(userUrl);
    }

    useEffect(() => {
      populateFormDataFromUser();
    }, [user])

    function populateFormDataFromUser(){
      setFormData(new UserCoreInfo(user.role, user.first_name, user.last_name));
    }

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>){
      const id = e.target.id
      const new_value = (e.target.value !== "" ?  e.target.value : undefined)
      setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function sumbitUserChange(){
      updateUserCoreInfo(user.id, formData);
      setEdit(false);
    }

    function resetUserChange(){
        populateFormDataFromUser();
        setEdit(false);
    }

    function deleteUserHandle(){
      if(! window.confirm('Are you sure you want to relete this user: ' + user.first_name + ' ' + user.last_name + '?')) return;
      deleteUser(user.id);
    }

    return(
      <div className="mb-3 border p-3">
        <div className="flex align-center w-full">
            <label htmlFor="diet">first_name</label>:<br/>
            <input disabled={!edit} placeholder="first_name" value={formData.first_name == undefined ? "": formData.first_name} id="first_name" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="diet">last_name</label>:<br/>
            <input disabled={!edit} placeholder="last_name" value={formData.last_name == undefined ? "": formData.last_name} id="last_name" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="role">role</label>:
            <select disabled={!edit} value={formData.role == undefined ? "": formData.role} id="role" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none")}>
                <option value={Role.admin}>ADMIN</option>
                <option value={Role.user}>USER</option>
            </select>
        </div>
        <p>
          attendance: {user.attendance || "attendance not set"} <br/>
          mail: {user.mail || "mail not set"} <br/>
          arrival_date: {user.arrival_date || "arrival_date not set"} <br/>
          departure_date: {user.departure_date || "departure_date not set"} <br/>
          language: {user.language || "language not set"} <br/>
          diet: {user.diet || "diet not set"} <br/>
          drinks: {user.drinks.join(", ") || "drinks not set"} <br/>
          seating_preference: {user.seating_preference || "seating_preference not set"} <br/>
          last_visit: {user.last_visit || "has not visited"} 
        </p>
        <div className="mt-2">
          <button className="btn btn-small mr-2 btn-gray" onClick={() => getUserUrl(user.id)}>{isSafari ? "fetch user token" : "load custom user url"}</button>
          {isSafari &&  <button className="btn btn-small mr-2 btn-gray" onClick={copyUrl}>copy token to clipboard</button> }
          <button className="btn btn-small btn-red" onClick={() => resetUserToken(user.id)}>reset token</button>
          <p>{infoMessage}</p>
        </div>
          <div className="pt-3">
              {!edit && <button onClickCapture={() => setEdit(true)} className="btn mr-2">
                  edit
              </button>} 
              {edit && <button onClickCapture={sumbitUserChange} className="btn btn-green mr-2">
                  submit
              </button>}
              {edit && <button onClickCapture={resetUserChange} className="btn btn-red mr-2">
                  cancel
              </button>}
              <button onClickCapture={deleteUserHandle} className="btn btn-red">
                  delete User
              </button>
          </div>
      </div>
    )
}
