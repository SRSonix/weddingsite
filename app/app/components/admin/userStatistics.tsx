import { useAllUsers } from "~/providers/allUserProvider";
import { Attandance, FamilyMember, FamilyMemberType, InvitedBy, User } from "~/services/userService";

const INVITED_BY_COLS = [
    { key: "total",          label: "Total" },
    { key: InvitedBy.both,   label: "Both" },
    { key: InvitedBy.groom,  label: "Groom" },
    { key: InvitedBy.bride,  label: "Bride" },
] as const;

const ATTENDANCE_ROWS = [
    { key: null,                           label: "Not set",               sub: true  },
    { key: Attandance.undecided,           label: "Undecided",             sub: true  },
    { key: Attandance.will_join,           label: "Coming",                sub: true  },
    { key: "total_excl_not_coming",        label: "Total excl. not coming", sub: false },
    { key: Attandance.will_not_join,       label: "Not coming",            sub: false },
] as const;

type ColKey = typeof INVITED_BY_COLS[number]["key"];
type RowKey = typeof ATTENDANCE_ROWS[number]["key"];
type AttendanceField = "attendance" | "brunch_attendance";

function matchesCol(user: User, col: ColKey): boolean {
    if (col === "total") return true;
    return user.invited_by === col;
}

function matchesRow(fm: FamilyMember, row: RowKey, field: AttendanceField): boolean {
    const value = fm[field];
    if (row === "total_excl_not_coming") return value !== Attandance.will_not_join;
    if (row === null) return value == null;
    return value === row;
}

function countFamilyMembers(users: User[], row: RowKey, col: ColKey, field: AttendanceField, type?: FamilyMemberType): number {
    return users
        .filter(u => matchesCol(u, col))
        .flatMap(u => u.familyMembers.filter(fm => type === undefined || fm.type === type))
        .filter(fm => matchesRow(fm, row, field))
        .length;
}

function StatsTable({ title, getValue }: { title: string; getValue: (row: RowKey, col: ColKey) => number }) {
    return (
        <div className="mb-6">
            <h4 className="font-semibold mb-2">{title}</h4>
            <table className="border-collapse text-sm">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-3 py-1 bg-gray-100"></th>
                        {INVITED_BY_COLS.map(col => (
                            <th key={col.key} className="border border-gray-400 px-3 py-1 bg-gray-100">{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {ATTENDANCE_ROWS.map(row => (
                        <tr key={String(row.key)} className={!row.sub ? "border-t-2 border-gray-400" : ""}>
                            <td className={"border border-gray-400 py-1 font-medium bg-gray-50 " + (row.sub ? "px-5 text-gray-500" : "px-3 font-semibold")}>
                                {row.label}
                            </td>
                            {INVITED_BY_COLS.map(col => (
                                <td key={col.key} className={"border border-gray-400 px-3 py-1 text-center " + (row.sub ? "text-gray-500" : "font-semibold")}>
                                    {getValue(row.key, col.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const MEMBER_TYPE_TABLES = [
    { type: FamilyMemberType.adult,  label: "Adults" },
    { type: FamilyMemberType.child,  label: "Children" },
    { type: FamilyMemberType.infant, label: "Infants" },
] as const;

export default function UserStatisticsPanel() {
    const { allUsers } = useAllUsers();

    return (
        <div>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3">Wedding</h3>
                {MEMBER_TYPE_TABLES.map(({type, label}) => (
                    <StatsTable
                        key={`wedding-${type}`}
                        title={`${label} Statistic`}
                        getValue={(row, col) => countFamilyMembers(allUsers, row, col, "attendance", type)}
                    />
                ))}
                <h3 className="text-lg font-semibold mb-3 mt-8">Brunch</h3>
                {MEMBER_TYPE_TABLES.map(({type, label}) => (
                    <StatsTable
                        key={`brunch-${type}`}
                        title={`${label} Statistic`}
                        getValue={(row, col) => countFamilyMembers(allUsers, row, col, "brunch_attendance", type)}
                    />
                ))}
            </div>
        </div>
    );
}
