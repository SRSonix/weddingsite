import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export enum Attandance {
  will_join = "will_join",
  will_not_join="will_not_join",
  undecided="undecided"
}

export enum Language {
  en = "en",
  de = "de",
  es = "es"
}

export class Guest {
  id: number;
  first_name: string;
  last_name: string;
  diet: string;

   constructor(
    id: number, 
    first_name: string,
    last_name: string,
    diet: string,
  ){
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.diet = diet;
  }
}

export class RsvpInformation{
  diet: string | undefined;
  mail: string | undefined;
  attendance: Attandance | undefined;
  language: string | undefined;
  arrival_date: string | undefined;
  departure_date: string | undefined;
  guests: Guest[] = [];

  constructor(
    diet: string | undefined,
    mail: string | undefined,
    attendance: Attandance | undefined,
    language: string | undefined,
    arrival_date: string | undefined,
    departure_date: string | undefined,
    guests: Guest[]
  ){
    this.diet = diet;
    this.mail = mail;
    this.attendance = attendance;
    this.language = language;
    this.arrival_date = arrival_date;
    this.departure_date = departure_date;
    this.guests = guests;
  }

  static getEmpty(){
    return new RsvpInformation(undefined, undefined, undefined, undefined, undefined, undefined, []);
  }
}

export class User extends RsvpInformation{
  id: number;
  role: string;
  first_name: string;
  last_name: string;

  constructor(
    id: number, 
    role: string, 
    first_name: string,
    last_name: string,
    diet: string | undefined,
    mail: string | undefined,
    attendance: Attandance | undefined,
    language: string | undefined,
    arrival_date: string | undefined,
    departure_date: string | undefined,
    guests: Guest[]
  ){
    super(diet, mail, attendance, language, arrival_date, departure_date, guests);
    this.id = id;
    this.role = role;
    this.first_name = first_name;
    this.last_name = last_name;

    console.log(this);
  }

    public getRsvpInformation() {
      return new RsvpInformation(this.diet, this.mail, this.attendance, this.language, this.arrival_date, this.departure_date, this.guests);
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

      const {id, role, first_name, last_name, diet, mail, attendance, language, arrival_date, departure_date, guests} = data;
      return new User(id, role, first_name, last_name, diet, mail, attendance, language, arrival_date, departure_date, guests);

    } catch (error) {
      console.log("failed to get user");
      console.log(error);
      return undefined
    }
  };

  static async createUser(body: {first_name: string, last_name: string, role: string, language: string | undefined}){
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
          const {id, role, first_name, last_name, diet, mail, attendance, language, arrival_date, departure_date, guests} = row;
          users.push(new User(id, role, first_name, last_name, diet, mail, attendance, language, arrival_date, departure_date, guests));
        }
      )
      return users
      
    } catch (error) {
      console.log("failed to get user");
      console.log(error);
      return []
    }
  }

  static async updateUser(user_id: number, body:{diet: string | undefined, mail: string | undefined, attendance: Attandance | undefined, language: string | undefined, arrival_date: string | undefined, departure_date: string | undefined}){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}`, 
        {method: "put", body: JSON.stringify(body), credentials: 'include'},
      )

      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      const {id, role, first_name, last_name, diet, mail, attendance, language, arrival_date, departure_date, guests} = data;
      return new User(id, role, first_name, last_name, diet, mail, attendance, language, arrival_date, departure_date, guests);
    }catch (error) {
      console.log("failed to get user");
      return undefined
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
  updateUser: (user_id: number, body:{diet: string | undefined, mail: string | undefined, attendance: Attandance | undefined}) => void;
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

  function update_user(user_id: number, body:{diet: string | undefined, mail: string | undefined, attendance: Attandance | undefined}){
    UserService.updateUser(user_id, body).then( 
      (new_user) => {
        if (new_user) setUser(new_user);
        else console.log("something went wrong setting new user!");
      }
    );
  }

  return (
    <UserContext.Provider value={{user, "logout": logout_update_state, "login": login_and_fetch_user, "updateUser": update_user}}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser () {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};