import { useState } from "react";
import { useAllUsers } from "~/providers/allUserProvider";
import { Attandance, FamilyMemberType } from "~/services/userService";
import type { FamilyMember, User } from "~/services/userService";

type MemberEntry = { user: User; member: FamilyMember };

const VEGAN_VARIANTS        = new Set(["vegan", "vegans"]);
const VEGETARIAN_VARIANTS   = new Set(["vegetarian", "vegetarisch", "vegetarier"]);
const NONE_VARIANTS         = new Set(["no allergies/preferences", "esse alles", "keine"]);

const NONE_KEY = "__none__";

function getCanonical(lower: string): string {
    if (VEGAN_VARIANTS.has(lower))      return "Vegan";
    if (VEGETARIAN_VARIANTS.has(lower)) return "Vegetarian";
    if (NONE_VARIANTS.has(lower))       return NONE_KEY;
    return lower;
}


export default function AllergyOverview() {
    const { allUsers } = useAllUsers();
    const [expanded, setExpanded] = useState<string | null>(null);

    const allergyMap = new Map<string, MemberEntry[]>();

    for (const user of allUsers) {
        for (const member of user.familyMembers) {
            const raw = member.diet?.trim().toLowerCase();
            if (!raw) continue;

            const canonical = getCanonical(raw);
            if (!allergyMap.has(canonical)) allergyMap.set(canonical, []);
            allergyMap.get(canonical)!.push({ user, member });
        }
    }

    const mainEntries: Array<{ canonical: string; members: MemberEntry[] }> = [];
    let noneEntry: { members: MemberEntry[] } | null = null;

    for (const [canonical, members] of allergyMap.entries()) {
        if (canonical === NONE_KEY) {
            noneEntry = { members };
        } else {
            mainEntries.push({ canonical, members });
        }
    }

    mainEntries.sort((a, b) => b.members.length - a.members.length);

    if (mainEntries.length === 0 && !noneEntry) {
        return <p className="text-sm text-gray-500">No allergy / diet entries found.</p>;
    }

    const attendanceLabel: Record<Attandance, string> = {
        [Attandance.will_join]:     "✓ coming",
        [Attandance.will_not_join]: "✗ not coming",
        [Attandance.undecided]:     "? undecided",
    };

    const typeLabel: Record<FamilyMemberType, string> = {
        [FamilyMemberType.adult]:  "adult",
        [FamilyMemberType.child]:  "child",
        [FamilyMemberType.infant]: "infant",
    };

    const counts = (members: MemberEntry[]) => ({
        adults:   members.filter(m => m.member.type === FamilyMemberType.adult).length,
        children: members.filter(m => m.member.type === FamilyMemberType.child).length,
        infants:  members.filter(m => m.member.type === FamilyMemberType.infant).length,
    });

    const renderCounts = (members: MemberEntry[]) => {
        const { adults, children, infants } = counts(members);
        return (
            <span className="flex gap-1 text-xs">
                <span className="btn btn-small btn-gray">{adults}a</span>
                <span className="btn btn-small btn-gray">{children}c</span>
                <span className="btn btn-small btn-gray">{infants}i</span>
            </span>
        );
    };

    const renderMemberList = (members: MemberEntry[]) => (
        <ul className="mt-2 text-sm text-gray-700 space-y-1 border-t border-olive-100 pt-2">
            {members.map(({ user, member }) => {
                const raw = member.diet?.trim().toLowerCase() ?? "";
                return (
                    <li key={`${user.id}-${member.id}`} className="flex gap-2 items-baseline flex-wrap">
                        <span className="text-gray-500">{user.name}</span>
                        <span className="text-gray-400">→</span>
                        <span>{member.name}</span>
                        {member.type != null && (
                            <span className="text-xs text-gray-400">{typeLabel[member.type]}</span>
                        )}
                        {member.attendance != null && (
                            <span className="text-xs text-gray-400">{attendanceLabel[member.attendance]}</span>
                        )}
                        {raw && (
                            <span className="text-gray-400 text-xs italic">"{raw}"</span>
                        )}
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div className="space-y-2">
            {mainEntries.map(({ canonical, members }) => (
                <div key={canonical} className="border border-olive-100 rounded-lg bg-olive-50">
                    <button
                        className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
                        onClick={() => setExpanded(prev => prev === canonical ? null : canonical)}
                    >
                        <span className="flex-grow font-medium">{canonical}</span>
                        {renderCounts(members)}
                    </button>
                    {expanded === canonical && <div className="px-3 pb-3">{renderMemberList(members)}</div>}
                </div>
            ))}

            {noneEntry && (
                <>
                    {mainEntries.length > 0 && <div className="border-t border-gray-200 my-1" />}
                    <div className="border border-gray-200 rounded-lg bg-gray-50">
                        <button
                            className="w-full flex items-center gap-3 p-3 text-left cursor-pointer"
                            onClick={() => setExpanded(prev => prev === NONE_KEY ? null : NONE_KEY)}
                        >
                            <span className="flex-grow font-medium text-gray-400 italic">No allergies / preferences</span>
                            {renderCounts(noneEntry.members)}
                        </button>
                        {expanded === NONE_KEY && <div className="px-3 pb-3">{renderMemberList(noneEntry.members)}</div>}
                    </div>
                </>
            )}
        </div>
    );
}
