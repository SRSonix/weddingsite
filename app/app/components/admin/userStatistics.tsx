import { useEffect, useState } from "react";
import { useAllUsers } from "~/providers/allUserProvider";
import { useGifts } from "~/providers/giftsProvider";
import { GiftType, type Gift } from "~/services/infoService";
import { Attandance } from "~/services/userService";


export default function UserStatisticsPanel(){
    const {allUsers, reloadAllUsers} = useAllUsers();
    const {gifts} = useGifts();

    function exportAllUsersCsv(){
        const fields: string[] = [
            "first_name", 
            "last_name", 
            "attendance",
            "diet",
            "drinks",
            "mail", 
            "seating_preference",
            "giftClaims",
        ]

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent = csvContent + fields.join(",") + "\n";
        csvContent = csvContent + allUsers.map(
            (user) => {
                let row =  fields.map((field) =>{
                    if(field === "giftClaims"){
                        return user.giftClaims.map((claim) => `${claim.gift_id}:${claim.amount}`).join("/");
                    }
                    if(field === "drinks"){
                        return user[field].join("/")
                    }
                    console.log(user[field])
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

    function getGiftAvailability(gift: Gift): string{
        const allClaims = allUsers.map((user) => user.giftClaims).reduce((a, b) => [...a, ...b], []).filter((claim)=> claim.gift_id == gift.id);
        const amountReserved = allClaims.map((claim) => claim.amount).reduce((a, b) => a + b, 0);

        console.log(allUsers);
        console.log(gift, allClaims, amountReserved);

        if (gift.type == GiftType.fixPrice){
            const price_reserved = amountReserved * gift.price_euro;
            return `${gift.title.en} (${gift.amount}x${gift.price_euro}€): ${amountReserved} / ${price_reserved}€`;
        }
        if (gift.type == GiftType.openPrice){
            return `${gift.title.en}: ${amountReserved}€`;
        }
        if (gift.type == GiftType.upToPrice){
            return `${gift.title.en} (up to ${gift.price_euro}€): ${amountReserved}€`;
        }

        throw Error("")
    }
    
    return (
        <div>
            <h2 className="text-black mb-3">User Statistics</h2>
            <button onClick={reloadAllUsers} className="btn mr-3">reload users</button>
            <button onClick={exportAllUsersCsv} className="btn">export users</button>
            <div>
                <h4>attendance overview</h4>
                user-count: {allUsers.length} <br/>
                joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_join)).length} <br/>
                not joining user-count: {allUsers.filter((user) => (user.attendance==Attandance.will_not_join)).length} <br/>
                undecided user-count: {allUsers.filter((user) => (user.attendance==Attandance.undecided)).length} <br/>
                attendance not set user-count: {allUsers.filter((user) => (user.attendance===null)).length} <br/><br/>  
            </div>
            <div>
                <h4>gifts reserved overview</h4>
                {Object.entries(gifts).map(([key, value]) => <div>{key}: {getGiftAvailability(value)}</div>)}
            </div>
        </div>
    )
}