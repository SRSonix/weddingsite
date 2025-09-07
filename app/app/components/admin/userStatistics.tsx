import { useAllUsers } from "~/providers/allUserProvider";
import { Attandance } from "~/services/userService";


export default function UserStatisticsPanel(){
    const {allUsers, reloadAllUsers} = useAllUsers();

    function exportAllUsersCsv(){
        const fields: string[] = [
            "first_name", 
            "last_name", 
            "attendance",
            "diet",
            "mail", 
            "seating_preference"
        ]

        let csvContent = "data:text/csv;charset=utf-8,"
        csvContent = csvContent + allUsers.map(
            (user) => {
                let row =  fields.map((field) =>user[field]).join(",");
                return row;
            }
        ).join("\n");

        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users-" + new Date().toISOString().split('.')[0].replaceAll(":", "-")+"Z"+ ".csv");
        document.body.appendChild(link);

        link.click();
    }
    
    return (
        <div>
            <h2 className="text-black mb-3">User Statistics</h2>
            <button onClick={reloadAllUsers} className="btn mr-3">reload users</button>
            <button onClick={exportAllUsersCsv} className="btn">export users</button>
            <div>
                <h4>attendance state</h4>
                user-count: {allUsers.length} <br/>
                joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_join)).length} <br/>
                not joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_not_join)).length} <br/>
                undecided user-count: {allUsers.filter((user) => (user.attendance==Attandance.undecided)).length} <br/>
                attendance not set user-count: {allUsers.filter((user) => (user.attendance===null)).length} <br/><br/>  
            </div>
        </div>
    )
}