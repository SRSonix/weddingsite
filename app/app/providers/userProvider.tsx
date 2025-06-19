import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export class User {
  id: number;
  username: string;
  role: string;

  constructor(id: number, username: string, role: string){
    this.id = id;
    this.username = username;
    this.role = role;
  }
}

const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

async function getUser(): Promise<User | undefined>{
  try{
    const response = await fetch(`${BASE_URL}`, {method: "get", credentials: 'include'})
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
}

async function login(token: string) {
  try{
    return fetch(
      `${import.meta.env.VITE_API_URL}/auth/login`, 
      {method: "post", body: JSON.stringify({token: token}), credentials: 'include'},
    )
  } catch (error) {
    console.log(error);
  }
};

async function logout() {
  try{
    return fetch(
      `${import.meta.env.VITE_API_URL}/auth/logout`, 
      {method: "post", body: JSON.stringify({}), credentials: 'include'},
    )
  } catch (error) {
    console.log(error);
  }
};



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
      login(token).then(
        () => {
          getUser().then(
            (newUser) => {
              console.log("setting user to "+newUser)
              setUser(newUser);
            }
          )
        }
      )
    }
    else {
      getUser().then(
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
    logout().then(
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