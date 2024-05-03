import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class GetTokenDto {
    @ApiProperty()
    @IsOptional()
    googleToken: string;

    @ApiProperty()
    @IsOptional()
    kakaoToken: string;

    @ApiProperty()
    @IsOptional()
    azureToken: string;

    @ApiProperty()
    @IsOptional()
    discordToken: string;
}