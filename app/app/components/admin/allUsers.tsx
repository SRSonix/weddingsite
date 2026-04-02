import { useState, type ChangeEvent} from "react";
import { Attandance, InvitedBy, Role, type User } from "~/services/userService";
import { UserItem } from "./userItem";
import { useAllUsers } from "~/providers/allUserProvider";


class SearchForm{
    constructor(
        public name: string,
        public role: Role | "",
        public attendance: Attandance | "not_set" | "",
        public has_visited: "visited" | "not_visited" | "",
        public mail_set: "mail_set" | "no_mail_set" | "",
        public invited_by: InvitedBy | "",
    ){}

    static initialFormData(){
        return new SearchForm("", "", "", "", "", "");
    }
}

export default function AllUsers(){
    const [formData, setFormData] = useState<SearchForm>(SearchForm.initialFormData());
    const {allUsers} = useAllUsers();

    function exportAllUsersCsv() {
        const fields: string[] = ["name", "attendance", "diet", "drinks", "mail", "seating_preference"];
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent = csvContent + fields.join(",") + "\n";
        csvContent = csvContent + allUsers.map(user => {
            return fields.map(field => {
                if (field === "drinks") return (user as any)[field].join("/");
                return (user as any)[field]?.replace(/(\r\n|\n|\r)/gm, "");
            }).join(",");
        }).join("\n");

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users-" + new Date().toISOString().split('.')[0].replaceAll(":", "-") + "Z" + ".csv");
        document.body.appendChild(link);
        link.click();
    }

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        setFormData((prev) => ({...prev, [e.target.id]: e.target.value}))
    }

    function resetSearchField(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        setFormData(SearchForm.initialFormData());
    }

    function filterUser(user: User){
        const {name, role, attendance, has_visited, mail_set, invited_by} = formData;

        if (name && !user.name.toLowerCase().includes(name.toLocaleLowerCase())) return false;
        if (attendance && attendance === "not_set" && user.attendance !== null) return false;
        if (attendance && attendance !== "not_set" && user.attendance !== attendance) return false;
        if (role && user.role !==  role) return false;
        if (has_visited === "visited" && user.last_visit === null) return false;
        if (has_visited === "not_visited" && user.last_visit !== null) return false;
        if (mail_set === "mail_set" && user.mail === null) return false;
        if (mail_set === "no_mail_set" && user.mail !== null) return false;
        if (invited_by && user.invited_by !== invited_by) return false;

        return true;
    }

    const filtered = allUsers.filter(filterUser);

    return (
        <div className="mt-3">
            <div className="bg-olive-50 border border-olive-100 rounded-lg p-3 mb-4">
                <h5 className="mt-0 mb-2 text-olive-700">Filter</h5>
                <form className="flex flex-wrap gap-3 items-end">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="input-label">name</label>
                        <input type="text" id="name" placeholder="any" onChange={handleChange} className="input-inline py-1 px-2" value={formData.name} />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="attendance" className="input-label">attendance</label>
                        <select id="attendance" value={formData.attendance} onChange={handleChange} className="input-inline py-1 px-2">
                            <option value="">any</option>
                            <option value="not_set">not set</option>
                            <option value={Attandance.undecided}>undecided</option>
                            <option value={Attandance.will_join}>coming</option>
                            <option value={Attandance.will_not_join}>not coming</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="invited_by" className="input-label">invited by</label>
                        <select id="invited_by" onChange={handleChange} className="input-inline py-1 px-2" value={formData.invited_by}>
                            <option value="">any</option>
                            <option value={InvitedBy.both}>both</option>
                            <option value={InvitedBy.groom}>groom</option>
                            <option value={InvitedBy.bride}>bride</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="role" className="input-label">role</label>
                        <select id="role" onChange={handleChange} className="input-inline py-1 px-2" value={formData.role}>
                            <option value="">any</option>
                            <option value={Role.user}>user</option>
                            <option value={Role.admin}>admin</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="has_visited" className="input-label">visited</label>
                        <select id="has_visited" onChange={handleChange} className="input-inline py-1 px-2" value={formData.has_visited}>
                            <option value="">any</option>
                            <option value="visited">visited</option>
                            <option value="not_visited">not visited</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="mail_set" className="input-label">mail</label>
                        <select id="mail_set" onChange={handleChange} className="input-inline py-1 px-2" value={formData.mail_set}>
                            <option value="">any</option>
                            <option value="mail_set">set</option>
                            <option value="no_mail_set">not set</option>
                        </select>
                    </div>
                    <button onClick={resetSearchField} className="btn btn-small btn-gray">reset</button>
                </form>
            </div>
            <div className="flex items-center gap-3 mb-3">
                <h4 className="m-0">Users ({filtered.length} of {allUsers.length})</h4>
                <button disabled onClick={exportAllUsersCsv} className="btn btn-small btn-gray opacity-50 cursor-not-allowed">export</button>
            </div>
            {filtered.map((item: User) => (
                <UserItem key={item.id} user={item} />
            ))}
        </div>
    );
}
