import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";
import { Attandance, Language, RsvpInformation } from "~/services/userService";
import { FamilyMembers } from "./familyMembers";

export function Rsvp() {
    const {t} = useTranslation("app")
    const {user, updateUserRsvp, addFamilyMember, updateFamilyMember, deleteFamilyMember} = useUser();
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<RsvpInformation>(RsvpInformation.getEmpty());
    const [errors, setErrors] = useState<Partial<Record<keyof RsvpInformation, string>>>({});

    useEffect(() => {
        if (user != undefined) setFormData(user.getRsvpInformation())
    }, [user]);

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        const id = e.target.id
        const new_value = (e.target.value !== "" ?  e.target.value : undefined)
        setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function validate(): boolean {
        const newErrors: Partial<Record<keyof RsvpInformation, string>> = {};
        if (!formData.attendance) newErrors.attendance = t("error_attendance_required", "Please select your attendance.");
        if (!formData.language) newErrors.language = t("error_language_required", "Please select a language.");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function submitRsvp(){
        if (!validate()) return;
        if (edit && user?.id) updateUserRsvp(user?.id, formData);
        setErrors({});
        setEdit(false);
    }

    function resetRsvp(){
        if (user !== null && user !== undefined) setFormData(() => (user.getRsvpInformation()));
        else setFormData(() => (RsvpInformation.getEmpty()));
        setErrors({});
        setEdit(false);
    }

    return (
        <div>
            {edit && <p className="text-l/4 text-red-900 pb-3">{t("save_reminder", "Please note that no changes will be saved until you press submit!")}</p>}
            <ul>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="attendance">{t("attendance", "Attendance")}</label>:
                    <select disabled={!edit} value={formData.attendance == undefined ? "": formData.attendance} id="attendance" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none") + (errors.attendance ? " border-red-500" : "")}>
                        <option disabled value={""}>{t("not_set", "Not set")}</option>
                        <option value={Attandance.undecided}>{t(Attandance.undecided, "Undecided")}</option>
                        <option value={Attandance.will_join}>{t(Attandance.will_join, "I will join the wedding!")}</option>
                        <option value={Attandance.will_not_join}>{t(Attandance.will_not_join, "I will not be able to join.")}</option>
                    </select>
                </li>
                {errors.attendance && <p className="text-red-500 text-sm">{errors.attendance}</p>}
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="mail">{t("mail", "Email")}</label>:
                    <input disabled={!edit} placeholder={t("mail", "Email")} value={formData.mail == undefined ? "": formData.mail} id="mail" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
                </li>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="language">{t("language", "Language")}</label>:
                    <select disabled={!edit} value={formData.language == undefined ? "": formData.language} id="language" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none") + (errors.language ? " border-red-500" : "")}>
                        <option disabled value={""}>{t("not_set", "Not set")}</option>
                        <option value={Language.de}>{t(Language.de, "German")}</option>
                        <option value={Language.fr}>{t(Language.fr, "French")}</option>
                    </select>
                </li>
                {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
            </ul>
            <div className="pt-3">
                {!edit && <button onClickCapture={() => setEdit(true)} className="btn">
                    {t("edit_rsvp", "Edit RSVP")}
                </button>}
                {edit && <button onClickCapture={submitRsvp} className="btn btn-green mr-2">
                    {t("submit", "Submit")}
                </button>}
                {edit && <button onClickCapture={resetRsvp} className="btn btn-red">
                    {t("cancel", "Cancel")}
                </button>}
            </div>
            {user && <div className="mt-6">
                <p className="font-bold mb-2">{t("party", "Your Party")}</p>
                <div className="bg-olive-100 border border-olive-300 rounded-lg p-3 mb-3 text-sm">
                  {t("party_text", "This list should include everyone in your group attending the wedding — including yourself. Please add or remove people as needed, as we plan seating and catering based on these entries.")}
                </div>
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
