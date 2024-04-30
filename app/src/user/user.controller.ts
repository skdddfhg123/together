import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Get()
    async getAllUsers() {
        return 'Get All User';
    }

    @Post()
    async registUser() {
        return 'Regist User';
    }

    @Post()
    async loginUser() {
        return 'login User';
    }
    
    // @UseGuards()
    @Post()
    async changeUserSetting() {
        return 'Change User Setting'
    }
}
