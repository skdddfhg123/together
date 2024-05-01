import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface KakaoUser {
    email: string;
    name: string;
    password: string;
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class KakaoService {
    constructor(
        private httpService: HttpService,
    ) {}

    async fetchCalendarEvents(accessToken: string, month:string, day: number): Promise<Array<any>> {
        const url = 'https://kapi.kakao.com/v2/api/calendar/events';
    
        try {
          const response = await firstValueFrom(this.httpService.get(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            params: {
                // 'filter': 'USER',
                // 'calender_id': ['User Calender Key'],
                // 'preset': 'THIS_MONTH',
                from: `2024-${month}-01T00:00:00Z`,
                to: `2024-${month}-${day}T23:59:00Z`,
                limit: 1000,
            },
          }));
          // console.log((response.data))
          // console.log((response.data.events))
          // console.log((response))
          return response.data.events;
        } catch (error) {
          console.error('Error fetching calendar events:', error);
          throw new Error('Failed to fetch calendar events' + error);
        }
    }
}