import { useState } from "react"
import i18n from "i18next";
import { useUser } from "~/providers/userProvider";
import { Link } from "react-router";
import ReactCountryFlag from "react-country-flag";


export function Header() {
    const [expandNav, setexpandNav] = useState<boolean>(false);
    const {user} = useUser();

    function toggle_mobile_header(){
        setexpandNav(!expandNav);
    }

    function closeMobuleHeader(){
        setexpandNav(false);
    }

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    }

    return (
        <header className="flex flex-wrap bg-yellow-700/70 text-white p-6">
            <div className="flex-grow font-semibold mr-6"><h1 className="text-3xl text-white">Regina & Yannic &#x2764;&#xFE0F;</h1></div>
            <div className="flex mr-3 border rounded border-white text-white">
                <button onClick={() => changeLanguage('de')} className="hover:text-yellow-200 text-white px-2 h-5 pt-1">
                    <ReactCountryFlag countryCode="DE" svg style={{width: '1.5rem', height: '1.5rem'}} title="German"></ReactCountryFlag>
                </button>
                <span className="pt-[0.25rem]">|</span>
                <button onClick={() => changeLanguage('en')} className="hover:text-yellow-200 text-white px-2 h-5 pt-1">
                    <ReactCountryFlag countryCode="GB" svg style={{width: '1.5rem', height: '1.5rem'}} title="German"></ReactCountryFlag>
                </button>
                <span className="pt-[0.25rem]">|</span>
                <button onClick={() => changeLanguage('es')} className="hover:text-yellow-200 text-white px-2 h-5 pt-1">
                    <ReactCountryFlag countryCode="ES" svg style={{width: '1.5rem', height: '1.5rem'}} title="German"></ReactCountryFlag>
                </button>
                <span className="text-yellow-200 mr-2 max-lg:hidden"></span>
            </div>
            <div className="lg:hidden flex items-center">
                <button className="px-3 py-2 border rounded hover:text-yellow-200 hover:border-yellow-200 text-white border-white" onClick={toggle_mobile_header}>
                <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>
            <nav className={"w-full lg:flex lg:items-center lg:w-auto " + (!expandNav ? "max-lg:hidden " : "")}> 
                <Link to="/overview" onClick={closeMobuleHeader} className="block mr-4 lg:inline-block hover:text-yellow-200 text-white text-right mt-4 lg:mt-0">Overview</Link>
                <Link to="/getting_there" onClick={closeMobuleHeader} className="block mr-4 lg:inline-block hover:text-yellow-200 text-white text-right mt-2 lg:mt-0">Getting there</Link>
                <Link to="/traveling" onClick={closeMobuleHeader} className="block mr-4 lg:inline-block hover:text-yellow-200 text-white text-right mt-2 lg:mt-0">Traveling</Link>
                {user?.role === "ADMIN" && 
                    <Link to="/admin" onClick={closeMobuleHeader} className="block mr-4 lg:inline-block hover:text-yellow-200 text-white text-right mt-2 lg:mt-0">Admin</Link>
                }
                <Link to="/user" onClick={closeMobuleHeader} className="block mr-4 lg:inline-block hover:text-yellow-200 text-white text-right mt-2 lg:mt-0">&#x1F464; {user?.first_name || "Login"}</Link>
            </nav>
        </header>
    )
}