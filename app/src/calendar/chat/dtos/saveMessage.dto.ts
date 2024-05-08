import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SaveMessageDTO {
    @ApiProperty({
        description: 'user nickname',
        example: 'test nick',
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'user nickname(nullable: true)',
        example: 'test nick',
    })
    @IsString()
    @IsOptional()
    nickname: string;

    @ApiProperty({
        description: 'user input message',
        example: 'test message',
    })
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty({
        description: '현재 채팅중인 캘린더 ID',
        example: 'edb9e459b28d-wsreglwnjh123-35672lkjns(main캘린더일시 (mainRoom + useremail))',
    })
    @IsString()
    @IsNotEmpty()
    roomId: string;
}