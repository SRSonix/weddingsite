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
  de = "de",
  fr = "fr",
}

export class FamilyMemberCore
{
  constructor(
    public name: string | undefined,
    public diet: string | undefined,
    public is_child: boolean | undefined,
  ){}

  static getEmpty(){
    return new FamilyMemberCore(undefined, "", false);
  }
}

export class FamilyMember extends FamilyMemberCore{
  constructor(
    public id: number,
    public user_id: number,
    public name: string | undefined,
    public diet: string | undefined,
    public is_child: boolean | undefined,
  ){
    super(name, diet, is_child)
  }

  public getFamilyMemberCore() {
    return new FamilyMemberCore(this.name, this.diet, this.is_child);
  }

  static fromData (data: any){
    return new FamilyMember(data.id, data.user_id, data.name, data.diet, data.is_child);
  }
}

export class RsvpInformation{
  constructor(
    public mail: string | undefined,
    public attendance: Attandance | undefined,
    public language: string | undefined,
  ){}

  static getEmpty(){
    return new RsvpInformation(undefined,undefined, undefined);
  }
}

export class UserCoreInfo{
  constructor(
    public role: string | undefined, 
    public name: string | undefined
  ){}

  static getEmpty(){
    return new UserCoreInfo(undefined, undefined);
  }
}

export class User extends RsvpInformation{
  constructor(
    public id: number,
    public role: string,
    public name: string,
    mail: string | undefined,
    attendance: Attandance | undefined,
    language: string | undefined,
    public last_visit: string,
    public familyMembers: FamilyMember[]
  ){
    super(mail, attendance, language);
  }

  public getRsvpInformation() {
    return new RsvpInformation(this.mail, this.attendance, this.language);
  }

  static fromData (data: any){

    let familyMembers = data.family_members.map((row: any)=>FamilyMember.fromData(row));
    return new User(data.id, data.role, data.name, data.mail, data.attendance, data.language, data.last_visit, familyMembers);
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

      return User.fromData(data);

    } catch (error) {
      return null
    }
  };

  static async createUser(body: {name: string, role: string, language: string}){
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
      data["data"].forEach((row: any) =>
        {
          console.log(row);
          users.push(User.fromData(row));
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
      return User.fromData(data)
    }catch (error) {
      return undefined
    }
  }

  static async updateUserCoreInfo(user_id: number, body:UserCoreInfo){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}/core-info`,
        {method: "put", body: JSON.stringify(body), credentials: 'include'},
      )

      const data = await response.json()

      if (!response.ok){
        return undefined;
      }
      return User.fromData(data);
    }catch (error) {
      return undefined
    }
  }

  static async deleteUser(user_id: number): Promise<boolean>{
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}`,
        {method: "delete", credentials: 'include'},
      )

      return response.ok;
    }catch (error) {
      return false;
    }
  }


  static async resetUserToken(user_id: number){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}/reset-token`, 
        {method: "put", credentials: 'include'},
      )

      const data = await response.json();
      const token = data.token;

      return `${import.meta.env.VITE_WEBSITE_URL}?token=${token}`;
    }catch (error) {
      return undefined
    }
  }

  static async addFamilyMember(userId: number, body: FamilyMemberCore): Promise<FamilyMember | undefined>{
    
    try {
      const response = await fetch(`${UserService.BASE_URL}/${userId}/family-member`, {method: "post", body: JSON.stringify(body), credentials: 'include'})
      if (!response.ok) return undefined;

      const data = await response.json()
      return FamilyMember.fromData(data);
  
    } catch(error){
      return undefined;
    }
  }

  static async updateFamilyMember(userId: number, familyMemberId: number, body: FamilyMemberCore): Promise<FamilyMember | undefined>{
    try {
      const response = await fetch(`${UserService.BASE_URL}/${userId}/family-member/${familyMemberId}`, {method: "put", body: JSON.stringify(body), credentials: 'include'})
      if (!response.ok) return undefined;

      const data = await response.json()
      return FamilyMember.fromData(data);
    } catch(error){
      return undefined;
    }
  }

  static async deleteFamilyMember(userId: number, familyMemberId: number): Promise<boolean>{
    try {
      const response = await fetch(`${UserService.BASE_URL}/${userId}/family-member/${familyMemberId}`, {method: "delete", credentials: 'include'});
      
      return response.ok;
    } catch(error){
      return false;
    }
  }
};
