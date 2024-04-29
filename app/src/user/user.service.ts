import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
//import { UserRepository } from './user.repository';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {

    constructor(
        @ InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async signUp(userDTO: CreateUserDTO): Promise<User> {
        const existingEmail = await this.userRepository.findOne({ where: { email: userDTO.email } });
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const existingNickname = await this.userRepository.findOne({ where: { nickname: userDTO.nickname } });
        if (existingNickname) {
            throw new ConflictException('Username already exists');
        }

        const user = new User();
        user.email = userDTO.email;
        user.nickname = userDTO.nickname;

        const salt = await bcrypt.genSalt();
        user.pwd = await bcrypt.hash(userDTO.pwd, salt);

        try {
            const savedUser = await this.userRepository.save(user);
            delete savedUser.pwd;
            return savedUser;
        } catch (e) {
            throw new InternalServerErrorException('Failed to create user');
        }
    } 

    async findOne(data: Partial<User>): Promise<User> {
        // console.log(data)
        const user = await this.userRepository.findOneBy({ email: data.email });
        // console.log(user)
        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }

    // async signIn(authCredentialsDto: UserCredentialsDto): Promise<{accessToken: string}> {

    //     const {userEmail, password} = authCredentialsDto;
    //     const user = await this.userRepository.findOne( {where : {email : userEmail}});
        
    //     if(password === user.pwd){
    //         const payload = { userEmail };
    //         const accessToken = await this.jwtService.sign(payload);
            
    //         return { accessToken }
    //     } else {
    //         throw new UnauthorizedException('login failed')
    //     }
    // } 
}
