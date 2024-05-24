import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class EmojiNameDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}
