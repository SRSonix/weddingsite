import { createContext, useContext, useEffect, useState } from "react";
import { FamilyMemberAdd, FamilyMemberUpdate, UserUpdateInfo, UserService, type User } from "~/services/userService";

type AllUsersContextType = {
    allUsers: Array<User>;
    reloadAllUsers: () => void;
    updateUser: (user_id: number, userUpdateInfo: UserUpdateInfo) => void;
    deleteUser: (user_id: number) => void;
    addFamilyMember: (user_id: number, data: FamilyMemberAdd) => void;
    updateFamilyMember: (user_id: number, familyMemberId: number, data: FamilyMemberUpdate) => void;
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

    function updateUser(user_id: number, userUpdateInfo: UserUpdateInfo): void{
        UserService.updateUser(user_id, userUpdateInfo).then(
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


    function addFamilyMember(user_id: number, data: FamilyMemberAdd){
        console.log(data);
        UserService.addFamilyMember(user_id, data).then(
            (familyMember) => {
                if (familyMember) {
                    setAllUsers(prev => prev.map((user) =>
                        user.id === user_id
                            ? user.withFamilyMembers([...user.familyMembers, familyMember])
                            : user
                    ));
                }
            }
        )
    }


    function updateFamilyMember(user_id: number, familyMemberId: number, data: FamilyMemberUpdate){
        UserService.updateFamilyMember(user_id, familyMemberId, data).then(
            (familyMember) => {
                if (familyMember) {
                    setAllUsers(prev => prev.map((user) =>
                        user.id === user_id
                            ? user.withFamilyMembers(user.familyMembers.map((fm) => fm.id === familyMemberId ? familyMember : fm))
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
                            ? user.withFamilyMembers(user.familyMembers.filter((fm) => fm.id !== familyMemberId))
                            : user
                    ));
                }
            }
        )
    }


    return (
        <AllUsersContext.Provider value={{allUsers, reloadAllUsers, updateUser, deleteUser, addFamilyMember, updateFamilyMember, deleteFamilyMember}}>
            {children}
        </AllUsersContext.Provider>
    )
}

export function useAllUsers () {
  const context = useContext(AllUsersContext);
  if (!context) throw new Error("useAllUsers must be used within a AllUsersProvider");
  return context;
};
