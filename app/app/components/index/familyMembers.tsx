import { FamilyMember, FamilyMemberAdd, FamilyMemberUpdate } from "~/services/userService";
import { FamilyMemberForm } from "./familyMemberItem";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type FamilyMembersProps = {
    familyMembers: FamilyMember[];
    updateCallback: (id: number, data: FamilyMemberUpdate) => void;
    addCallback?: (data: FamilyMemberAdd) => void;
    deleteCallback?: (id: number) => void;
};

export function FamilyMembers({familyMembers, updateCallback, addCallback, deleteCallback}: FamilyMembersProps){
    const {t} = useTranslation("app");
    const [showNewMember, setShowNewMember] = useState(false);

    function submitNewMember(data: FamilyMemberUpdate){
        addCallback!(new FamilyMemberAdd(data.name, data.diet, data.type));
        setShowNewMember(false);
    }

    return <div className="flex flex-col gap-3">
        {familyMembers.map(
            (item: FamilyMember) => (
                <div key={item.id} className="bg-olive-50 border border-olive-100 rounded-lg p-4 shadow-sm">
                    <FamilyMemberForm
                        id={item.id}
                        defaultData={item.getFamilyMemberUpdate()}
                        submitChanges={(data) => updateCallback(item.id, data)}
                        deleteCallback={deleteCallback ? () => deleteCallback(item.id) : undefined}
                    />
                </div>
            )
        )}
        {addCallback && !showNewMember && (
            <button className="btn btn-small self-start" onClick={() => setShowNewMember(true)}>
                {t("add_person", "Add person")}
            </button>
        )}
        {addCallback && showNewMember && (
            <div className="bg-olive-50 border border-olive-100 rounded-lg p-4 shadow-sm">
                <p className="font-semibold text-olive-700 mb-2">{t("new_family_member", "New Family Member")}</p>
                <FamilyMemberForm
                    defaultData={FamilyMemberUpdate.getEmpty()}
                    submitChanges={submitNewMember}
                    cancelCallback={() => setShowNewMember(false)}
                />
            </div>
        )}
        {!addCallback && (
            <p className="text-sm text-olive-700 italic">
                {t("contact_couple_for_changes", "If someone is missing from your group, please contact us directly.")}
            </p>
        )}
    </div>
}
