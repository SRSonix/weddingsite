import { Link } from "react-router";
import { useUser } from "~/providers/userProvider";

export function EmptyState({children}: {children: React.ReactNode})
{
    const {user} = useUser();

    return (
        <>
            {user === undefined ? 
            <div>
                Please log in <Link className="text-blue-600" to="/user">here</Link> to see content.
            </div>
            : children
            }
        </>
       
    )
}