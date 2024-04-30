import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { GoogleUser } from "./utils/interface/google.interface";

@Injectable()
export class GoogleService {
    constructor(
        private httpService: HttpService,
    ) {}
    async findByProviderIdOrSave(googleUser: GoogleUser) {
        // 액세스 토큰 반환 및 리프레쉬토큰 저장용 함수

        return googleUser as GoogleUser;
    }

    async verifyToken(accessToken: string): Promise<boolean> {
        const url = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + accessToken;
        try {
            const response = await firstValueFrom(this.httpService.get(url));
            return response.status === 200;
        } catch (error) {
            console.error('Invalid access token:', error);
            return false;
        }
    }

    async fetchCalendarEvents(accessToken: string): Promise<any> {
        const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    
        try {
            const response = await firstValueFrom(this.httpService.get(url, {
                headers: {
                'Authorization': `Bearer ${accessToken}`
                }
            }));
        //   console.log('Events:', response.data.items);
        // console.log(response.data.items)
        
            return response.data.items;
        } catch (error) {
            console.error('Error fetching calendar events:', error.response?.data);
          throw new InternalServerErrorException('Failed to fetch calendar events');
        }
      }
}