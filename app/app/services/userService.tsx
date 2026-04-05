export enum InvitedBy {
  groom = "groom",
  bride = "bride",
  both = "both",
}

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

export enum FamilyMemberType {
  adult = "adult",
  child = "child",
  infant = "infant",
}

export class FamilyMemberAdd
{
  constructor(
    public name: string | undefined,
    public diet: string | undefined,
    public type: FamilyMemberType | undefined,
  ){}

}

export class FamilyMemberUpdate extends FamilyMemberAdd
{
  constructor(
    name: string | undefined,
    diet: string | undefined,
    type: FamilyMemberType | undefined,
    public attendance: Attandance | undefined,
  ){
    super(name, diet, type);
  }

  static getEmpty(){
    return new FamilyMemberUpdate(undefined, "", undefined, undefined);
  }
}

export class FamilyMember extends FamilyMemberUpdate {
  constructor(
    public id: number,
    public user_id: number,
    name: string | undefined,
    diet: string | undefined,
    type: FamilyMemberType | undefined,
    attendance: Attandance | undefined,
  ){
    super(name, diet, type, attendance);
  }

  public getFamilyMemberUpdate() {
    return new FamilyMemberUpdate(this.name, this.diet, this.type, this.attendance);
  }

  static fromData (data: any){
    return new FamilyMember(data.id, data.user_id, data.name, data.diet, data.type, data.attendance);
  }
}

export class UserContactInformation{
  constructor(
    public mail: string | undefined,
    public language: string | undefined,
  ){}

  static getEmpty(){
    return new UserContactInformation(undefined, undefined);
  }
}

export class UserUpdateInfo extends UserContactInformation{
  constructor(
    public role: string | undefined,
    public name: string | undefined,
    public invited_by: InvitedBy | null | undefined,
    mail: string | undefined,
    language: string | undefined,
  ){
    super(mail, language);
  }

  static getEmpty(){
    return new UserUpdateInfo(undefined, undefined, undefined, undefined, undefined);
  }
}

export class User extends UserUpdateInfo {
  declare role: string;
  declare name: string;
  declare invited_by: InvitedBy | null;

  constructor(
    public id: number,
    role: string,
    name: string,
    mail: string | undefined,
    language: string | undefined,
    public last_visit: string,
    public familyMembers: FamilyMember[],
    invited_by: InvitedBy | null,
  ){
    super(role, name, invited_by, mail, language);
  }

  public getContactInformation() {
    return new UserContactInformation(this.mail, this.language);
  }

  public withFamilyMembers(familyMembers: FamilyMember[]) {
    return new User(this.id, this.role, this.name, this.mail, this.language, this.last_visit, familyMembers, this.invited_by);
  }

  static fromData (data: any){
    let familyMembers = data.family_members.map((row: any)=>FamilyMember.fromData(row));
    return new User(data.id, data.role, data.name, data.mail, data.language, data.last_visit, familyMembers, data.invited_by);
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

  static async createUser(body: {name: string, role: string, language: string, invited_by: string}){
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

  static async updateUserContact(user_id: number, body: UserContactInformation){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}/contact`,
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

  static async updateUser(user_id: number, body: UserUpdateInfo){
   try{
      const response = await fetch(
        `${UserService.BASE_URL}/${user_id}`,
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

  static async addFamilyMember(userId: number, body: FamilyMemberAdd): Promise<FamilyMember | undefined>{

    try {
      const response = await fetch(`${UserService.BASE_URL}/${userId}/family-member`, {method: "post", body: JSON.stringify(body), credentials: 'include'})
      if (!response.ok) return undefined;

      const data = await response.json()
      return FamilyMember.fromData(data);

    } catch(error){
      return undefined;
    }
  }

  static async updateFamilyMember(userId: number, familyMemberId: number, body: FamilyMemberUpdate): Promise<FamilyMember | undefined>{
    try {
      const response = await fetch(`${UserService.BASE_URL}/${userId}/family-member/${familyMemberId}`, {method: "put", body: JSON.stringify(body), credentials: 'include'})
      if (!response.ok) return undefined;

      const data = await response.json()
      return FamilyMember.fromData(data);
    } catch(error){
      return undefined;
    }
  }

  static async loginAsUser(userId: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login-as/${userId}`,
        {method: "post", credentials: 'include'},
      );
      return response.ok;
    } catch (error) {
      return false;
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
