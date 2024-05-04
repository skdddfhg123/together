import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccessToken } from './entities/userAccessToken.entity';
import { UserRefreshToken } from './entities/userRefreshToken.entity';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {

    constructor (
        @ InjectRepository(UserAccessToken)
        private userAccessTokenRepository: Repository<UserAccessToken>,
        @ InjectRepository(UserRefreshToken)
        private userRefreshTokenRepository: Repository<UserRefreshToken>,
        @ InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JwtService
    ) {}

    /** 유저에 따른 Token Table 생성 및 저장 */
    async saveTokenUser(accessToken: Partial<UserAccessToken>, refreshToken: Partial<UserRefreshToken>): Promise<[UserAccessToken, UserRefreshToken]> {
        const saveAccess = await this.userAccessTokenRepository.save(accessToken);

        if(!saveAccess) throw new InternalServerErrorException('save access token failed');

        const saveRefresh = await this.userRefreshTokenRepository.save(refreshToken);

        if(!saveRefresh) throw new InternalServerErrorException('save refresh token failed');

        return [saveAccess, saveRefresh]
    }

    /** 클라이언트 측에서 보낸 각 토큰 저장 */
    async saveUserToken(userEmail: string, provider: string, accessToken: string, refreshToken: string): Promise<boolean> {

        const TokenTables = await this.findTokenTableByUserEmail(userEmail);
        const accessTokenTable = TokenTables[0];
        const refreshTokenTable = TokenTables[1];

        let isSaved = false;

        switch (provider){
            case 'jwt':
                let jwtUpdate = await this.userAccessTokenRepository.update(accessTokenTable.accessId, {jwtAccessToken: accessToken});

                if(!jwtUpdate)
                    throw new InternalServerErrorException("access token update failed");

                jwtUpdate = await this.userRefreshTokenRepository.update(refreshTokenTable.refreshId, {jwtRefreshToken: refreshToken});

                if(!jwtUpdate)
                    throw new InternalServerErrorException("refresh token update failed");

                isSaved = true;
                break;
            case 'kakao':
                let kakaoUpdate = await this.userAccessTokenRepository.update(accessTokenTable.accessId, {kakaoAccessToken: accessToken});

                if(!kakaoUpdate)
                    throw new InternalServerErrorException("access token update failed");

                kakaoUpdate = await this.userRefreshTokenRepository.update(refreshTokenTable.refreshId, {kakaoRefreshToken: refreshToken});

                if(!kakaoUpdate)
                    throw new InternalServerErrorException("refresh token update failed");

                isSaved = true;
                break;
            case 'google':
                let googleUpdate = await this.userAccessTokenRepository.update(accessTokenTable.accessId, {googleAccessToken: accessToken});

                if(!googleUpdate)
                    throw new InternalServerErrorException("access token update failed");

                googleUpdate = await this.userRefreshTokenRepository.update(refreshTokenTable.refreshId, {googleRefreshToken: refreshToken});

                if(!googleUpdate)
                    throw new InternalServerErrorException("refresh token update failed");

                isSaved = true;
                break;
            case 'outlook':
                let outlookUpdate = await this.userAccessTokenRepository.update(accessTokenTable.accessId, {outlookAccessToken: accessToken});

                if(!outlookUpdate)
                    throw new InternalServerErrorException("access token update failed");

                outlookUpdate = await this.userRefreshTokenRepository.update(refreshTokenTable.refreshId, {outlookRefreshToken: refreshToken});

                if(!outlookUpdate)
                    throw new InternalServerErrorException("refresh token update failed");

                isSaved = true;
                break;
            case 'discord':
                let discordUpdate = await this.userAccessTokenRepository.update(accessTokenTable.accessId, {discordAccessToken: accessToken});

                if(!discordUpdate)
                    throw new InternalServerErrorException("access token update failed");

                discordUpdate = await this.userRefreshTokenRepository.update(refreshTokenTable.refreshId, {discordRefreshToken: refreshToken});

                if(!discordUpdate)
                    throw new InternalServerErrorException("refresh token update failed");

                isSaved = true;
                break;
        }

        return isSaved;
    }

    async findTokenTablesToEmpty(userEmail: string, provider: string) {
        const tokenTables = await this.findTokenTableByUserEmail(userEmail);

        const accessTable = tokenTables[0];
        const refreshTable = tokenTables[1];

        switch (provider){
            case 'jwt':
                let jwtUpdate = await this.userAccessTokenRepository.update(accessTable.accessId, {jwtAccessToken: null});

                if(!jwtUpdate)
                    throw new InternalServerErrorException("access token update to null failed");

                jwtUpdate = await this.userRefreshTokenRepository.update(refreshTable.refreshId, {jwtRefreshToken: null});

                if(!jwtUpdate)
                    throw new InternalServerErrorException("refresh token update to null failed");
                break;
            case 'kakao':
                let kakaoUpdate = await this.userAccessTokenRepository.update(accessTable.accessId, {kakaoAccessToken: null});

                if(!kakaoUpdate)
                    throw new InternalServerErrorException("access token update to null failed");

                kakaoUpdate = await this.userRefreshTokenRepository.update(refreshTable.refreshId, {kakaoRefreshToken: null});

                if(!kakaoUpdate)
                    throw new InternalServerErrorException("refresh token update to null failed");
                break;
            case 'google':
                let googleUpdate = await this.userAccessTokenRepository.update(accessTable.accessId, {googleAccessToken: null});

                if(!googleUpdate)
                    throw new InternalServerErrorException("access token update to null failed");

                googleUpdate = await this.userRefreshTokenRepository.update(refreshTable.refreshId, {googleRefreshToken: null});

                if(!googleUpdate)
                    throw new InternalServerErrorException("refresh token update to null failed");
                break;
            case 'outlook':
                let outlookUpdate = await this.userAccessTokenRepository.update(accessTable.accessId, {outlookAccessToken: null});

                if(!outlookUpdate)
                    throw new InternalServerErrorException("access token update to null failed");

                outlookUpdate = await this.userRefreshTokenRepository.update(refreshTable.refreshId, {outlookRefreshToken: null});

                if(!outlookUpdate)
                    throw new InternalServerErrorException("refresh token update to null failed");
                break;
            case 'discord':
                let discordUpdate = await this.userAccessTokenRepository.update(accessTable.accessId, {discordAccessToken: null});

                if(!discordUpdate)
                    throw new InternalServerErrorException("access token update to null failed");

                discordUpdate = await this.userRefreshTokenRepository.update(refreshTable.refreshId, {discordRefreshToken: null});

                if(!discordUpdate)
                    throw new InternalServerErrorException("refresh token update to null failed");
                break;
        }
    }

    async findTokenTableByUserEmail(userEmail: string): Promise<[UserAccessToken, UserRefreshToken]> {
        const userInfo = await this.userRepository.findOneBy({useremail: userEmail})

        try {
            const accessTokenInfo = await this.userAccessTokenRepository.findOne({
                where: {
                    user: { userId: userInfo.userId }
                },
                relations: ['user']
            });
        
            if (!accessTokenInfo) {
                throw new UnauthorizedException(`accessTokenInfo not found for user ID: ${userInfo.userId}`);
            }

            const refreshTokenInfo = await this.userRefreshTokenRepository.findOne({
                where: {
                    user: { userId: userInfo.userId }
                },
                relations: ['user']
            });
        
            if (!refreshTokenInfo) {
                throw new UnauthorizedException(`refreshTokenInfo not found for user ID: ${userInfo.userId}`);
            }
        
            return [accessTokenInfo, refreshTokenInfo];
        } catch (error) {
            console.error('Error occurred:', error);
            throw new InternalServerErrorException('Failed to find user calendar');
        }
    }

    async refreshTokenMatches(refreshToken: string, payload: PayloadResponse): Promise<boolean> {
        let success = false;

        const user = await this.userRepository.findOne({where: {useremail: payload.useremail}})

        if(!user)
            throw new HttpException('User not found', 400);
 
        const savedToken = await this.userRefreshTokenRepository.findOne({
            where: {
                user: { userId: user.userId }
            },
            relations: ['user']
        });

        if(!savedToken)
            throw new HttpException('Token not found', 400);

        const isMatch = this.isRefreshTokenMatch(refreshToken, savedToken.jwtRefreshToken);
        
        if(!isMatch)
            throw new HttpException('token is not match', 400);
        else {
            success = true;
        }

        return success;
    }

    async accessTokenMatches(accessToken: string, payload: PayloadResponse): Promise<boolean> {

        let success = false;

        const user = await this.userRepository.findOne({where: {useremail: payload.useremail}})

        if(!user)
            throw new HttpException('User not found', 400);
 
        const savedToken = await this.userAccessTokenRepository.findOne({
            where: {
                user: { userId: user.userId }
            },
            relations: ['user']
        });

        if(!savedToken)
            throw new HttpException('Token not found', 400);

        const isMatch = await this.isAccressTokenValid(accessToken, savedToken.jwtAccessToken);
        
        if(!isMatch)
            throw new HttpException('token is not match', 400);
        else {
            success = true;
        }

        return success;
    }

    async isAccressTokenValid(cmpAccessToken: string, savedAccessToken: string): Promise<boolean> {
        let isSame = false;

        const subCmpAccessToken = cmpAccessToken.substring(7);
        const decodeSavedAccess = this.jwtService.decode(savedAccessToken);

        if(subCmpAccessToken !== savedAccessToken) {
            if(decodeSavedAccess.exp != 0) {
                return isSame;
            }
            else {
                await this.userAccessTokenRepository.update(savedAccessToken, {jwtAccessToken: cmpAccessToken});
                isSame = true;
            }
        }
        else {
            isSame = true;
        }
        
        return isSame;
    }

    isRefreshTokenMatch(cmpRefreshToken: string, savedRefreshToken: string): boolean {
        let isSame = false;

        // console.log(cmpRefreshToken)
        // console.log("Bearer " + savedRefreshToken)

        if(cmpRefreshToken === savedRefreshToken)
            isSame = true;

        return isSame;
    }
}
