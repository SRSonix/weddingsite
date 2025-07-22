import type { ChangeEvent } from "react";
import { type Guest } from "~/providers/userProvider";

export function GuestTile({guest, edit, onDelete, onChange}: {guest: Guest, edit: boolean, onDelete: () => void, onChange: (updatedGuest: Guest) => void}) {
    function handleChange(e: ChangeEvent<HTMLInputElement>){
        const { id, value } = e.target;
        onChange({...guest, [id]: value});
    };


    return (
        <div className="border p-2 rounded">
            <ul>
                <li>first_name: <input disabled={!edit} placeholder="first_name" id="first_name" value={guest.first_name} onChange={handleChange} className={edit ? "input-inline" : ""}></input></li>
                <li>last_name: <input disabled={!edit} placeholder="last_name" id="last_name" value={guest.last_name} onChange={handleChange} className={edit ? "input-inline" : ""}></input></li>
                <li>diet: <input disabled={!edit} placeholder="diet" id="diet" value={guest.diet} onChange={handleChange} className={edit ? "input-inline" : ""}></input></li>
            </ul>
            {edit && <button onClick={onDelete} className="btn btn-red btn-small">delete guest</button>}
        </div>
    );
}