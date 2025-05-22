// src/services/userService.ts

import { createContext } from "react";

export class User {
  id: number;
  username: string;

  constructor(id: number, username: string){
    this.id = id;
    this.username = username;
  }
}




export class UserService  {
  static BASE_URL = `${import.meta.env.VITE_API_URL}/users`;
  static userContext = createContext<User|undefined>(undefined);

  static async getUser(): Promise<User | undefined>{
    try{
      const response = await fetch(`${this.BASE_URL}`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      const {id, name } = data;
      return new User(id, name);
      
    } catch (error) {
      
      console.log("failed to get user");
      console.log(error);
      return undefined
    }
  }

  static async login(user_id: string, token: string) {
    try{
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`, 
        {method: "post", body: JSON.stringify({ user_id: user_id, token: token}), credentials: 'include'},
      )
      const data = await response.json()      
    } catch (error) {
      console.log(error);
    }
  }

  static async login_and_fetch_user(id: string | null, token: string | null){
    console.log(`id/token: ${id}/${token}`)

    if (id !== null && token !== null){
      console.log("login try");  
      await UserService.login(id, token)
    }

    return UserService.getUser()
  }
};