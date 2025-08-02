import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import type { Guest } from "~/services/userService";

export function GuestTile({guest, edit, onDelete, onChange}: {guest: Guest, edit: boolean, onDelete: () => void, onChange: (updatedGuest: Guest) => void}) {
    const {t} = useTranslation(["user", "common"])
    
    function handleChange(e: ChangeEvent<HTMLInputElement>){
        const { id, value } = e.target;
        onChange({...guest, [id]: value});
    };


    return (
        <div className="border p-2 rounded">
            <ul>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="first_name">{t("first_name")}</label>:
                    <input disabled={!edit} placeholder={t("first_name")} id="first_name" value={guest.first_name} onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
                </li>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="last_name">{t("last_name")}</label>:
                    <input disabled={!edit} placeholder={t("last_name")} id="last_name" value={guest.last_name} onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
                </li>
                <li className="flex align-center w-full mb-2">
                    <label htmlFor="diet">{t("diet")}</label>:
                    <input disabled={!edit} placeholder={t("diet")} id="diet" value={guest.diet} onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
                </li>
            </ul>
            {edit && <button onClick={onDelete} className="btn btn-small">{t("remove_guest")}</button>}
        </div>
    );
}