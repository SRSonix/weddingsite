export class OverviewInfo{
    constructor(
        public date: string,
        public arrival_time: string,
        public location: string,
        public car_minutes: string,
        public car_from: string,
        public pre_wedding_day: string,
        public pre_wedding_location: string,
        public post_wedding_day: string,
        public post_wedding_location: string,
        public whatsapp: Record<string, string>
    ){};
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

      const {date, arrival_time, location, car_minutes, car_from, pre_wedding_day, pre_wedding_location, post_wedding_day, post_wedding_location, whatsapp} = data;
      return new OverviewInfo(date, arrival_time, location, car_minutes, car_from, pre_wedding_day, pre_wedding_location, post_wedding_day, post_wedding_location, whatsapp);
    } catch (error) {
      return undefined
    }
  };
};