import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './utils/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dtos/create-user.dto';

@Injectable()
export class UserService {

    constructor(
        @ InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async signUp(userDTO: CreateUserDTO): Promise<User> {
        const existingEmail = await this.userRepository.findOne({ where: { useremail: userDTO.useremail } });
        if (existingEmail) {
            throw new ConflictException('Email already exists');
        }

        const existingNickname = await this.userRepository.findOne({ where: { nickname: userDTO.nickname } });
        if (existingNickname) {
            throw new ConflictException('Username already exists');
        }

        const user = new User();
        user.useremail = userDTO.useremail;
        user.nickname = userDTO.nickname;

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(userDTO.password, salt);

        try {
            const savedUser = await this.userRepository.save(user);
            delete savedUser.password;
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
