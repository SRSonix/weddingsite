import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";

export function EmptyState({children}: {children: React.ReactNode})
{
    const navigate = useNavigate();
    const {user} = useUser();
        
    useEffect(() => {
        if (user == undefined) {
            navigate("/user", { replace: true });
        }
    }, [navigate, user]);

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