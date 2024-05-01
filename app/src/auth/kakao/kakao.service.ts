import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class KakaoService {
    constructor(
        private httpService: HttpService,
    ) {}

    /** 카카오 엑세스 토큰 재발급 */
    async refreshAccessToken(refreshToken: string): Promise<string | null> {
      const url = 'https://kauth.kakao.com/oauth/token';
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.KAKAO_CLIENT_REST_KEY, // Your Kakao app client ID
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        refresh_token: refreshToken,
      }).toString();
  
      try {
        const response = await firstValueFrom(
          this.httpService.post(url, body, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }),
        );

        // console.log(response.data.access_token)

        const newAccessToken = response.data.access_token;
        return newAccessToken;
      } catch (error) {
        console.error('Failed to refresh Kakao access token:', error);
        return null;
      }
    }
  
    async getValidAccessToken(accessToken: string, refreshToken: string): Promise<string | null> {
      const isValid = await this.verifyKakaoToken(accessToken);
      if (!isValid) {
        return await this.refreshAccessToken(refreshToken);
      }
      return accessToken;
    }
  

    async verifyKakaoToken(accessToken: string): Promise<boolean> {
      const url = 'https://kapi.kakao.com/v1/user/access_token_info';
      try {
          const response = await firstValueFrom(
              this.httpService.get(url, {
                  headers: {
                      Authorization: `Bearer ${accessToken}`
                      // Authorization: accessToken
                  }
              })
          );
          return response.status === 200;
      } catch (error) {
          console.error('Invalid Kakao access token:', error);
          return false;
      }
    }

    async fetchCalendarEvents(accessToken: string, month:string, day: number): Promise<Array<any>> {
      const url = 'https://kapi.kakao.com/v2/api/calendar/events';
  
      try {
        const response = await firstValueFrom(this.httpService.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
            // 'Authorization': accessToken,
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
        return response.data.events;
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        throw new Error('Failed to fetch calendar events' + error);
      }
    }

    async getKakaoEvents(accessToken: string): Promise<any[]> {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      const monthPromises = months.map(month => {
        let formattedMonth = month < 10 ? `0${month}` : `${month}`;
        return this.fetchCalendarEvents(accessToken, formattedMonth, 31);
      });

      const results = await Promise.all(monthPromises);
      
      const allEvents = results.flat();
      return allEvents;
    }
}