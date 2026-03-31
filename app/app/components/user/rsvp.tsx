import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";
import { Attandance, Language, RsvpInformation } from "~/services/userService";
import { FamilyMembers } from "./familyMembers";

export function Rsvp() {
    const {t} = useTranslation(["user", "common"])
    const {user, updateUserRsvp, addFamilyMember, updateFamilyMember, deleteFamilyMember} = useUser();
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<RsvpInformation>(RsvpInformation.getEmpty());

    useEffect(() => {
        if (user != undefined) setFormData(user.getRsvpInformation())
    }, [user]);

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        const id = e.target.id
        const new_value = (e.target.value !== "" ?  e.target.value : undefined)
        setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function submitRsvp(){
        if (edit && user?.id){
            updateUserRsvp(user?.id, formData);
        }
        setEdit(false);
    }

    function resetRsvp(){
        if (user !== null && user !== undefined) setFormData(() => (user.getRsvpInformation()));
        else setFormData(() => (RsvpInformation.getEmpty()));
        setEdit(false);
    }

    return (
        <div>
            {edit && <p className="text-l/4 text-red-900 pb-3">{t("save_reminder")}</p> }
            <ul>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="attendance">{t("attendance")}</label>:
                    <select disabled={!edit} value={formData.attendance == undefined ? "": formData.attendance} id="attendance" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none")}>
                        <option value={""}>{t("not_set")}</option>
                        <option value={Attandance.undecided}>{t(Attandance.undecided)}</option>
                        <option value={Attandance.will_join}>{t(Attandance.will_join)}</option>
                        <option value={Attandance.will_not_join}>{t(Attandance.will_not_join)}</option>
                    </select>
                </li>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="mail">{t("mail")}</label>:
                    <input disabled={!edit} placeholder={t("mail")} value={formData.mail == undefined ? "": formData.mail} id="mail" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
                </li>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="language">{t("language")}</label>:
                    <select disabled={!edit} value={formData.language == undefined ? "": formData.language} id="language" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none")}>
                        <option value={""}>{t("not_set")}</option>
                        <option value={Language.de}>{t(Language.de)}</option>
                        <option value={Language.fr}>{t(Language.fr)}</option>
                    </select>
                </li>
            </ul>
            <div className="pt-3">
                {!edit && <button onClickCapture={() => setEdit(true)} className="btn">
                    {t("edit_rsvp")}
                </button>}
                {edit && <button onClickCapture={submitRsvp} className="btn btn-green mr-2">
                    {t("submit")}
                </button>}
                {edit && <button onClickCapture={resetRsvp} className="btn btn-red">
                    {t("cancel")}
                </button>}
            </div>
            {user && <div className="mt-6">
                <p className="font-bold mb-2">{t("family_members")}</p>
                <FamilyMembers
                    user_id={user.id}
                    familyMembers={user.familyMembers}
                    addCallback={addFamilyMember}
                    updateCallback={updateFamilyMember}
                    deleteCallback={deleteFamilyMember}
                />
            </div>}
        </div>
    )
}
