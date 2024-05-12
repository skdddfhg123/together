import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";


export class ReadEmojiFeedDTO {
    
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

    @ApiProperty()
    @IsString()
    nickname: string;

  
  
}


