import { FamilyMember, FamilyMemberCore } from "~/services/userService";
import { FamilyMemberForm, FamilyMemberItem } from "./familyMemberItem";
import { useState } from "react";

export function FamilyMembers({user_id, familyMembers, addCallback, updateCallback, deleteCallback}: {user_id: number, familyMembers: FamilyMember[],  addCallback: (data: FamilyMemberCore) => void, updateCallback: (id: number, data: FamilyMemberCore) => void, deleteCallback: (id: number) => void}){
    const [showNewMember, setShowNewMember] = useState(false);

    function addFamilyMember(coreData: FamilyMemberCore){
        addCallback(coreData);
        setShowNewMember(false);
    }

    return <div className="flex flex-col gap-3">
        {familyMembers.map(
            (item: FamilyMember) => (<FamilyMemberItem key={item.id} updateCallback={updateCallback} deleteCallback={deleteCallback} familyMember={item}></FamilyMemberItem>)
        )}
        {!showNewMember && <button className="btn btn-small self-start" onClick={()=>setShowNewMember(true)}>add person</button>}
        {showNewMember && (
            <div className="bg-olive-50 border border-olive-100 rounded-lg p-4 shadow-sm">
                <p className="font-semibold text-olive-700 mb-2">New Family Member</p>
                <FamilyMemberForm id={undefined} defaultData={FamilyMemberCore.getEmpty()} submitChanges={addFamilyMember} cancelCallback={()=>setShowNewMember(false)}></FamilyMemberForm>
            </div>
        )}
    </div>
}