import { createContext, useContext, useEffect, useState } from "react";
import { FamilyMember, FamilyMemberCore, UserCoreInfo, UserService, type User } from "~/services/userService";

type AllUsersContextType = {
    allUsers: Array<User>;
    reloadAllUsers: () => void;
    updateUserCoreInfo: (user_id: number, userCoreInfo: UserCoreInfo) => void;
    deleteUser: (user_id: number) => void;
    addFamilyMember: (user_id: number, data: FamilyMemberCore) => void;
    updateFamilyMember: (user_id: number, familyMemberId: number, data: FamilyMemberCore) => void;
    deleteFamilyMember: (user_id: number, familyMemberId: number) => void;
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

    function updateUserCoreInfo(user_id: number, userCoreInfo: UserCoreInfo): void{
        UserService.updateUserCoreInfo(user_id, userCoreInfo).then(
            (user) => {
                if (user){ 
                    setAllUsers(prev => {
                        const index = prev.findIndex((user) => user.id === user_id);
                        const newArray = [...prev];
                        newArray[index] = user;
                        return newArray;
                    });
                }
            }
        )
    }

    function deleteUser(user_id: number){
        UserService.deleteUser(user_id).then(
            (success) => {
                if (success) {
                    setAllUsers(prev => {
                        const index = prev.findIndex((user) => user.id === user_id);
                        const newArray = [...prev];
                        newArray.splice(index, 1);
                        return newArray;
                    });
                }
            }
        )
    }
    

    function addFamilyMember(user_id: number, data: FamilyMemberCore){
        console.log(data);
        UserService.addFamilyMember(user_id, data).then(
            (familyMember) => {
                if (familyMember) {
                    setAllUsers(prev => prev.map((user) =>
                        user.id === user_id
                            ? {...user, familyMembers: [...user.familyMembers, familyMember]}
                            : user
                    ));
                }
            }
        )
    }


    function updateFamilyMember(user_id: number, familyMemberId: number, data: FamilyMemberCore){
        UserService.updateFamilyMember(user_id, familyMemberId, data).then(
            (familyMember) => {
                if (familyMember) {
                    setAllUsers(prev => prev.map((user) =>
                        user.id === user_id
                            ? {...user, familyMembers: user.familyMembers.map((fm) => fm.id === familyMemberId ? familyMember : fm)}
                            : user
                    ));
                }
            }
        )
    }


    function deleteFamilyMember(user_id: number, familyMemberId: number){
        UserService.deleteFamilyMember(user_id, familyMemberId).then(
            (success) => {
                console.log(success);
                if (success) {
                    setAllUsers(prev => prev.map((user) =>
                        user.id === user_id
                            ? {...user, familyMembers: user.familyMembers.filter((fm) => fm.id !== familyMemberId)}
                            : user
                    ));
                }
            }
        )
    }


    return (
        <AllUsersContext.Provider value={{allUsers, reloadAllUsers, updateUserCoreInfo, deleteUser, addFamilyMember, updateFamilyMember, deleteFamilyMember}}>
            {children}
        </AllUsersContext.Provider>
    )
}

export function useAllUsers () {
  const context = useContext(AllUsersContext);
  if (!context) throw new Error("useAllUsers must be used within a AllUsersProvider");
  return context;
};
