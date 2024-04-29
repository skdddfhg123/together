import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCredentialsDto } from './dto/user-credential.dto';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    constructor (private userService: UserService) {}

    @Post('/signup')
    signUp(@Body() userCredentialsDto: UserCredentialsDto): Promise<User> {
        console.log("회원가입 DTO")
        console.log(userCredentialsDto)
        return this.userService.signUp(userCredentialsDto);
    }

    /*
    @Post('/signin')
    signIn(@Body() authCredentialsDto: UserCredentialsDto): Promise<{accessToken: string}> {
        return this.userService.signIn(authCredentialsDto);
    }
    */
    /*
    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User) {
        console.log('user', user);
    }
    */
}
