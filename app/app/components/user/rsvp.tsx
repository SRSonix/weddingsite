import { useEffect, useState, type ChangeEvent } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";
import { Attandance, Language, RsvpInformation } from "~/services/userService";

export function Rsvp() {
    const {t} = useTranslation(["user", "common"])
    const {user, updateUserRsvp} = useUser();
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<RsvpInformation>(RsvpInformation.getEmpty());

    useEffect(() => {
        if (user != undefined) setFormData(user.getRsvpInformation())
    }, [user]);

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>){
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
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="arrival">{t("arrival")}</label>:
                    <input disabled={!edit} type="date" value={formData.arrival_date == undefined ? "": formData.arrival_date} id="arrival_date" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
                </li>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="departure">{t("departure")}</label>:
                    <input disabled={!edit} type="date" value={formData.departure_date == undefined ? "": formData.departure_date} id="departure_date" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
                </li>
                <li className="mb-2">
                    <label htmlFor="diet">{t("diet")}</label>:<br/>
                    <p className="text-[0.8rem]/4 text-gray-700"><Trans i18nKey="user:diet_info"></Trans></p>
                    <input disabled={!edit} placeholder={t("diet")} value={formData.diet == undefined ? "": formData.diet} id="diet" onChange={handleChange} className={"w-full " + (edit ? "input-inline" : "")}/>
                </li>
                <li className="mb-2">
                    <label htmlFor="seating_preference">{t("seating_preference")}</label>:<br/>
                    <p className="text-[0.8rem]/4 text-gray-700"><Trans i18nKey="user:seating_preference_info"></Trans></p>
                    <textarea disabled={!edit} style={{ resize: "none" }}  rows={2} placeholder={t("seating_preference")} value={formData.seating_preference == undefined ? "": formData.seating_preference} id="seating_preference" onChange={handleChange} className={"w-full " + (edit ? "input-inline" : "")}/>
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
        </div>
    )
}