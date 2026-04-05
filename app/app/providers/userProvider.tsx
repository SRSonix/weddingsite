import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import i18n from "i18next";
import { UserContactInformation, FamilyMemberUpdate, User, UserService } from "~/services/userService";
import { AuthService } from "~/services/authService";

type UserContextType = {
  user: User | undefined | null;
  login: (token: string | null) => Promise<boolean>;
  logout: () => void;
  updateUserContact: (user_id: number, body: UserContactInformation) => void;
  updateFamilyMember: (familyMemberId: number, data: FamilyMemberUpdate) => void;
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

  function updateUserContact(user_id: number, body: UserContactInformation){
    UserService.updateUserContact(user_id, body).then(
      (new_user) => {
        if (new_user) setUser(new_user);
        else console.log("something went wrong setting new user!");
      }
    );
  }

  function updateFamilyMember(familyMemberId: number, data: FamilyMemberUpdate) {
    if (!user?.id) return;
    UserService.updateFamilyMember(user.id, familyMemberId, data).then((familyMember) => {
      if (familyMember) {
        setUser((prev) => prev ? prev.withFamilyMembers(prev.familyMembers.map((fm) => fm.id === familyMemberId ? familyMember : fm)) : prev);
      }
    });
  }

  return (
    <UserContext.Provider value={{user, "logout": logout_reset_user, "login": login_and_fetch_user, "updateUserContact": updateUserContact, updateFamilyMember, "reloadUser": fetch_user}}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser () {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
