import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";
import { UserContactInformation, Language } from "~/services/userService";
import { FamilyMembers } from "./familyMembers";

export function Rsvp() {
    const {t} = useTranslation("app")
    const {user, updateUserContact, updateFamilyMember} = useUser();
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<UserContactInformation>(UserContactInformation.getEmpty());
    const [errors, setErrors] = useState<Partial<Record<keyof UserContactInformation, string>>>({});

    useEffect(() => {
        if (user != undefined) setFormData(user.getContactInformation())
    }, [user]);

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        const id = e.target.id
        const new_value = (e.target.value !== "" ?  e.target.value : undefined)
        setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function validate(): boolean {
        const newErrors: Partial<Record<keyof UserContactInformation, string>> = {};
        if (!formData.language) newErrors.language = t("error_language_required", "Please select a language.");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function submitContact(){
        if (!validate()) return;
        if (edit && user?.id) updateUserContact(user?.id, formData);
        setErrors({});
        setEdit(false);
    }

    function resetContact(){
        if (user !== null && user !== undefined) setFormData(() => (user.getContactInformation()));
        else setFormData(() => (UserContactInformation.getEmpty()));
        setErrors({});
        setEdit(false);
    }

    return (
        <div>
            <div className="bg-olive-50 border border-olive-100 rounded-lg p-4 shadow-sm mb-4">
                <div className="bg-olive-100 border border-olive-300 rounded-lg p-3 mb-3 text-sm">
                    {t("contact_note", "We will use your email address to contact you if needed.")}
                </div>
                <div className="flex align-center w-full mb-2">
                    <label htmlFor="mail" className="whitespace-nowrap">{t("mail", "Email")}</label>:
                    <input disabled={!edit} placeholder={t("mail", "Email")} value={formData.mail == undefined ? "": formData.mail} id="mail" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ?"input-inline" : "")}/>
                </div>
                <div className="flex align-center w-full mb-2">
                    <label htmlFor="language">{t("language", "Language")}</label>:
                    <select disabled={!edit} value={formData.language == undefined ? "": formData.language} id="language" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ?"input-inline" : "appearance-none") + (errors.language ? " border-red-500" : "")}>
                        <option disabled value={""}>{t("not_set", "Not set")}</option>
                        <option value={Language.de}>{t(Language.de, "German")}</option>
                        <option value={Language.fr}>{t(Language.fr, "French")}</option>
                    </select>
                </div>
                {errors.language && <p className="text-red-500 text-sm">{errors.language}</p>}
                <div className="pt-3 flex flex-wrap items-center gap-2">
                    {!edit && <button onClickCapture={() => setEdit(true)} className="btn btn-small">
                        {t("edit_contact", "Edit contact info")}
                    </button>}
                    {edit && <button onClickCapture={submitContact} className="btn btn-green btn-small">
                        {t("save", "Save")}
                    </button>}
                    {edit && <button onClickCapture={resetContact} className="btn btn-small">
                        {t("cancel", "Cancel")}
                    </button>}
                </div>
            </div>
            {user && <div className="mt-6">
                <p className="font-bold mb-2">{t("party", "Your Party")}</p>
                <div className="bg-olive-100 border border-olive-300 rounded-lg p-3 mb-3 text-sm">
                  {t("party_text", "This list shows everyone in your group. Please set your attendance for each person.")}
                </div>
                <FamilyMembers
                    familyMembers={user.familyMembers}
                    updateCallback={updateFamilyMember}
                />
            </div>}
        </div>
    )
}
