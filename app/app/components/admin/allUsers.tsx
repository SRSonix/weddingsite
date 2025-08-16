import { useState, type ChangeEvent} from "react";
import { Attandance, UserService, type User } from "~/services/userService";
import { UserItem } from "./userItem";
import { useAllUsers } from "~/providers/allUserProvider";


class SearchForm{
    constructor(
        public first_name: string,
        public last_name: string,
        public role: string,
        public attendance: string,
    ){}

    static initialFormData(){
        return new SearchForm("", "", "", "");
    }
}

export default function AllUsers(){
    const [showAllUsers, setShowAllUsers] = useState(false);
    const [formData, setFormData] = useState<SearchForm>(SearchForm.initialFormData());
    const {allUsers} = useAllUsers()
 
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
        const {first_name, last_name, role, attendance} = formData;

        if (first_name && !user.first_name.toLowerCase().includes(first_name.toLocaleLowerCase())) return false;
        if (last_name && !user.last_name.toLowerCase().includes(last_name.toLocaleLowerCase())) return false;
        if (role && !user.role.toLowerCase().includes(role.toLocaleLowerCase())) return false;
        if (attendance && user.attendance!=attendance) return false;

        return true;
    }

    return (
        <div className="mt-3">
            <button onClick={tollgeShowAllUsers}  className="btn">show all users</button>
            <div className={(showAllUsers ? "": "hidden") +  " mt-2"}>
                <div className="mt-3">
                    <h4>Search Users</h4>
                    <form className="w-full flex flex-wrap">
                        <div className="px-3 inline">
                            <label htmlFor="first_name" className="input-label">first name</label>
                            <input type="text" id="first_name" placeholder="first_name" onChange={handleChange}  className="input-block" value={formData.first_name}></input>
                        </div>
                        <div className="px-3 inline">
                            <label htmlFor="last_name" className="input-label">last name</label>
                            <input type="text" id="last_name" placeholder="last_name" onChange={handleChange}  className="input-block" value={formData.last_name}></input>
                        </div>
                        <div className="px-3 inline">
                            <label htmlFor="attendance">"attendance"</label>:
                            <select value={formData.attendance} id="attendance" onChange={handleChange} className="input-block">
                                <option value={""}>{"not_set"}</option>
                                <option value={Attandance.undecided}>{Attandance.undecided}</option>
                                <option value={Attandance.will_join}>{Attandance.will_join}</option>
                                <option value={Attandance.will_not_join}>{Attandance.will_not_join}</option>
                            </select>
                        </div>
                        <div className="px-3 inline">
                            <label htmlFor="role" className="input-label">role</label>
                            <select id="role" defaultValue="" onChange={handleChange}  className="input-block"  value={formData.role}>
                                <option value="">not set</option>
                                <option value="USER">user</option>
                                <option value="ADMIN">admin</option>
                            </select>
                        </div>
                        <button onClick={(e) => resetSearchField(e)} className="btn btn-inline mt-6 btn-gray mr-3">reset filter</button>
                    </form>
                </div>
                <div className="mt-3">
                    <h4>Users</h4>
                    {allUsers.map((item: User, index) => (
                        filterUser(item) ? <UserItem user={item}></UserItem> : ""
                    ))}
                </div>
            </div>
        </div>  
    );
}