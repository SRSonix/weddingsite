import { createContext, useContext, useEffect, useState } from "react";
import { UserCoreInfo, UserService, type User } from "~/services/userService";

type AllUsersContextType = {
    allUsers: Array<User>;
    reloadAllUsers: () => void;
    updateUserCoreInfo: (user_id: number, userCoreInfo: UserCoreInfo) => void;
    deleteUser: (user_id: number) => void;
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
            }
        )
    }

    function updateUserCoreInfo(user_id: number, userCoreInfo: UserCoreInfo){
        UserService.updateUserCoreInfo(user_id, userCoreInfo).then(
            (user) => {
                if (user) setAllUsers(prev => {
                    const index = prev.findIndex((user) => user.id === user_id);
                    const newArray = [...prev];
                    newArray[index] = user;
                    return newArray;
                });
            }
        )
    }

    function deleteUser(user_id: number){
        UserService.deleteUser(user_id).then(
            (success) => {
                if (success) setAllUsers(prev => {
                    const index = prev.findIndex((user) => user.id === user_id);
                    const newArray = [...prev];
                    newArray.splice(index, 1);
                    return newArray;
                });
            }
        )
    }
    
    return (
        <AllUsersContext.Provider value={{allUsers, reloadAllUsers, updateUserCoreInfo, deleteUser}}>
            {children}
        </AllUsersContext.Provider>
    )
}

export function useAllUsers () {
  const context = useContext(AllUsersContext);
  if (!context) throw new Error("useAllUsers must be used within a AllUsersProvider");
  return context;
};