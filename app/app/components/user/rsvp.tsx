import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Attandance, Guest, Language, RsvpInformation, useUser } from "~/providers/userProvider";

export function Rsvp() {
    const {t} = useTranslation(["user", "common"])
    const {user, updateUser} = useUser();
    const [editRSVP, setEditRSVP] = useState(false);
    const [formData, setFormData] = useState<RsvpInformation>(RsvpInformation.getEmpty());

    useEffect(() => {
        // This code runs every time 'count' changes
        if (user != undefined) setFormData(user.getRsvpInformation())
    }, [user]); // <-- 'count' is the dependency

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        const value = 
        setFormData({...formData, [e.target.id]: (e.target.value !== "" ?  e.target.value : undefined)});
    }

    function submitRsvp(){
        if (editRSVP && user?.id){
        console.log("updating user data", formData);

        updateUser(user?.id, formData);
        }
        
        setEditRSVP(false);
    }

    function resetRsvp(){
        if (user !== undefined) setFormData(user.getRsvpInformation());
        else setFormData(RsvpInformation.getEmpty());
        setEditRSVP(false);
    }

    return (
        <div>
            <h3>RSVP</h3>
            <ul className="wrapper-test">
            <li>Diet: {editRSVP ? <input placeholder="diet" defaultValue={formData.diet} id="diet" onChange={handleChange} className="input-inline"></input>  : <span>{user?.diet}</span>}</li>
            <li>Mail: {editRSVP ? <input placeholder="mail" defaultValue={formData.mail} id="mail" onChange={handleChange} className="input-inline"></input>  : <span>{user?.mail}</span>}</li>
            <li>Attendance: {editRSVP ? 
                <select defaultValue={formData.attendance} id="attendance" onChange={handleChange} className="input-inline">
                    <option value={""}>Not set</option>
                    <option value={Attandance.undecided}>{t(Attandance.undecided)}</option>
                    <option value={Attandance.will_join}>{t(Attandance.will_join)}</option>
                    <option value={Attandance.will_not_join}>{t(Attandance.will_not_join)}</option>
                </select>  : <span>{t(user?.attendance || "")}</span>}
            </li>
            <li>Language: {editRSVP ? 
                <select defaultValue={formData.language} id="language" onChange={handleChange} className="input-inline">
                    <option value={""}>Not set</option>
                    <option value={Language.en}>{t(Language.en)}</option>
                    <option value={Language.de}>{t(Language.de)}</option>
                    <option value={Language.es}>{t(Language.es)}</option>
                </select>  : <span>{user?.language}</span>}
            </li>
            <li>arrival: {editRSVP ? <input type="date" placeholder="arrival date" defaultValue={formData.arrival_date} id="arrival_date" onChange={handleChange} className="input-inline"></input>  : <span>{user?.arrival_date}</span>}</li>
            <li>departure: {editRSVP ? <input type="date" placeholder="departure date" defaultValue={formData.departure_date} id="departure_date" onChange={handleChange} className="input-inline"></input>  : <span>{user?.departure_date}</span>}</li>
            <li>Guests:
                {editRSVP ? 
                "EDITING GUESTS IS NOT IMPLEMENTED" : <div>
                    <ul>
                    {user?.guests.map((item: Guest, index) => (
                      
                        <li key={index}>
                        <div>{item.first_name} | {item.last_name} | {item.diet || "diet not set"} </div>
                        </li>
                    ))}
                    </ul>
                    </div>
                }
            </li>
            </ul>
            {!editRSVP && <button onClickCapture={() => setEditRSVP(true)} className="btn">
                 edit RSVP
            </button>}
            {editRSVP && <button onClickCapture={submitRsvp} className="btn">
                 submit
            </button>}
            {editRSVP && <button onClickCapture={resetRsvp} className="btn">
                 cancel
            </button>}
        </div>
    )
}