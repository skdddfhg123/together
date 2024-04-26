// import { InjectRepository } from '@nestjs/typeorm';
// import { UsersEntity } from './typeorm/entities/user.entity';
// import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';

export interface GoogleUser {
    provider: string;
    providerId: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    sub: string;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private httpService: HttpService
    ) {}

    async findByProviderIdOrSave(googleUser: GoogleUser) {
        const { providerId, provider, email, name } = googleUser;

        return googleUser as GoogleUser;
    }

    async getToken(payload: JwtPayload) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '2h',
            secret: 'secret',
        })

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: 'secret',
        })

        return { accessToken, refreshToken };
    }

    async fetchCalendarEvents(accessToken: string): Promise<any> {
        const url = 'URL';
    
        try {
          const response = await firstValueFrom(this.httpService.get(url, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }));
        //   console.log('Events:', response.data.items);
          console.log((response.data.items.length))
          console.log(response.data.items[(response.data.items.length)-1]);
          return response.data.items;
        } catch (error) {
          console.error('Error fetching calendar events:', error);
          throw new Error('Failed to fetch calendar events');
        }
      }
}

