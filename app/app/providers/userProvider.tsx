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
  constructor(
    public first_name: string,
    public last_name: string,
    public diet: string,
  ){}
}

export class RsvpInformation{
  constructor(
    public diet: string | undefined,
    public mail: string | undefined,
    public attendance: Attandance | undefined,
    public language: string | undefined,
    public arrival_date: string | undefined,
    public departure_date: string | undefined,
    public guests: Guest[]
  ){}

  static getEmpty(){
    return new RsvpInformation(undefined, undefined, undefined, undefined, undefined, undefined, []);
  }
}

export class User extends RsvpInformation{
  constructor(
    public id: number, 
    public role: string, 
    public first_name: string,
    public last_name: string,
    diet: string | undefined,
    mail: string | undefined,
    attendance: Attandance | undefined,
    language: string | undefined,
    arrival_date: string | undefined,
    departure_date: string | undefined,
    guests: Guest[],
    public last_visit: string
  ){
    super(diet, mail, attendance, language, arrival_date, departure_date, guests);
  }

  public getRsvpInformation() {
    return new RsvpInformation(this.diet, this.mail, this.attendance, this.language, this.arrival_date, this.departure_date, this.guests);
  }
}

// TODO: move UserService to a dedicated file
export class UserService{
  static BASE_URL = `${import.meta.env.VITE_API_URL}/user`;

  static async getUser(): Promise<User | undefined>{
    try{
      const response = await fetch(`${UserService.BASE_URL}`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      return new User(data.id, data.role, data.first_name, data.last_name, data.diet, data.mail, data.attendance, data.language, data.arrival_date, data.departure_date, data.guests, data.last_visit);

    } catch (error) {
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

      let users: Array<User> = []
      data.forEach((row: any) =>
        {
          users.push(new User(row.id, row.role, row.first_name, row.last_name, row.diet, row.mail, row.attendance, row.language, row.arrival_date, row.departure_date, row.guests, row.last_visit));
        }
      )
      return users
      
    } catch (error) {
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
      return new User(data.id, data.role, data.first_name, data.last_name, data.diet, data.mail, data.attendance, data.language, data.arrival_date, data.departure_date, data.guests, data.last_visit);
    }catch (error) {
      return undefined
    }
  }
}

// TODO: move AuthService to a dedicated file
class AuthService{
  static BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

  static async login(token: string) {
    try{
      const response = await fetch(
        `${AuthService.BASE_URL}/login`, 
        {method: "post", body: JSON.stringify({token: token}), credentials: 'include'},
      )
      
      return response.ok
    } catch (error) {
      return false;
    }
  };

  static async logout() {
    try{
      return fetch(
        `${AuthService.BASE_URL}/logout`, 
        {method: "post", body: JSON.stringify({}), credentials: 'include'},
      )
    } catch (error) {}
  };
}

type UserContextType = {
  user: User | undefined;
  login: (token: string | null) => Promise<boolean>;
  logout: () => void;
  updateUser: (user_id: number, body:{diet: string | undefined, mail: string | undefined, attendance: Attandance | undefined, language: string | undefined, arrival_date: string | undefined, departure_date: string | undefined}) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<User| undefined>(undefined);
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

  function update_user(user_id: number, body:{diet: string | undefined, mail: string | undefined, attendance: Attandance | undefined, language: string | undefined, arrival_date: string | undefined, departure_date: string | undefined}){
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