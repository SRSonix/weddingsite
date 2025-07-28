export class AuthService{
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
};
