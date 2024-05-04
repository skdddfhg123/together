import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
//import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dtos/create-user.dto';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { Calendar } from 'src/calendar/entities/calendar.entity';
import { UserCalendar } from '../user_calendar/entities/userCalendar.entity';
import { UserCalendarService } from '../user_calendar/userCalendar.service';
import { UserAccessToken } from '../tokens/entities/userAccessToken.entity';
import { UserRefreshToken } from '../tokens/entities/userRefreshToken.entity';
import { SaveAccessTokenDto } from '../tokens/dtos/saveAccessToken.dto';
import { SaveRefreshTokenDto } from '../tokens/dtos/saveRefreshToken.dto';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class UserService {

    constructor(
        @ InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly tokensService: TokensService
    ) {}

    async signUp(userDTO: CreateUserDTO): Promise<User> {
        const existingEmail = await this.userRepository.findOne({ where: { useremail: userDTO.useremail } });
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const existingNickname = await this.userRepository.findOne({ where: { nickname: userDTO.nickname } });
        if (existingNickname) {
            throw new ConflictException('Nickname already exists');
        }

        const user = new User();
        user.useremail = userDTO.useremail;
        user.nickname = userDTO.nickname;

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userDTO.password, salt);


        try {
            const savedUser = await this.userRepository.save(user);
            delete savedUser.password;

            const accessTokenUser = new SaveAccessTokenDto();
            const refreshTokenUser = new SaveRefreshTokenDto();
            accessTokenUser.user = savedUser;
            refreshTokenUser.user = savedUser;

            const tokens = await this.tokensService.saveTokenUser(accessTokenUser, refreshTokenUser)
            await this.userRepository.update(savedUser.userId, {accessToken: tokens[0], refreshToken: tokens[1]})
            
            return savedUser;
        } catch (e) {
            throw new InternalServerErrorException('Failed to create user');
        }
    } 

    async findOne(data: Partial<User>): Promise<User> {
        // console.log(data)
        const user = await this.userRepository.findOneBy({ useremail: data.useremail });
        // console.log(user)
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }
}
