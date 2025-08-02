import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import i18n from "i18next";
import { RsvpInformation, UserService, type Attandance, type User } from "~/services/userService";
import { AuthService } from "~/services/authService";

type UserContextType = {
  user: User | undefined | null;
  login: (token: string | null) => Promise<boolean>;
  logout: () => void;
  updateUser: (user_id: number, body: RsvpInformation) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<User| undefined | null>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

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

  function update_user(user_id: number, body: RsvpInformation){
    UserService.updateUser(user_id, body).then( 
      (new_user) => {
        if (new_user) setUser(new_user);
        else console.log("something went wrong setting new user!");
      }
    );
  }

  return (
    <UserContext.Provider value={{user, "logout": logout_reset_user, "login": login_and_fetch_user, "updateUser": update_user}}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser () {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};