//import { IsNotEmpty, IsString, Matches, MaxLength, MinLength, isNotEmpty, isString } from "class-validator"

export class UserCredentialsDto {
    
    //@IsString()
    //@MinLength(4)
    //@MaxLength(20)
    userEmail: string;
    
    //@IsString()
    //@MinLength(4)
    //@MaxLength(20)
    password: string;

    nickname: string;
}
