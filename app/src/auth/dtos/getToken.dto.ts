import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GetTokenDto {
    @ApiProperty()
    @IsOptional()
    googleAccessToken: string;

    @ApiProperty()
    @IsOptional()
    kakaoAccessToken: string;

    @ApiProperty()
    @IsOptional()
    azureAccessToken: string;

    @ApiProperty()
    @IsOptional()
    discordAccessToken: string;

    @ApiProperty()
    @IsOptional()
    googleRefreshToken: string;

    @ApiProperty()
    @IsOptional()
    kakaoRefreshToken: string;

    @ApiProperty()
    @IsOptional()
    azureRefreshToken: string;

    @ApiProperty()
    @IsOptional()
    discordRefreshToken: string;
    
    @ApiProperty()
    @IsOptional()
    id:string;
}