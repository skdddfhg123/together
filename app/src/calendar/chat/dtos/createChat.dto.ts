import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateChatDto {
    @ApiProperty({
        description: 'user nickname',
        example: 'test nick',
    })
    @IsString()
    @IsNotEmpty()
    nickname: string;

    @ApiProperty({
        description: 'user input message',
        example: 'test message',
    })
    @IsString()
    @IsNotEmpty()
    message: string;
}

export class SetInitDTO {
    nickname: string;
    room: {
        roomId: string;
        roomName: string;
    };
}

export class ChatRoomListDTO {
    roomId: string;
    cheifId: string;
    roomName: string;
}