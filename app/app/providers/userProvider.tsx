import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import i18n from "i18next";
import { FamilyMemberCore, RsvpInformation, User, UserService } from "~/services/userService";
import { AuthService } from "~/services/authService";

type UserContextType = {
  user: User | undefined | null;
  login: (token: string | null) => Promise<boolean>;
  logout: () => void;
  updateUserRsvp: (user_id: number, body: RsvpInformation) => void;
  addFamilyMember: (data: FamilyMemberCore) => void;
  updateFamilyMember: (familyMemberId: number, data: FamilyMemberCore) => void;
  deleteFamilyMember: (familyMemberId: number) => void;
  reloadUser: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<User| undefined | null>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    setSearchParams({});

    if (token) login_and_fetch_user(token);
    else fetch_user();
  }, []);

  useEffect(() => {
    if (user?.language != undefined) {
      i18n.changeLanguage(user.language);
    }
  }, [user])


  async function login_and_fetch_user(token: string | null){
    if (token === null) return false;

    const loginSuccess = await AuthService.login(token)

    if(!loginSuccess) return false;

    fetch_user();
    return true;
  };

  function fetch_user(){
    UserService.getUser().then(
      (newUser) => {
        setUser(newUser);
      }
    );
  }

  function logout_reset_user(){
    AuthService.logout().then(
      () => {
      setUser(undefined);
    });
  }

  function updateUserRsvp(user_id: number, body: RsvpInformation){
    UserService.updateUserRsvp(user_id, body).then(
      (new_user) => {
        if (new_user) setUser(new_user);
        else console.log("something went wrong setting new user!");
      }
    );
  }

  function addFamilyMember(data: FamilyMemberCore) {
    if (!user?.id) return;
    UserService.addFamilyMember(user.id, data).then((familyMember) => {
      if (familyMember) {
        setUser((prev) => prev ? new User(prev.id, prev.role, prev.name, prev.mail, prev.attendance, prev.language, prev.last_visit, [...prev.familyMembers, familyMember]) : prev);
      }
    });
  }

  function updateFamilyMember(familyMemberId: number, data: FamilyMemberCore) {
    if (!user?.id) return;
    UserService.updateFamilyMember(user.id, familyMemberId, data).then((familyMember) => {
      if (familyMember) {
        setUser((prev) => prev ? new User(prev.id, prev.role, prev.name, prev.mail, prev.attendance, prev.language, prev.last_visit, prev.familyMembers.map((fm) => fm.id === familyMemberId ? familyMember : fm)) : prev);
      }
    });
  }

  function deleteFamilyMember(familyMemberId: number) {
    if (!user?.id) return;
    UserService.deleteFamilyMember(user.id, familyMemberId).then((success) => {
      if (success) {
        setUser((prev) => prev ? new User(prev.id, prev.role, prev.name, prev.mail, prev.attendance, prev.language, prev.last_visit, prev.familyMembers.filter((fm) => fm.id !== familyMemberId)) : prev);
      }
    });
  }

  return (
    <UserContext.Provider value={{user, "logout": logout_reset_user, "login": login_and_fetch_user, "updateUserRsvp": updateUserRsvp, addFamilyMember, updateFamilyMember, deleteFamilyMember, "reloadUser": fetch_user}}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser () {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};