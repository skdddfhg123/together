import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDTO {
    @ApiProperty({
        description: 'email of the new user',
        example: 'test@test.com',
    })
    @IsString()
    @IsEmail()
    useremail: string;

    @ApiProperty({
        description: 'Username of the new user',
        example: 'testNick',
    })
    @IsString()
    // @MinLength(4)
    // @MaxLength(20)
    nickname: string;

    @ApiProperty({
        description: 'Password of the new user',
        example: 'PASSWORD',
    })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: 'password only accepts english and number'
    })
    password: string;
}
