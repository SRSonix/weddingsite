import { useContext, useState } from "react"
import { UserService } from "~/services/userService";


export function Header() {
    const [expandNav, setexpandNav] = useState<boolean>(false);
    const user = useContext(UserService.userContext)

    function toggle_mobile_header(){
        setexpandNav(!expandNav);
    }

    return (
        <header className="flex flex-wrap bg-yellow-700/70 text-white  p-6">
            <div className="flex-grow font-semibold mr-6"><h1 className="text-3xl">Regina & Yannic ❤</h1></div>
            <div className="lg:hidden block">
                <button className="px-3 py-2 border rounded text-yellow-200 border-yellow-200 hover:text-white hover:border-white" onClick={toggle_mobile_header}>
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>
            <nav className={"w-full lg:flex lg:items-center lg:w-auto " + (!expandNav ? "max-lg:hidden " : "")}> 
                <a href="/overview" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-4 lg:mt-0">Overview</a>
                <a href="/getting_there" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">Getting there</a>
                <a href="/traveling" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">Traveling</a>
                {user?.role === "ADMIN" && 
                    <a href="/admin" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">Admin</a>
                }
                <a href={user ? "/user" : "/login"} className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">🌝 {user?.username || "User"}</a>
            </nav>
        </header>
    )
}