import { Link } from "react-router";

export function EmptyState()
{
    return (
        <div>
            Please log in <Link to="/user">here</Link> to see content.
        </div>
    )
}