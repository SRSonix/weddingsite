import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Attandance, Guest, Language, RsvpInformation, useUser } from "~/providers/userProvider";
import { GuestTile } from "./guest";

export function Rsvp() {
    const {t} = useTranslation(["user", "common"])
    const {user, updateUser} = useUser();
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<RsvpInformation>(RsvpInformation.getEmpty());

    useEffect(() => {
        // This code runs every time 'count' changes
        if (user != undefined) setFormData(user.getRsvpInformation())
    }, [user]); // <-- 'count' is the dependency

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        const id = e.target.id
        const new_value = (e.target.value !== "" ?  e.target.value : undefined)
        setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function handleGuestChange(index: number, newGuest: Guest){
        setFormData((prev: RsvpInformation) => ({...prev, guests: prev.guests.map((g, i) => (i === index ? newGuest : g))}));
    }

    function deleteGuest(index: number){
        setFormData((prev: RsvpInformation) => ({...prev, guests: prev.guests.filter((_, i) => (i !== index))}));
    }

    function addGuest(){
        setFormData((prev: RsvpInformation) => ({...prev, guests: [...prev.guests, new Guest("", "", "")]}));
    }

    function submitRsvp(){
        if (edit && user?.id){
            updateUser(user?.id, formData);
        }
        setEdit(false);
    }

    function resetRsvp(){
        if (user !== undefined) setFormData(() => (user.getRsvpInformation()));
        else setFormData(() => (RsvpInformation.getEmpty()));
        setEdit(false);
    }

    return (
        <div>
            <h3>RSVP</h3>
            <ul>
                <li>Diet: <input disabled={!edit} placeholder="diet" value={formData.diet == undefined ? "": formData.diet} id="diet" onChange={handleChange} className={edit ? "input-inline" : ""}></input></li>
                <li>Mail: <input disabled={!edit} placeholder="mail" value={formData.mail == undefined ? "": formData.mail} id="mail" onChange={handleChange} className={edit ? "input-inline" : ""}></input></li>
                <li>Attendance:
                    <select disabled={!edit} value={formData.attendance == undefined ? "": formData.attendance} id="attendance" onChange={handleChange} className={edit ? "input-inline" : "appearance-none"}>
                        <option value={""}>Not set</option>
                        <option value={Attandance.undecided}>{t(Attandance.undecided)}</option>
                        <option value={Attandance.will_join}>{t(Attandance.will_join)}</option>
                        <option value={Attandance.will_not_join}>{t(Attandance.will_not_join)}</option>
                    </select>
                </li>
                <li>Language:
                    <select disabled={!edit} value={formData.language == undefined ? "": formData.language} id="language" onChange={handleChange} className={edit ? "input-inline" : "appearance-none"}>
                        <option value={""}>Not set</option>
                        <option value={Language.en}>{t(Language.en)}</option>
                        <option value={Language.de}>{t(Language.de)}</option>
                        <option value={Language.es}>{t(Language.es)}</option>
                    </select>
                </li>
                <li>arrival: <input disabled={!edit} type="date" placeholder="arrival date" value={formData.arrival_date == undefined ? "": formData.arrival_date} id="arrival_date" onChange={handleChange} className={edit ? "input-inline" : ""}></input></li>
                <li>departure: <input disabled={!edit} type="date" placeholder="departure date" value={formData.departure_date == undefined ? "": formData.departure_date} id="departure_date" onChange={handleChange} className={edit ? "input-inline" : ""}></input></li>
                <li>Guests:
                    <ul>
                    {formData.guests.map((guest: Guest, index: number) => (
                        <li key = {index}>
                        <GuestTile edit={edit} guest={guest} onChange={(newGuest) => handleGuestChange(index, newGuest)} onDelete={() => deleteGuest(index)}></GuestTile>
                        </li>
                    ))}
                    </ul>
                    {edit && <button onClick={addGuest} className="btn"> add guest</button>}
                </li>
            </ul>
            {!edit && <button onClickCapture={() => setEdit(true)} className="btn">
                 edit RSVP
            </button>}
            {edit && <button onClickCapture={submitRsvp} className="btn">
                 submit
            </button>}
            {edit && <button onClickCapture={resetRsvp} className="btn">
                 cancel
            </button>}
        </div>
    )
}