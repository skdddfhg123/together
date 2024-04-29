import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
//import { UserRepository } from './user.repository';
import { UserCredentialsDto } from './dto/user-credential.dto';
import { Repository } from 'typeorm';
//import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

    constructor(
        @ InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async signUp(userCredentialsDto: UserCredentialsDto): Promise<User> {

        //const salt = await bcrypt.genSalt();
        //const hashedPassword = await bcrypt.hash(userCredentialsDto.password, salt);
        
        const signUpInfo = this.userRepository.create(
            {   
                email : userCredentialsDto.userEmail, 
                prePwd: null,
                pwd : userCredentialsDto.password,
                phone: null,
                nickname : userCredentialsDto.nickname,
                thumbnail : null,
                registerdAt : new Date(),
                changedAt : null,
                // settings : 'settings',
                birthDay : null, 
                birthDayFlag : false, 
            }
        );

        return this.userRepository.save(signUpInfo);
    } 

    async signIn(authCredentialsDto: UserCredentialsDto): Promise<{accessToken: string}> {

        const {userEmail, password} = authCredentialsDto;
        const user = await this.userRepository.findOne( {where : {email : userEmail}});
        
        if(password === user.pwd){
            const payload = { userEmail };
            const accessToken = await this.jwtService.sign(payload);
            
            return { accessToken }
        } else {
            throw new UnauthorizedException('login failed')
        }
    } 
}
