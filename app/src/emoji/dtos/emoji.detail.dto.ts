import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";


export class ReadEmojiDTO {
    
    @ApiProperty()
    @IsString()
    emojiId: string;

    @ApiProperty()
    @IsString()
    emojiUrl: string;
    
    @ApiProperty()
    @IsString()
    emojiName: string;

    @ApiProperty()
    @IsDateString()
    createdAt: Date;

  
}


