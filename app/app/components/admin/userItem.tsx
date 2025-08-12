import { UserService, type Guest, type User } from "~/services/userService";


export function UserItem({user}: {user:User}){
    function getUserToken(id: number){
      UserService.getCustomUserUrl(id).then(
        (url) => {
          navigator.clipboard.writeText(url ? url : ""); 
        }
      )
    }

    function resetUserToken(id: number){
      window.confirm('Are you sure you want to update the user token? this will invalidate the past url given to the user!')

      UserService.resetUserToken(id);
    }

    return(
      <div className="mb-3 border p-3">
        <p>
          {user.first_name} <br/>
          {user.last_name} <br/>
          {user.role} <br/>
          {user.diet || "diet not set"} <br/>
          {user.mail || "mail not set"} <br/>
          {user.attendance || "attendance not set"} <br/>
          {user.language || "language not set"} <br/>
          {user.arrival_date || "arrival_date not set"} <br/>
          {user.departure_date || "departure_date not set"} <br/>
          {user.seating_preference || "seating_preference not set"} <br/>
          guests: {user.guests.map((guest: Guest, index) => (guest.first_name + "/" + guest.last_name  + "/" + guest.diet) + "|" )} <br/>
          {user.last_visit || "has not visited"} 
        </p>
        <button className="btn btn-small" onClick={() => getUserToken(user.id)}>copy custom user url</button>
        <button className="btn btn-small btn-red" onClick={() => resetUserToken(user.id)}>reset token</button>
      </div>
    )
}
