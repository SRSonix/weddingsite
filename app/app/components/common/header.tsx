import { useState } from "react"
import i18n from "i18next";
import { useUser } from "~/providers/userProvider";
import { Link } from "react-router";


export function Header() {
    const [expandNav, setexpandNav] = useState<boolean>(false);
    const {user} = useUser();

    function toggle_mobile_header(){
        setexpandNav(!expandNav);
    }

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    }

    return (
        <header className="flex flex-wrap bg-yellow-700/70 text-white p-6">
            <div className="flex-grow font-semibold mr-6"><h1 className="text-3xl">Regina & Yannic ❤</h1></div>
            <div className="flex items-center">
                <button onClick={() => changeLanguage('de')} className="text-yellow-200 hover:text-white mr-2">de</button>
                <button onClick={() => changeLanguage('en')} className="text-yellow-200 hover:text-white mr-2">en</button>
                <button onClick={() => changeLanguage('esp')} className="text-yellow-200 hover:text-white mr-2">esp</button>
                <span className="text-yellow-200 mr-2 max-lg:hidden">|</span>
            </div>
            <div className="lg:hidden flex items-center ">
                <button className="px-3 py-2 border rounded text-yellow-200 border-yellow-200 hover:text-white hover:border-white" onClick={toggle_mobile_header}>
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>
            <nav className={"w-full lg:flex lg:items-center lg:w-auto " + (!expandNav ? "max-lg:hidden " : "")}> 
                <Link to="/overview" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-4 lg:mt-0">Overview</Link>
                <Link to="/getting_there" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">Getting there</Link>
                <Link to="/traveling" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">Traveling</Link>
                {user?.role === "ADMIN" && 
                    <Link to="/admin" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">Admin</Link>
                }
                <Link to="/user" className="block mr-4 lg:inline-block text-yellow-200 hover:text-white text-right mt-2 lg:mt-0">🌝 {user?.first_name || "Login"}</Link>
            </nav>
        </header>
    )
}