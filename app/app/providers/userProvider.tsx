import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export class User {
  id: number | undefined;
  username: string;
  role: string;

  constructor(id: number | undefined, username: string, role: string){
    this.id = id;
    this.username = username;
    this.role = role;
  }
}


export class UserService{
  static BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

  static async getUser(): Promise<User | undefined>{
    try{
      const response = await fetch(`${UserService.BASE_URL}`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      const {id, name, role } = data;
      return new User(id, name, role);
      
    } catch (error) {
      console.log("failed to get user");
      console.log(error);
      return undefined
    }
  };

  static async createUser(body: {user_name: string, role: string}){
    try{
      const response = await fetch(
        `${UserService.BASE_URL}`, 
        {method: "post", body: JSON.stringify(body), credentials: 'include'},
      )

      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      const {token} = data;

      return token

    }catch (error) {
      console.log("failed to get user");
      return undefined
    }
  }

  static async showUsers(){

  }
}

class AuthService{
  static BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

  static async login(token: string) {
    try{
      return fetch(
        `${AuthService.BASE_URL}/login`, 
        {method: "post", body: JSON.stringify({token: token}), credentials: 'include'},
      )
    } catch (error) {
      console.log(error);
    }
  };

  static async logout() {
    try{
      return fetch(
        `${AuthService.BASE_URL}/logout`, 
        {method: "post", body: JSON.stringify({}), credentials: 'include'},
      )
    } catch (error) {
      console.log(error);
    }
  };
}

type UserContextType = {
  user: User | undefined;
  login: (token: string | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<User| undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  function login_and_fetch_user(token: string | null){
    console.log(`token: ${token}`)

    if (token !== null){
      AuthService.login(token).then(
        () => {
          UserService.getUser().then(
            (newUser) => {
              console.log("setting user to "+newUser)
              setUser(newUser);
            }
          )
        }
      )
    }
    else {
      UserService.getUser().then(
        (newUser) => {
          console.log("setting user to "+newUser)
          setUser(newUser);
        }
      )
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    setSearchParams({});

    login_and_fetch_user(token);
  }, []);

  function logout_update_state(){
    AuthService.logout().then(
      () => {
      console.log("logged out!")
      setUser(undefined);
    });
  }

  return (
    <UserContext.Provider value={{user, "logout": logout_update_state, "login": login_and_fetch_user}}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser () {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};