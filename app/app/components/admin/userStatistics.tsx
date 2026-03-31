import { useEffect, useState } from "react";
import { useAllUsers } from "~/providers/allUserProvider";
import { Attandance } from "~/services/userService";


export default function UserStatisticsPanel(){
    const {allUsers, reloadAllUsers} = useAllUsers();

    function exportAllUsersCsv(){
        const fields: string[] = [
            "name", 
            "attendance",
            "diet",
            "drinks",
            "mail", 
            "seating_preference",
        ]

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent = csvContent + fields.join(",") + "\n";
        csvContent = csvContent + allUsers.map(
            (user) => {
                let row =  fields.map((field) =>{
                    if(field === "drinks"){
                        return user[field].join("/")
                    }
                    return user[field]?.replace(/(\r\n|\n|\r)/gm, "");
                }).join(",");
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
                <h4>invite overview</h4>
                invited <br/>
                user-count: {allUsers.length} <br/>
                adult-count {allUsers.map((user)=>user.familyMembers.filter((member)=>member.is_child==false).length).reduce((a, b)=>a+b, 0)} <br/>
                child-count {allUsers.map((user)=>user.familyMembers.filter((member)=>member.is_child==true).length).reduce((a, b)=>a+b, 0)} <br/>
                attending <br/>
                user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_join)).length} <br/>
                adult-count {allUsers.filter((user) => (user.attendance==Attandance.will_join)).map((user)=>user.familyMembers.filter((member)=>member.is_child==false).length).reduce((a, b)=>a+b, 0)} <br/>
                child-count {allUsers.filter((user) => (user.attendance==Attandance.will_join)).map((user)=>user.familyMembers.filter((member)=>member.is_child==true).length).reduce((a, b)=>a+b, 0)} <br/>
            </div>
            <div>
                <h4>attendance overview</h4>
                user-count: {allUsers.length} <br/>
                joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_join)).length} <br/>
                not joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_not_join)).length} <br/>
                undecided user-count: {allUsers.filter((user) => (user.attendance==Attandance.undecided)).length} <br/>
                attendance not set user-count: {allUsers.filter((user) => (user.attendance===null)).length} <br/><br/>  
            </div>
        </div>
    )
}