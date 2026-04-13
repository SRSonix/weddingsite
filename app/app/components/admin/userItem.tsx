import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { useAllUsers } from "~/providers/allUserProvider";
import { FamilyMemberType, InvitedBy, Language, Role, UserUpdateInfo, UserService, type User } from "~/services/userService";
import { FamilyMembers } from "../index/familyMembers";
import { useUser } from "~/providers/userProvider";
import { InfoService } from "~/services/infoService";
import { InviteTextService } from "~/services/inviteTextService";


export function UserItem({user}: {user:User}){
    const {reloadUser} = useUser();
    const [infoMessage, setInfoMessage] = useState("");
    const [inviteText, setInviteText] = useState<string|undefined>(undefined);
    const [edit, setEdit] = useState(false);
    const [showFamily, setShowFamily] = useState(false);
    const [formData, setFormData] = useState<UserUpdateInfo>(UserUpdateInfo.getEmpty());
    const {updateUser, deleteUser, updateFamilyMember, deleteFamilyMember, addFamilyMember} = useAllUsers();
    const navigate = useNavigate();

    const userAgent = window.navigator.userAgent;
    const isSafari = userAgent.includes("Safari") && !userAgent.includes("Chrome");

    async function resetUserToken(id: number){
      if(!window.confirm('Are you sure you want to update the user token? this will invalidate the past url given to the user!')) return;

      const [url, overviewInfo] = await Promise.all([
        UserService.resetUserToken(id),
        InfoService.getOverviewInfo(),
      ]);

      if (url === undefined) {
        setInfoMessage("something went wrong resetting the token!");
        return;
      }

      const text = overviewInfo
        ? await InviteTextService.generateInviteText(user, url, overviewInfo.date, overviewInfo.rsvp_deadline)
        : url;

      setInviteText(text);

      if (!isSafari) {
        navigator.clipboard.writeText(text);
        setInfoMessage("Token reset. Invite text copied to clipboard.");
      } else {
        setInfoMessage("Token reset. Use the button below to copy the invite text.");
      }
    }

    function copyInviteText() {
      if (!inviteText) return;

      navigator.clipboard.writeText(inviteText);
      setInfoMessage("Invite text copied to clipboard.");
    }

    useEffect(() => {
      populateFormDataFromUser();
    }, [user])

    function populateFormDataFromUser(){
      setFormData(new UserUpdateInfo(user.role, user.name, user.invited_by, user.mail, user.language));
    }

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>){
      const id = e.target.id
      const new_value = (e.target.value !== "" ?  e.target.value : undefined)
      setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function submitUserChange(){
      updateUser(user.id, formData);
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

    async function loginAsUserHandle(){
      const ok = await UserService.loginAsUser(user.id);
      if (ok) {
        reloadUser();
        navigate("/");
      } else {
        setInfoMessage("failed to login as user");
      }
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
                <option value="" disabled>not set</option>
                <option value={InvitedBy.both}>both</option>
                <option value={InvitedBy.groom}>groom</option>
                <option value={InvitedBy.bride}>bride</option>
            </select>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="mail">mail</label>:
            <input disabled={!edit} placeholder="mail" value={formData.mail == undefined ? "": formData.mail} id="mail" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="language">language</label>:
            <select disabled={!edit} value={formData.language == undefined ? "": formData.language} id="language" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none")}>
                <option value="" disabled>not set</option>
                <option value={Language.de}>de</option>
                <option value={Language.fr}>fr</option>
                <option value={Language.en}>en</option>
            </select>
        </div>

        <div className="pt-3 flex flex-wrap items-center gap-2">
            {!edit && <button onClickCapture={() => setEdit(true)} className="btn btn-small">
                edit
            </button>}
            {edit && <button onClickCapture={submitUserChange} className="btn btn-green btn-small">
                save
            </button>}
            {edit && <button onClickCapture={resetUserChange} className="btn btn-small">
                cancel
            </button>}
        </div>

        <p className="mt-2">
          last_visit: {user.last_visit || "has not visited"} <br/>
        </p>
        <div>
          family_members: {user.familyMembers.length} {user.familyMembers.filter(fm => fm.type === FamilyMemberType.adult).length}A · {user.familyMembers.filter(fm => fm.type === FamilyMemberType.child).length}C · {user.familyMembers.filter(fm => fm.type === FamilyMemberType.infant).length}I
          <button className="btn btn-small ml-2" onClick={() => setShowFamily(p => !p)}>
            {showFamily ? "hide" : "show"} family
          </button>
          {showFamily && <div className="mt-2"><FamilyMembers
            addCallback={(coreData) => addFamilyMember(user.id, coreData)}
            updateCallback={(id, updateData) => updateFamilyMember(user.id, id, updateData)}
            deleteCallback={(id) => deleteFamilyMember(user.id, id)}
            familyMembers={user.familyMembers}>
          </FamilyMembers></div>}
        </div>

        <div className="pt-3 border-t border-olive-100 mt-3 flex flex-wrap items-center gap-2">
            <button onClickCapture={deleteUserHandle} className="btn btn-red btn-small">
                delete user
            </button>
            <button className="btn btn-small btn-red" onClick={() => resetUserToken(user.id)}>reset token</button>
            {inviteText && <button className="btn btn-small btn-gray" onClick={copyInviteText}>copy invite text</button>}
            <button className="btn btn-small btn-gray" onClick={loginAsUserHandle}>login as user</button>
        </div>
        {infoMessage && <p className="text-sm mt-1">{infoMessage}</p>}
        {inviteText && (
          <textarea
            readOnly
            className="mt-2 w-full text-sm font-mono border border-olive-100 rounded p-2 bg-white resize-none"
            rows={10}
            value={inviteText}
          />
        )}
      </div>
    )
}
