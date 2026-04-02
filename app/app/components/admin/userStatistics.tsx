import { useAllUsers } from "~/providers/allUserProvider";
import { Attandance, InvitedBy, User } from "~/services/userService";

const INVITED_BY_COLS = [
    { key: "total",          label: "Total" },
    { key: InvitedBy.both,   label: "Both" },
    { key: InvitedBy.groom,  label: "Groom" },
    { key: InvitedBy.bride,  label: "Bride" },
] as const;

const ATTENDANCE_ROWS = [
    { key: "total",                    label: "Total" },
    { key: null,                       label: "Not set" },
    { key: Attandance.undecided,       label: "Unknown" },
    { key: Attandance.will_join,       label: "Coming" },
    { key: Attandance.will_not_join,   label: "Not coming" },
] as const;

type ColKey = typeof INVITED_BY_COLS[number]["key"];
type RowKey = typeof ATTENDANCE_ROWS[number]["key"];

function matchesCol(user: User, col: ColKey): boolean {
    if (col === "total") return true;
    return user.invited_by === col;
}

function matchesRow(user: User, row: RowKey): boolean {
    if (row === "total") return true;
    if (row === null) return user.attendance == null;
    return user.attendance === row;
}

function countUsers(users: User[], row: RowKey, col: ColKey): number {
    return users.filter(u => matchesRow(u, row) && matchesCol(u, col)).length;
}

function countFamilyMembers(users: User[], row: RowKey, col: ColKey): number {
    return users
        .filter(u => matchesRow(u, row) && matchesCol(u, col))
        .reduce((sum, u) => sum + u.familyMembers.length, 0);
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
                        <tr key={String(row.key)}>
                            <td className="border border-gray-400 px-3 py-1 font-medium bg-gray-50">{row.label}</td>
                            {INVITED_BY_COLS.map(col => (
                                <td key={col.key} className="border border-gray-400 px-3 py-1 text-center">
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
                    title="Users by attendance and invited by"
                    getValue={(row, col) => countUsers(allUsers, row, col)}
                />
                <StatsTable
                    title="Family members by attendance and invited by"
                    getValue={(row, col) => countFamilyMembers(allUsers, row, col)}
                />
            </div>
        </div>
    );
}
