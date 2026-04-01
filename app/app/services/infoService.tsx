export interface HotelInfo{
    name: string,
    tel: string,
    web: string,
    note: Record<string, string>
}

export class OverviewInfo{
    constructor(
        public date: string,
        public arrival_time: string,
        public location: string,
        public location_maps_link: string,
        public phone: Record<string, string>,
        public hotels: HotelInfo[],
        public public_transport: Record<string, string>
    ){};
}

export interface AgendaItem{
  "en": string,
  "fr": string
}

export interface AgendaData{
  items: {[key: string]: AgendaItem}
}

export interface BankDetails{
  name: string,
  iban: string,
  bic: string
}

export interface PaymentDetails{
  bank: BankDetails
}

export class InfoService{
  static BASE_URL = `${import.meta.env.VITE_API_URL}/info`;

  static async getOverviewInfo(): Promise<OverviewInfo | undefined>{
    try{
      const response = await fetch(`${InfoService.BASE_URL}/overview`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      return data as OverviewInfo;
    } catch (error) {
      return undefined
    }
  };

  static async getAganda(): Promise<AgendaData | undefined>{
    try{
      const response = await fetch(`${InfoService.BASE_URL}/agenda`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      return data as AgendaData;
    } catch (error) {
      return undefined
    }
  };


  static async getPaymentDetails(): Promise<PaymentDetails | undefined>{
    try{
      const response = await fetch(`${InfoService.BASE_URL}/payment-details`, {method: "get", credentials: 'include'})
      const data = await response.json()

      if (!response.ok){
        return undefined;
      }

      return data as PaymentDetails;
    } catch (error) {
      return undefined
    }
  };
};