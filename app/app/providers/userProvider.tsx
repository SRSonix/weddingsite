import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export class User {
  id: number | undefined;
  role: string;
  first_name: string;
  last_name: string;
  diet: string;
  mail: string;
  attendance: string;

  constructor(
    id: number | undefined, 
    role: string, 
    first_name: string,
    last_name: string,
    diet: string,
    mail: string,
    attendance: string,
  ){
    this.id = id;
    this.role = role;
    this.first_name = first_name;
    this.last_name = last_name;
    this.diet = diet;
    this.mail = mail;
    this.attendance = attendance;
  }
}


export class UserService{
  static BASE_URL = `${import.meta.env.VITE_API_URL}/user`;

  static async getUser(): Promise<User | undefined>{
    try{
      const response = await fetch(`${UserService.BASE_URL}`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      const {id, role, first_name, last_name, diet, mail, attendance} = data;
      return new User(id, role, first_name, last_name, diet, mail, attendance);
      
    } catch (error) {
      console.log("failed to get user");
      console.log(error);
      return undefined
    }
  };

  static async createUser(body: {first_name: string, last_name: string, role: string}){
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

  static async getAllUsers(){
    try{
      const response = await fetch(`${UserService.BASE_URL}s`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return [];
      }

      console.log(data)

      let users: Array<User> = []
      data.forEach((row: User) =>
        {
          const {id, role, first_name, last_name, diet, mail, attendance} = row;
          users.push(new User(id, role, first_name, last_name, diet, mail, attendance));
        }
      )
      return users
      
    } catch (error) {
      console.log("failed to get user");
      console.log(error);
      return []
    }
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