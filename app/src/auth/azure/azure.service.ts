import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AzureService {
    constructor(
        private httpService: HttpService,
    ) {}

    async fetchCalendarEvents(accessToken: string): Promise<any> {
        const url = 'https://graph.microsoft.com/v1.0/me/events?$select=subject,body,bodyPreview,organizer,attendees,start,end,location';
    
        try {
            const response = await firstValueFrom(this.httpService.get(url, {
                headers: {
                'Authorization': `Bearer ${accessToken}`
                }
            }));

            console.log(JSON.stringify(response.data))
            return response.data.value;
        } catch (error) {
            console.error('Error fetching calendar events:', error.response?.data);
          throw new InternalServerErrorException('Failed to fetch calendar events');
        }
      }
}