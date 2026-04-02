import { useAllUsers } from "~/providers/allUserProvider";
import { Attandance, InvitedBy, User } from "~/services/userService";

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

function matchesCol(user: User, col: ColKey): boolean {
    if (col === "total") return true;
    return user.invited_by === col;
}

function matchesRow(user: User, row: RowKey): boolean {
    if (row === "total_excl_not_coming") return user.attendance !== Attandance.will_not_join;
    if (row === null) return user.attendance == null;
    return user.attendance === row;
}

function countUsers(users: User[], row: RowKey, col: ColKey): number {
    return users.filter(u => matchesRow(u, row) && matchesCol(u, col)).length;
}

function countFamilyMembers(users: User[], row: RowKey, col: ColKey, is_child?: boolean): number {
    return users
        .filter(u => matchesRow(u, row) && matchesCol(u, col))
        .reduce((sum, u) => sum + u.familyMembers.filter(fm => is_child === undefined || fm.is_child === is_child).length, 0);
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

export default function UserStatisticsPanel() {
    const { allUsers } = useAllUsers();

    return (
        <div>
            <div className="mt-4">
                <StatsTable
                    title="User Statistic"
                    getValue={(row, col) => countUsers(allUsers, row, col)}
                />
                <StatsTable
                    title="Adults Statistic"
                    getValue={(row, col) => countFamilyMembers(allUsers, row, col, false)}
                />
                <StatsTable
                    title="Children Statistic"
                    getValue={(row, col) => countFamilyMembers(allUsers, row, col, true)}
                />
            </div>
        </div>
    );
}
