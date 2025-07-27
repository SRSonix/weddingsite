import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";

export function EmptyState({children}: {children: React.ReactNode})
{
    const navigate = useNavigate();
    const {user} = useUser();
        
    useEffect(() => {
        if (user == undefined) {
            // workaround: on the index page, the navigate might not be fully initalized
            setTimeout(() => {
                navigate("/user", { replace: true });
            }, 10); 
        }
    }, [navigate]);

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