import { createContext, useContext, useEffect, useState } from "react";
import { Attandance, UserService, type User } from "~/services/userService";

type AllUsersContextType = {
    allUsers: Array<User>;
}

const AllUsersContext = createContext<AllUsersContextType | undefined>(undefined);

export default function AllUsersProvider({children}: {children: React.ReactNode}){
    const [allUsers, setAllUsers] = useState<Array<User>>([]);

    useEffect(() => {
        UserService.getAllUsers().then(
            (allUsers) => {
                setAllUsers(allUsers || []);

                console.log(allUsers);
            }
        )
    }, [])

    return (
        <AllUsersContext.Provider value={{allUsers}}>
            {children}
        </AllUsersContext.Provider>
    )
}

export function useAllUsers () {
  const context = useContext(AllUsersContext);
  if (!context) throw new Error("useAllUsers must be used within a AllUsersProvider");
  return context;
};