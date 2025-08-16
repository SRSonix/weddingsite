import { useAllUsers } from "~/providers/allUserProvider";
import { Attandance } from "~/services/userService";


export default function UserStatisticsPanel(){
    const {allUsers} = useAllUsers();

    return (
        <div>
            <h4>attendance state</h4>
            user-count: {allUsers.length} <br/>
            joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_join)).length} <br/>
            not joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_not_join)).length} <br/>
            undecided user-count: {allUsers.filter((user) => (user.attendance==Attandance.undecided)).length} <br/>
            attendance not set user-count: {allUsers.filter((user) => (user.attendance===null)).length} <br/><br/>
            <h4>guests</h4>
            guest_count joining users: {allUsers.filter((user) => (user.attendance==Attandance.will_join)).map((item) => (item.guests.length)).reduce((a, b) => (a+b), 0)}
        </div>
    )
}