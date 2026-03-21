import { useState, type ChangeEvent} from "react";
import { Attandance, Role, type User } from "~/services/userService";
import { UserItem } from "./userItem";
import { useAllUsers } from "~/providers/allUserProvider";


class SearchForm{
    constructor(
        public name: string,
        public role: Role | "",
        public attendance: Attandance | "not_set" | "",
        public has_visited: "visited" | "not_visited" | "",
        public mail_set: "mail_set" | "no_mail_set" | "",
    ){}

    static initialFormData(){
        return new SearchForm("", "", "", "", "");
    }
}

export default function AllUsers(){
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [formData, setFormData] = useState<SearchForm>(SearchForm.initialFormData());
    const {allUsers} = useAllUsers();
 
    function tollgeShowAllUsers(){  
        setShowAllUsers(!showAllUsers);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        setFormData((prev) => ({...prev, [e.target.id]: e.target.value}))
    }

    function resetSearchField(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();

        setFormData(SearchForm.initialFormData());
    }

    function filterUser(user: User){
        const {name, role, attendance, has_visited, mail_set} = formData;

        if (name && !user.name.toLowerCase().includes(name.toLocaleLowerCase())) return false;
        if (attendance && attendance === "not_set" && user.attendance !== null) return false;
        if (attendance && attendance !== "not_set" && user.attendance !== attendance) return false;
        if (role && user.role !==  role) return false;
        if (has_visited === "visited" && user.last_visit === null) return false;
        if (has_visited === "not_visited" && user.last_visit !== null) return false;
        if (mail_set === "mail_set" && user.mail === null) return false;
        if (mail_set === "no_mail_set" && user.mail !== null) return false;

        return true;
    }

    return (
        <div className="mt-3">
            <button onClick={tollgeShowAllUsers}  className="btn">show all users</button>
            <div className={(showAllUsers ? "": "hidden") +  " mt-2"}>
                <div className="mt-3">
                    <h4>Search Users</h4>
                    <form className="w-full flex flex-wrap gap-x-3">
                        <div className="inline">
                            <label htmlFor="name" className="input-label">name</label>
                            <input type="text" id="name" placeholder="name" onChange={handleChange}  className="input-block" value={formData.name}></input>
                        </div>
                        <div className="inline">
                            <label htmlFor="attendance" className="input-label">attendance</label>
                            <select value={formData.attendance} id="attendance" onChange={handleChange} className="input-block">
                                <option value="">no filter</option>
                                <option value={"not_set"}>not set by user</option>
                                <option value={Attandance.undecided}>{Attandance.undecided}</option>
                                <option value={Attandance.will_join}>{Attandance.will_join}</option>
                                <option value={Attandance.will_not_join}>{Attandance.will_not_join}</option>
                            </select>
                        </div>
                        <div className="inline">
                            <label htmlFor="role" className="input-label">role</label>
                            <select id="role" onChange={handleChange}  className="input-block"  value={formData.role}>
                                <option value="">no filter</option>
                                <option value={Role.user}>user</option>
                                <option value={Role.admin}>admin</option>
                            </select>
                        </div>
                        <div className="inline">
                            <label htmlFor="has_visited" className="input-label">has visited</label>
                            <select id="has_visited" onChange={handleChange}  className="input-block"  value={formData.has_visited}>
                                <option value="">no filter</option>
                                <option value={"visited"}>visited</option>
                                <option value={"not_visited"}>not visited</option>
                            </select>
                        </div>
                        <div className="inline">
                            <label htmlFor="mail_set" className="input-label">has mail set</label>
                            <select id="mail_set" onChange={handleChange}  className="input-block"  value={formData.mail_set}>
                                <option value="">no filter</option>
                                <option value={"mail_set"}>mail set</option>
                                <option value={"no_mail_set"}>no mail set</option>
                            </select>
                        </div>
                        <button onClick={(e) => resetSearchField(e)} className="btn btn-inline mt-6 btn-gray mr-3">reset filter</button>
                    </form>
                </div>
                <div className="mt-3">
                    <h4>Users (showing {allUsers.filter((item) =>filterUser(item)).length} of {allUsers.length})</h4>
                    {allUsers.filter((item) =>filterUser(item)).map(
                        (item: User) => (<UserItem user={item}></UserItem>)
                    )}
                </div>
            </div>
        </div>  
    );
}