import { useEffect } from "react";
import { useNavigate } from "react-router";



export default function index(){
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(()=>navigate("/overview", { replace: true }), 10);
    }, [navigate]);

    return <></>
}