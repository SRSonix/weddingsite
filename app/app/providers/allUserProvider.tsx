import { createContext, useContext, useEffect, useState } from "react";
import { Attandance, UserService, type User } from "~/services/userService";

type AllUsersContextType = {
    allUsers: Array<User>;
    reloadAllUsers: () => void;
}

const AllUsersContext = createContext<AllUsersContextType | undefined>(undefined);

export default function AllUsersProvider({children}: {children: React.ReactNode}){
    const [allUsers, setAllUsers] = useState<Array<User>>([]);

    useEffect(() => {
      reloadAllUsers();
    }, [])

    function reloadAllUsers(){
        UserService.getAllUsers().then(
            (allUsers) => {
                setAllUsers(allUsers || []);
                console.log(allUsers)
            }
        )
    }

    
    return (
        <AllUsersContext.Provider value={{allUsers, reloadAllUsers}}>
            {children}
        </AllUsersContext.Provider>
    )
}

export function useAllUsers () {
  const context = useContext(AllUsersContext);
  if (!context) throw new Error("useAllUsers must be used within a AllUsersProvider");
  return context;
};