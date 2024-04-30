import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KakaoService {
    constructor(
        private httpService: HttpService,
    ) {}

    async fetchCalendarEvents(accessToken: string): Promise<any> {
        const url = 'https://kapi.kakao.com/v2/api/calendar/events';
    
        try {
          const response = await firstValueFrom(this.httpService.get(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            },
            params: {
                // 'filter': 'USER',
                'calender_id': ['User Calender Key'],
                'preset': 'THIS_MONTH'
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
