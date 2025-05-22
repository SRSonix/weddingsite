// src/services/userService.ts

import { createContext } from "react";

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

      const {id, name, role } = data;
      return new User(id, name, role);
      
    } catch (error) {
      
      console.log("failed to get user");
      console.log(error);
      return undefined
    }
  }

  static async login(token: string) {
    try{
      return fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`, 
        {method: "post", body: JSON.stringify({token: token}), credentials: 'include'},
      )
    } catch (error) {
      console.log(error);
    }
  }

  static async login_and_fetch_user(token: string | null){
    console.log(`token: ${token}`)

    if (token !== null){
      await UserService.login(token)
    }

    return UserService.getUser()
  }
};