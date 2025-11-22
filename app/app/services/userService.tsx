import type { Gift } from "./infoService";

export enum Attandance {
  will_join = "will_join",
  will_not_join="will_not_join",
  undecided="undecided"
}

export enum Role {
  user = "USER",
  admin = "ADMIN"
}

export enum Language {
  en = "en",
  de = "de",
  es = "es"
}

export enum Drink {
  white_wine = "white_wine",
  red_wine = "red_wine",
  beer = "beer",
  cocktail = "cocktail",
  non_alcoholic = "non_alcoholic",
}

export interface GiftClaim{
  gift_id: number,
  amount: number
}

export class RsvpInformation{
  constructor(
    public diet: string | undefined,
    public drinks: Drink[],
    public mail: string | undefined,
    public attendance: Attandance | undefined,
    public language: string | undefined,
    public arrival_date: string | undefined,
    public departure_date: string | undefined,
    public seating_preference: string | undefined,
  ){}

  static getEmpty(){
    return new RsvpInformation(undefined, [], undefined, undefined, undefined, undefined, undefined, undefined);
  }
}

export class UserCoreInfo{
  constructor(
    public role: string | undefined, 
    public first_name: string | undefined,
    public last_name: string | undefined){}

  static getEmpty(){
    return new UserCoreInfo(undefined, undefined, undefined);
  }
}

export class User extends RsvpInformation{
  constructor(
    public id: number, 
    public role: string, 
    public first_name: string,
    public last_name: string,
    diet: string | undefined,
    drinks: Drink[],
    mail: string | undefined,
    attendance: Attandance | undefined,
    language: string | undefined,
    arrival_date: string | undefined,
    departure_date: string | undefined,
    seating_preference: string | undefined,
    public last_visit: string,
    public giftClaims: GiftClaim[]
  ){
    super(diet, drinks, mail, attendance, language, arrival_date, departure_date, seating_preference);
  }

  public getRsvpInformation() {
    return new RsvpInformation(this.diet, this.drinks, this.mail, this.attendance, this.language, this.arrival_date, this.departure_date, this.seating_preference);
  }
}

export class UserService{
  static BASE_URL = `${import.meta.env.VITE_API_URL}/user`;

  static async getUser(): Promise<User | null>{
    try{
      const response = await fetch(`${UserService.BASE_URL}`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return null;
      }

      return new User(data.id, data.role, data.first_name, data.last_name, data.diet, data.drinks, data.mail, data.attendance, data.language, data.arrival_date, data.departure_date, data.seating_preference, data.last_visit, data.gift_claims);

    } catch (error) {
      return null
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
          users.push(new User(row.id, row.role, row.first_name, row.last_name, row.diet, row.drinks, row.mail, row.attendance, row.language, row.arrival_date, row.departure_date, row.seating_preference, row.last_visit, row.gift_claims));
        }
      )
      return users
      
    } catch (error) {
      return []
    }
  }

  static async updateUserRsvp(user_id: number, body:RsvpInformation){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}/rsvp`, 
        {method: "put", body: JSON.stringify(body), credentials: 'include'},
      )

      const data = await response.json()

      if (!response.ok){
        return undefined;
      }
      return new User(data.id, data.role, data.first_name, data.last_name, data.diet, data.drinks, data.mail, data.attendance, data.language, data.arrival_date, data.departure_date, data.seating_preference, data.last_visit, data.gift_claims);
    }catch (error) {
      return undefined
    }
  }

  static async updateUserCoreInfo(user_id: number, body:UserCoreInfo){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}/core_info`,
        {method: "put", body: JSON.stringify(body), credentials: 'include'},
      )

      const data = await response.json()

      if (!response.ok){
        return undefined;
      }
      return new User(data.id, data.role, data.first_name, data.last_name, data.diet, data.drinks, data.mail, data.attendance, data.language, data.arrival_date, data.departure_date, data.seating_preference, data.last_visit, data.gift_claims);
    }catch (error) {
      return undefined
    }
  }

  static async deleteUser(user_id: number){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}`,
        {method: "delete", credentials: 'include'},
      )

      const data = await response.json()

      if (!response.ok){
        return undefined;
      }
      return data["success"];
    }catch (error) {
      return undefined
    }
  }

  static async getCustomUserUrl(user_id: number){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}/token`, 
        {method: "get", credentials: 'include'},
      )

      const data = await response.json();
      const token = data.token;

      return `${import.meta.env.VITE_WEBSITE_URL}?token=${token}`;
    }catch (error) {
      return undefined
    }
  }

  static async resetUserToken(user_id: number){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}/reset_token`, 
        {method: "put", credentials: 'include'},
      )

      const data = await response.json();
      const token = data.token;

      return `${import.meta.env.VITE_WEBSITE_URL}?token=${token}`;
    }catch (error) {
      return undefined
    }
  }


  static async addGiftClaim(userId: number, giftId: number, amount: number): Promise<boolean>{
    try {
      const response = await fetch(`${UserService.BASE_URL}/${userId}/gifts/${giftId}`, {method: "put", body:JSON.stringify({amount}), credentials: 'include'})
        return response.ok;

    } catch(error){
      return false;
    }
  }

  static async removeGiftClaim(userId: number, giftId: number): Promise<boolean>{
    try {
      const response = await fetch(`${UserService.BASE_URL}/${userId}/gifts/${giftId}`, {method: "delete", credentials: 'include'})
      
      return response.ok;
    } catch(error){
      return false;
    }
  }
};
