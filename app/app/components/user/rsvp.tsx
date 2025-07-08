import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Attandance, useUser } from "~/providers/userProvider";


export function Rsvp() {
    const {t} = useTranslation(["user", "common"])
    const {user, updateUser} = useUser();
    const [editRSVP, setEditRSVP] = useState(false);
    const [formData, setFormData] = useState<{diet: string | undefined, mail: string | undefined, attendance: Attandance | undefined}>({diet: undefined, mail: undefined, attendance: undefined});

    useEffect(() => {
        // This code runs every time 'count' changes
        setFormData({diet: user?.diet, mail: user?.mail, attendance: user?.attendance})
    }, [user]); // <-- 'count' is the dependency

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        setFormData({...formData, [e.target.id]: e.target.value});
    }

    function submitRsvp(){
        if (editRSVP && user?.id){
        console.log("updating user data", formData);

        updateUser(user?.id, formData);
        }
        
        setEditRSVP(false);
    }

    function resetRsvp(){
        setFormData({diet: user?.diet, mail: user?.mail, attendance: user?.attendance})
        setEditRSVP(false);
    }

    return (
        <div>
            <h3>RSVP</h3>
            <ul className="wrapper-test">
              <li>Diet: {editRSVP ? <input placeholder="diet" defaultValue={formData.diet} id="diet" onChange={handleChange} className="input-inline"></input>  : <span>{user?.diet}</span>}</li>
              <li>Mail: {editRSVP ? <input placeholder="mail" defaultValue={formData.mail} id="mail" onChange={handleChange} className="input-inline"></input>  : <span>{user?.mail}</span>}</li>
              <li>Attendance: {editRSVP ? <select defaultValue={formData.attendance} id="attendance" onChange={handleChange} className="input-inline">
                <option value={Attandance.undecided}>{t(Attandance.undecided)}</option>
                <option value={Attandance.will_join}>{t(Attandance.will_join)}</option>
                <option value={Attandance.will_not_join}>{t(Attandance.will_not_join)}</option>
              </select>  : <span>{t(user?.attendance || "")}</span>}</li>
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