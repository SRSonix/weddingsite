import { useEffect, useState, type ChangeEvent } from "react";
import { useAllUsers } from "~/providers/allUserProvider";
import { InvitedBy, Role, UserCoreInfo, UserService, type User } from "~/services/userService";
import { FamilyMembers } from "../index/familyMembers";


export function UserItem({user}: {user:User}){
    const [infoMessage, setInfoMessage] = useState("");
    const [userUrl, setUserUrl] = useState<string|undefined>(undefined);
    const [edit, setEdit] = useState(false);
    const [showFamily, setShowFamily] = useState(false);
    const [formData, setFormData] = useState<UserCoreInfo>(UserCoreInfo.getEmpty());
    const {updateUserCoreInfo, deleteUser, updateFamilyMember, deleteFamilyMember, addFamilyMember} = useAllUsers();

    const userAgent = window.navigator.userAgent;
    const isSafari = userAgent.includes("Safari") && !userAgent.includes("Chrome");

    function resetUserToken(id: number){
      if(!window.confirm('Are you sure you want to update the user token? this will invalidate the past url given to the user!')) return;

      UserService.resetUserToken(id).then(
        (url) => {
           if (url === undefined){
            setInfoMessage("something went wrong copying the info message!");
            return;
          }

          setUserUrl(url);

          let msg = "The token is reset. Please sent the user the new url as the old one is no longer working."

          if (isSafari) {
            msg = msg + "\nClick the other button to copy it."
          }{
            msg = msg + "\nThe new url is copied to your clipboard."
            navigator.clipboard.writeText(url);
          }

          setInfoMessage(msg);
        }
      )
    }

    function copyUrl() {
      if (!userUrl) return;

      navigator.clipboard.writeText(userUrl);
      setInfoMessage("user url is copied to your clipboard.");
    }

    useEffect(() => {
      populateFormDataFromUser();
    }, [user])

    function populateFormDataFromUser(){
      setFormData(new UserCoreInfo(user.role, user.name, user.invited_by));
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
      if(! window.confirm('Are you sure you want to delete this user: ' + user.name + ' ' + '?')) return;
      deleteUser(user.id);
    }

    return(
      <div className="bg-olive-50 border border-olive-100 rounded-lg p-4 shadow-sm mb-3">
        <div className="flex align-center w-full">
            <label htmlFor="name">name</label>:<br/>
            <input disabled={!edit} placeholder="name" value={formData.name == undefined ? "": formData.name} id="name" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="role">role</label>:
            <select disabled={!edit} value={formData.role == undefined ? "": formData.role} id="role" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none")}>
                <option value={Role.admin}>ADMIN</option>
                <option value={Role.user}>USER</option>
            </select>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="invited_by">invited by</label>:
            <select disabled={!edit} value={formData.invited_by == undefined ? "": formData.invited_by} id="invited_by" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none")}>
                <option value="">not set</option>
                <option value={InvitedBy.both}>both</option>
                <option value={InvitedBy.groom}>groom</option>
                <option value={InvitedBy.bride}>bride</option>
            </select>
        </div>

        <div className="pt-3 flex flex-wrap items-center gap-2">
            {!edit && <button onClickCapture={() => setEdit(true)} className="btn btn-small">
                edit
            </button>}
            {edit && <button onClickCapture={sumbitUserChange} className="btn btn-green btn-small">
                save
            </button>}
            {edit && <button onClickCapture={resetUserChange} className="btn btn-small">
                cancel
            </button>}
        </div>

        <p className="mt-2">
          attendance: {user.attendance || "not set"} <br/>
          mail: {user.mail || "not set"} <br/>
          language: {user.language || "not set"} <br/>
          last_visit: {user.last_visit || "has not visited"} <br/>
        </p>
        <div>
          family_members: {user.familyMembers.length} ↑{user.familyMembers.filter(fm => !fm.is_child).length} ↓{user.familyMembers.filter(fm => fm.is_child).length}
          <button className="btn btn-small ml-2" onClick={() => setShowFamily(p => !p)}>
            {showFamily ? "hide" : "show"} family
          </button>
          {showFamily && <div className="mt-2"><FamilyMembers
            user_id={user.id}
            addCallback={(coreData) => addFamilyMember(user.id, coreData)}
            updateCallback={(id, coreData)=>updateFamilyMember(user.id, id, coreData)}
            deleteCallback={(id)=>deleteFamilyMember(user.id, id)}
            familyMembers={user.familyMembers}>
          </FamilyMembers></div>}
        </div>

        <div className="pt-3 border-t border-olive-100 mt-3 flex flex-wrap items-center gap-2">
            <button onClickCapture={deleteUserHandle} className="btn btn-red btn-small">
                delete user
            </button>
            <button className="btn btn-small btn-red" onClick={() => resetUserToken(user.id)}>reset token</button>
            {userUrl && <button className="btn btn-small btn-gray" onClick={copyUrl}>copy url</button>}
            <button disabled className="btn btn-small btn-gray opacity-50 cursor-not-allowed">login as user</button>
        </div>
        {infoMessage && <p className="text-sm mt-1">{infoMessage}</p>}
      </div>
    )
}
