import { useState, type ChangeEvent} from "react";
import { Attandance, FamilyMemberType, InvitedBy, Role, type User } from "~/services/userService";
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
        public has_diet: "has_diet" | "",
    ){}

    static initialFormData(){
        return new SearchForm("", "", "", "", "", "", "");
    }
}

export default function AllUsers(){
    const [formData, setFormData] = useState<SearchForm>(SearchForm.initialFormData());
    const {allUsers} = useAllUsers();

    function exportAllUsersCsv() {
        function escapeField(value: string | undefined | null): string {
            const str = value ?? "";
            if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
                return '"' + str.replace(/"/g, '""') + '"';
            }
            return str;
        }

        const headers = ["user_name", "user_mail", "user_language", "user_invited_by", "member_name", "member_type", "member_attendance", "member_diet"];
        const rows: string[] = [headers.join(",")];
        for (const user of filtered) {
            for (const fm of user.familyMembers) {
                rows.push([
                    escapeField(user.name),
                    escapeField(user.mail),
                    escapeField(user.language),
                    escapeField(user.invited_by),
                    escapeField(fm.name),
                    escapeField(fm.type),
                    escapeField(fm.attendance),
                    escapeField(fm.diet),
                ].join(","));
            }
        }

        const filterParts: string[] = [];
        if (formData.name) filterParts.push("name=" + formData.name.replace(/[^a-zA-Z0-9]/g, "_"));
        if (formData.role) filterParts.push("role=" + formData.role);
        if (formData.attendance) filterParts.push("attendance=" + formData.attendance);
        if (formData.has_visited) filterParts.push(formData.has_visited);
        if (formData.mail_set) filterParts.push(formData.mail_set);
        if (formData.invited_by) filterParts.push("invited_by=" + formData.invited_by);
        if (formData.has_diet) filterParts.push(formData.has_diet);
        const filterSuffix = filterParts.length > 0 ? "-" + filterParts.join("-") : "";

        const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "users" + filterSuffix + "-" + new Date().toISOString().split('.')[0].replaceAll(":", "-") + "Z" + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>){
        setFormData((prev) => ({...prev, [e.target.id]: e.target.value}))
    }

    function resetSearchField(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.preventDefault();
        setFormData(SearchForm.initialFormData());
    }

    function filterUser(user: User){
        const {name, role, attendance, has_visited, mail_set, invited_by, has_diet} = formData;

        if (name && !user.name.toLowerCase().includes(name.toLocaleLowerCase())) return false;
        if (attendance === "not_set" && !user.familyMembers.some(fm => fm.attendance === undefined)) return false;
        if (attendance && attendance !== "not_set" && !user.familyMembers.some(fm => fm.attendance === attendance)) return false;
        if (role && user.role !==  role) return false;
        if (has_visited === "visited" && user.last_visit === null) return false;
        if (has_visited === "not_visited" && user.last_visit !== null) return false;
        if (mail_set === "mail_set" && user.mail === null) return false;
        if (mail_set === "no_mail_set" && user.mail !== null) return false;
        if (invited_by && user.invited_by !== invited_by) return false;
        if (has_diet === "has_diet" && !user.familyMembers.some(fm => fm.diet && fm.diet.trim() !== "")) return false;

        return true;
    }

    const filtered = allUsers.filter(filterUser);

    function countedMembers(user: User) {
        if (!formData.attendance) return user.familyMembers;
        if (formData.attendance === "not_set") return user.familyMembers.filter(fm => fm.attendance === undefined);
        return user.familyMembers.filter(fm => fm.attendance === formData.attendance);
    }

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
                    <div className="flex flex-col">
                        <label htmlFor="has_diet" className="input-label">diet</label>
                        <select id="has_diet" onChange={handleChange} className="input-inline py-1 px-2" value={formData.has_diet}>
                            <option value="">any</option>
                            <option value="has_diet">has diet set</option>
                        </select>
                    </div>
                    <button onClick={resetSearchField} className="btn btn-small btn-gray">reset</button>
                </form>
            </div>
            <div className="flex items-center gap-3 mb-3">
                <h4 className="m-0">Users ({filtered.length} of {allUsers.length})</h4>
                <span className="text-sm text-gray-500">
                    {filtered.reduce((s, u) => s + countedMembers(u).filter(fm => fm.type === FamilyMemberType.adult).length, 0)} adults
                    · {filtered.reduce((s, u) => s + countedMembers(u).filter(fm => fm.type === FamilyMemberType.child).length, 0)} children
                    · {filtered.reduce((s, u) => s + countedMembers(u).filter(fm => fm.type === FamilyMemberType.infant).length, 0)} infants
                </span>
                <button onClick={exportAllUsersCsv} className="btn btn-small btn-gray">export</button>
            </div>
            {filtered.map((item: User) => (
                <UserItem key={item.id} user={item} />
            ))}
        </div>
    );
}
