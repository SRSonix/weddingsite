import { useState } from "react";
import { UserService, type Guest, type User } from "~/services/userService";


export function UserItem({user}: {user:User}){
    const [infoMessage, setInfoMessage] = useState("");
    const [userUrl, setUserUrl] = useState("");

    const userAgent = window.navigator.userAgent;
    const isSafari = userAgent.includes("Safari") && !userAgent.includes("Chrome");

    function getUserUrl(id: number){
      const url =  UserService.getCustomUserUrl(id).then(
        (url) => {
           if (url === undefined){
            setInfoMessage("something went wrong copying the info message!");
            return;
          }

          setUserUrl(url);
          
          if (isSafari) {
            setInfoMessage("token was fetched. click the other button to copy it.")
            return;
          }

          setInfoMessage(url);          
          navigator.clipboard.writeText(url); 
        }
      );
    }

    function resetUserToken(id: number){
      window.confirm('Are you sure you want to update the user token? this will invalidate the past url given to the user!')

      UserService.resetUserToken(id).then(
        () =>setInfoMessage("The token is reset. Please sent the user the new url as the old one is no longer working.")
      )
    }

    function copyUrl() {
      navigator.clipboard.writeText(userUrl); 
      setInfoMessage(userUrl);
    }

    return(
      <div className="mb-3 border p-3">
        <p>
          first_name: {user.first_name} <br/>
          last_name: {user.last_name} <br/>
          role: {user.role} <br/>
          diet: {user.diet || "diet not set"} <br/>
          mail: {user.mail || "mail not set"} <br/>
          attendance: {user.attendance || "attendance not set"} <br/>
          language: {user.language || "language not set"} <br/>
          arrival_date: {user.arrival_date || "arrival_date not set"} <br/>
          departure_date: {user.departure_date || "departure_date not set"} <br/>
          seating_preference: {user.seating_preference || "seating_preference not set"} <br/>
          guests: {user.guests.map((guest: Guest, index) => (guest.first_name + "/" + guest.last_name  + "/" + guest.diet) + "|" )} <br/>
          last_visit: {user.last_visit || "has not visited"} 
        </p>
        <div className="mt-2">
          <button className="btn btn-small mr-2 btn-gray" onClick={() => getUserUrl(user.id)}>{isSafari ? "fetch user token" : "load custom user url"}</button>
          {isSafari &&  <button className="btn btn-small mr-2 btn-gray" onClick={copyUrl}>copy token to clipboard</button> }
          <button className="btn btn-small btn-red" onClick={() => resetUserToken(user.id)}>reset token</button>
          <p>{infoMessage}</p>
        </div>
      </div>
    )
}
