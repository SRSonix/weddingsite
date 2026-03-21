import { FamilyMember, FamilyMemberCore } from "~/services/userService";
import { FamilyMemberForm, FamilyMemberItem } from "./familyMemberItem";
import { useState } from "react";

export function FamilyMembers({user_id, familyMembers, addCallback, updateCallback, deleteCallback}: {user_id: number, familyMembers: FamilyMember[],  addCallback: (data: FamilyMemberCore) => void, updateCallback: (id: number, data: FamilyMemberCore) => void, deleteCallback: (id: number) => void}){
    const [showNewMember, setShowNewMember] = useState(false);

    function addFamilyMember(coreData: FamilyMemberCore){
        addCallback(coreData);
        setShowNewMember(false);
    }

    return <div className="border-1 border-dashed">
        {familyMembers.map(
            (item: FamilyMember) => (<FamilyMemberItem updateCallback={updateCallback} deleteCallback={deleteCallback} familyMember={item}></FamilyMemberItem>)
        )}
        {!showNewMember && <button className="btn btn-small" onClick={()=>setShowNewMember(true)}>add person</button>}
        {showNewMember && <div>
                <p>New Family Member</p>
                <FamilyMemberForm id={undefined} defaultData={new FamilyMemberCore(undefined, "", undefined)} submitChanges={addFamilyMember} cancelCallback={()=>setShowNewMember(false)}></FamilyMemberForm>
        </div>}
    </div>
}